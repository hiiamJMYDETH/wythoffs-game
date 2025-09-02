import { database } from "../config/firebase.js";
import { ref, get, set, remove } from "firebase/database";
import redisClient from "../config/redis.js"

export default async function handler(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Credentials", "true");

    if (req.method === "OPTIONS") return res.status(200).end();
    if (req.method !== "POST") return res.status(405).json({ error: "Only POST requests allowed" });

    try {
        const { oldGameId, player, opponent } = req.body;
        if (!oldGameId || !player || !opponent) {
            return res.status(404).json({ error: "Missing required fields" });
        }

        const rematchRef = ref(database, `games/${oldGameId}/rematchState`);
        const snapshot = await get(rematchRef);

        if (!snapshot.exists()) {
            return res.status(404).json({ error: "No rematch state found" });
        }

        const state = snapshot.val();
        const p1 = state[player];
        const p2 = state[opponent];

        if (p1 === "1" && p2 === "1") {
            const newGameId = await redisClient.incr('game:id:counter');

            await set(ref(database, `games/${newGameId}`), {
                players: [player, opponent],
                createdAt: Date.now(),
                state: "waiting",
            });

            await set(ref(database, `rematches/${oldGameId}/newGameId`), newGameId);

            await remove(ref(database, `games/${oldGameId}`));

            return res.status(200).json({ newGameId });
        }

        if (p1 === "0" || p2 === "0") {
            await remove(ref(database, `games/${oldGameId}`));
            return res.status(200).json({ declined: true });
        }

        return res.status(200).json({ waiting: true });
    } catch (err) {
        console.error("Finalize rematch error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
}
