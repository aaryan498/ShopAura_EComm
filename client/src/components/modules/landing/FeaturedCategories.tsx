'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image'; // Assuming Next.js Image component is available
import { Category } from '@/types/category.types';

// Placeholder data for categories
const categories = [
  { name: 'Electronics', image: 'https://www.electronicsforyou.biz/wp-content/uploads/2019/08/Consumer-Electronics-Appliance_Sept-19.jpg', href: '/categories/electronics' },
  { name: 'Apparel', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZL-lfT5ZgEywUlO-mUe1xgE_tdZHuQyXI-0tWoEBncufJQIj6uRAe564n&s=10', href: '/categories/apparel' },
  { name: 'Home Goods', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQyKOIsBdYIvO3ezDl_eAzzB5tYVoId8ZSuRy2iD4Y5MyGD7BI_yyRfjuKi&s=10', href: '/categories/home-goods' },
  { name: 'Books', image: 'https://images.theconversation.com/files/45159/original/rptgtpxd-1396254731.jpg?ixlib=rb-4.1.1&q=45&auto=format&w=754&fit=clip', href: '/categories/books' },
];

// const FeaturedCategories = ({ categories } : { categories: Category[] }) => {
const FeaturedCategories = () => {
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
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground"
        >
          Shop by Category
        </motion.h2>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {categories.map((category, index) => {
          
            console.log(category.name, category.image);

          return (
            
            <motion.div
              key={category.name}
              variants={itemVariants}
              whileHover={{ scale: 1.03, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
              whileTap={{ scale: 0.98 }}
              className="relative overflow-hidden rounded-xl shadow-lg group"
            >
              <Link href={category.href} className="block">
                <div className="w-full h-64 relative">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black opacity-60 flex items-center justify-center">
                    <h3 className="text-xl font-semibold text-white group-hover:text-indigo-200 transition-colors duration-300">
                      {category.name}
                    </h3>
                  </div>
                </div>
              </Link>
            </motion.div>
            
          )})}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedCategories;