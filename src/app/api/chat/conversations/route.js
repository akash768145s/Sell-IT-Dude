// src/app/api/chat/conversations/route.js
import { getServerSession } from "next-auth";
import connect from "@/utils/db";
import Conversation from "@/models/Conversation";
import Product from "@/models/Product";

export async function GET(req) {
  try {
    const session = await getServerSession();
    if (!session) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    await connect();

    const userEmail = session.user.email;

    // Find all conversations where user is either buyer or seller
    const conversations = await Conversation.find({
      $or: [{ buyerId: userEmail }, { sellerId: userEmail }],
    }).sort({ lastMessageAt: -1 });

    return new Response(JSON.stringify(conversations), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch conversations" }), {
      status: 500,
    });
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession();
    if (!session) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    await connect();

    const { productId, sellerId, sellerName } = await req.json();
    const buyerId = session.user.email;
    const buyerName = session.user.name || "Anonymous";

    // Check if conversation already exists
    let conversation = await Conversation.findOne({
      productId,
      buyerId,
      sellerId,
    });

    if (conversation) {
      return new Response(JSON.stringify(conversation), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Fetch product details
    const product = await Product.findById(productId);
    if (!product) {
      return new Response(JSON.stringify({ error: "Product not found" }), {
        status: 404,
      });
    }

    // Create new conversation
    conversation = new Conversation({
      productId,
      productName: product.name,
      productImage: product.imageUrl,
      buyerId,
      buyerName,
      sellerId,
      sellerName,
    });

    await conversation.save();

    return new Response(JSON.stringify(conversation), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error creating conversation:", error);
    return new Response(JSON.stringify({ error: "Failed to create conversation" }), {
      status: 500,
    });
  }
}

