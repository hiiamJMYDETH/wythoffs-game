import redisClient from "./config/redis.js";

export default async function handler(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Credentials", "true");

    if (req.method === "OPTIONS") return res.status(200).end();
    if (req.method !== "POST") return res.status(405).json({ error: "Only POST requests allowed" });

    console.log("Received request body:", req.body);

    const { left, right, numberOfBalls, totalSeconds, id, playerId } = req.body;
    console.log("Request body:", { left, right, numberOfBalls, totalSeconds, id, playerId });
    if (!left || !right || !numberOfBalls || !totalSeconds || !id || !playerId) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    await redisClient.hSet(`lobby:${id}:history`, {
        left: JSON.stringify(left),
        right: JSON.stringify(right),
        numberOfBalls,
        totalSeconds,
        status: "waiting",
        createdAt: Date.now(),
        createdBy: playerId, 
        lastMoveBy: "",
    });

    return res.status(200).json({ message: "API is working!" });
}