import pool from "../config/db.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import crypto from "crypto";
import {adminDb, adminAuth} from "../config/firebase.js";

dotenv.config();

// async function storeUserInFirebase(user) {
//     await set(ref(database, `users/${user.id}`), {
//         name: user.username,
//         email: user.email,
//         id: user.id
//     });
// }

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
        const { userId, email } = req.body;

        if (!userId || !email) {
            return res.status(400).json({
                message: "Missing username, email, or password",
            });
        }

        const client = pool;
        const result = await client.query(
            "SELECT * FROM users WHERE email = $1 AND id = $2",
            [email, userId]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ message: "Invalid login" });
        }

        // const user = result.rows[0];

        // const match = await bcrypt.compare(password, user.usr_pwd);
        // if (!match) {
        //     return res.status(401).json({ message: "Invalid login" });
        // }

        // const userId = user.id;

        // await signInWithEmailAndPassword(auth, email, hashedPassword);

        // await storeUserInFirebase(user);

        // const sessionId = crypto.randomUUID();
        // await storeSessionInFirebase(sessionId, userId);

        return res.status(200).json({
            status: "success",
            message: "Login successful",
            userId
        });
    } catch (error) {
        console.error("Error during login:", error);
        return res.status(500).json({ error: "Error processing login" });
    }
}