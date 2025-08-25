import redisClient from "./config/redis.js";
import { connectToDatabase } from "./config/db.js";

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    if (req.method === 'POST') {
        try {
            console.log("req body:", req.body);
            const { id, player, opponent } = req.body;
            if (!id || !player || !opponent) {
                return res.status(400).json({ message: "Missing id, player, or opponent" });
            }
            const gameKey = `lobby:${id}:meta`;
            const metaData = await redisClient.hGetAll(gameKey);
            if (!metaData || Object.keys(metaData).length === 0) {
                return res.status(404).json({ message: "Game not found" });
            }
            const history = await redisClient.lRange(`lobby:${id}:history`, 0, -1);
            if (!history || history.length === 0) {
                return res.status(404).json({ message: "Game history not found" });
            }
            const finalState = JSON.parse(history[history.length - 1]);
            const winner = finalState.movedBy === player ? opponent : player;
            await redisClient.hSet(gameKey, { status: "completed", winner });
            const client = await connectToDatabase();
            const insertQuery = `
                UPDATE users
                SET win = win + 1
                SET games = ARRAY_APPEND(games, ${id}::text)
                SET wlratio = win / games.length::float
                WHERE id = ${winner};
                SET lose = lose + 1
                SET games = ARRAY_APPEND(games, ${id}::text)
                SET wlratio = win / games.length::float
                WHERE id = ${opponent};

            `
            const results = await client.query(insertQuery);
            console.log("All users:", results.rows);
            res.status(200).json({ message: "POST request received" });
        } catch (error) {
            console.error("Error creating new game:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    } else {
        res.status(405).json({ message: "Method not allowed" });
    }
}