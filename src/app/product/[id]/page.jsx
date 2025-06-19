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
} from "lucide-react";
import Link from "next/link";
import "react-toastify/dist/ReactToastify.css";
import SafeImage from "@/components/ui/SafeImage";

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

  const handleContactSeller = () => {
    if (!session) {
      toast.error("Please sign in to contact seller");
      return;
    }

    if (!product) return;

    const subject = encodeURIComponent(`Inquiry About ${product.name}`);
    const body = encodeURIComponent(
      `
Dear ${product.sellerName || "Seller"},

I am interested in "${product.name}" listed on SellItDude marketplace.

Could you provide more details or suggest a time to discuss?

Thank you!

Best regards,
${session.user?.name || "Buyer"}

---
Product: ${product.name}
Price: ₹${product.price?.toLocaleString()}
Listed on: SellItDude
    `.trim()
    );

    const mailtoUrl = `mailto:${product.sellerEmail}?subject=${subject}&body=${body}`;
    window.open(mailtoUrl, "_blank");

    toast.success("Opening email client...");
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

              {!isSeller && (
                <button
                  onClick={handleWishlistToggle}
                  className={`p-2 transition-colors ${isInWishlist
                    ? "text-red-500"
                    : "text-gray-600 hover:text-red-500"
                    }`}
                  title={
                    isInWishlist ? "Remove from wishlist" : "Add to wishlist"
                  }
                >
                  <Heart
                    className={`w-5 h-5 ${isInWishlist ? "fill-current" : ""}`}
                  />
                </button>
              )}
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
                  <Mail className="w-5 h-5" />
                  Contact Seller
                </button>

                <p className="text-sm text-gray-600 text-center">
                  This will open your email client to contact the seller
                  directly.
                </p>
              </div>
            )}

            {/* Seller Notice */}
            {isSeller && (
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <p className="text-blue-800 text-sm">
                  <strong>This is your listing.</strong> Potential buyers will
                  contact you via email when they&apos;re interested in this item.
                </p>
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
    </div>
  );
};

export default ProductPage;
