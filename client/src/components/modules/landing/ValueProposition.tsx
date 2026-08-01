'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FiTruck, FiShield, FiHeadphones, FiGift } from 'react-icons/fi'; // Using react-icons

const features = [
  {
    icon: FiTruck,
    title: 'Fast & Free Shipping',
    description: 'Enjoy swift delivery on all orders, with free shipping for purchases over $50.',
  },
  {
    icon: FiShield,
    title: 'Secure Payments',
    description: 'Shop with confidence using our encrypted and secure payment gateway.',
  },
  {
    icon: FiHeadphones,
    title: '24/7 Customer Support',
    description: 'Our dedicated support team is always here to help you with any queries.',
  },
  {
    icon: FiGift,
    title: 'Exclusive Offers',
    description: 'Get access to special discounts and promotions as a valued Shop Aura member.',
  },
];

const ValueProposition = () => {
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
          Why Choose Shop Aura?
        </motion.h2>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="bg-card p-6 rounded-xl shadow-md text-center border border-border"
            >
              <feature.icon size={48} className="text-indigo-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ValueProposition;