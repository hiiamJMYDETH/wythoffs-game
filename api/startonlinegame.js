import redisClient from "./config/redis.js";
import {database} from "./config/firebase.js";
import {ref, set, get} from "firebase/database";

export default async function handler(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Credentials", "true");

    if (req.method === "OPTIONS") return res.status(200).end();
    if (req.method !== "POST") return res.status(405).json({ error: "Only POST requests allowed" });

    console.log(req.body);
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
        movedBy: 'system'
    };

    const startshot = {
        left,
        right,
        playerTurn,
        movedBy: 'system',
        move: 0
    }

    const startRef = ref(database, `games/${id}/start`);
    const startSnap = await get(startRef);
    if (startSnap.exists()) return res.status(404).json({message: "Game already set"});
    await set(startRef, snapshot);

    const histRef = ref(database, `games/${id}/history`);
    const histSnap = await get(histRef);
    if (histSnap.exists()) return res.status(404).json({message: "Game is already set and is somewhere"});
    await set(histRef, [startshot]);

    return res.status(200).json({ message: "Game state appended to history" });
}
