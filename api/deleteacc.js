import pool from "../config/db.js";
import { adminDb, adminAuth } from "../config/firebase.js";
import { get, remove } from "firebase/database";

export default async function handler(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Credentials", "true");

    if (req.method === "OPTIONS") return res.status(200).end();
    if (req.method !== "POST") return res.status(405).json({ error: "Only POST requests allowed" });

    const { userId } = req.body;

    if (!userId) return res.status(404).json({ message: "Missing user id" });

    const client = pool;

    const userRef = adminDb.ref(`users/${userId}`);
    const userSnap = await get(userRef);
    if (!userSnap.exists()) return res.status(404).json({ message: "User does not exist" });
    await remove(userRef);
    await client.query(
        "DELETE FROM users WHERE id = $1",
        [userId]
    );
    await adminAuth.deleteUser(userId);

    res.status(200).json({ message: "Success" });
}