"use client";
import Link from "next/link";
import { m } from "framer-motion";
import { Home, Search, ArrowLeft, Package } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md mx-auto">
        {/* 404 Animation */}
        <m.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, type: "spring" }}
          className="mb-8"
        >
          <h1 className="text-8xl lg:text-9xl font-bold text-primary/20 mb-4">
            404
          </h1>
          <div className="text-6xl mb-4">🔍</div>
        </m.div>

        {/* Content */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
            Oops! Page Not Found
          </h2>
          <p className="text-gray-600 mb-8 text-lg">
            The page you&apos;re looking for seems to have wandered off. Don&apos;t worry,
            even the best explorers get lost sometimes!
          </p>
        </m.div>

        {/* Action Buttons */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            href="/"
            className="btn btn-primary px-6 py-3 flex items-center gap-2 justify-center group"
          >
            <Home className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
            Back to Home
          </Link>

          <Link
            href="/display"
            className="btn btn-outline px-6 py-3 flex items-center gap-2 justify-center group"
          >
            <Package className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
            Browse Products
          </Link>
        </m.div>

        {/* Helpful Links */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 pt-8 border-t border-gray-200"
        >
          <p className="text-sm text-gray-500 mb-4">
            Looking for something specific?
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link
              href="/upload"
              className="text-primary hover:text-primary-dark transition-colors duration-200"
            >
              Sell Items
            </Link>
            <Link
              href="/wishlist"
              className="text-primary hover:text-primary-dark transition-colors duration-200"
            >
              Wishlist
            </Link>
            <Link
              href="/Profile"
              className="text-primary hover:text-primary-dark transition-colors duration-200"
            >
              Profile
            </Link>
          </div>
        </m.div>
      </div>

      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary/5 rounded-full blur-xl" />
        <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-indigo-500/5 rounded-full blur-xl" />
      </div>
    </div>
  );
};

export default NotFound;
