import redisClient from "./config/redis.js";

export default async function handler(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Credentials", "true");

    if (req.method === "OPTIONS") return res.status(200).end();
    if (req.method !== "POST") return res.status(405).json({ error: "Only POST requests allowed" });


    const { left, right, numberOfBalls, totalSeconds, id, player, opponent } = req.body;

    if (!left || !right || !numberOfBalls || !totalSeconds || !id || !player || !opponent) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    const determineTurn = Math.random() < 0.5;
    const playerTurn = determineTurn ? player : opponent;

    const snapshot = {
        left,
        right,
        numberOfBalls,
        totalSeconds,
        playerTurn,
        timestamp: Date.now(),
    };

    await redisClient.rPush(`lobby:${id}:history`, JSON.stringify(snapshot));

    return res.status(200).json({ message: "Game state appended to history" });
}
