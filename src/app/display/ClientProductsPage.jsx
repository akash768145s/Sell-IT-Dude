// src/app/display/ClientProductsPage.jsx

"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ProductListSimple from "./ProductListSimple";
import { ProductsLoading } from "@/components/ui/Loading";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const fetchProducts = async () => {
  try {
    console.log("Fetching products from client-side...");
    const response = await fetch("/api/products", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.status}`);
    }

    const data = await response.json();
    console.log("Client-side fetched products:", data);
    return data.products || [];
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

const ClientProductsPage = ({ products: initialProducts }) => {
  console.log("Initial products prop:", initialProducts);

  const [productList, setProductList] = useState(() =>
    Array.isArray(initialProducts) ? initialProducts : []
  );
  const [loading, setLoading] = useState(() =>
    !initialProducts || !Array.isArray(initialProducts) || initialProducts.length === 0
  );
  const [error, setError] = useState(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const category = searchParams.get("category") || "All";

  // Fetch products client-side if no initial products were provided
  useEffect(() => {
    const getProducts = async () => {
      if (!initialProducts || !Array.isArray(initialProducts) || initialProducts.length === 0) {
        setLoading(true);
        try {
          const products = await fetchProducts();
          setProductList(Array.isArray(products) ? products : []);
          setError(null);
        } catch (err) {
          console.error("Failed to load products:", err);
          setError("Failed to load products. Please try again.");
          toast.error("Failed to load products");
        } finally {
          setLoading(false);
        }
      }
    };

    getProducts();
  }, [initialProducts]);

  // Filter products based on category with safety checks
  const filteredProducts = React.useMemo(() => {
    try {
      if (!Array.isArray(productList)) return [];

      return productList.filter(
        (product) => category === "All" || product?.category === category
      );
    } catch (err) {
      console.error("Error filtering products:", err);
      return [];
    }
  }, [productList, category]);
  console.log("Filtered products:", filteredProducts);

  const handleDeleteProduct = async (id) => {
    if (!id) return;

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        // Update local state after successful deletion
        setProductList((prev) =>
          Array.isArray(prev) ? prev.filter(product => product?._id !== id) : []
        );
        toast.success("Product deleted successfully!");
      } else {
        const data = await response.json();
        toast.error(data?.message || "Failed to delete product.");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("An error occurred while deleting the product.");
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-100 pb-10">
        {loading ? (
          <ProductsLoading text="Discovering amazing deals for you..." />
        ) : error ? (
          <div className="text-center py-10">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={() => {
                setError(null);
                window.location.reload();
              }}
              className="px-4 py-2 bg-primary text-white rounded-lg"
            >
              Try Again
            </button>
          </div>
        ) : (
          <ErrorBoundary>
            <ProductListSimple
              products={filteredProducts}
              onDelete={handleDeleteProduct}
            />
          </ErrorBoundary>
        )}
        <ToastContainer position="bottom-right" />
      </div>
    </>
  );
};

export default ClientProductsPage;
