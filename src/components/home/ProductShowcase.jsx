"use client";
import { useState, useEffect } from "react";
import { m } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Heart, Star, ArrowRight } from "lucide-react";

const ProductCard = ({ product, index }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Fallback image if product image fails to load
  const fallbackImage = "/image-product-1.jpg";

  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group"
    >
      <div className="bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden">
        {/* Image */}
        <div className="relative overflow-hidden">
          <Image
            src={imageError ? fallbackImage : product.imageUrl || fallbackImage}
            alt={product.name}
            width={300}
            height={200}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            priority={index < 2}
            onError={() => setImageError(true)}
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
          />

          {/* Wishlist button */}
          <button
            onClick={() => setIsLiked(!isLiked)}
            className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors duration-200"
            aria-label="Add to wishlist"
          >
            <Heart
              className={`w-4 h-4 ${
                isLiked ? "fill-red-500 text-red-500" : "text-gray-600"
              }`}
            />
          </button>

          {/* Category badge */}
          <div className="absolute top-3 left-3 bg-primary text-white px-2 py-1 rounded-full text-xs font-medium">
            {product.category}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-primary transition-colors duration-200 line-clamp-1">
            {product.name}
          </h3>

          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {product.description}
          </p>

          <div className="flex items-center justify-between mb-3">
            <div className="text-lg font-bold text-primary">
              ₹{product.price?.toLocaleString()}
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400 mr-1" />
              <span>4.5</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-500">By {product.sellerName}</div>
            <Link
              href={`/product/${product._id}`}
              className="text-primary hover:text-primary-dark text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all duration-200"
            >
              View <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </m.div>
  );
};

const ProductShowcase = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await fetch("/api/products?limit=8");
        if (response.ok) {
          const data = await response.json();
          console.log("Featured products fetched:", data.products?.length || 0);
          setFeaturedProducts(data.products || []);
        } else {
          console.error("Failed to fetch featured products:", response.status);
        }
      } catch (error) {
        console.error("Error fetching featured products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  // Fallback data for demonstration - using actual public images
  const fallbackProducts = [
    {
      _id: "1",
      name: "Electronics & Gadgets",
      price: 15000,
      category: "Electronics",
      description:
        "High-quality electronics and gadgets for students, perfect for academic and personal use.",
      sellerName: "John Doe",
      imageUrl: "/image-product-1.jpg",
    },
    {
      _id: "2",
      name: "Study Materials & Books",
      price: 500,
      category: "Stationary",
      description:
        "Essential study materials and textbooks for various courses and subjects.",
      sellerName: "Sarah Smith",
      imageUrl: "/Book.png",
    },
    {
      _id: "3",
      name: "Sports Equipment",
      price: 2500,
      category: "Sport Equipment",
      description:
        "Quality sports equipment including badminton rackets and other sports gear.",
      sellerName: "Mike Johnson",
      imageUrl: "/Badminton.png",
    },
    {
      _id: "4",
      name: "Campus Essentials",
      price: 800,
      category: "Other Accessories",
      description:
        "Various campus essentials and accessories for student life.",
      sellerName: "Emma Wilson",
      imageUrl: "/Shopping Bag.png",
    },
  ];

  const displayProducts =
    featuredProducts.length > 0 ? featuredProducts : fallbackProducts;

  if (loading) {
    return (
      <div className="container">
        <div className="text-center mb-12">
          <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4 skeleton" />
          <div className="h-4 bg-gray-200 rounded w-96 mx-auto skeleton" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-card overflow-hidden"
            >
              <div className="h-48 bg-gray-200 skeleton" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded skeleton" />
                <div className="h-3 bg-gray-200 rounded skeleton" />
                <div className="h-4 bg-gray-200 rounded w-20 skeleton" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="text-center mb-12">
        <m.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4"
        >
          Featured Products
        </m.h2>
        <m.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-lg text-gray-600 max-w-2xl mx-auto"
        >
          Discover the best deals from your fellow students
        </m.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {displayProducts.slice(0, 8).map((product, index) => (
          <ProductCard key={product._id} product={product} index={index} />
        ))}
      </div>

      <m.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
        className="text-center"
      >
        <Link href="/display" className="btn btn-primary px-8 py-3 text-base">
          View All Products
        </Link>
      </m.div>
    </div>
  );
};

export default ProductShowcase;
