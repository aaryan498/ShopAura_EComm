'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FiShoppingCart, FiStar } from 'react-icons/fi'; // Using react-icons for consistency

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
    rating?: number;
    reviews?: number;
  };
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.4 }}
      whileHover={{ scale: 1.03, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
      className="bg-card rounded-xl shadow-md overflow-hidden border border-border flex flex-col"
    >
      <Link href={`/products/${product.id}`} className="block relative h-60 w-full overflow-hidden">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 hover:scale-110"
        />
      </Link>
      <div className="p-4 flex-grow flex flex-col justify-between">
        <div>
          <Link href={`/products/${product.id}`}>
            <h3 className="text-lg font-semibold text-foreground hover:text-indigo-600 transition-colors duration-200 line-clamp-2">
              {product.name}
            </h3>
          </Link>
          {product.rating && (
            <div className="flex items-center mt-1 text-sm text-muted-foreground">
              {[...Array(5)].map((_, i) => (
                <FiStar
                  key={i}
                  className={i < product.rating! ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}
                  fill={i < product.rating! ? 'currentColor' : 'none'}
                />
              ))}
              {product.reviews && <span className="ml-2">({product.reviews})</span>}
            </div>
          )}
        </div>
        <div className="flex items-center justify-between mt-4">
          <p className="text-xl font-bold text-foreground">${product.price.toFixed(2)}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 transition-colors duration-200"
            aria-label={`Add ${product.name} to cart`}
          >
            <FiShoppingCart size={20} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;