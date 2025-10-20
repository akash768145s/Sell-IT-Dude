// src/app/api/chat/messages/[conversationId]/route.js
import { getServerSession } from "next-auth";
import connect from "@/utils/db";
import Message from "@/models/Message";
import Conversation from "@/models/Conversation";

export async function GET(req, { params }) {
  try {
    const session = await getServerSession();
    if (!session) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    await connect();

    const { conversationId } = params;

    // Verify user is part of this conversation
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return new Response(JSON.stringify({ error: "Conversation not found" }), {
        status: 404,
      });
    }

    const userEmail = session.user.email;
    if (conversation.buyerId !== userEmail && conversation.sellerId !== userEmail) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
      });
    }

    // Fetch messages
    const messages = await Message.find({ conversationId }).sort({ createdAt: 1 });

    return new Response(JSON.stringify(messages), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch messages" }), {
      status: 500,
    });
  }
}

