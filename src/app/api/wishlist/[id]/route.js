import { NextResponse } from 'next/server';
import connect from '@/utils/db';
import Wishlist from '@/models/Wishlist';
import { getServerSession } from "next-auth/next";

// DELETE a product from the wishlist by ID
export async function DELETE(request, { params }) {
  await connect();
  
  const { id } = params; // Extract the wishlist item ID
  const session = await getServerSession({ req: request });

  // Check if the session exists and the user is authenticated
  if (!session || !session.user?.email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    // Find and delete the wishlist item by ID and user email
    const deletedWishlistItem = await Wishlist.findOneAndDelete({
      _id: id,
      user: session.user.email,
    });

    if (!deletedWishlistItem) {
      return NextResponse.json({ message: "Product not found in wishlist" }, { status: 404 });
    }

    return NextResponse.json({ message: "Product removed from wishlist" }, { status: 200 });
  } catch (error) {
    console.error("Error removing product from wishlist:", error);
    return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
  }
}