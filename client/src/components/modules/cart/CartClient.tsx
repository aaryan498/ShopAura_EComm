'use client';

import { useCart } from '@/hooks/useCart';
import { Category } from '@/types/category.types';
import React, { useEffect, useState } from 'react';
import CartItem from './CartItem';
import { CartItem as CartItemType } from '@/types/cart.types';
import { Product } from '@/types/product.types';
import { motion } from 'framer-motion';
import { FiShoppingCart } from 'react-icons/fi';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

const CartClient = () => {

    const [items, setItems] = useState<CartItemType[]>([]);

    const { items: cartItems, clearCart, totalPrice } = useCart();
    const { isAuthenticated } = useAuth();
    const router = useRouter();

    // Dummy data for demonstration purposes

    useEffect(() => {
        setItems(cartItems);
    }, [cartItems]);



    const handleClearCart = async () => {
        if(window.confirm(`Are you sure you want to REMOVE all the items from cart ?`)){
            await clearCart();
        }
    }

    const handleCheckOut = () => {
        if(!isAuthenticated){
            router.push("/auth/login?redirect=/cart");
        }
        else{
            router.push("/checkout");
        }
    }

    const shipping = totalPrice > 400 ? 0 : 30;
    const total = totalPrice + shipping;

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };


    return (
        <section className="py-16 md:py-24 bg-background min-h-[calc(100vh-10rem)]">
            <div className="container mx-auto px-4">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground"
                >
                    Your Shopping Cart
                </motion.h1>

                {items.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="bg-card border border-border rounded-xl shadow-md p-8 md:p-12 flex flex-col items-center justify-center text-center max-w-md mx-auto my-16"
                    >
                        <FiShoppingCart size={60} className="text-muted-foreground mb-6" />
                        <h3 className="text-2xl font-semibold text-foreground mb-3">
                            Your cart is empty.
                        </h3>
                        <p className="text-muted-foreground mb-6">
                            Looks like you haven't added anything to your cart yet.
                        </p>
                        <Link href="/">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors duration-200 shadow-md"
                            >
                                Continue Shopping
                            </motion.button>
                        </Link>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Cart Items List */}
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="lg:col-span-2 space-y-6"
                        >
                            {items.map((item) => (
                                <CartItem key={item.id} item={item} />
                            ))}
                        </motion.div>

                        {/* Order Summary */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="bg-card rounded-lg shadow-md p-6 border border-border h-fit"
                        >
                            <h2 className="text-xl font-semibold text-foreground mb-4 border-b border-border pb-3">Order Summary</h2>
                            <div className="space-y-3 text-foreground">
                                <div className="flex justify-between">
                                    <span>Subtotal:</span>
                                    <span>${totalPrice.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Shipping:</span>
                                    <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                                </div>
                                <div className="flex justify-between font-bold text-lg pt-2 border-t border-border mt-3">
                                    <span>Total:</span>
                                    <span>${total.toFixed(2)}</span>
                                </div>
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleCheckOut}
                                className="mt-6 bg-indigo-600 text-white w-full py-3 rounded-md hover:bg-indigo-700 transition-colors duration-200 shadow-md text-lg font-semibold cursor-pointer"
                            >
                                Proceed to Checkout
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleClearCart}
                                className="mt-3 bg-black text-white w-full py-3 rounded-md hover:bg-gray-800 transition-colors duration-200 shadow-md text-lg font-semibold cursor-pointer"
                            >
                                Clear Cart
                            </motion.button>
                            <Link href="/">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="mt-3 bg-black text-white w-full py-3 rounded-md hover:bg-gray-800 transition-colors duration-200 shadow-md text-lg font-semibold cursor-pointer"
                                >
                                    Continue Shipping
                                </motion.button>
                            </Link>
                        </motion.div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default CartClient;