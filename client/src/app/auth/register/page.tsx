import RegisterForm from '@/components/modules/auth/RegisterForm';
import type { Metadata } from 'next';
import React from 'react';

// Next.js ISR caching strategy
export const revalidate = false;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Register',
    description: 'Register to start shopping with ShopAura - The only company that holds best top collections at minimal prices.',
  };
}

const page = async () => {
  return <RegisterForm/>
};

export default page;