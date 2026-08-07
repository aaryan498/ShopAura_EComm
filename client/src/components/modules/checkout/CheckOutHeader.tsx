'use client';

import React from 'react';
import { FiLock } from 'react-icons/fi';

const CheckOutHeader = () => {
  return (
    <div className="bg-navbar-background text-navbar-foreground py-4 px-6 shadow-md flex justify-between items-center">
      <h1 className="text-xl md:text-2xl font-bold">ShopAura Checkout</h1>
      <div className="flex items-center text-navbar-foreground-hover">
        <FiLock className="mr-2" />
        <span className="text-sm md:text-base">Secure Checkout</span>
      </div>
    </div>
  );
};

export default CheckOutHeader;