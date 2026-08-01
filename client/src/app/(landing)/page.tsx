import Footer from "@/components/modules/landing/Footer";
import Header from "@/components/modules/landing/Header";
import HeroSection from '@/components/modules/landing/HeroSection'
import ProductGrid from '@/components/modules/landing/ProductGrid'
import FeaturedCategories from "@/components/modules/landing/FeaturedCategories";
import PromotionalBanner from "@/components/modules/landing/PromotionalBanner";
import Testimonials from "@/components/modules/landing/Testimonials";
import BrandLogos from "@/components/modules/landing/BrandLogos";
import ValueProposition from "@/components/modules/landing/ValueProposition";

export const metadata = {
  title: "Home | ShopAura Online Shopping",
  description: "ShopAura Home Page",
};


export default function Home() {
  return (
    <>
      <Header />
      <main className="pt-16 md:pt-20"> {/* Added padding-top to account for fixed header height */}
        <HeroSection/>
        <FeaturedCategories/>
        <ProductGrid title={"Our Products"}/>
        <PromotionalBanner/>
        <Testimonials/>
        <BrandLogos/>
        <ValueProposition/>
      </main>
      <Footer />
    </>
  );
}
