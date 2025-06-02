// src/app/display/ClientProductsPage.jsx

"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ProductList from "./ProductList";
import Navbar from "../../components/Display/nav";
import { ToastContainer, toast } from "react-toastify";

const fetchProducts = async () => {
  try {
    const response = await fetch("/api/products", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    const { products } = await response.json();
    console.log("Fetched products:", products);
    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

const ClientProductsPage = ({ products: initialProducts }) => {
  console.log("Initial products prop:", initialProducts);
  const [productList, setProductList] = useState(initialProducts || []);
  const router = useRouter();
  const searchParams = useSearchParams();
  const category = searchParams.get("category") || "All";

  // Update productList when initialProducts changes
  useEffect(() => {
    if (initialProducts) {
      setProductList(initialProducts);
    }
  }, [initialProducts]);

  // Filter products based on category
  const filteredProducts = productList.filter(
    (product) => category === "All" || product.category === category
  );
  console.log("Filtered products:", filteredProducts);

  const handleDeleteProduct = async (id) => {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        // Refetch products after successful deletion
        const updatedProducts = await fetchProducts();
        setProductList(updatedProducts);
        toast.success("Product deleted successfully!");
      } else {
        const data = await response.json();
        toast.error(data.message || "Failed to delete product.");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("An error occurred while deleting the product.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100">
        <ProductList
          products={filteredProducts}
          onDelete={handleDeleteProduct}
        />
        <ToastContainer />
      </div>
    </>
  );
};

export default ClientProductsPage;
