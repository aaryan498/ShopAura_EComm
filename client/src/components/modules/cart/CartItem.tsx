'use client';

import { CartItem as CartItemType } from '@/types/cart.types';
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiMinusCircle, FiPlusCircle, FiTrash2, FiStar } from 'react-icons/fi';
import { useCart } from '@/hooks/useCart';

const CartItemComponent = ({ item }: { item: CartItemType }) => {

  const { incrementProductQuantity, decrementProductQuantity, removeProductFromCart } = useCart();



  const handleIncrementQuantityChange = async () => {
    if(item.quantity < item.product.stock){
      await incrementProductQuantity(item.product.id);
    } else{
      alert(`Only ${item.product.stock} items are available`);
    }
  };

  const handleDecrementQuantityChange = async () => {
    if(item.quantity > 1){
      await decrementProductQuantity(item.product.id);
    }
  };

  const handleRemoveItem = async () => {
    if(window.confirm(`Remove ${item.product.name} from cart ?`)){
      await removeProductFromCart(item.product.id);
      alert(`Removed item: ${item.product.name}`);
    }
  };

  const itemTotal = item.price * item.quantity;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-card rounded-lg shadow-md p-4 border border-border flex flex-col sm:flex-row items-center gap-4 group"
      style={{ minHeight: '150px' }} 
    >
      {/* Product Image */}
      <Link href={`/products/${item.product.id}`} className="block relative w-24 h-24 flex-shrink-0 overflow-hidden rounded-md bg-gray-100 dark:bg-gray-700">
        <Image
          src={item.product.imageUrl}
          alt={item.product.name}
          fill
          sizes="96px"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </Link>

      {/* Product Details */}
      <div className="flex-grow text-center sm:text-left">
        {/* Category Name Tag */}
        {item.product.category?.name && (
          <span className="inline-block bg-muted text-muted-foreground px-2 py-1 rounded-full text-xs font-medium mb-1">
            {item.product.category.name}
          </span>
        )}
        <Link href={`/products/${item.product.id}`}>
          <h3 className="text-lg font-semibold text-foreground hover:text-indigo-600 transition-colors duration-200 line-clamp-2">
            {item.product.name}
          </h3>
        </Link>
        {item.product.description && (
          <p className="text-sm text-muted-foreground line-clamp-1 hidden sm:block">
            {item.product.description}
          </p>
        )}
        {/* Add variant info here if applicable, e.g., item.product.variant */}

        {/* Quantity Controls and Wishlist Button */}
        <div className="flex flex-col sm:flex-row items-center gap-3 mt-3">
          <div className="flex items-center gap-2 text-foreground">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleDecrementQuantityChange}
              disabled={item.quantity <= 1}
              className="text-muted-foreground hover:text-destructive transition-colors duration-200 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
              aria-label="Decrease quantity"
            >
              <FiMinusCircle size={20} />
            </motion.button>
            <span className="font-medium text-lg w-8 text-center">{item.quantity}</span>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleIncrementQuantityChange}
              disabled={item.quantity >= item.product.stock} // Disable if quantity reaches stock limit
              className="text-muted-foreground hover:text-indigo-600 transition-colors duration-200 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
              aria-label="Increase quantity"
            >
              <FiPlusCircle size={20} />
            </motion.button>
          </div>

          {/* Add to Wishlist Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => alert(`Added ${item.product.name} to wishlist!`)} // Dummy logic
            className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors duration-200 text-sm flex items-center gap-1 cursor-pointer"
          >
            <FiStar size={16} /> Add to Wishlist
          </motion.button>
        </div>

        {/* Low Stock Warning */}
        {item.product.stock > 0 && item.product.stock < 5 && (
          <p className="text-destructive text-sm font-medium mt-2">
            Only {item.product.stock} left in stock!
          </p>
        )}
        {item.product.stock === 0 && (
          <p className="text-destructive text-sm font-medium mt-2">
            Out of stock
          </p>
        )}
      </div>

      {/* Price and Remove Button */}
      <div className="flex flex-col sm:flex-row items-center sm:ml-auto gap-3">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleRemoveItem}
          className="text-muted-foreground hover:text-destructive transition-colors duration-200"
          aria-label={`Remove ${item.product.name} from cart`}
        >
          <FiTrash2 size={20} />
        </motion.button>
        <p className="text-xl font-bold text-foreground flex-shrink-0">
          ${itemTotal.toFixed(2)}
        </p>
      </div>
    </motion.div>
  );
};

export default CartItemComponent;