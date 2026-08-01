'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const PromotionalBanner = () => {
  return (
    <section className="py-16 md:py-20 bg-indigo-700 dark:bg-gray-800 text-white">
      <div className="container mx-auto px-4 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-5xl font-bold mb-4"
        >
          Limited Time Offer!
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg md:text-xl mb-8 max-w-2xl mx-auto"
        >
          Get up to 50% off on selected items. Don't miss out!
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Link href="/deals">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 8px 20px rgba(0, 0, 0, 0.2)" }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-indigo-700 font-semibold px-8 py-3 rounded-full text-lg shadow-lg hover:bg-indigo-50 transition-all duration-300"
            >
              Shop Deals
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default PromotionalBanner;