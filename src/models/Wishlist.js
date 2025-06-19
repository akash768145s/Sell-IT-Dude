import mongoose from "mongoose";

const { Schema } = mongoose;

const wishlistSchema = new Schema({
  user: {
    type: String,
    required: true,
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
}, {
  timestamps: true, // Add createdAt and updatedAt fields
});

// Create a unique compound index to prevent duplicate user-product combinations
wishlistSchema.index({ user: 1, product: 1 }, { unique: true });

const Wishlist =
  mongoose.models.Wishlist || mongoose.model("Wishlist", wishlistSchema);

export default Wishlist;
