"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Heart, ShoppingBag } from "lucide-react";
import Navbar from "./nav";

const WishlistPage = () => {
  const { data: session, status } = useSession();
  const [wishlist, setWishlist] = useState([]);
  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsMounted(true);
    if (session) {
      fetchWishlist();
    }
  }, [session]);

  const fetchWishlist = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/wishlist");
      if (response.ok) {
        const data = await response.json();
        // Filter out items where product is null/undefined
        const validWishlistItems = data.filter(item => item.product && item.product._id);
        setWishlist(validWishlistItems);
      } else {
        const errorData = await response.json();
        setError(errorData.message);
      }
    } catch (error) {
      setError("Error fetching wishlist.");
      console.error("Error fetching wishlist:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (productId) => {
    try {
      const response = await fetch(`/api/wishlist/${productId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error removing product from wishlist:", errorData.message);
        return;
      }

      const responseData = await response.json();
      console.log(responseData.message);

      // Update the wishlist UI after successful removal
      setWishlist((prevWishlist) =>
        prevWishlist.filter((item) => item._id !== productId)
      );
    } catch (error) {
      console.error("Error removing product from wishlist:", error);
    }
  };

  if (!isMounted) {
    return null;
  }

  if (status === "loading" || loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading your wishlist...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">😔</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchWishlist}
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </>
    );
  }

  if (!session) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
          <div className="text-center">
            <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign in to view your wishlist</h2>
            <p className="text-gray-600 mb-6">Keep track of products you love</p>
            <Link
              href="/sign-in"
              className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors inline-flex items-center gap-2"
            >
              Sign In
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                My Wishlist
              </h1>
              <p className="text-gray-600">
                {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved for later
              </p>
            </div>

            {wishlist.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {wishlist.map((item) => {
                  // Safety check for product data
                  if (!item.product) {
                    return null; // Skip items with missing product data
                  }

                  const product = item.product;
                  const fallbackImage = "/image-product-1.jpg";

                  return (
                    <div
                      key={item._id}
                      className="bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden group"
                    >
                      {/* Product Image */}
                      <div className="relative h-48 bg-gray-50">
                        <Image
                          src={product.imageUrl || fallbackImage}
                          alt={product.name || "Product"}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.target.src = fallbackImage;
                          }}
                        />
                        <div className="absolute top-3 left-3 bg-primary text-white px-2 py-1 rounded-full text-xs font-medium">
                          {product.category || "Other"}
                        </div>
                      </div>

                      {/* Product Details */}
                      <div className="p-4">
                        <h3 className="font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                          {product.name || "Untitled Product"}
                        </h3>

                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {product.description || "No description available"}
                        </p>

                        <div className="flex items-center justify-between mb-4">
                          <div className="text-lg font-bold text-primary">
                            ₹{product.price ? product.price.toLocaleString() : "0"}
                          </div>
                          <div className="text-sm text-gray-500">
                            {product.sellerName || "Unknown Seller"}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          <Link
                            href={`/product/${product._id}`}
                            className="flex-1 bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary-dark transition-colors text-center text-sm font-medium flex items-center justify-center gap-2"
                          >
                            <ShoppingBag className="w-4 h-4" />
                            View Product
                          </Link>
                          <button
                            onClick={() => handleRemoveFromWishlist(item._id)}
                            className="bg-red-100 text-red-600 p-2 rounded-lg hover:bg-red-200 transition-colors"
                            title="Remove from wishlist"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">💝</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Your wishlist is empty
                </h3>
                <p className="text-gray-600 mb-6">
                  Discover amazing products and add them to your wishlist
                </p>
                <Link
                  href="/display"
                  className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors inline-flex items-center gap-2"
                >
                  <ShoppingBag className="w-5 h-5" />
                  Browse Products
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default WishlistPage;
