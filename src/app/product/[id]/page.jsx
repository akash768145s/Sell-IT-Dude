// src/app/product/[id]/page.jsx
"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { useSession } from "next-auth/react";
import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import "../../../components/ProductPage/main.css";
import Image from "next/image";
import Navbar from "../../../components/ProductPage/nav";
import Modal from "../../../components/Model/Modal";

const ProductPage = () => {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const productId = searchParams.get("_id");
  const productName = searchParams.get("name");
  const productPrice = searchParams.get("price");
  const sellerEmail = searchParams.get("sellerEmail");
  const productDescription = searchParams.get("description");
  const productImageUrl = searchParams.get("imageUrl");
  const category = searchParams.get("category");
  const sellerName = searchParams.get("sellerName");

  const [loading, setLoading] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchWishlistStatus = useCallback(async () => {
    try {
      const response = await fetch("/api/wishlist");
      if (response.ok) {
        const data = await response.json();
        const isProductInWishlist = data.some((item) => item._id === productId);
        setIsInWishlist(isProductInWishlist);
      } else {
        console.error("Failed to fetch wishlist:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching wishlist status:", error);
    }
  }, [productId]);

  useEffect(() => {
    console.log("Seller Name:", sellerName); // Debug log
    if (productId) {
      fetchWishlistStatus();
    }
  }, [productId, sellerName, fetchWishlistStatus]);

  useEffect(() => {
    console.log("Seller Name:", sellerName); // Debug log
    if (productId) {
      fetchWishlistStatus();
    }
  }, [productId, sellerName, fetchWishlistStatus]); // Include fetchWishlistStatus

  const handleConfirmModal = async () => {
    setLoading(true);
  
    const subject = encodeURIComponent(`Inquiry About ${productName}`);
    const body = encodeURIComponent(`
      Dear ${sellerName || "Seller"},
      
      I am interested in ${productName} listed on SellItDude!. Could you provide more details or suggest a time to discuss?
      
      Thank you!
      
      Best regards,
      ${session?.user?.name || "Buyer"}
      
      Note: You can continue the conversation by replying to this email.
      
      For any issues, contact our team.
      
      Best regards,
      Team SID`);
  
    // Use window.matchMedia to check for mobile screen size
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
  
    // Define the URLs based on the device type
    const mailtoUrl = `mailto:${sellerEmail}?subject=${subject}&body=${body}`;
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${sellerEmail}&su=${subject}&body=${body}`;
  
    try {
      const response = await fetch("/api/contact-seller", {
        method: "POST",
        body: JSON.stringify({
          sellerName,
          productName,
          sellerEmail,
          buyerEmail: session?.user?.email, // Send the buyer's email
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      const data = await response.json();
  
      if (response.ok) {
        // Redirect to appropriate URL based on device type
        window.location.href = isMobile ? mailtoUrl : gmailUrl;
      } else {
        alert(data.message || "Failed to contact seller.");
      }
    } catch (error) {
      console.error("Error contacting seller:", error);
      alert("Error contacting seller.");
    } finally {
      setLoading(false);
      setIsModalOpen(false);
    }
  };
  
  

  const handleAddToWishlist = async (product) => {
    try {
      const response = await fetch("/api/wishlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ product, sellerName }),
      });

      const responseData = await response.json();

      if (response.ok) {
        toast.success(responseData.message, {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        toast.error(responseData.message, {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      console.error("Error adding product to wishlist:", error);
      toast.error("Error adding product to wishlist.", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const handleRemoveFromWishlist = async (productId) => {
    try {
      const response = await fetch(`/api/wishlist/${productId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error(
          "Error removing product from wishlist:",
          errorData.message
        );
        return;
      }

      const responseData = await response.json();
      console.log(responseData.message);

      setIsInWishlist(false);
      toast.success(responseData.message, {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      console.error("Error removing product from wishlist:", error);
      toast.error("Error removing product from wishlist.", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const handleToggleWishlist = async () => {
    console.log("Button clicked"); // Debug log

    if (productId) {
      if (isInWishlist) {
        console.log("Removing from wishlist"); // Debug log
        await handleRemoveFromWishlist(productId);
      } else {
        console.log("Adding to wishlist"); // Debug log
        await handleAddToWishlist({
          id: productId,
          name: productName,
          price: productPrice,
          sellerEmail,
          description: productDescription,
          imageUrl: productImageUrl,
          category,
        });
      }
      setIsInWishlist((prev) => !prev);
      console.log("Updated wishlist status:", !isInWishlist); // Debug log
    } else {
      console.error("Product ID is missing");
    }
  };

  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <>
      <Navbar />
      <div className="container">
        <section className="main">
          <div className="default gallery">
            <div className="main-img">
              <Image
                className="active"
                src={productImageUrl}
                alt={productName}
                width={500}
                height={500}
                layout="responsive"
                objectFit="contain"
              />
            </div>
          </div>

          <div className="lightbox">
            <div className="gallery">
              <div className="main-img">
                <span className="icon-close">
                  <svg
                    width="14"
                    height="15"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="m11.596.782 2.122 2.122L9.12 7.499l4.597 4.597-2.122 2.122L7 9.62l-4.595 4.597-2.122-2.122L4.878 7.5.282 2.904 2.404.782l4.595 4.596L11.596.782Z"
                      fill="#69707D"
                      fillRule="evenodd"
                    />
                  </svg>
                </span>
                <span className="icon-prev">
                  <svg
                    width="12"
                    height="18"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M11 1 3 9l8 8"
                      stroke="#1D2026"
                      strokeWidth="3"
                      fill="none"
                      fillRule="evenodd"
                    />
                  </svg>
                </span>
                <span className="icon-next">
                  <svg
                    width="13"
                    height="18"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="m2 1 8 8-8 8"
                      stroke="#1D2026"
                      strokeWidth="3"
                      fill="none"
                      fillRule="evenodd"
                    />
                  </svg>
                </span>
                <Image
                  className="active"
                  src={productImageUrl}
                  alt={productName}
                  width={500}
                  height={500}
                  layout="responsive"
                  objectFit="contain"
                />
              </div>
            </div>
          </div>

          <div className="content">
            <div className="product-container">
              <div className="flex flex-col">
                <h2 className="product-name text-2xl font-semibold">
                  {productName}
                </h2>
                <h3 className="product-category text-sm text-gray-500 italic -mt-10">
                  {category}
                </h3>
                <p className="product-seller text-sm text-gray-500 italic mt-2">
                  Seller: {sellerName || "Unknown"}
                </p>
              </div>
              <div className="wishlist-button mt-2">
                <button
                  className={`wishlist-toggle ${
                    isInWishlist ? "in-wishlist" : ""
                  }`}
                  aria-label="Toggle Wishlist"
                  onClick={handleToggleWishlist}
                >
                  <svg
                    width="24"
                    height="24"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill={isInWishlist ? "white" : "none"}
                    stroke={isInWishlist ? "white" : "currentColor"}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {isInWishlist ? (
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    ) : (
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    )}
                  </svg>
                </button>
              </div>
            </div>

            <p className="product-desc">{productDescription}</p>
            <div className="price-info">
              <div className="price">
                <span className="current-price">&#x20b9; {productPrice}</span>
              </div>
            </div>

            <div className="add-to-cart-container">
              <button
                className="add-to-cart"
                onClick={() => setIsModalOpen(true)}
              >
                <span>Contact Seller</span>
              </button>
            </div>

            <Modal
              isOpen={isModalOpen}
              onClose={handleCloseModal}
              onConfirm={handleConfirmModal}
              message="Do you want to chat with the seller?"
            />
          </div>
        </section>
        <ToastContainer />
      </div>
    </>
  );
};

export default ProductPage;
