// src/app/display/ProductList.jsx
"use client";
import React, { useState, useEffect, useMemo, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { m, AnimatePresence } from "framer-motion";
import {
  Heart,
  Trash2,
  Eye,
  Filter,
  Grid3X3,
  List,
  Search,
  SortAsc,
  MapPin,
  User,
  DollarSign,
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const categories = [
  "All",
  "Stationary",
  "Sport Equipment",
  "Electronics",
  "Other Accessories",
];

const sortOptions = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "name", label: "Name A-Z" },
];

const ProductCardSkeleton = () => (
  <div className="bg-white rounded-2xl shadow-card overflow-hidden">
    <div className="h-48 bg-gray-200 skeleton" />
    <div className="p-4 space-y-3">
      <div className="h-4 bg-gray-200 rounded skeleton" />
      <div className="h-3 bg-gray-200 rounded skeleton" />
      <div className="flex justify-between items-center">
        <div className="h-4 bg-gray-200 rounded w-20 skeleton" />
        <div className="h-8 bg-gray-200 rounded w-16 skeleton" />
      </div>
    </div>
  </div>
);

const ProductCard = ({ product, onDelete, onAddToWishlist, index }) => {
  const { data: session } = useSession();
  const isSeller = session?.user?.email === product.sellerEmail;
  const isAdmin = session?.user?.email === "sakthimuruganakash@gmail.com";
  const canDelete = isSeller || isAdmin;
  const [imageError, setImageError] = useState(false);

  // Fallback image if product image fails to load
  const fallbackImage = "/image-product-1.jpg";

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      onDelete(product._id);
    }
  };

  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -5 }}
      className="group bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden relative z-10"
    >
      {/* Image */}
      <div className="relative overflow-hidden h-48 bg-white">
        <Image
          src={imageError ? fallbackImage : product.imageUrl || fallbackImage}
          alt={product.name || "Product image"}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          onError={() => setImageError(true)}
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
        />

        {/* Category Badge */}
        <div className="absolute top-3 left-3 bg-primary text-white px-2 py-1 rounded-full text-xs font-medium z-20">
          {product.category || "Other"}
        </div>

        {/* Actions */}
        <div className="absolute top-3 right-3 flex gap-2 z-20">
          {!isSeller && (
            <button
              onClick={() => onAddToWishlist(product)}
              className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors duration-200"
              title="Add to Wishlist"
              aria-label="Add to Wishlist"
            >
              <Heart className="w-4 h-4 text-gray-600" />
            </button>
          )}

          {canDelete && (
            <button
              onClick={handleDelete}
              className="w-8 h-8 bg-red-500/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-red-500 transition-colors duration-200"
              title="Delete Product"
              aria-label="Delete Product"
            >
              <Trash2 className="w-4 h-4 text-white" />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 bg-white">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1 group-hover:text-primary transition-colors duration-200">
          {product.name || "Untitled Product"}
        </h3>

        <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
          <User className="w-3 h-3" />
          <span>{product.sellerName || "Unknown Seller"}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-lg font-bold text-primary">
            ₹{(product.price || 0).toLocaleString()}
          </div>

          {!isSeller && (
            <Link
              href={`/product/${product._id}`}
              className="btn btn-primary btn-sm px-4 py-2 text-xs flex items-center gap-1"
            >
              <Eye className="w-3 h-3" />
              View
            </Link>
          )}
        </div>
      </div>
    </m.div>
  );
};

const ProductList = ({ products = [] }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();

  const [productList, setProductList] = useState(products);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("grid");
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Initialize from URL params
  useEffect(() => {
    const category = searchParams.get("category") || "All";
    const search = searchParams.get("search") || "";
    const sort = searchParams.get("sort") || "newest";

    setSelectedCategory(category);
    setSearchQuery(search);
    setSortBy(sort);
  }, [searchParams]);

  useEffect(() => {
    setProductList(products);
  }, [products]);

  // Early return if no products
  if (!products || products.length === 0) {
    console.log("No products to display:", products);
    return (
      <div className="text-center py-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No Products Found
        </h3>
        <p className="text-gray-600">Try adjusting your search or filters</p>
      </div>
    );
  }

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    console.log("Filtering and sorting products:", products);
    let filtered = [...productList];

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter(
        (product) => product.category === selectedCategory
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.description?.toLowerCase().includes(query) ||
          product.sellerName.toLowerCase().includes(query)
      );
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return (a.price || 0) - (b.price || 0);
        case "price-high":
          return (b.price || 0) - (a.price || 0);
        case "name":
          return a.name.localeCompare(b.name);
        case "oldest":
          return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
        case "newest":
        default:
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      }
    });

    return filtered;
  }, [productList, selectedCategory, searchQuery, sortBy]);

  const handleDeleteProduct = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        setProductList((prev) => prev.filter((product) => product._id !== id));
        toast.success("Product deleted successfully!");
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Error deleting product");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToWishlist = async (product) => {
    if (!session) {
      toast.error("Please sign in to add items to wishlist");
      return;
    }

    try {
      const response = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product }),
      });

      const responseData = await response.json();

      if (response.ok) {
        toast.success(responseData.message);
      } else {
        toast.error(responseData.message || "Failed to add to wishlist");
      }
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      toast.error("Error adding to wishlist");
    }
  };

  const updateURL = (params) => {
    const url = new URL(window.location);
    Object.entries(params).forEach(([key, value]) => {
      if (value && value !== "All" && value !== "newest") {
        url.searchParams.set(key, value);
      } else {
        url.searchParams.delete(key);
      }
    });
    router.push(url.pathname + url.search, { scroll: false });
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    updateURL({ category, search: searchQuery, sort: sortBy });
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);
    updateURL({ category: selectedCategory, search: query, sort: sortBy });
  };

  const handleSortChange = (sort) => {
    setSortBy(sort);
    updateURL({ category: selectedCategory, search: searchQuery, sort });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 relative z-10">
        <div className="container py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                Browse Products
              </h1>
              <p className="text-gray-600 mt-1">
                {filteredAndSortedProducts.length} items available
              </p>
            </div>

            {/* Search */}
            <div className="relative max-w-md w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search products, sellers..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Controls */}
      <div className="bg-white border-b border-gray-200 relative z-10">
        <div className="container py-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    selectedCategory === category
                      ? "bg-primary text-white shadow-sm"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4">
              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              {/* View Mode */}
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 ${
                    viewMode === "grid"
                      ? "bg-primary text-white"
                      : "bg-white text-gray-400"
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 ${
                    viewMode === "list"
                      ? "bg-primary text-white"
                      : "bg-white text-gray-400"
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container py-8 relative z-10">
        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}

        <AnimatePresence mode="wait">
          {filteredAndSortedProducts.length === 0 ? (
            <m.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-16"
            >
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No products found
              </h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search or filters
              </p>
              <Link href="/upload" className="btn btn-primary">
                List Your First Item
              </Link>
            </m.div>
          ) : (
            <m.div
              key={`${selectedCategory}-${searchQuery}-${sortBy}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={`grid gap-6 ${
                viewMode === "grid"
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  : "grid-cols-1"
              }`}
            >
              {filteredAndSortedProducts.map((product, index) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onDelete={handleDeleteProduct}
                  onAddToWishlist={handleAddToWishlist}
                  index={index}
                />
              ))}
            </m.div>
          )}
        </AnimatePresence>
      </div>

      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default ProductList;
