import mongoose from "mongoose";
import { config } from "./app.config";

const connectDatabase = async (): Promise<void> => {
  try {
    // Validate MONGO_URI
    if (!config.MONGO_URI) {
      throw new Error("MONGO_URI environment variable is not set");
    }

    await mongoose.connect(config.MONGO_URI);
    console.log("✅ Connected to MongoDB database successfully");

    // Connection event listeners
    mongoose.connection.on("error", (error) => {
      console.error("❌ MongoDB connection error:", error);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("⚠️  MongoDB disconnected");
    });

    mongoose.connection.on("reconnected", () => {
      console.log("🔄 MongoDB reconnected");
    });

    // Graceful shutdown
    process.on("SIGINT", async () => {
      console.log("🛑 Received SIGINT, closing MongoDB connection...");
      await mongoose.connection.close();
      console.log("✅ MongoDB connection closed");
      process.exit(0);
    });
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB:", error);
    process.exit(1);
  }
};

export default connectDatabase;
