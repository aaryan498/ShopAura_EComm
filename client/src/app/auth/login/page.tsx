import LoginForm from '@/components/modules/auth/LoginForm';
import type { Metadata } from 'next';
import React from 'react';

// Next.js ISR caching strategy
export const revalidate = false;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Login',
    description: 'Login to ShopAura',
  };
}

const page = async () => {
  return <LoginForm/>
};

export default page;