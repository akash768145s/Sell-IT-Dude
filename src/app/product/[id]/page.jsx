// src/app/product/[id]/page.jsx
"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ToastContainer, toast } from "react-toastify";
import {
  Heart,
  ArrowLeft,
  Share2,
  MapPin,
  Clock,
  User,
  Mail,
  Phone,
  MessageCircle,
  Loader2,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import "react-toastify/dist/ReactToastify.css";
import SafeImage from "@/components/ui/SafeImage";
import ChatWindow from "@/components/chat/ChatWindow";

const ProductPage = () => {
  const { data: session } = useSession();
  const params = useParams();
  const router = useRouter();
  const productId = params.id;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState(null);

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;

      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`/api/products/${productId}`);

        if (response.ok) {
          const data = await response.json();
          const productData = data.product || data;
          setProduct(productData);
        } else {
          setError("Product not found");
        }
      } catch (error) {
        setError("Error loading product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  // Check wishlist status
  useEffect(() => {
    const checkWishlistStatus = async () => {
      if (!session || !productId) return;

      try {
        const response = await fetch("/api/wishlist");
        if (response.ok) {
          const wishlist = await response.json();
          const isInList = wishlist.some(
            (item) =>
              item.product._id === productId || item.product.id === productId
          );
          setIsInWishlist(isInList);
        }
      } catch (error) {
        console.error("Error checking wishlist:", error);
      }
    };

    checkWishlistStatus();
  }, [session, productId]);

  const handleWishlistToggle = async () => {
    if (!session) {
      toast.error("Please sign in to add items to wishlist");
      return;
    }

    if (!product) return;

    try {
      if (isInWishlist) {
        // Remove from wishlist
        const response = await fetch(`/api/wishlist/${productId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          setIsInWishlist(false);
          toast.success("Removed from wishlist");
        } else {
          toast.error("Failed to remove from wishlist");
        }
      } else {
        // Add to wishlist
        const response = await fetch("/api/wishlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ product }),
        });

        if (response.ok) {
          setIsInWishlist(true);
          toast.success("Added to wishlist");
        } else {
          const data = await response.json();
          toast.error(data.message || "Failed to add to wishlist");
        }
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
      toast.error("Error updating wishlist");
    }
  };

  const handleContactSeller = async () => {
    if (!session) {
      toast.error("Please sign in to contact seller");
      return;
    }

    if (!product) return;

    try {
      // Create or get existing conversation
      const response = await fetch("/api/chat/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product._id,
          sellerId: product.sellerEmail,
          sellerName: product.sellerName,
        }),
      });

      if (response.ok) {
        const conversation = await response.json();
        // Open chat window by setting it in state
        setShowContactModal(true);
        setSelectedConversation(conversation);
        toast.success("Chat opened!");
      } else {
        toast.error("Failed to start conversation");
      }
    } catch (error) {
      console.error("Error starting conversation:", error);
      toast.error("Error starting conversation");
    }
  };

  const handleShare = async () => {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.name || "Product",
          text: `Check out this ${product?.name} on SellItDude!`,
          url: url,
        });
      } catch (error) {
        // Fall back to clipboard
        navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard!");
      }
    } else {
      navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {error || "Product Not Found"}
          </h2>
          <p className="text-gray-600 mb-6">
            The product you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <div className="space-x-4">
            <button
              onClick={() => router.back()}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            >
              Go Back
            </button>
            <Link
              href="/display"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Browse All Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const fallbackImage = "/image-product-1.jpg";

  // Check if current user is the seller
  const isSeller = session?.user?.email === product.sellerEmail;
  const isAdmin = session?.user?.email === process.env.NEXTAUTH_ADMIN_EMAIL;

  const handleDeleteProduct = async () => {
    if (!product?._id) return;

    const confirmMessage = isAdmin && !isSeller
      ? "Are you sure you want to delete this product as an admin?"
      : "Are you sure you want to delete your product?";

    if (!confirm(confirmMessage)) return;

    try {
      const response = await fetch(`/api/products/${product._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        toast.success("Product deleted successfully!");
        setTimeout(() => {
          router.push("/display");
        }, 1000);
      } else {
        const data = await response.json();
        toast.error(data.message || "Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Error deleting product");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                title="Share"
              >
                <Share2 className="w-5 h-5" />
              </button>

            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg">
              <div className="aspect-square relative">
                <SafeImage
                  src={product.imageUrl}
                  alt={product.name || "Product image"}
                  fallbackSrc={fallbackImage}
                  fill
                  className="object-cover"
                  priority
                  style={{ objectFit: "cover" }}
                />

                {/* Category Badge */}
                <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {product.category}
                </div>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>

              <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {product.sellerName || "Unknown Seller"}
                </div>

                {product.createdAt && (
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {new Date(product.createdAt).toLocaleDateString()}
                  </div>
                )}
              </div>

              <div className="text-4xl font-bold text-blue-600 mb-6">
                ₹{product.price?.toLocaleString()}
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Description
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {product.description || "No description available."}
              </p>
            </div>

            {/* Contact Section */}
            {!isSeller && (
              <div className="bg-white p-6 rounded-2xl shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Interested in this item?
                </h3>

                <button
                  onClick={handleContactSeller}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 mb-3"
                >
                  <MessageCircle className="w-5 h-5" />
                  Chat with Seller
                </button>

                <p className="text-sm text-gray-600 text-center">
                  Start a real-time chat conversation with the seller
                </p>
              </div>
            )}

            {/* Seller Notice */}
            {isSeller && (
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg space-y-3">
                <p className="text-blue-800 text-sm">
                  <strong>This is your listing.</strong> Potential buyers will
                  contact you via email when they&apos;re interested in this item.
                </p>
                <button
                  onClick={handleDeleteProduct}
                  className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-5 h-5" />
                  Delete Product
                </button>
              </div>
            )}

            {/* Admin Delete */}
            {isAdmin && !isSeller && (
              <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg space-y-3">
                <p className="text-orange-800 text-sm">
                  <strong>Admin Controls:</strong> You can delete this product as an administrator.
                </p>
                <button
                  onClick={handleDeleteProduct}
                  className="w-full bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-5 h-5" />
                  Admin Delete
                </button>
              </div>
            )}
          </div>
        </div>
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

      {selectedConversation && (
        <ChatWindow
          conversation={selectedConversation}
          onClose={() => {
            setSelectedConversation(null);
            setShowContactModal(false);
          }}
        />
      )}
    </div>
  );
};

export default ProductPage;
