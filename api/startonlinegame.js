import { database } from "../config/firebase.js";
import { ref, set, get, push } from "firebase/database";

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

    const startshot = {
        left,
        right,
        numberOfBalls,
        totalSeconds,
        playerTurn,
        movedBy: "system",
        move: 0
    };

    const histshot = {
        left,
        right,
        playerTurn,
        movedBy: "system",
        move: 0
    }

    const timeShot = Date.now();

    const gameRef = ref(database, `games/${id}`);
    const gameSnap = await get(gameRef);
    if (!gameSnap.exists()) return res.status(404).json({ message: "Game does not exist" });
    await set(gameRef, { ...gameSnap.val(), state: "started" }); 

    const startRef = ref(database, `games/${id}/start`);
    const startSnap = await get(startRef);
    if (!startSnap.exists()) {
        await set(startRef, startshot);
    }

    const histRef = ref(database, `games/${id}/history`);
    await push(histRef, histshot);

    const timeRef = ref(database, `games/${id}/startTime`);
    await set(timeRef, timeShot);

    return res.status(200).json({ message: "Game state appended to history", histshot });
}
