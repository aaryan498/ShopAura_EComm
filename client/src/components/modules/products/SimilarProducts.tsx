'use client';

import { useProduct } from '@/hooks/useProduct';
import { Category } from '@/types/category.types';
import React, { useEffect } from 'react';
import ProductCard from '../landing/ProductCard';
import { motion } from 'framer-motion';

interface SimilarProductsProps {
  category: Category;
  productId: string;
}

const SimilarProducts = ({ category, productId }: SimilarProductsProps) => {

    const { getProducts, products, isLoading, error } = useProduct();

    useEffect(()=>{
        if(category && category.id){
            getProducts({ category: category.id, limit: 20 })
        }
    },[category, getProducts]);

    // Filter out the current product and take up to 16 similar products
    const similarProducts = products.filter((product) => product.id !== productId).slice(0, 16);

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }} // Use animate for immediate appearance of heading
          transition={{ duration: 0.5 }} 
          className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground"
        >
          Similar Products
        </motion.h2>

        {isLoading && (
            <div className="flex flex-col items-center justify-center py-10 text-center text-muted-foreground">
                <svg className="animate-spin h-8 w-8 text-indigo-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="text-lg font-medium">Loading similar products...</p>
            </div>
        )}

        {!isLoading && error && (
            <div className="bg-card border border-destructive rounded-xl shadow-md p-8 flex flex-col items-center justify-center text-center max-w-md mx-auto my-8 text-destructive">
                <p className="text-lg font-medium">Failed to load similar products.</p>
                <p className="text-sm text-muted-foreground mt-2">Please try again later.</p>
            </div>
        )}

        {!isLoading && !error && similarProducts.length === 0 && (
            <div className="bg-card border border-border rounded-xl shadow-md p-8 flex flex-col items-center justify-center text-center max-w-md mx-auto my-8 text-muted-foreground">
                <p className="text-lg font-medium">No similar products found in this category.</p>
            </div>
        )}

        {!isLoading && !error && similarProducts.length > 0 && (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative"
            >
                <div className="flex overflow-x-auto scrollbar-hide space-x-6 pb-4 -mx-4 px-4 md:px-0 md:-mx-0">
                    {similarProducts.map((product) => (
                        <div key={product.id} className="flex-none w-64 sm:w-72 lg:w-80">
                            <ProductCard product={product} isAdmin={false} />
                        </div>
                    ))}
                </div>
                {/* Optional: Add scroll indicators/buttons here if needed for a more "slider" feel */}
            </motion.div>
        )}
      </div>
    </section>
  );
};

export default SimilarProducts;