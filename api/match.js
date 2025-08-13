import redisClient from "./config/redis.js";
import dotenv from "dotenv";
dotenv.config();
import { v4 as uuidv4 } from "uuid";

export default async function handler(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Credentials", "true");

    if (req.method === "OPTIONS") return res.status(200).end();
    if (req.method !== "POST") return res.status(405).json({ error: "Only POST requests allowed" });

    const playerId = req.body?.userId;
    if (!playerId) return res.status(400).json({ error: "Missing player ID" });

    // Check if user exists
    const user = await redisClient.hGetAll(`user:${playerId}`);
    if (!user || Object.keys(user).length === 0) {
        return res.status(404).json({ error: "User not found" });
    }

    // Check if player already has a lobbyId saved
    const existingLobbyId = await redisClient.get(`user:${playerId}:lobbyId`);
    if (existingLobbyId) {
        // Get other users in the lobby
        const lobbyUsers = await redisClient.sMembers(`lobby:${existingLobbyId}:users`);
        const opponent = lobbyUsers.find(u => u !== playerId) || null;
        const meta = await redisClient.hGetAll(`lobby:${existingLobbyId}:meta`);
        return res.status(200).json({
            lobbyId: existingLobbyId,
            opponent,
            meta
        });
    }

    // Check queue
    const queue = await redisClient.lRange("queue:queue", 0, -1);

    if (queue.length >= 1) {
        // Match found: pop one waiting player
        const player1 = await redisClient.lPop("queue:queue");
        const player2 = playerId;

        const lobbyId = uuidv4();

        // Save lobby info
        await redisClient.sAdd(`lobby:${lobbyId}:users`, player1, player2);
        await redisClient.hSet(`lobby:${lobbyId}:meta`, {
            createdAt: Date.now(),
            status: "active",
            playerCount: 2,
            expiresAt: Date.now() + 3600000
        });

        // Save lobby ID for each player to find easily later
        await redisClient.set(`user:${player1}:lobbyId`, lobbyId);
        await redisClient.set(`user:${player2}:lobbyId`, lobbyId);

        console.log(`✅ Lobby ${lobbyId} created with ${player1} and ${player2}`);

        return res.status(200).json({
            lobbyId,
            opponent: player1
        });
    }

    // No match: add player to queue
    await redisClient.rPush("queue:queue", playerId);
    const queueLength = await redisClient.lLen("queue:queue");

    return res.status(200).json({
        message: "Player added to queue",
        queueLength,
        lobbyId: null
    });
}
