// src/app/display/page.jsx

import React from "react";
import ClientProductsPage from "./ClientProductsPage";
import connect from "@/utils/db";
import Product from "@/models/Product";

async function fetchProducts() {
  try {
    await connect();
    const products = await Product.find().sort({ createdAt: -1 }).lean();
    console.log("Server-side fetched products:", products);
    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export default async function ProductsPage() {
  const products = await fetchProducts();
  console.log("Rendering products page with", products.length, "products");
  return <ClientProductsPage products={products} />;
}
