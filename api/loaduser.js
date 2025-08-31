// pages/api/loaduser.js
import { ref, child, get } from "firebase/database";
import { database } from "./config/firebase.js"; // import the shared Firebase instance
import { configDotenv } from "dotenv";
import checkSession from "./config/checksession.js";

// Timeout helper
function timeout(ms, promise) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Firebase request timed out")), ms)
    ),
  ]);
}

export default async function handler(req, res) {
  const allowedOrigins = [
    "http://localhost:5173",
    "https://wythoffs-game.onrender.com"
  ];

  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "GET") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  try {
    const sessionId = req.headers["authorization"]?.replace("Session ", "");
    if (!sessionId) return res.status(401).json({ message: "Unauthorized" });

    const userId = await checkSession(sessionId);
    if (!userId) return res.status(401).json({ message: "Invalid or expired session" });
    res.status(200).json({ message: "Authorized", userId });
  } catch (error) {
    console.error("Error in loaduser:", error);
    res.status(500).json({ message: error.message });
  }
}
