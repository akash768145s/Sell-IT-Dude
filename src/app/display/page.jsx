// src/app/display/page.jsx

import React from "react";
import ClientProductsPage from "./ClientProductsPage";
import connect from "@/utils/db";
import Product from "@/models/Product";
import ErrorBoundary from "@/components/ui/ErrorBoundary";

// Force dynamic rendering for this page
export const dynamic = "force-dynamic";

async function fetchProducts() {
  try {
    await connect();
    const products = await Product.find().sort({ createdAt: -1 }).lean();

    // Transform MongoDB documents to plain objects and ensure _id is a string
    const serializedProducts = products.map(product => ({
      ...product,
      _id: product._id.toString(),
      createdAt: product.createdAt?.toISOString(),
      updatedAt: product.updatedAt?.toISOString(),
    }));

    console.log("Server-side fetched products:", serializedProducts.length);
    return serializedProducts;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export default async function ProductsPage() {
  const products = await fetchProducts();
  console.log("Rendering products page with", products.length, "products");

  return (
    <ErrorBoundary>
      <ClientProductsPage products={products} />
    </ErrorBoundary>
  );
}
