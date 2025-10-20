"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useSocket } from "@/contexts/SocketContext";
import { X, Send, Loader2, ArrowLeft } from "lucide-react";
import SafeImage from "@/components/ui/SafeImage";

interface Message {
  _id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  content: string;
  createdAt: string;
  read: boolean;
}

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

interface ChatWindowProps {
  conversation: Conversation;
  onClose: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ conversation, onClose }) => {
  const { data: session } = useSession();
  const { socket, isConnected } = useSocket();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  const currentUserId = session?.user?.email;
  const otherUser =
    currentUserId === conversation.buyerId
      ? conversation.sellerName
      : conversation.buyerName;

  // Fetch messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/chat/messages/${conversation._id}`
        );
        if (response.ok) {
          const data = await response.json();
          setMessages(data);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [conversation._id]);

  // Socket.io event handlers
  useEffect(() => {
    if (!socket) return;

    if (isConnected) {
      socket.emit("join_conversation", conversation._id);
    }

    // Listen for new messages (from other users only)
    socket.on("receive_message", (message: Message) => {
      // Only add if it's not from the current user (to avoid duplicates)
      if (message.senderId !== currentUserId) {
        setMessages((prev) => {
          // Check if message already exists
          if (prev.some(m => m._id === message._id)) {
            return prev;
          }
          return [...prev, message];
        });
      }
    });

    // Listen for typing indicator
    socket.on("user_typing", (data) => {
      if (data.userId !== currentUserId) {
        setTyping(true);
      }
    });

    socket.on("user_stop_typing", (data) => {
      if (data.userId !== currentUserId) {
        setTyping(false);
      }
    });

    // Listen for read receipts
    socket.on("messages_read", (data) => {
      if (data.readBy !== currentUserId) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.senderId === currentUserId ? { ...msg, read: true } : msg
          )
        );
      }
    });

    return () => {
      socket.emit("leave_conversation", conversation._id);
      socket.off("receive_message");
      socket.off("user_typing");
      socket.off("user_stop_typing");
      socket.off("messages_read");
    };
  }, [socket, isConnected, conversation._id, currentUserId]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Mark messages as read when opening chat
  useEffect(() => {
    if (currentUserId) {
      // Mark as read via socket if connected
      if (socket && isConnected) {
        socket.emit("mark_as_read", {
          conversationId: conversation._id,
          userId: currentUserId,
        });
      }
    }
  }, [socket, isConnected, conversation._id, currentUserId]);

  // Poll for new messages when socket is disconnected
  useEffect(() => {
    if (isConnected) return; // Don't poll if socket is connected

    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(
          `/api/chat/messages/${conversation._id}`
        );
        if (response.ok) {
          const data = await response.json();
          setMessages(data);
        }
      } catch (error) {
        console.error("Error polling messages:", error);
      }
    }, 3000); // Poll every 3 seconds

    return () => clearInterval(pollInterval);
  }, [isConnected, conversation._id]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !currentUserId) return;

    setSending(true);
    const messageContent = newMessage.trim();
    setNewMessage("");

    try {
      // Always save to database via API
      const response = await fetch("/api/chat/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: conversation._id,
          content: messageContent,
        }),
      });

      if (response.ok) {
        const savedMessage = await response.json();

        // Add message to UI immediately
        setMessages((prev) => [...prev, savedMessage]);

        // If socket is connected, emit event for real-time update to other user
        if (socket && isConnected) {
          socket.emit("send_message", {
            conversationId: conversation._id,
            senderId: currentUserId,
            senderName: session?.user?.name || "Anonymous",
            content: messageContent,
            messageId: savedMessage._id,
          });

          // Stop typing indicator
          socket.emit("stop_typing", {
            conversationId: conversation._id,
            userId: currentUserId,
          });
        }
      } else {
        // Re-add message if failed
        setNewMessage(messageContent);
        alert("Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setNewMessage(messageContent);
      alert("Error sending message. Please check your connection.");
    } finally {
      setSending(false);
    }
  };

  const handleTyping = (value: string) => {
    setNewMessage(value);

    if (!socket || !currentUserId || !isConnected) return;

    // Emit typing event
    socket.emit("typing", {
      conversationId: conversation._id,
      userId: currentUserId,
      userName: session?.user?.name || "Anonymous",
    });

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Stop typing after 2 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stop_typing", {
        conversationId: conversation._id,
        userId: currentUserId,
      });
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl h-[600px] flex flex-col">
        {/* Header */}
        <div className="bg-blue-600 text-white p-4 rounded-t-lg flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="lg:hidden text-white hover:bg-blue-700 p-1 rounded"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            {conversation.productImage && (
              <div className="relative w-10 h-10">
                <SafeImage
                  src={conversation.productImage}
                  alt={conversation.productName}
                  className="rounded object-cover w-10 h-10"
                />
              </div>
            )}
            <div>
              <h3 className="font-semibold">{otherUser}</h3>
              <p className="text-sm text-blue-100">{conversation.productName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-blue-700 p-2 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-center">
                <p className="mb-2">No messages yet</p>
                <p className="text-sm">Start the conversation!</p>
              </div>
            </div>
          ) : (
            messages.map((message) => {
              const isOwnMessage = message.senderId === currentUserId;
              return (
                <div
                  key={message._id}
                  className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg px-4 py-2 ${isOwnMessage
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-900 border border-gray-200"
                      }`}
                  >
                    <p className="break-words">{message.content}</p>
                    <div
                      className={`text-xs mt-1 ${isOwnMessage ? "text-blue-100" : "text-gray-500"
                        }`}
                    >
                      {new Date(message.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                      {isOwnMessage && message.read && (
                        <span className="ml-1">✓✓</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          {typing && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 rounded-lg px-4 py-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 bg-white border-t rounded-b-lg">
          <div className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => handleTyping(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              disabled={sending}
            />
            <button
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || sending}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {sending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;

