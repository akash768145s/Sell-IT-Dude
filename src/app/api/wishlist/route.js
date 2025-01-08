import { getServerSession } from "next-auth/next";
import connect from "../../../utils/db";
import Wishlist from "../../../models/Wishlist";
import Product from "../../../models/Product"; // Import Product model to validate product existence
import { NextResponse } from "next/server";

// Add a product to the wishlist
export async function POST(request) {
  const session = await getServerSession(request);

  // Ensure session and user email are present
  if (!session || !session.user?.email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await connect();

  try {
    const { product } = await request.json();

    // Check if the product exists in the database
    const existingProduct = await Product.findById(product._id);
    if (!existingProduct) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    // Check if the product is already in the wishlist for this user
    const existingWishlistItem = await Wishlist.findOne({
      user: session.user.email,
      "product._id": product._id,
    });

    if (existingWishlistItem) {
      return NextResponse.json(
        { message: "Product already in wishlist" },
        { status: 400 }
      );
    }

    // Add the product to the wishlist
    const wishlistItem = new Wishlist({ user: session.user.email, product });
    await wishlistItem.save();

    return NextResponse.json(
      { message: "Product added to wishlist" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error adding product to wishlist:", error);
    return NextResponse.json(
      { message: "Error adding product to wishlist", error: error.message },
      { status: 500 }
    );
  }
}

// Get all wishlist items for the user
export async function GET(request) {
  const session = await getServerSession(request);

  if (!session || !session.user?.email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await connect();

  try {
    // Fetch all wishlist items for the authenticated user
    const wishlist = await Wishlist.find({ user: session.user.email }).populate(
      "product"
    ); // Populate product details
    return NextResponse.json(wishlist, { status: 200 });
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    return NextResponse.json(
      { message: "Error fetching wishlist", error: error.message },
      { status: 500 }
    );
  }
}
