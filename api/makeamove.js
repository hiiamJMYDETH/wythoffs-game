import redisClient from "./config/redis.js";

export default async function handler(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Credentials", "true");

    if (req.method === "OPTIONS") return res.status(200).end();
    if (req.method !== "POST") return res.status(405).json({ error: "Only POST requests allowed" });

    const { id, left, right, move, playerTurn, movedBy } = req.body;
    if (!id || !left || !right || move === undefined || !playerTurn || !movedBy) {
        return res.status(400).json({ error: "Missing required fields" });
    }
    console.log("Received move request:", { id, left, right, move, playerTurn, movedBy });
    const isMember = await redisClient.sIsMember(`lobby:${id}:users`, movedBy);
    if (!isMember) return res.status(400).json({ error: "Outsider in lobby" });

    const lastSnapshot = await redisClient.lIndex(`lobby:${id}:history`, -1);
    if (!lastSnapshot) {
        return res.status(404).json({ error: "Lobby not found or no history available" });
    }
    console.log("Last snapshot:", lastSnapshot);
    const parsedSnapshot = JSON.parse(lastSnapshot);
    if (parsedSnapshot.left === left && parsedSnapshot.right === right) {
        return res.status(401).json({ error: "No changes made" });
    }
    // const lastState = JSON.parse(lastSnapshot);
    // if (playerTurn !== userId) {
    //     return res.status(403).json({ error: "Not your turn" });
    // }
    // if (left == lastState.left && right == lastState.right) {
    //     return res.status(400).json({ error: "No changes made" });
    // }
    const newState = {
        left,
        right,
        move,
        playerTurn,
        movedBy
    };
    await redisClient.rPush(`lobby:${id}:history`, JSON.stringify(newState));

    return res.status(200).json({ message: "Move initiated successfully" });
}