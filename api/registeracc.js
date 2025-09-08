import pool from "../config/db.js";
import dotenv from "dotenv";
import { adminDb } from "../config/firebase.js";
dotenv.config();

async function signUpUser(userId, username, email) {
    const client = pool;

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

    return {
        status: "success",
        message: "Signup successful",
        userId
    };
}

async function loginUser(userId, email) {
    const client = pool;
    const result = await client.query(
        "SELECT * FROM users WHERE email = $1 AND id = $2",
        [email, userId]
    );

    if (result.rows.length === 0) {
        return res.status(401).json({ message: "Invalid login" });
    }

    return {
        status: "success",
        message: "Login successful",
        userId
    };
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
        const { type, userId = null, username = null, email = null } = req.body;

        if (!type) return res.status(404).json({ message: "Invalid/missing register type" });

        if (type === 'signup') {
            if (!userId || !email || !username) return res.status(404).json({ message: "Missing email or username" });
            const client = pool;

            const existing = await client.query(
                "SELECT * FROM users WHERE email = $1 OR username = $2",
                [email, username]
            );

            if (existing.rows.length > 0) {
                return res.status(409).json({ message: "Email or username already exists" });
            }
            const response = await signUpUser(userId, email, username);
            return res.status(200).json(response);
        }
        if (type === 'login') {
            if (!userId || !email) return res.status(404).json({ message: "Missing email" });
            const response = await loginUser(userId, email);
            return res.status(200).json(response);
        }
        return res.status(400).json({
            status: "failure",
            message: "Failed to register",
            userId
        })
    } catch (error) {
        console.error("Error during login:", error);
        return res.status(500).json({ error: "Error processing login" });
    }
}