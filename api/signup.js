import { connectToDatabase } from "./config/db.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import redisClient from "./config/redis.js";
import crypto from "crypto"; // Import the crypto module for generating UUIDs
import { v4 as uuidv4 } from 'uuid'; // Import the uuid module for generating UUIDs

dotenv.config();

async function hashRedis(name, email, id) {
    await redisClient.hSet(`user:${id}`, {name, email, id});
}

export default async function handler(req, res) {
    // Enable CORS headers
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    // res.setHeader("Access-Control-Allow-Credentials", "true");
    
    if (req.method === "OPTIONS") {
        res.status(200).end();
        return;
    }

    if (req.method != "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {

        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Missing username/email/password' });
        }

        const userId = await redisClient.incr("user_id_counter"); 
        // const userId = crypto.randomUUID(); // Generate a unique user ID
        console.log("Generated User ID:", userId);

        const hashedPassword = await bcrypt.hash(password, 10);
        const values = [name, email, hashedPassword, userId];

        const client = await connectToDatabase();
        const result = await client.query(
            "INSERT INTO users (username, email, usr_pwd, creation_date, id) VALUES ($1, $2, $3, CURRENT_DATE, $4) ON CONFLICT (id) DO NOTHING",
            values
        );

        if (result.rowCount === 0) {
            return res.status(401).json({ message: "Email already exists" });
        }

        // const token = jwt.sign({ user_id: userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" });
        // await hashRedis(name, email);
        await hashRedis(user.username, user.email, user.id);

        const sessionId = crypto.randomUUID();
        await redisClient.hSet(`session:${sessionId}`, {user_id: user.id});
        await redisClient.expire(`session:${sessionId}`, 3600); // Set session expiration to 1 hour

        res.json({ message: "Successfully created an account", sessionId });
    } catch (error) {
        console.error("🚨 Error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    } finally {
        if (redisClient) {
            await redisClient.disconnect(); // Ensure Redis connection is closed after each request
        }
    }
}
