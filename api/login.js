// pages/api/login.js
import { connectToDatabase } from "./config/db.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import crypto from "crypto";
import { database } from "./config/firebase.js"; // import the shared Firebase instance
import { ref, set } from "firebase/database";

dotenv.config();

// Store user info in Firebase
async function storeUserInFirebase(name, email, id) {
  await set(ref(database, `users/${id}`), { name, email, id });
}

// Store session in Firebase with expiration (simulate TTL)
async function storeSessionInFirebase(sessionId, userId) {
  const expiresAt = Date.now() + 3600 * 1000; // 1 hour
  await set(ref(database, `sessions/${sessionId}`), { user_id: userId, expiresAt });
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // Extract sessionId from header
    const sessionId = req.headers["authorization"]?.replace("Session ", "").trim();
    if (!sessionId) {
      return res.status(401).json({ message: "Unauthorized: missing session" });
    }

    // Fetch session data from Firebase
    const sessionSnap = await timeout(
      5000,
      get(child(ref(database), `sessions/${sessionId}`))
    );

    if (!sessionSnap.exists()) {
      return res.status(401).json({ message: "Unauthorized: invalid session" });
    }

    const sessionData = sessionSnap.val();

    // Check expiration
    if (sessionData.expiresAt && Date.now() > sessionData.expiresAt) {
      return res.status(401).json({ message: "Unauthorized: session expired" });
    }

    const userId = sessionData.user_id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: no user attached to session" });
    }

    // Fetch user info from Firebase
    const userSnap = await timeout(
      5000,
      get(child(ref(database), `users/${userId}`))
    );

    if (!userSnap.exists()) {
      return res.status(404).json({ message: "User not found" });
    }

    const userData = userSnap.val();
    res.status(200).json(userData);
  } catch (error) {
    console.error("Error in loaduser:", error);
    res.status(500).json({ message: error.message });
  }
}