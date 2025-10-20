// src/app/api/chat/messages/route.js
import { getServerSession } from "next-auth";
import connect from "@/utils/db";
import Message from "@/models/Message";
import Conversation from "@/models/Conversation";

export async function POST(req) {
    try {
        const session = await getServerSession();
        if (!session) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), {
                status: 401,
            });
        }

        await connect();

        const { conversationId, content } = await req.json();

        if (!conversationId || !content?.trim()) {
            return new Response(JSON.stringify({ error: "Missing required fields" }), {
                status: 400,
            });
        }

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

        // Create message
        const message = new Message({
            conversationId,
            senderId: userEmail,
            senderName: session.user.name || "Anonymous",
            content: content.trim(),
        });

        await message.save();

        // Update conversation's last message
        await Conversation.findByIdAndUpdate(conversationId, {
            lastMessage: content.trim(),
            lastMessageAt: new Date(),
        });

        return new Response(JSON.stringify(message), {
            status: 201,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Error sending message:", error);
        return new Response(JSON.stringify({ error: "Failed to send message" }), {
            status: 500,
        });
    }
}

