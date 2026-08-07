import Footer from '@/components/modules/landing/Footer';
import Header from '@/components/modules/landing/Header';
import ProductDetailClient from '@/components/modules/product/ProductDetailClient';
import type { Metadata } from 'next';
// import { useParams } from 'next/navigation';
import React from 'react'; 

// Next.js ISR caching strategy
export const revalidate = false;



export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
    return {
        title: 'Product',
        description: 'Product Description'
    };
}

interface PageProps { 
    params: { id: string };
}

const page = async ({ params }: PageProps) => {

    const { id } = await params;
    return (
        <>
            <Header />
            <main className="pt-16 md:pt-20"> {/* Adjusted padding to account for fixed header */}
                <ProductDetailClient productId={ id } />
            </main>
            <Footer />
        </>
    );
};

export default page;