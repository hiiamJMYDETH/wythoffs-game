import { adminDb } from "../config/firebase.js";
import pool from "../config/db.js";

export default async function handler(req, res) {

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {

    const userId = req.query.userId;

    if (!userId) return res.status(404).json({ error: "Missing UID" });

    const snapshot = await adminDb.ref(`users/${userId}`).once("value");
    const userData = snapshot.val();
    if (!userData) return res.status(404).json({ error: "User not found" });

    const results = await pool.query("SELECT * FROM users WHERE id = $1", [userId]);
    res.status(200).json({ message: "Authorized", user: userData, poolUser: results.rows });
  } catch (error) {
    console.error("Error in loaduser:", error);
    res.status(500).json({ message: error.message });
  }
}
