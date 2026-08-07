import Footer from "@/components/modules/landing/Footer";
import Header from "@/components/modules/landing/Header";
import HeroSection from '@/components/modules/landing/HeroSection'
import ProductGrid from '@/components/modules/landing/ProductGrid'
import FeaturedCategories from "@/components/modules/landing/FeaturedCategories";
import PromotionalBanner from "@/components/modules/landing/PromotionalBanner";
import Testimonials from "@/components/modules/landing/Testimonials";
import BrandLogos from "@/components/modules/landing/BrandLogos";
import ValueProposition from "@/components/modules/landing/ValueProposition";
import { Metadata } from "next";
import MainClient from "@/components/modules/landing/MainClient";

export const metadata : Metadata = {
  title: "Home | ShopAura Online Shopping",
  description: "ShopAura Home Page",
};


export default function Home() {
  return (
    <>
      <Header />

      {/* Added padding-top to account for fixed header height */}
      <main className="pt-16 md:pt-20"> 
        <MainClient/>
      </main>
      
      <Footer />
    </>
  );
}
