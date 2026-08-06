'use client';

import React, { useEffect, useState } from 'react';
import BreadCrumbs from './BreadCrumbs';
import { useProduct } from '@/hooks/useProduct';
import Image from 'next/image';
import { FiShoppingCart, FiStar, FiMinus, FiPlus } from 'react-icons/fi';
import { motion } from 'framer-motion';
import ProductDetail from './ProductDetail';
import SimilarProducts from './SimilarProducts';

const ProductDetailClient = ({ productId }: { productId: string }) => {


    const { getProduct, error, isLoading, product } = useProduct();
 

    useEffect(()=>{
        if(productId){
            getProduct(productId);
        }
    },[productId, getProduct]);
    
    

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center text-foreground">
                <svg className="animate-spin h-8 w-8 text-indigo-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="text-lg font-medium">Loading Product Details...</p>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="bg-card border border-border rounded-xl shadow-md p-8 md:p-12 flex flex-col items-center justify-center text-center max-w-md mx-auto my-16 text-foreground">
                <h3 className="text-2xl font-semibold mb-3">Product Not Found</h3>
                <p className="text-muted-foreground mb-6">The product you are looking for does not exist or is unavailable.</p>
                {/* Optionally add a link to go back to shop */}
            </div>
        );
    }

    
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="container mx-auto px-4 py-8 bg-background text-foreground"
        >
            <BreadCrumbs
                productName={product.name}
                categoryName={product.category.name}
                categoryId={product.category.id}
            />
            <ProductDetail product={product}/>
            <SimilarProducts category={product.category} productId={product.id}/>   
        </motion.div>
    );
};

export default ProductDetailClient;