import pool from "../config/db.js";
import { adminDb, adminAuth } from "../config/firebase.js";
import {get, set} from "firebase/database";

export default async function handler(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Credentials", "true");

    if (req.method === "OPTIONS") return res.status(200).end();
    if (req.method !== "POST") return res.status(405).json({ error: "Only POST requests allowed" });

    const { userId, oldUsername, newUsername, oldPassword, newPassword } = req.body;

    if (!newUsername && (!oldPassword || !newPassword)) {
        return res.status(404).json({ error: "Missing username and password" });
    }
    if (!userId || !oldUsername) {
        return res.status(404).json({ error: "Missing id or old username" });
    }

    const client = pool;
    const result = await client.query(
        "SELECT * FROM users WHERE username = $1 AND ID = $2",
        [oldUsername, userId]
    );

    if (result.rows.length === 0) {
        return res.status(401).json({ message: "Invalid login" });
    }

    await adminAuth.updateUser(userId, {
        password: newPassword,
        displayName: newUsername
    });

    if (newUsername) {
        await client.query(
            "UPDATE users SET username = $1 WHERE id = $2",
            [newUsername, userId]
        );
        const userRef = adminDb.ref(`users/${userId}`);
        const userSnap = await get(userRef);
        if (!userSnap.exists()) return res.status(404).json({message: "User does not exist"});

        await set(userRef, {...userSnap.val(), username: newUsername});
    }

    res.status(200).json({ message: "Successfully changed info" });
}