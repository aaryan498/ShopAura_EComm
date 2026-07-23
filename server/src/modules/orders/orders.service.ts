import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderApiResponseDto, OrderResponseDto, PaginatedOrderResponseDto } from './dto/order-response.dto';
import { Order, OrderItem, OrderStatus, Prisma, Product, User } from 'src/generated/prisma/client';
import { QueryOrderDto } from './dto/query-order.dto';

@Injectable()
export class OrdersService {

    constructor(
        private prisma: PrismaService
    ) {}

    private wrap(order: Order & { 
            orderItems: (OrderItem & { product: Product })[];
            user: User;
        }) : OrderApiResponseDto<OrderResponseDto> {
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
        }) : OrderResponseDto {
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




    async create( id: string, createOrderDto: CreateOrderDto ) : Promise<OrderApiResponseDto<OrderResponseDto>> {

        const { items, shippingAddress } = createOrderDto;

        for(const item of items) {
            const product = await this.prisma.product.findUnique({
                where: {id : item.productId},
            });

            if(!product) throw new NotFoundException(`Product with ID ${item.productId} not found`);

            if(product.stock < item.quantity) throw new BadRequestException(`Insufficient stock for Product with ID ${item.productId}. Stock: ${product.stock}, required: ${item.quantity}`);
        }

        const total = items.reduce(
            (sum, item) => sum + item.price*item.quantity,
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


        const order = await this.prisma.$transaction(async(tx) => 
            {

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
    
                for(const item of items){
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


    async findAllForAdmin(queryDto: QueryOrderDto) : Promise<PaginatedOrderResponseDto> {
        const { status, search, page=1, limit=10 } = queryDto;
        const skip = (page - 1) * limit;
        const take = limit;
        const where = {};

        if(status) where['status'] = status;
        if(search) where['OR'] = [
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
            },
            {
                shippingAddress: {
                    contains: search,
                    mode: 'insensitive',
                },
            },
            {
                orderNumber : {
                    contains: search,
                    mode: 'insensitive',
                }
            }
        ]

        const total = await this.prisma.order.count({ where });


        const orders = await this.prisma.order.findMany({
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
        });

        return {
            data: orders.map((order) => this.map(order)),
            total,
            page,
            limit,
        };
    }


    async findAllForUser(id: string, queryDto: QueryOrderDto){

        const user = await this.prisma.user.findUnique({
            where: { id },
        });

        if(!user) throw new NotFoundException('User not found');

        const { page=1, limit=10, status, search } = queryDto;

        const skip = (page-1)*limit;
        const take = limit;



        const where : Prisma.OrderWhereInput = { userId: id };

        if(status) where.status = status;
        if(search) where['OR'] = [
            {
                shippingAddress: {
                    contains: search,
                    mode: 'insensitive',
                },
            },
            {
                orderNumber : {
                    contains: search,
                    mode: 'insensitive',
                }
            }
        ]

        const [ orders, total ] = await Promise.all([
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
                }
            }),

            this.prisma.order.count({ where })
        ]);

        return {
            data: orders.map((order) => this.map(order)),
            total,
            page,
            limit
        }
    }


}


