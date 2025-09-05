import { connectToDatabase } from "./config/db.js";
import { database } from "./config/firebase.js";
import { ref, remove } from "firebase/database";

export default async function handler(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Credentials", "true");

    if (req.method === "OPTIONS") return res.status(200).end();
    if (req.method !== "POST") return res.status(405).json({ error: "Only POST requests allowed" });

    const {sessionId, userId} = req.body;

    if (!sessionId || !userId) return res.status(404).json({message: "Missing user id"});

    const client = await connectToDatabase();

    await remove(ref(database, `sessions/${sessionId}`));
    await remove(ref(database, `users/${userId}`));
    await client.query(
        "DELETE FROM users WHERE id = $1",
        [userId]
    );

    res.status(200).json({message: "Success"});
}