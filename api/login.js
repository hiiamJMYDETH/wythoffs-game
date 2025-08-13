import { connectToDatabase } from "./config/db.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import redisClient from "./config/redis.js";
dotenv.config();

async function hashRedis(name, email, id) {
    await redisClient.hSet(`user:${id}`, {name, email, id});
}

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    if (req.method === 'POST') {
        try {
            const { username, email, password } = req.body;

            if ((!username || !email) || !password) {
                return res.status(400).json({
                    message: 'Missing email or password',
                });
            }

            const client = await connectToDatabase();
            const result = await client.query('SELECT * FROM users WHERE email = $1 OR username = $2', [email, username]);
            console.log("results: ", result);

            if (result.rows.length === 0) {
                return res.status(401).json({
                    message: 'Incorrect/missing information',
                    logMessage: 'Login failed'
                });
            }

            const user = result.rows[0];
            console.log("user id: ", user.id);

            const match = await bcrypt.compare(password, user.usr_pwd);
            if (!match) {
                return res.status(401).json({
                    message: 'Incorrect/missing information',
                    logMessage: 'Login failed'
                });
            }

            // const token = jwt.sign({ user_id: user.id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
            await hashRedis(user.username, user.email, user.id);

            const sessionId = crypto.randomUUID();
            await redisClient.hSet(`session:${sessionId}`, {user_id: user.id});
            await redisClient.expire(`session:${sessionId}`, 3600); // Set session expiration to 1 hour

            res.status(200).json({ message: "Login successful", sessionId });
        }
        catch (error) {
            console.error('Error during login:', error);
            res.status(500).json({ error: "Error processing login" });
        }
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}
