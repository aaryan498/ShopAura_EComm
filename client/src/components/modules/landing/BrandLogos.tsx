'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const brands = [
  { name: 'Brand A', logo: '/images/brands/brand-a.png' },
  { name: 'Brand B', logo: '/images/brands/brand-b.png' },
  { name: 'Brand C', logo: '/images/brands/brand-c.png' },
  { name: 'Brand D', logo: '/images/brands/brand-d.png' },
  { name: 'Brand E', logo: '/images/brands/brand-e.png' },
];

// Pre-create placeholder images in public/images/brands
// For example:
// public/images/brands/brand-a.png
// ...

const BrandLogos = () => {
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
          Trusted by Leading Brands
        </motion.h2>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="flex flex-wrap justify-center items-center gap-8 md:gap-12"
        >
          {brands.map((brand, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.1 }}
              className="w-24 h-16 md:w-32 md:h-20 relative grayscale hover:grayscale-0 transition-all duration-300"
            >
              <Image
                src={brand.logo}
                alt={brand.name}
                fill
                sizes="(max-width: 768px) 100px, 120px"
                className="object-contain"
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default BrandLogos;