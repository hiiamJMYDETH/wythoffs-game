import pool from "../config/db.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import crypto from "crypto";
import { adminDb, adminAuth } from "../config/firebase.js";
dotenv.config();

// async function storeSessionInFirebase(sessionId, userId) {
//     const expiresAt = Date.now() + 3600 * 1000;
//     await set(ref(database, `sessions/${sessionId}`), {
//         user_id: userId,
//         expiresAt
//     });
// }

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
    const { userId, username, email } = req.body;

    if (!userId || !username || !email) return res.status(404).json({ error: "Missing userId, email, or username" });

    const client = pool;

    // const users = await client.query(
    //   "SELECT * FROM users"
    // );
    // console.log("Users: ", users.rows);

    // const existing = await client.query(
    //   "SELECT * FROM users WHERE email = $1 OR username = $2",
    //   [email, name]
    // );
    // console.log("Existing", existing.rows);
    // if (existing.rows.length > 0) {
    //   return res.status(409).json({ message: "Email or username already exists" });
    // }


    await client.query(
      "INSERT INTO users (username, email, creation_date, id) VALUES ($1, $2, CURRENT_DATE, $3)",
      [username, email, userId]
    );

    await adminDb.ref(`users/${userId}`).set({
      email,
      username,
      win: 0,
      loss: 0
    });
    // await signInWithEmailAndPassword(auth, email, hashedPassword);

    // await storeUserInFirebase(name, email, userId);

    // const sessionId = crypto.randomUUID();
    // await storeSessionInFirebase(sessionId, userId);

    res.status(201).json({ message: "Successfully created an account", status: "success", userId });
  } catch (error) {
    console.error("🚨 Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}