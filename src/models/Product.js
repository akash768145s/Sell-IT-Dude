import mongoose from "mongoose";
import Wishlist from "./Wishlist"; // Import the Wishlist model

const { Schema } = mongoose;

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    sellerName: {
      type: String,
      required: true,
    },
    sellerEmail: {
      type: String,
      required: true, // Ensure that sellerEmail is always provided
    },
  },
  { timestamps: true }
);

// Middleware to automatically remove wishlist entries when a product is deleted
productSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    // Remove all wishlists containing the deleted product
    await Wishlist.deleteMany({ product: doc._id });
    console.log(`Deleted all wishlists containing product: ${doc._id}`);
  }
});

const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
