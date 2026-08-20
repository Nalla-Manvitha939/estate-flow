import Hero from "@/components/landing/Hero";
import FeaturedProperties from "@/components/landing/FeaturedProperties";
import WhyEstateFlow from "@/components/landing/WhyEstateFlow";
import PropertyCategories from "@/components/landing/PropertyCategories";
import Testimonials from "@/components/landing/Testimonials";
import CTASection from "@/components/landing/CTASection";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <>
      <Hero />

      <FeaturedProperties />

      <WhyEstateFlow />

      <PropertyCategories />

      <Testimonials />

      <CTASection />

      <Footer />
    </>
  );
}