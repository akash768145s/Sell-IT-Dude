// server.js - Custom Next.js server with Socket.io
const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const { Server } = require("socket.io");
const mongoose = require("mongoose");

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = parseInt(process.env.PORT || "3000", 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

// MongoDB connection
const connectDB = async () => {
  if (mongoose.connections[0].readyState) {
    return;
  }
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected for Socket.io server");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
};

app.prepare().then(() => {
  const httpServer = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error("Error handling request:", err);
      res.statusCode = 500;
      res.end("Internal server error");
    }
  });

  const io = new Server(httpServer, {
    cors: {
      origin: process.env.NEXTAUTH_URL || `http://localhost:${port}`,
      methods: ["GET", "POST"],
    },
  });

  // Socket.io connection handling
  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    // Join conversation room
    socket.on("join_conversation", (conversationId) => {
      socket.join(conversationId);
      console.log(`Socket ${socket.id} joined conversation ${conversationId}`);
    });

    // Leave conversation room
    socket.on("leave_conversation", (conversationId) => {
      socket.leave(conversationId);
      console.log(`Socket ${socket.id} left conversation ${conversationId}`);
    });

    // Handle new message
    socket.on("send_message", async (data) => {
      try {
        await connectDB();

        // Import models dynamically
        const Message = require("./src/models/Message").default;
        const Conversation = require("./src/models/Conversation").default;

        // Save message to database
        const message = new Message({
          conversationId: data.conversationId,
          senderId: data.senderId,
          senderName: data.senderName,
          content: data.content,
        });
        await message.save();

        // Update conversation's last message
        await Conversation.findByIdAndUpdate(data.conversationId, {
          lastMessage: data.content,
          lastMessageAt: new Date(),
        });

        // Emit message to all users in the conversation room
        io.to(data.conversationId).emit("receive_message", {
          _id: message._id,
          conversationId: message.conversationId,
          senderId: message.senderId,
          senderName: message.senderName,
          content: message.content,
          createdAt: message.createdAt,
          read: message.read,
        });
      } catch (error) {
        console.error("Error sending message:", error);
        socket.emit("message_error", { error: "Failed to send message" });
      }
    });

    // Handle typing indicator
    socket.on("typing", (data) => {
      socket.to(data.conversationId).emit("user_typing", {
        conversationId: data.conversationId,
        userId: data.userId,
        userName: data.userName,
      });
    });

    // Handle stop typing
    socket.on("stop_typing", (data) => {
      socket.to(data.conversationId).emit("user_stop_typing", {
        conversationId: data.conversationId,
        userId: data.userId,
      });
    });

    // Mark messages as read
    socket.on("mark_as_read", async (data) => {
      try {
        await connectDB();
        const Message = require("./src/models/Message").default;

        await Message.updateMany(
          {
            conversationId: data.conversationId,
            senderId: { $ne: data.userId },
            read: false,
          },
          { read: true }
        );

        socket.to(data.conversationId).emit("messages_read", {
          conversationId: data.conversationId,
          readBy: data.userId,
        });
      } catch (error) {
        console.error("Error marking messages as read:", error);
      }
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});

