// src/app/display/ClientProductsPage.jsx

"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import ProductList from "./ProductList";
import Navbar from "../../components/Display/nav";
import { ToastContainer, toast } from "react-toastify";

const fetchProducts = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/fetch`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store", // Ensure fresh data
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    const { products } = await response.json();
    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

const ClientProductsPage = ({ products }) => {
  const [productList, setProductList] = useState(products);
  const router = useRouter();
  const query = router.query;

  const category = query?.category || "All";

  // Filter products based on category
  const filteredProducts = productList.filter(
    (product) => category === "All" || product.category === category
  );

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
        setProductList(updatedProducts); // Update state with fresh data
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
      <div className="p-24 bg-[#004aad] -mt-20">
        <h1 className="text-2xl text-white font-bold mb-4">Product Listings</h1>
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
