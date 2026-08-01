'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const testimonials = [
  {
    id: 1,
    quote: "Shop Aura has completely transformed my online shopping experience. The quality of products is exceptional, and delivery is always on time!",
    author: "Jane Doe",
    title: "Happy Customer",
    avatar: "/images/avatars/avatar1.jpg",
  },
  {
    id: 2,
    quote: "I love the curated collections at Shop Aura. It's so easy to find unique and stylish items that I can't find anywhere else.",
    author: "John Smith",
    title: "Fashion Enthusiast",
    avatar: "/images/avatars/avatar2.jpg",
  },
  {
    id: 3,
    quote: "The customer service is outstanding! They helped me with an issue quickly and efficiently. Highly recommend Shop Aura!",
    author: "Emily White",
    title: "Loyal Shopper",
    avatar: "/images/avatars/avatar3.jpg",
  },
];

// Pre-create placeholder images in public/images/avatars
// For example:
// public/images/avatars/avatar1.jpg
// public/images/avatars/avatar2.jpg
// public/images/avatars/avatar3.jpg

const Testimonials = () => {
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
    <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground"
        >
          What Our Customers Say
        </motion.h2>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {testimonials.map((testimonial) => (
            <motion.div
              key={testimonial.id}
              variants={itemVariants}
              className="bg-card p-6 rounded-xl shadow-md border border-border flex flex-col items-center text-center"
            >
              <div className="relative w-20 h-20 rounded-full overflow-hidden mb-4">
                <Image
                  src={testimonial.avatar}
                  alt={testimonial.author}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </div>
              <p className="text-lg italic text-foreground mb-4">"{testimonial.quote}"</p>
              <p className="font-semibold text-indigo-600">{testimonial.author}</p>
              <p className="text-sm text-muted-foreground">{testimonial.title}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;