import CheckOutClient from '@/components/modules/checkout/CheckOutClient';
import Footer from '@/components/modules/landing/Footer';
import Header from '@/components/modules/landing/Header';
import type { Metadata } from 'next';
import React from 'react';

// Next.js ISR caching strategy
export const revalidate = false;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Checkout',
    description: 'Checkout Description',
  };
}

const page = async () => {
  return <CheckOutClient/>

};

export default page;