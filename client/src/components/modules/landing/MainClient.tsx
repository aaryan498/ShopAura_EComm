'use client';

import React from 'react';
import HeroSection from './HeroSection';
import FeaturedCategories from './FeaturedCategories';
import ProductGrid from './ProductGrid';
import PromotionalBanner from './PromotionalBanner';
import Testimonials from './Testimonials';
import BrandLogos from './BrandLogos';
import ValueProposition from './ValueProposition';

const MainClient = () => {
    return (
        <section>
            <HeroSection />
            {/* <FeaturedCategories categories={categories}/> */}
            <FeaturedCategories />
            <ProductGrid title={"Featured Products"} />
            <PromotionalBanner />
            <Testimonials />
            <BrandLogos />
            <ValueProposition />
        </section>
    );
};

export default MainClient;