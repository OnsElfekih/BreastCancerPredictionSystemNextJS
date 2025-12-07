import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://elfekihons:elfekih69ons@cluster0.v7vr279.mongodb.net/projet-nextjs?retryWrites=true&w=majority";

if (!MONGODB_URI) {
  throw new Error("❌ Please add your MongoDB URI to .env.local");
}

let isConnected = false;

export async function dbConnect() {
  if (isConnected) return;

  try {
    await mongoose.connect(MONGODB_URI);
    isConnected = true;
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    throw error;
  }
}
