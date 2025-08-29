import { database } from "./config/firebase.js";
import { ref, get, set, update } from "firebase/database";
import { connectToDatabase } from "./config/db.js";

async function fetchGameResults(client, game) {
    const { createdAt, gameId, history, players } = game;
    const script = `
        INSERT INTO games (game_id, history, players, created_at)
        VALUES ($1, $2, $3, $4)
    `;
    await client.query(script, [gameId, history, players, createdAt]);
}

export default async function handler(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Credentials", "true");

    if (req.method === "OPTIONS") return res.status(200).end();
    if (req.method !== "POST") return res.status(405).json({ error: "Only POST requests allowed" });

    const { gameId, player, opponent } = req.body;
    if (!gameId || !player || !opponent) {
        return res.status(404).json({ message: "Missing id, player, or opponent" });
    }

    const client = await connectToDatabase();
    const gameRef = ref(database, `games/${gameId}`);
    const gameSnap = await get(gameRef);

    if (!gameSnap.exists()) return res.status(404).json({ message: "Game does not exist" });

    await set(gameRef, { ...gameSnap.val(), state: "completed" });
    const rematchRef = ref(database, `games/${gameId}/rematchState`);
    const rematchSnap = await get(rematchRef);

    if (!rematchSnap.exists() || typeof rematchSnap.val() !== "object") {
        await set(rematchRef, { [player]: '', [opponent]: '' });
    }
    const game = gameSnap.val();

    await fetchGameResults(client, game);

    const histRef = ref(database, `games/${gameId}/history`);
    const histSnap = await get(histRef);
    if (!histSnap.exists()) return res.status(404).json({ message: "Game history does not exist" });

    const hist = histSnap.val() || {};
    const histArray = Object.values(hist);
    const lastState = histArray[histArray.length - 1];

    const winnerId = lastState.movedBy === player ? player : opponent;
    const loserId = lastState.movedBy === player ? opponent : player;

    try {
        await client.query('BEGIN');

        const updateWinnerQuery = `
            UPDATE users
            SET win = win + 1,
                games = ARRAY_APPEND(games, $1::text),
                wlratio = (win + 1)::float / NULLIF(array_length(games, 1) + 1, 0)
            WHERE id = $2
        `;

        const updateLoserQuery = `
            UPDATE users
            SET lose = lose + 1,
                games = ARRAY_APPEND(games, $1::text),
                wlratio = win::float / NULLIF(array_length(games, 1) + 1, 0)
            WHERE id = $2
        `;

        await client.query(updateWinnerQuery, [gameId, winnerId]);
        await client.query(updateLoserQuery, [gameId, loserId]);

        await client.query('COMMIT');
    } catch (err) {
        await client.query('ROLLBACK');
        console.error("Failed to update users:", err);
        return res.status(500).json({ message: "Failed to update users" });
    }

    return res.status(200).json({ message: "Win reported successfully" });
}
