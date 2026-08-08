import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CartApiResponseDto, CartResponseDto } from './dto/cart-response.dto';
import { Cart, CartItem, Product, User } from 'src/generated/prisma/client';
import { UpdateCartProductQuantityDto } from './dto/update-cart.dto';

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

    async getCurrentCart(userId: string): Promise<CartApiResponseDto<CartResponseDto>> {

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


    async getAllCart(userId?: string) : Promise<{
        success: boolean,
        data: CartResponseDto[],
        message: string,
    }> {


        const carts = await this.prisma.cart.findMany({
            where: userId
            ? { userId }
            : undefined,
            include: {
                cartItems: {
                    include: {
                        product: true,
                    },
                },
                user: true,
            },
        });
        
        if(!carts) throw new NotFoundException('User Carts not Found');


        return {
            success: true,
            data: carts.map((cart)=>{
                return this.map(cart);
            }),
            message: 'Carts retrieved successfully',
        }

    }


    async addProduct(userId: string, productId: string) : Promise<CartApiResponseDto<CartResponseDto>> {
        
        const updatedCart = await this.prisma.$transaction(async (prisma) => {

            let cart = await prisma.cart.findFirst({
                where: {
                    userId,
                    checkoutCompleted: false,
                }
                
            });
            
            if(!cart){
                cart = await prisma.cart.create({
                    data: {
                        userId,
                    },
                });
            }

            const product = await prisma.product.findUnique({
                where: {
                    id: productId,
                },
            });

            if(!product) throw new NotFoundException('Product not found');

            if(product.stock <= 0) throw new BadRequestException('Product out of stock');
            
            const existingCartItem = await prisma.cartItem.findFirst({
                where: {
                    cartId: cart.id,
                    productId,
                },
            });
            
            if(existingCartItem){
                await prisma.cartItem.update({
                    where: {
                        id: existingCartItem.id,
                    },
                    data: {
                        quantity: {
                            increment: 1,
                        },
                    }
                });
            }
            else{
                await prisma.cartItem.create({
                    data: {
                        cartId: cart.id,
                        productId,
                        quantity: 1,
                    }
                })
            }

            await prisma.product.update({
                where: {
                    id: productId,
                },
                data: {
                    stock: {
                        decrement: 1,
                    },
                },
            })

            return await prisma.cart.findUnique({
                where: {
                    id: cart.id
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
        })

        if(!updatedCart) throw new NotFoundException('Cart not found');

        return this.wrap(updatedCart);
            
    }


    async updateCartProductQuantity(userId: string, productId: string, quantity: number) : Promise<CartApiResponseDto<CartResponseDto>> {


        if(quantity <= 0) throw new BadRequestException('Quantity must be greater than 0');


        const updatedCart = await this.prisma.$transaction(async (prisma) => {

            
            const product = await prisma.product.findUnique({
                where: {
                    id: productId,
                },
            });

            if(!product) throw new NotFoundException('Product not found');

            if(product.stock <= 0) throw new BadRequestException('Product out of stock');

            let cart = await prisma.cart.findFirst({
                where: {
                    userId,
                    checkoutCompleted: false,
                    
                },
            })

            if(!cart) {
                cart = await prisma.cart.create({
                    data: {
                        userId,
                    },
                });
            }


            const existingCartItem = await prisma.cartItem.findFirst({
                where: {
                    cartId: cart.id,
                    productId,
                },
            });

            if(existingCartItem){
                const stockUpdateUnit = quantity - existingCartItem.quantity;
                
                if(stockUpdateUnit > 0){
                    if(product.stock < stockUpdateUnit) throw new BadRequestException('Product out of stock');
                    await prisma.cartItem.update({
                        where: {
                            id: existingCartItem.id,
                        },
                        data: {
                            quantity : {
                                increment: stockUpdateUnit,
                            }
                        }
                    });
                    await prisma.product.update({
                        where: {
                            id: productId,
                        },
                        data: {
                            stock: {
                                decrement: stockUpdateUnit,
                            },
                        },
                    })

                }
                else if(stockUpdateUnit < 0){
                    await prisma.cartItem.update({
                        where: {
                            id: existingCartItem.id,
                        },
                        data: {
                            quantity : {
                                decrement: stockUpdateUnit * -1,
                            }
                        }
                    });
                    await prisma.product.update({
                        where: {
                            id: productId,
                        },
                        data: {
                            stock: {
                                increment: stockUpdateUnit * -1,
                            },
                        },
                    })

                }
            }
            else{
                if(product.stock < quantity) throw new BadRequestException('Product out of stock');
                await prisma.cartItem.create({
                    data: {
                        cartId: cart.id,
                        productId,
                        quantity,
                    }
                })

                await prisma.product.update({
                    where: {
                        id: productId,
                    },
                    data: {
                        stock: {
                            decrement: quantity,
                        },
                    },
                })
            }
            
            
            return await prisma.cart.findUnique({
                where: {
                    id: cart.id,
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
        })

        if(!updatedCart) throw new NotFoundException('Cart not found');

        return this.wrap(updatedCart);
    }


    async removeProduct(userId: string, productId: string) : Promise<CartApiResponseDto<CartResponseDto>> {

        
        const updatedCart = await this.prisma.$transaction(async (prisma) => {
            
            const product = await prisma.product.findUnique({
                where: {
                    id: productId,
                },
            });
    
            if(!product) throw new NotFoundException('Invalid Product - not found');

            let cart = await prisma.cart.findFirst({
                where: {
                    userId,
                    checkoutCompleted: false,
                }
            })

            if(!cart) throw new BadRequestException("No current active carts");

            const existingCartItem = await prisma.cartItem.findFirst({
                where: {
                    cartId: cart.id,
                    productId,
                }
            })

            if(existingCartItem){
                await prisma.product.update({
                    where: {
                        id: productId,
                    },
                    data: {
                        stock: {
                            increment: existingCartItem.quantity,
                        }
                    }
                })
                await prisma.cartItem.delete({
                    where: {
                        id: existingCartItem.id,
                    }
                })
            }
            else throw new NotFoundException("Product not found in cart.")

            



            return await prisma.cart.findUnique({
                where: {
                    id: cart.id,
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
        })

        if(!updatedCart) throw new NotFoundException("Cart Not found");

        return this.wrap(updatedCart);        
    }
}
