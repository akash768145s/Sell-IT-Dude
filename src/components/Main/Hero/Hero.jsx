"use client";
import React from "react";
import { m } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, TrendingUp } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50 min-h-[90vh] flex items-center">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -right-32 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -left-32 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <m.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            {/* Badge */}
            <m.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6"
            >
              <TrendingUp className="w-4 h-4" />
              New Student Marketplace
            </m.div>

            {/* Main Heading */}
            <m.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight"
            >
              Turn Your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-600">
                Campus Finds
              </span>{" "}
              Into Cash
            </m.h1>

            {/* Subtitle */}
            <m.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0"
            >
              Buy and sell textbooks, electronics, and campus essentials with
              fellow students. Safe, easy, and affordable.
            </m.p>

            {/* CTA Buttons */}
            <m.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Link
                href="/display"
                className="btn btn-primary px-8 py-4 text-lg font-semibold flex items-center gap-2 group"
              >
                Browse Products
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
              <Link
                href="/upload"
                className="btn btn-outline px-8 py-4 text-lg font-semibold"
              >
                Sell Your Items
              </Link>
            </m.div>
          </m.div>

          {/* Hero Image */}
          <m.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            <div className="relative z-10">
              <Image
                src="/Girl-Img.png"
                alt="Student with books and laptop"
                width={600}
                height={500}
                priority
                className="w-full h-auto max-w-lg mx-auto lg:max-w-full"
                style={{
                  filter: "drop-shadow(0 20px 40px rgba(0, 74, 173, 0.15))",
                }}
              />
            </div>
          </m.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
