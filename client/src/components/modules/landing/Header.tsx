'use client';

import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiShoppingCart, FiMenu, FiX, FiUser, FiSearch } from 'react-icons/fi'; // Using Feather Icons for a similar style
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';



const Header = () => {

  const { isAuthenticated, isLoading, user, logout, } = useAuth();
  const router = useRouter();

  const handleDashboardClick = () => {
    if(user && user.role === "ADMIN"){
      router.push('/admin');
    }
    else{
      router.push('/user');
    }
  }


  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // Hardcoded authentication state for now. This will be replaced by Redux logic later.

  // Toggle mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Close menu on resize if it transitions to desktop view
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) { // Tailwind's 'md' breakpoint
        setIsMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <header className='fixed top-0 left-0 right-0 z-50 bg-navbar-background shadow-md'>
      <div className='mx-auto flex h-16 items-center justify-between px-4 py-3 md:h-20'>
        {/* Logo */}
        <Link href='/' className='text-2xl font-bold text-navbar-foreground md:text-3xl'>
          Shop<span className='text-indigo-600'>Aura</span>
        </Link>

        {/* Desktop Navigation (hidden on mobile) */}
        <nav className='hidden md:flex items-center space-x-6'>
          {/* Placeholder for Search Bar */}
          <div className='relative'>
            <input
              type='text'
              placeholder='Search...'
              className='rounded-full border bg-input border-navbar-foreground text-navbar-foreground px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring'
            /> 
            <FiSearch className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400' size={18} />
          </div>
          <Link href='/categories' className='text-navbar-foreground hover:text-navbar-foreground-hover transition-colors duration-200'>
            Categories
          </Link>
          <Link href='/deals' className='text-navbar-foreground hover:text-navbar-foreground-hover transition-colors duration-200'>
            Deals
          </Link>
          <Link href='/about' className='text-navbar-foreground hover:text-navbar-foreground-hover transition-colors duration-200'>
            About
          </Link>
        </nav>

        {/* Desktop User Actions (hidden on mobile) */}
        <div className='hidden md:flex items-center space-x-4'>
          {isAuthenticated ? (
            <>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className='relative flex bg-navbar-button-background px-4 py-2 items-center gap-1 text-navbar-button-foreground hover:text-navbar-foreground-hover transition-colors duration-200 cursor-pointer'
              >
                <FiShoppingCart size={20} />
                Cart
                <div className='absolute -top-2 -right-2 bg-black text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold'>
                  3 {/* Hardcoded item count */}
                </div>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className='flex bg-navbar-button-background px-4 py-2 items-center gap-1 text-navbar-button-foreground hover:text-navbar-foreground-hover transition-colors duration-200 cursor-pointer'
                disabled={isLoading}
                onClick={() => setIsAuthenticated(false)} // Simulate logout
              > 
                <FiUser size={20} />
                Log Out
              </motion.button>
            </>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className='flex items-center gap-1 text-indigo-600 border border-indigo-600 px-4 py-2 hover:bg-indigo-600 hover:text-white transition-colors duration-200'
              onClick={() => setIsAuthenticated(true)} // Simulate login
            > 
              <FiUser size={20} />
              Login
            </motion.button>
          )}
        </div>

        {/* Mobile Menu Button (visible on mobile) */}
        <div className='md:hidden flex items-center space-x-4'>
          {isAuthenticated && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className='text-navbar-foreground hover:text-indigo-600'
            >
              <FiShoppingCart size={24} />
            </motion.button>
          )}
          <button onClick={toggleMenu} className='text-navbar-foreground hover:text-indigo-600'> 
            {isMenuOpen ? <FiX size={28} /> : <FiMenu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu (animated with Framer Motion) */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className='fixed inset-y-0 right-0 w-64 bg-white shadow-lg p-6 md:hidden flex flex-col space-y-6 border-l border-gray-200'
          >
            <button onClick={toggleMenu} className='self-end text-gray-700 hover:text-indigo-600'>
              <FiX size={28} />
            </button>
            <nav className='flex flex-col space-y-4'>
              {/* Placeholder for Search Bar in mobile menu */}
              <div className='relative w-full'>
                <input
                  type='text'
                  placeholder='Search...'
                  className='w-full rounded-full border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500'
                />
                <FiSearch className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400' size={18} />
              </div>
              <Link href='/categories' className='text-gray-700 hover:text-indigo-600 transition-colors duration-200' onClick={toggleMenu}>
                Categories
              </Link>
              <Link href='/deals' className='text-gray-700 hover:text-indigo-600 transition-colors duration-200' onClick={toggleMenu}>
                Deals
              </Link>
              <Link href='/about' className='text-gray-700 hover:text-indigo-600 transition-colors duration-200' onClick={toggleMenu}>
                About
              </Link>
            </nav>
            <div className='flex flex-col space-y-4 pt-4 border-t border-gray-200'>
              {isAuthenticated ? (
                <>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className='flex items-center gap-2 text-gray-700 hover:text-indigo-600 transition-colors duration-200'
                  >
                    <FiShoppingCart size={20} />
                    Cart
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className='flex items-center gap-2 text-gray-700 hover:text-indigo-600 transition-colors duration-200'
                    onClick={() => { setIsAuthenticated(false); toggleMenu(); }} // Simulate logout and close menu
                  > 
                    <FiUser size={20} />
                    Log Out
                  </motion.button>
                </>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className='flex items-center gap-2 text-indigo-600 border border-indigo-600 px-4 py-2 rounded-full hover:bg-indigo-600 hover:text-white transition-colors duration-200'
                  onClick={() => { setIsAuthenticated(true); toggleMenu(); }} // Simulate login and close menu
                  > 
                    <FiUser size={20} />
                  Login
                </motion.button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;