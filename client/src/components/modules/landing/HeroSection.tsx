'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const HeroSection = () => {
  return (
    <section className="relative h-[70vh] md:h-[80vh] flex items-center justify-center text-center overflow-hidden bg-[url('/hero-image.jpg')] bg-cover bg-center bg-no-repeat dark:from-gray-800 dark:to-gray-900">
      {/* Background overlay for premium feel */}
      <div className="absolute inset-0 bg-black opacity-60 dark:opacity-90 z-0"></div>

      <div className="relative z-10 p-4 max-w-4xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-4xl md:text-6xl font-extrabold text-hero-foreground leading-tight mb-4"
        >
          Discover Your Style, Effortlessly.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-lg md:text-xl text-hero-foreground mb-8 max-w-2xl mx-auto"
        >
          Shop Aura brings you curated collections of fashion, electronics, and home essentials.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Link href="/shop">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 8px 20px rgba(0, 0, 0, 0.2)" }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-indigo-700 font-semibold px-8 py-3 rounded-full text-lg shadow-lg hover:bg-indigo-50 transition-all duration-300 cursor-pointer"
            >
              Shop Now
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;