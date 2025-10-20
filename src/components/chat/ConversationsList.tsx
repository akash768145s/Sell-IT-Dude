"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { MessageCircle, Loader2 } from "lucide-react";
import ChatWindow from "./ChatWindow";
import SafeImage from "@/components/ui/SafeImage";

interface Conversation {
  _id: string;
  productId: string;
  productName: string;
  productImage?: string;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  sellerName: string;
  lastMessage?: string;
  lastMessageAt: Date;
}

const ConversationsList: React.FC = () => {
  const { data: session } = useSession();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);

  useEffect(() => {
    if (!session) return;

    const fetchConversations = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/chat/conversations");
        if (response.ok) {
          const data = await response.json();
          setConversations(data);
        }
      } catch (error) {
        console.error("Error fetching conversations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [session]);

  if (!session) {
    return null;
  }

  const currentUserId = session.user?.email;

  return (
    <>
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <MessageCircle className="w-6 h-6 text-blue-600" />
          My Conversations
        </h2>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : conversations.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p>No conversations yet</p>
            <p className="text-sm mt-2">
              Start chatting with sellers or buyers about products
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {conversations.map((conversation) => {
              const otherUser =
                currentUserId === conversation.buyerId
                  ? conversation.sellerName
                  : conversation.buyerName;

              return (
                <div
                  key={conversation._id}
                  onClick={() => setSelectedConversation(conversation)}
                  className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  {conversation.productImage && (
                    <SafeImage
                      src={conversation.productImage}
                      alt={conversation.productName}
                      width={60}
                      height={60}
                      className="rounded object-cover"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {otherUser}
                      </h3>
                      <span className="text-xs text-gray-500 whitespace-nowrap">
                        {new Date(conversation.lastMessageAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-blue-600 mb-1 truncate">
                      {conversation.productName}
                    </p>
                    {conversation.lastMessage && (
                      <p className="text-sm text-gray-600 truncate">
                        {conversation.lastMessage}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {selectedConversation && (
        <ChatWindow
          conversation={selectedConversation}
          onClose={() => setSelectedConversation(null)}
        />
      )}
    </>
  );
};

export default ConversationsList;

