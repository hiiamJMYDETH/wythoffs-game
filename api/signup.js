import pool from "./config/db.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import crypto from "crypto"; 
import { database } from "./config/firebase.js"; 
import { ref, set } from "firebase/database";

dotenv.config();

async function storeUserInFirebase(name, email, id) {
  await set(ref(database, `users/${id}`), { name, email, id });
}

async function storeSessionInFirebase(sessionId, userId) {
  const expiresAt = Date.now() + 3600 * 1000; 
  await set(ref(database, `sessions/${sessionId}`), { user_id: userId, expiresAt });
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Missing username/email/password" });
    }

    const client = pool;

    const existing = await client.query(
      "SELECT * FROM users WHERE email = $1 OR username = $2",
      [email, name]
    );
    if (existing.rows.length > 0) {
      return res.status(409).json({ message: "Email or username already exists" });
    }

    const userId = crypto.randomUUID();
    const hashedPassword = await bcrypt.hash(password, 10);

    await client.query(
      "INSERT INTO users (username, email, usr_pwd, creation_date, id) VALUES ($1, $2, $3, CURRENT_DATE, $4)",
      [name, email, hashedPassword, userId]
    );

    await storeUserInFirebase(name, email, userId);

    const sessionId = crypto.randomUUID();
    await storeSessionInFirebase(sessionId, userId);

    res.status(201).json({ message: "Successfully created an account", sessionId });
  } catch (error) {
    console.error("🚨 Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}