// src/app/display/ProductList.jsx
"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { toast } from "react-toastify";
import {
  Search,
  Filter,
  Grid3X3,
  List,
  Heart,
  Edit3,
  Trash2,
  Calendar,
  User,
  Phone,
  Mail,
  MapPin,
  IndianRupee,
} from "lucide-react";
import SafeImage from "@/components/ui/SafeImage";

const ProductCardSkeleton = () => (
  <div className="bg-white rounded-2xl border border-gray-200 p-6 animate-pulse">
    <div className="bg-gray-200 rounded-xl h-48 mb-4"></div>
    <div className="space-y-3">
      <div className="bg-gray-200 rounded h-4 w-3/4"></div>
      <div className="bg-gray-200 rounded h-4 w-1/2"></div>
      <div className="bg-gray-200 rounded h-4 w-2/3"></div>
    </div>
  </div>
);

const ProductCard = ({ product, onDelete, onAddToWishlist, index }) => {
  const { data: session } = useSession();
  const router = useRouter();

  if (!product) return null;

  const handleDelete = () => {
    if (onDelete && product._id) {
      onDelete(product._id);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Recently";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "Recently";
    }
  };

  const isOwner = session?.user?.email === product.sellerEmail;

  return (
    <div className="group bg-white rounded-2xl border border-gray-200 hover:border-primary/20 hover:shadow-lg transition-all duration-300">
      {/* Product Image */}
      <div className="relative h-48 rounded-t-2xl overflow-hidden bg-gray-100">
        <SafeImage
          src={product.imageUrl || "/image-product-1.jpg"}
          alt={product.name || "Product"}
          fill
          style={{ objectFit: "cover" }}
          className="group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src = "/image-product-1.jpg";
          }}
        />

        {/* Overlay buttons */}
        <div className="absolute top-3 right-3 flex gap-2">
          {!isOwner && (
            <button
              onClick={() => onAddToWishlist && onAddToWishlist(product)}
              className="p-2 bg-white/90 hover:bg-white rounded-full shadow-sm transition-colors"
              aria-label="Add to wishlist"
            >
              <Heart className="w-4 h-4 text-gray-600" />
            </button>
          )}

          {isOwner && (
            <>
              <button
                onClick={() => router.push(`/product/${product._id}`)}
                className="p-2 bg-white/90 hover:bg-white rounded-full shadow-sm transition-colors"
                aria-label="Edit product"
              >
                <Edit3 className="w-4 h-4 text-gray-600" />
              </button>
              <button
                onClick={handleDelete}
                className="p-2 bg-red-50/90 hover:bg-red-100 rounded-full shadow-sm transition-colors"
                aria-label="Delete product"
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </button>
            </>
          )}
        </div>

        {/* Price badge */}
        <div className="absolute bottom-3 left-3">
          <div className="bg-primary text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
            <IndianRupee className="w-3 h-3" />
            {product.price || 0}
          </div>
        </div>
      </div>

      {/* Product Details */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-gray-900 text-lg line-clamp-2 group-hover:text-primary transition-colors">
            {product.name || "Untitled Product"}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-2 mt-1">
            {product.description || "No description available"}
          </p>
        </div>

        {/* Product Meta */}
        <div className="space-y-2 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{product.sellerName || "Unknown Seller"}</span>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 flex-shrink-0" />
            <span>{formatDate(product.createdAt)}</span>
          </div>

          {product.category && (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-400 rounded-full flex-shrink-0" />
              <span className="truncate">{product.category}</span>
            </div>
          )}
        </div>

        {/* Contact Actions */}
        <div className="flex gap-2 pt-2 border-t border-gray-100">
          {product.phone && (
            <a
              href={`tel:${product.phone}`}
              className="flex items-center gap-2 px-3 py-2 bg-green-50 text-green-600 rounded-lg text-sm hover:bg-green-100 transition-colors flex-1 justify-center"
            >
              <Phone className="w-4 h-4" />
              Call
            </a>
          )}

          {product.sellerEmail && (
            <a
              href={`mailto:${product.sellerEmail}`}
              className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm hover:bg-blue-100 transition-colors flex-1 justify-center"
            >
              <Mail className="w-4 h-4" />
              Email
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

const ProductList = ({ products = [] }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();

  // Simple state management
  const [productList, setProductList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Initialize from URL params
  useEffect(() => {
    try {
      const category = searchParams?.get("category") || "All";
      const search = searchParams?.get("search") || "";
      const sort = searchParams?.get("sort") || "newest";

      setSelectedCategory(category);
      setSearchQuery(search);
      setSortBy(sort);
      setMounted(true);
    } catch (err) {
      console.error("Error initializing from URL params:", err);
      setMounted(true);
    }
  }, [searchParams]);

  // Update products when props change
  useEffect(() => {
    if (Array.isArray(products)) {
      setProductList(products);
    }
  }, [products]);

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    if (!Array.isArray(productList) || productList.length === 0) {
      return [];
    }

    let filtered = [...productList];

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter(
        (product) => product?.category === selectedCategory
      );
    }

    // Filter by search query
    if (searchQuery?.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product?.name?.toLowerCase().includes(query) ||
          product?.description?.toLowerCase().includes(query) ||
          product?.sellerName?.toLowerCase().includes(query)
      );
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0);
        case "oldest":
          return new Date(a?.createdAt || 0) - new Date(b?.createdAt || 0);
        case "price-low":
          return (a?.price || 0) - (b?.price || 0);
        case "price-high":
          return (b?.price || 0) - (a?.price || 0);
        case "name":
          return (a?.name || "").localeCompare(b?.name || "");
        default:
          return 0;
      }
    });

    return filtered;
  }, [productList, selectedCategory, searchQuery, sortBy]);

  const handleDeleteProduct = async (id) => {
    if (!id) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const responseData = await response.json();

      if (response.ok) {
        setProductList((prev) => prev.filter((product) => product?._id !== id));
        toast.success(responseData?.message || "Product deleted successfully!");
      } else {
        toast.error(responseData?.message || "Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Error deleting product");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToWishlist = async (product) => {
    if (!product?._id || !session?.user?.email) {
      toast.error("Please sign in to add items to wishlist");
      return;
    }

    try {
      const response = await fetch("/api/wishlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product._id,
          userEmail: session.user.email,
        }),
      });

      const responseData = await response.json();

      if (response.ok) {
        toast.success(responseData?.message || "Added to wishlist!");
      } else if (response.status === 409) {
        toast.info(responseData?.message || "Already in your wishlist");
      } else {
        toast.error(responseData?.message || "Failed to add to wishlist");
      }
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      toast.error("Error adding to wishlist");
    }
  };

  // Don't render until mounted
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container py-8">
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
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
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 mt-6">
            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="All">All Categories</option>
              <option value="Electronics">Electronics</option>
              <option value="Books">Books</option>
              <option value="Clothing">Clothing</option>
              <option value="Sports">Sports</option>
              <option value="Home">Home</option>
              <option value="Other">Other</option>
            </select>

            {/* Sort Filter */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name: A to Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container py-8">
        {filteredAndSortedProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No products found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search or filters to find what you&apos;re looking for.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredAndSortedProducts.map((product, index) => (
              <ProductCard
                key={product._id || index}
                product={product}
                onDelete={handleDeleteProduct}
                onAddToWishlist={handleAddToWishlist}
                index={index}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;
