import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CartApiResponseDto, CartResponseDto } from './dto/cart-response.dto';
import { Cart, CartItem, Product, User } from 'src/generated/prisma/client';

@Injectable()
export class CartsService {

    constructor( private prisma: PrismaService ){}

    private wrap(
        cart: Cart & {
            cartItems: (CartItem & {
                product: Product
            })[];
            user: User;
        }
    ): CartApiResponseDto<CartResponseDto> {
        return {
            success: true,
            message: 'Cart retrieved successfully',
            data: this.map(cart),
        }
    }

    private map(
        cart: Cart & {
            cartItems: (CartItem & {
                product: Product
            })[];
            user: User;
        }
    ): CartResponseDto {
        return {
            id: cart.id,
            userId: cart.userId,
            checkoutCompleted: cart.checkoutCompleted,
            items: cart.cartItems.map((item)=>{
                return {
                    id: item.id,
                    productId: item.productId,
                    productName: item.product.name,
                    productImageUrl: item.product.imageUrl,
                    price: Number(item.product.price),
                    quantity: item.quantity,
                    subtotal: Number(item.product.price) * item.quantity,
                    createdAt: item.createdAt,
                    updatedAt: item.updatedAt,
                }
            }),
            totalItems: cart.cartItems.length,
            totalQuantity: cart.cartItems.reduce((total, item) => total + item.quantity, 0),
            totalAmount: cart.cartItems.reduce((totalPrice, item) => totalPrice + Number(item.product.price) * item.quantity, 0),
            createdAt: cart.createdAt,
            updatedAt: cart.updatedAt,
        }
    }

    async getCurrentUserCart(userId: string): Promise<CartApiResponseDto<CartResponseDto>> {

        const cart = await this.prisma.cart.findFirst({
            where: {
                userId,
                checkoutCompleted: false
            },
            include: {
                cartItems: {
                    include: {
                        product: true,
                    },
                },
                user: true,
            },
        });

        if(!cart){
            const newCart = await this.prisma.cart.create({
                data: {
                    userId,    
                },
                include: {
                    cartItems: {
                        include: {
                            product: true,
                        },
                    },
                    user: true,
                },
            })

            return this.wrap(newCart);
        }

        return this.wrap(cart);
    }
}
