import { getServerSession } from "next-auth/next";
import connect from "../../../utils/db";
import Wishlist from "../../../models/Wishlist";
import Product from "../../../models/Product";
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
    const { productId, userEmail } = await request.json();

    // Validate input
    if (!productId) {
      return NextResponse.json(
        { message: "Product ID is required" },
        { status: 400 }
      );
    }

    // Check if the product exists in the database
    const existingProduct = await Product.findById(productId);
    if (!existingProduct) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    // Use session email for security (don't trust client-provided email)
    const userEmailToUse = session.user.email;

    // Check if the product is already in the wishlist for this user
    const existingWishlistItem = await Wishlist.findOne({
      user: userEmailToUse,
      product: productId,
    });

    if (existingWishlistItem) {
      return NextResponse.json(
        { message: "Product is already in your wishlist" },
        { status: 409 } // 409 Conflict status for duplicates
      );
    }

    // Add the product to the wishlist (store product ID reference)
    const wishlistItem = new Wishlist({
      user: userEmailToUse,
      product: productId
    });

    await wishlistItem.save();

    return NextResponse.json(
      { message: "Product added to wishlist successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error adding product to wishlist:", error);

    // Handle MongoDB duplicate key error (in case of race conditions)
    if (error.code === 11000 || error.name === 'MongoServerError') {
      return NextResponse.json(
        { message: "Product is already in your wishlist" },
        { status: 409 }
      );
    }

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
    const wishlist = await Wishlist.find({ user: session.user.email })
      .populate("product")
      .sort({ createdAt: -1 }); // Sort by newest first

    // Filter out items where product population failed (product was deleted)
    const validWishlist = wishlist.filter(item => item.product !== null);

    return NextResponse.json(validWishlist, { status: 200 });
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    return NextResponse.json(
      { message: "Error fetching wishlist", error: error.message },
      { status: 500 }
    );
  }
}
