"use client";
import React, { Suspense, lazy } from "react";
import { LazyMotion, domAnimation } from "framer-motion";
import dynamic from "next/dynamic";

// Lazy load components for better performance
const Navbar = dynamic(() => import("@/components/Main/navbar"), {
  loading: () => <div className="h-16 bg-white skeleton" />,
});
const Hero = dynamic(() => import("@/components/Main/Hero/Hero"), {
  loading: () => <div className="h-96 bg-gray-50 skeleton" />,
});
const ProductShowcase = lazy(() => import("@/components/home/ProductShowcase"));
const CategoryGrid = lazy(() => import("@/components/home/CategoryGrid"));
const HowItWorks = lazy(() => import("@/components/home/HowItWorks"));
const Footer = dynamic(() => import("@/components/Main/Footer/footer"), {
  loading: () => <div className="h-64 bg-gray-100 skeleton" />,
});

// Loading component
const LoadingSection = ({ height = "h-64" }) => (
  <div className={`${height} bg-gray-50 skeleton rounded-lg mx-4`} />
);

const Home = () => {
  return (
    <LazyMotion features={domAnimation}>
      <div className="min-h-screen bg-white">
        {/* Navigation */}
        <Navbar />

        {/* Hero Section */}
        <Hero />

        {/* Main Content */}
        <main className="relative">
          {/* Category Grid */}
          <section className="py-16 bg-white">
            <Suspense fallback={<LoadingSection height="h-96" />}>
              <CategoryGrid />
            </Suspense>
          </section>

          {/* How It Works */}
          <section className="py-16 bg-gray-50">
            <Suspense fallback={<LoadingSection height="h-96" />}>
              <HowItWorks />
            </Suspense>
          </section>

          {/* Featured Products */}
          <section className="py-16 bg-white">
            <Suspense fallback={<LoadingSection height="h-96" />}>
              <ProductShowcase />
            </Suspense>
          </section>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </LazyMotion>
  );
};

export default Home;
