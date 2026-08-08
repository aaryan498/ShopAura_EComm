'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FiShoppingCart, FiStar } from 'react-icons/fi';
import { Product } from '@/types/product.types';
import { useCart } from '@/hooks/useCart';




const ProductCard = ({ product, isAdmin }: { product: Product, isAdmin: boolean }) => {

  const { addProductToCart } = useCart();

  const handleAddToCart = async (product: Product) => {
    await addProductToCart(product);
  }


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.4 }}
      whileHover={{ scale: 1.03, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }} // Subtle lift and shadow on hover
      className="bg-card rounded-lg shadow-md overflow-hidden border border-border flex flex-col group" // Added 'group' for potential nested hover effects
    >
      <Link href={`/${product.id}`} className="block relative h-48 w-full overflow-hidden bg-gray-100 dark:bg-gray-700"> {/* Adjusted height, added bg for loading state */}
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          loading='lazy'
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-110" // Use group-hover
          priority={false} // Set to false if not critical for LCP
        />
      </Link>
      <div className="p-4 flex-grow flex flex-col justify-between">
        <div>
          <Link href={`/products/${product.id}`}>
            <h3 className="text-lg font-semibold text-foreground hover:text-indigo-600 transition-colors duration-200 line-clamp-2 mb-1">
              {product.name}
            </h3>
            {product.description && (
              <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                {product.description}
              </p>
            )}
          </Link>
          {product.rating !== undefined && product.reviews !== undefined && ( // Check for both
            <div className="flex items-center text-sm text-muted-foreground mb-2">
              <div className="flex items-center mr-1">
                {[...Array(5)].map((_, i) => (
                  <FiStar
                    key={i}
                    className={`h-4 w-4 ${i < product.rating! ? 'text-yellow-500' : 'text-gray-300 dark:text-gray-600'}`}
                    fill={i < product.rating! ? 'currentColor' : 'none'}
                    stroke="currentColor" // Ensure stroke is visible for empty stars
                    strokeWidth="2"
                  />
                ))}
              </div>
              {product.reviews > 0 && (
                <span className="text-xs">({product.reviews} reviews)</span>
              )}
            </div>
          )}
          {product.category && (
            <span className="inline-block bg-muted text-muted-foreground px-2 py-1 rounded-full text-xs font-medium mt-2 mr-2">
              {product.category.name}
            </span>
          )}
          {isAdmin && product.sku && (
            <span className="inline-block bg-accent text-accent-foreground px-2 py-1 rounded-full text-xs font-medium mt-2">
              SKU: {product.sku}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-border"> {/* mt-auto to push to bottom, pt-3 and border-t for separation */}
          <p className="text-xl font-bold text-foreground">${product.price.toFixed(2)}</p>
          {product.stock < 5 && product.stock > 0 ? (
            <span className="text-sm font-medium text-destructive ml-4">{product.stock} left!</span>
          ) : product.stock === 0 && (
            <span className="text-sm font-medium text-destructive ml-4">Out of stock</span>
          )}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors duration-200 flex items-center gap-2 text-sm" // Changed to rounded-md, added text, gap, and smaller text
            aria-label={`Add ${product.name} to cart`}
            onClick={() => handleAddToCart(product)}
          >
            <FiShoppingCart size={20} />
            <span className="hidden sm:inline">Add to Cart</span> {/* Hidden on small screens, visible on sm and up */}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;