'use client';

import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiMinus, FiPlus, FiShoppingCart, FiStar } from 'react-icons/fi';
import { Product } from '@/types/product.types';

const ProductDetail = ({ product }: { product: Product }) => {

    // const product = {
    //     id: '1',
    //     name: 'Wireless Bluetooth Headphones with Noise Cancellation',
    //     price: 129.99,
    //     description: "hhishfbakbjdvbjabdvj",
    //     stock: 10,
    //     sku: "123456",
    //     imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
    //     rating: 4.5,
    //     reviews: 120
    // };

    const [mainImage, setMainImage] = useState<string | null>(null);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        if (product && product.imageUrl) {
            setMainImage(product.imageUrl);
        }
    }, [product]);

    const handleQuantityChange = (type: 'increment' | 'decrement') => {
        if (product) {
            if (type === 'increment' && quantity < product.stock) {
                setQuantity(prev => prev + 1);
            } else if (type === 'decrement' && quantity > 1) {
                setQuantity(prev => prev - 1);
            }
        }
    };

    // const displayImages = product.images && product.images.length > 0 ? product.images : [product.imageUrl];

    const displayImages = [product.imageUrl, product.imageUrl, product.imageUrl, product.imageUrl];



    return (
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {/* Product Image Gallery */}
            <div className="flex flex-col items-center">
                <div className="relative w-full h-96 md:h-[500px] bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden shadow-md border border-border">
                    {mainImage && (
                        <Image
                            src={mainImage}
                            alt={product.name}
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className="object-contain"
                            priority
                        />
                    )}
                </div>
                <div className="flex space-x-3 mt-4 overflow-x-auto pb-2">
                    {displayImages.map((imgUrl, index) => (
                        <motion.div
                            key={index}
                            className={`relative w-20 h-20 rounded-md overflow-hidden cursor-pointer border-2 ${mainImage === imgUrl ? 'border-indigo-600' : 'border-transparent'} hover:border-indigo-400 transition-colors duration-200`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setMainImage(imgUrl)}
                        >
                            <Image
                                src={imgUrl}
                                alt={`${product.name} thumbnail ${index + 1}`}
                                fill
                                sizes="80px"
                                className="object-cover"
                            />
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Product Details */}
            <div className="flex flex-col">
                {product.category?.name && (
                    <span className="inline-block bg-muted text-muted-foreground px-3 py-1 rounded-full text-sm font-medium mb-4 self-start">
                        {product.category.name}
                    </span>
                )}
                <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3">{product.name}</h1>
                {product.rating !== undefined && product.reviews !== undefined && (
                    <div className="flex items-center text-lg text-muted-foreground mb-4">
                        <div className="flex items-center mr-2">
                            {[...Array(5)].map((_, i) => (
                                <FiStar
                                    key={i}
                                    className={`h-5 w-5 ${i < product.rating! ? 'text-yellow-500' : 'text-gray-300 dark:text-gray-600'}`}
                                    fill={i < product.rating! ? 'currentColor' : 'none'}
                                    stroke="currentColor"
                                    strokeWidth="2"
                                />
                            ))}
                        </div>
                        <span>({product.reviews} reviews)</span>
                    </div>
                )}
                <p className="text-5xl font-bold text-indigo-600 mb-6">${product.price.toFixed(2)}</p>
                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                    {product.description || "No detailed description available."}
                </p>

                <div className="flex items-center mb-6">
                    <span className="font-semibold mr-3">Availability:</span>
                    {product.stock > 0 ? (
                        <span className="text-success font-medium">In Stock ({product.stock} left)</span>
                    ) : (
                        <span className="text-destructive font-medium">Out of Stock</span>
                    )}
                </div>

                {product.stock > 0 && (
                    <div className="flex items-center space-x-4 mb-8">
                        <div className="flex items-center border border-border rounded-md bg-input">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleQuantityChange('decrement')}
                                disabled={quantity <= 1}
                                className="p-2 text-foreground hover:bg-muted rounded-l-md disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <FiMinus size={20} />
                            </motion.button>
                            <input
                                type="number"
                                value={quantity}
                                readOnly
                                className="w-16 text-center bg-transparent border-x border-border focus:outline-none text-foreground"
                            />
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleQuantityChange('increment')}
                                disabled={quantity >= product.stock}
                                className="p-2 text-foreground hover:bg-muted rounded-r-md disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <FiPlus size={20} />
                            </motion.button>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.03, boxShadow: "0 8px 20px rgba(0,0,0,0.2)" }}
                            whileTap={{ scale: 0.97 }}
                            className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors duration-200 shadow-md"
                        >
                            <FiShoppingCart size={20} />
                            Add to Cart
                        </motion.button>
                    </div>
                )}

                {/* Placeholder for more sections like specifications, reviews, etc. */}
                <div className="mt-8 pt-8 border-t border-border">
                    <h3 className="text-2xl font-bold text-foreground mb-4">Product Description</h3>
                    <p className="text-muted-foreground leading-relaxed">
                        {product.description || "A comprehensive description of the product will be available soon."}
                    </p>
                </div>
            </div>
        </section>
    );
};

export default ProductDetail;