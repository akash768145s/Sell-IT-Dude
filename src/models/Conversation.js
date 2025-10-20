// src/models/Conversation.js
import mongoose from "mongoose";

const ConversationSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    productName: {
      type: String,
      required: true,
    },
    productImage: {
      type: String,
    },
    buyerId: {
      type: String,
      required: true,
    },
    buyerName: {
      type: String,
      required: true,
    },
    sellerId: {
      type: String,
      required: true,
    },
    sellerName: {
      type: String,
      required: true,
    },
    lastMessage: {
      type: String,
    },
    lastMessageAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Index for quick lookups
ConversationSchema.index({ productId: 1, buyerId: 1, sellerId: 1 });
ConversationSchema.index({ buyerId: 1 });
ConversationSchema.index({ sellerId: 1 });

export default mongoose.models.Conversation ||
  mongoose.model("Conversation", ConversationSchema);

