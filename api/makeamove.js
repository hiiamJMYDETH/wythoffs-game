import redisClient from "./config/redis.js";

export default async function handler(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Credentials", "true");

    if (req.method === "OPTIONS") return res.status(200).end();
    if (req.method !== "POST") return res.status(405).json({ error: "Only POST requests allowed" });

    const { lobbyId, userId, left, right } = req.body;
    if (!lobbyId || !userId) return res.status(400).json({ error: "Missing lobbyId or userId" });

    const isMember = await redisClient.sIsMember(`lobby:${lobbyId}:users`, userId);
    if (!isMember) return res.status(400).json({ error: "Outsider in lobby" });

    const lastSnapshot = await redisClient.lIndex(`lobby:${lobbyId}:history`, -1);
    if (!lastSnapshot) {
        return res.status(404).json({ error: "Lobby not found or no history available" });
    }
    console.log("Last snapshot:", lastSnapshot);
    const lastState = JSON.parse(lastSnapshot);
    const { playerTurn } = lastState;
    if (playerTurn !== userId) {
        return res.status(403).json({ error: "Not your turn" });
    }

    return res.status(200).json({ message: "User added to lobby successfully" });
}