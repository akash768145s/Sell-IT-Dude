// src/utils/db.js
import mongoose from "mongoose";

const connect = async () => {
  if (mongoose.connections.length > 0 && mongoose.connections[0].readyState) {
    console.log("MongoDB already connected.");
    return;
  }

  try {
    console.log("Connecting to MongoDB...");
    console.log(`MongoDB URL: ${process.env.MONGO_URL}`);

    if (!process.env.MONGO_URL) {
      throw new Error("MONGO_URL is not defined in environment variables");
    }

    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000, // 30 seconds
      socketTimeoutMS: 45000, // 45 seconds
    });
    console.log("MongoDB connection successfully established.");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    console.error("Error details:", {
      name: error.name,
      message: error.message,
      code: error.code,
      stack: error.stack,
    });
    throw new Error("Error connecting to Mongoose");
  }
};

export default connect;
