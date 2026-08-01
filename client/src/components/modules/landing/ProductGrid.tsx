'use client';

import React from 'react';
import ProductCard from '@/components/modules/landing/ProductCard';
import { motion } from 'framer-motion';

// Placeholder data for products
const products = [
  { id: '1', name: 'Wireless Bluetooth Headphones with Noise Cancellation', price: 129.99, imageUrl: '/images/products/headphones.jpg', rating: 4.5, reviews: 120 },
  { id: '2', name: 'Smartwatch with Heart Rate Monitor and GPS', price: 199.99, imageUrl: '/images/products/smartwatch.jpg', rating: 4.2, reviews: 85 },
  { id: '3', name: 'Premium Leather Wallet with RFID Protection', price: 49.99, imageUrl: '/images/products/wallet.jpg', rating: 4.8, reviews: 210 },
  { id: '4', name: 'Ergonomic Office Chair with Lumbar Support', price: 249.99, imageUrl: '/images/products/chair.jpg', rating: 4.0, reviews: 60 },
  { id: '5', name: 'Portable Espresso Maker for Travel', price: 79.99, imageUrl: '/images/products/espresso.jpg', rating: 4.6, reviews: 95 },
  { id: '6', name: 'Organic Cotton Bedding Set - Queen Size', price: 159.99, imageUrl: '/images/products/bedding.jpg', rating: 4.7, reviews: 150 },
  { id: '7', name: 'High-Performance Gaming Mouse with RGB Lighting', price: 69.99, imageUrl: '/images/products/gaming-mouse.jpg', rating: 4.3, reviews: 180 },
  { id: '8', name: 'Vintage Style Ceramic Coffee Mugs (Set of 4)', price: 29.99, imageUrl: '/images/products/mugs.jpg', rating: 4.9, reviews: 300 },
];

// Pre-create placeholder images in public/images/products
// For example:
// public/images/products/headphones.jpg
// public/images/products/smartwatch.jpg
// ...

interface ProductGridProps {
  title: string;
}

const ProductGrid: React.FC<ProductGridProps> = ({ title }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground"
        >
          {title}
        </motion.h2>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ProductGrid;