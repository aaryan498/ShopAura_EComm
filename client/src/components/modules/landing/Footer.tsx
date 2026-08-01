'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn } from 'react-icons/fa'; // Using Font Awesome for social icons

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: FaFacebookF, href: '#', label: 'Facebook' },
    { icon: FaInstagram, href: '#', label: 'Instagram' },
    { icon: FaTwitter, href: '#', label: 'Twitter' },
    { icon: FaLinkedinIn, href: '#', label: 'LinkedIn' },
  ];

  const footerLinks = [
    {
      title: 'Shop Aura',
      links: [
        { name: 'About Us', href: '/about' },
        { name: 'Careers', href: '/careers' },
        { name: 'Press', href: '/press' },
        { name: 'Blog', href: '/blog' },
      ],
    },
    {
      title: 'Help',
      links: [
        { name: 'Contact Us', href: '/contact' },
        { name: 'FAQs', href: '/faq' },
        { name: 'Shipping', href: '/shipping' },
        { name: 'Returns', href: '/returns' },
        { name: 'Order Tracking', href: '/orders' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'Terms of Service', href: '/terms' },
        { name: 'Refund Policy', href: '/refund' },
      ],
    },
  ];

  return (
    <footer className='bg-gray-900 text-gray-300 py-10 md:py-16'>
      <div className='container mx-auto px-4'>
        {/* Top Section: Logo, Description, Socials */}
        <div className='flex flex-col md:flex-row md:justify-between md:items-start border-b border-gray-700 pb-8 mb-8'>
          <div className='mb-8 md:mb-0 md:w-1/3'>
            <Link href='/' className='text-3xl font-bold text-white'>
              Shop <span className='text-indigo-400'>Aura</span>
            </Link>
            <p className='mt-4 text-sm leading-relaxed'>
              Your ultimate destination for premium products. Discover quality, style, and convenience all in one place.
            </p>
          </div>

          <div className='md:w-1/3 flex justify-start md:justify-end'>
            <div className='flex space-x-6'>
              {socialLinks.map((item, index) => (
                <motion.a
                  key={index}
                  href={item.href}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-gray-400 hover:text-indigo-400 transition-colors duration-200'
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={item.label}
                >
                  <item.icon size={24} />
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        {/* Middle Section: Links and Newsletter */}
        <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-8 mb-8'>
          {footerLinks.map((section, index) => (
            <div key={index}>
              <h3 className='text-lg font-semibold text-white mb-4'>{section.title}</h3>
              <ul className='space-y-2'>
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link href={link.href} className='text-gray-400 hover:text-indigo-400 transition-colors duration-200'>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div className='w-full max-w-lg mx-auto flex flex-col items-center text-center mb-8'>
          <h3 className='text-lg font-semibold text-white mb-4'>Stay Connected</h3>
          <p className='text-sm mb-4'>Subscribe to our newsletter for exclusive offers and updates.</p>
          <form className='flex flex-col sm:flex-row gap-2 w-full max-w-sm'>
            <input
              type='email'
              placeholder='Your email address'
              className='flex-grow px-4 py-2 rounded-md bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500'
              aria-label='Email for newsletter'
            />
            <motion.button
              type='submit'
              className='bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors duration-200 whitespace-nowrap'
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Subscribe
            </motion.button>
          </form>
        </div>
        

        {/* Bottom Section: Copyright and Payment Methods */}
        <div className='border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500'>
          <p className='mb-4 md:mb-0'>&copy; {currentYear} Shop Aura. All rights reserved.</p>
          <div className='flex flex-wrap justify-center gap-4'>
            {/* Placeholder for payment method icons */}
            <img src='https://img.icons8.com/color/48/000000/visa.png' alt='Visa' className='h-6' />
            <img src='https://img.icons8.com/color/48/000000/mastercard.png' alt='Mastercard' className='h-6' />
            <img src='https://img.icons8.com/color/48/000000/paypal.png' alt='PayPal' className='h-6' />
            <img src='https://img.icons8.com/color/48/000000/american-express.png' alt='American Express' className='h-6' />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;