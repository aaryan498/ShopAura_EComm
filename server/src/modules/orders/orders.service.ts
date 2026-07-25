import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderApiResponseDto, OrderResponseDto, PaginatedOrderResponseDto } from './dto/order-response.dto';
import { Order, OrderItem, OrderStatus, Prisma, Product, User } from 'src/generated/prisma/client';
import { QueryOrderDto } from './dto/query-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { isTemplateMiddle } from 'typescript';


@Injectable()
export class OrdersService {

    constructor(
        private prisma: PrismaService
    ) { }

    private wrap(order: Order & {
        orderItems: (OrderItem & { product: Product })[];
        user: User;
    }): OrderApiResponseDto<OrderResponseDto> {
        return {
            success: true,
            message: 'Order retrieved successfully',
            data: this.map(order),
        };
    }

    private map(
        order: Order & {
            orderItems: (OrderItem & { product: Product })[];
            user: User;
        }): OrderResponseDto {
        return {
            id: order.id,
            userId: order.userId,
            status: order.status,
            total: Number(order.totalAmount),
            shippingAddress: order.shippingAddress ?? '',
            items: order.orderItems.map((item) => ({
                id: item.id,
                productId: item.productId,
                productName: item.product.name,
                quantity: item.quantity,
                price: Number(item.price),
                subtotal: Number(item.price) * item.quantity,
                createdAt: item.createdAt,
                updatedAt: item.updatedAt,

            })),
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
            ...(order.user && {
                userEmail: order.user.email,
                userName: `${order.user.firstName} ${order.user.middleName || ''} ${order.user.lastName}`.trim(),
            })
        }
    }




    async create(id: string, createOrderDto: CreateOrderDto): Promise<OrderApiResponseDto<OrderResponseDto>> {

        const { items, shippingAddress } = createOrderDto;

        for (const item of items) {
            const product = await this.prisma.product.findUnique({
                where: { id: item.productId },
            });

            if (!product) throw new NotFoundException(`Product with ID ${item.productId} not found`);

            if (product.stock < item.quantity) throw new BadRequestException(`Insufficient stock for Product with ID ${item.productId}. Stock: ${product.stock}, required: ${item.quantity}`);
        }

        const total = items.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );

        const latestCart = await this.prisma.cart.findFirst({
            where: {
                id,
                checkedOut: false,
            },
            orderBy: {
                createdAt: 'desc',
            }
        });


        const order = await this.prisma.$transaction(async (tx) => {

            const newOrder = await tx.order.create({
                data: {
                    userId: id,
                    status: OrderStatus.PENDING,
                    totalAmount: total,
                    shippingAddress,
                    cartId: latestCart?.id,
                    orderItems: {
                        create: items.map((item) => ({
                            productId: item.productId,
                            quantity: item.quantity,
                            price: item.price,

                        }))
                    },
                },
                include: {
                    orderItems: {
                        include: {
                            product: true
                        },
                    },
                    user: true,
                }
            })

            for (const item of items) {
                await tx.product.update({
                    where: { id: item.productId },
                    data: { stock: { decrement: item.quantity } }
                })
            }

            return newOrder;
        }
        )

        return this.wrap(order);
    }


    async findAll(queryDto: QueryOrderDto, userId? : string): Promise<PaginatedOrderResponseDto> {

        const { status, search, page = 1, limit = 10 } = queryDto;
        const skip = (page - 1) * limit;
        const take = limit;
        const where: Prisma.OrderWhereInput = {};

        if (userId) where.userId = userId;
        if (status) where.status = status;
        if (search) {
            const orConditions: Prisma.OrderWhereInput[] = [
                {
                    shippingAddress: {
                        contains: search,
                        mode: 'insensitive',
                    },
                },
                {
                    orderNumber: {
                        contains: search,
                        mode: 'insensitive',
                    }
                }
            ];
            if(!userId){
                orConditions.push(
                    {
                        id: {
                            contains: search,
                            mode: 'insensitive',
                        },
                    },
                    {
                        userId: {
                            contains: search,
                            mode: 'insensitive',
                        },
                    }
                )
            }
            where.OR = orConditions;
        } 
        

        const [orders, total] = await Promise.all([
            this.prisma.order.findMany({
                where,
                skip,
                take,
                include: {
                    user: true,
                    orderItems: {
                        include: {
                            product: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: 'desc',
                },
            }),
            this.prisma.order.count({ where }),
        ]);

        return {
            data: orders.map((order) => this.map(order)),
            total,
            page,
            limit,
        };
    }



    async findOne(id: string, userId?: string): Promise<OrderApiResponseDto<OrderResponseDto>> {

        const where: Prisma.OrderWhereInput = { id };

        if (userId) where.userId = userId;

        const order = await this.prisma.order.findFirst({
            where,
            include: {
                orderItems: {
                    include: {
                        product: true,
                    }
                },
                user: true,
            },
        });

        if (!order) throw new NotFoundException('Order not Found');

        return this.wrap(order);
    }

    async update(
        id: string, 
        updateOrderDto: UpdateOrderDto, 
        userId?: string
    ): Promise<OrderApiResponseDto<OrderResponseDto>> {


        const where : Prisma.OrderWhereInput = { id };

        if (userId) where.userId = userId;

        const existing = await this.prisma.order.findFirst({ where });
        if(!existing) throw new NotFoundException('Order not Found');

        const updatedOrder = await this.prisma.order.update({
            where: { id },
            data: updateOrderDto,
            include: {
                orderItems: {
                    include: {
                        product: true,
                    },
                },
                user: true,
            }
        })
        return this.wrap(updatedOrder);
    }

    async cancel(id: string, userId?: string): Promise<OrderApiResponseDto<OrderResponseDto>> {
        const where: Prisma.OrderWhereInput = { id };

        if(userId) where.userId = userId;

        const existingOrder = await this.prisma.order.findFirst({ where });
        if(!existingOrder) throw new NotFoundException('Order not Found');

        if(existingOrder.status !== OrderStatus.CANCELLED) throw new BadRequestException('Only Orders with Status [PENDING] can be [CANCELLED]')

        const cancelledOrder = await this.prisma.$transaction(async (tx) => {
            for(const item of cancelledOrder.orderItems){
                await tx.product.update({
                    where: {
                        id: item.productId,
                    },
                    data: {
                        stock: {
                            increment: item.quantity,
                        }
                    }
                })
            }

            return tx.order.update({
                where: { id },
                data: { status: OrderStatus.CANCELLED },
                include: {
                    orderItems: {
                        include: {
                            product: true,
                        },
                    },
                    user: true,
                }
            })
        })

        return this.wrap(cancelledOrder);
    }
        
}


