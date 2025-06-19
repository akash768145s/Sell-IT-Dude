// src/app/api/products/[id]/route.js

import { NextResponse } from "next/server";
import connect from "@/utils/db";
import Product from "@/models/Product";
import { getToken } from "next-auth/jwt";

// Force dynamic routing
export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
  try {
    await connect();

    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { message: "Product ID is required" },
        { status: 400 }
      );
    }

    const product = await Product.findById(id).lean();

    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    // Serialize the MongoDB document to plain JSON
    const serializedProduct = {
      ...product,
      _id: product._id.toString(),
      createdAt: product.createdAt?.toISOString(),
      updatedAt: product.updatedAt?.toISOString(),
    };

    console.log(`Fetched product with ID: ${id}`);
    return NextResponse.json({ product: serializedProduct }, { status: 200 });
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await connect();

    const { id } = params;
    if (!id) {
      return NextResponse.json(
        { message: "Product ID is required" },
        { status: 400 }
      );
    }

    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userEmail = token.email;
    const adminEmail = process.env.NEXTAUTH_ADMIN_EMAIL;

    if (userEmail === adminEmail) {
      // Admin user: Delete the product regardless of ownership
      const result = await Product.findByIdAndDelete(id);
      if (!result) {
        return NextResponse.json(
          { message: "Product not found" },
          { status: 404 }
        );
      }
      return NextResponse.json({ message: "Product deleted successfully" });
    } else {
      // Regular user: Delete only if the product belongs to them
      const product = await Product.findById(id);
      if (!product) {
        return NextResponse.json(
          { message: "Product not found" },
          { status: 404 }
        );
      }
      if (product.sellerEmail !== token.email) {
        return NextResponse.json(
          { message: "Unauthorized to delete this product" },
          { status: 403 }
        );
      }
      await Product.findByIdAndDelete(id);
      return NextResponse.json({ message: "Product deleted successfully" });
    }
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
