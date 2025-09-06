import pool from "../config/db.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import crypto from "crypto";
import { database } from "../config/firebase.js";
import { ref, set } from "firebase/database";

dotenv.config();

async function storeUserInFirebase(user) {
    await set(ref(database, `users/${user.id}`), {
        name: user.username,
        email: user.email,
        id: user.id
    });
}

async function storeSessionInFirebase(sessionId, userId) {
    const expiresAt = Date.now() + 3600 * 1000; 
    await set(ref(database, `sessions/${sessionId}`), {
        user_id: userId,
        expiresAt
    });
}

export default async function handler(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({
                message: "Missing username, email, or password",
            });
        }

        const client = pool;
        const result = await client.query(
            "SELECT * FROM users WHERE email = $1 OR username = $2",
            [email, username]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ message: "Invalid login" });
        }

        const user = result.rows[0];

        const match = await bcrypt.compare(password, user.usr_pwd);
        if (!match) {
            return res.status(401).json({ message: "Invalid login" });
        }

        await storeUserInFirebase(user);

        const sessionId = crypto.randomUUID();
        await storeSessionInFirebase(sessionId, user.id);

        return res.status(200).json({
            message: "Login successful",
            sessionId,
            user: { id: user.id, name: user.username, email: user.email }
        });
    } catch (error) {
        console.error("Error during login:", error);
        return res.status(500).json({ error: "Error processing login" });
    }
}