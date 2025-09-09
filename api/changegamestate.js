import { adminDb } from "../config/firebase.js";
import { ref, get, set, push, serverTimestamp } from "firebase/database";
import pool from "../config/db.js";

async function generateNewGame(body) {
    console.log("Requested body: ", body);
    const { id, left, right, numberOfBalls, totalSeconds, playerTurn, movedBy, move, timeShot } = body;
    if (
        id == null ||
        left == null ||
        right == null ||
        numberOfBalls == null ||
        totalSeconds == null ||
        playerTurn == null ||
        movedBy == null ||
        move !== 0 ||
        timeShot == null
    ) {
        return { status: false, message: "Missing required fields" };
    }

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

    const gameRef = adminDb.ref(`games/${id}`);
    const gameSnap = await get(gameRef);
    if (!gameSnap.exists()) return { status: false, message: "Game does not exist" };
    await gameRef.update({ state: "started" });
    const startRef = adminDb.ref(`games/${id}/start`);
    const startSnap = await get(startRef);
    if (!startSnap.exists()) {
        await startRef.set(startshot);
    }

    const histRef = adminDb.ref(`games/${id}/history`);
    await histRef.push(histshot);

    const timeRef = adminDb.ref(`games/${id}/startTime`);
    await timeRef.set(timeShot);

    return {
        status: true,
        message: "Game started successfully",
        histshot
    };
}

async function setTime(body) {
    const { gameId } = body;
    if (!gameId) return { status: false, message: "Game id not sent" };
    const gameRef = adminDb.ref(`games/${gameId}/startTime`);
    await gameRef.set(serverTimestamp());
    return { status: true, message: "Time recorded successfully" };
}

async function confirmMove(body) {
    const { id, left = [], right = [], move, movedBy, playerTurn } = body;
    if (!id || move < 0 || !playerTurn || !movedBy) return {
        status: false,
        message: "Missing id, move, player turn, or moved by"
    };
    const histRef = adminDb.ref(`games/${id}/history`);
    const requestedMove = {
        left: Array.isArray(left) ? left : [],
        right: Array.isArray(right) ? right : [],
        move,
        movedBy,
        playerTurn
    };

    await histRef.push(requestedMove);
    return {
        status: true,
        message: "Move confirmed successfully"
    };
}

async function fetchGameResults(game) {
    const { createdAt, gameId, history, players } = game;
    let script;
    script = `SELECT * FROM games WHERE game_id = $1`;
    const response = await pool.query(script, [gameId]);
    if (response.rows.length === 0) {
        script = `
        INSERT INTO games (game_id, history, players, created_at)
        VALUES ($1, $2, $3, $4)
    `;
        await pool.query(script, [gameId, history, JSON.stringify(players), createdAt]);
    }
}

async function updateUser(userId, type, gameId) {
    const res = await pool.query('SELECT games, win, lose FROM users WHERE id = $1', [userId]);
    const row = res.rows[0];

    let games = row.games;

    if (!Array.isArray(games)) {
        try { games = JSON.parse(games || '[]'); }
        catch { games = []; }
    }

    if (!games.includes(gameId)) {
        games.push(gameId);
    }

    let win = row.win || 0;
    let lose = row.lose || 0;
    let tie = row.tie || 0;
    if (type === 'win') win++;
    if (type === 'lose') lose++;
    if (type === 'tie') tie++;


    const wlratio = win / games.length;

    await pool.query(
        `UPDATE users
         SET win = $1,
             lose = $2,
             games = $3,
             wlratio = $4
         WHERE id = $5`,
        [win, lose, JSON.stringify(games), wlratio, userId]
    );
}



async function endGame(body) {
    const { gameId, player, opponent } = body;
    if (!gameId || !player || !opponent) {
        return { status: false, message: "Missing gameId, player, or opponent" };
    }

    const gameRef = adminDb.ref(`games/${gameId}`);
    const gameSnap = await get(gameRef);

    if (!gameSnap.exists()) return { status: false, message: "Game does not exist" };

    await gameRef.update({ state: "completed" });

    const rematchRef = adminDb.ref(`rematches/${gameId}`);
    const rematchSnap = await get(rematchRef);
    if (!rematchSnap.exists() || typeof rematchSnap.val() !== "object") {
        await rematchRef.set({ [player]: '', [opponent]: '' });
    }

    const game = gameSnap.val();
    await fetchGameResults(game);

    const histRef = adminDb.ref(`games/${gameId}/history`);
    const histSnap = await get(histRef);
    if (!histSnap.exists()) return { status: false, message: "History does not exist" };

    const hist = histSnap.val() || {};
    const histArray = Object.values(hist);
    const lastState = histArray[histArray.length - 1];

    const leftBallsLength = lastState.left ? lastState.left.length : 0;
    const rightBallsLength = lastState.right ? lastState.right.length : 0;


    try {
        await pool.query('BEGIN');

        if (leftBallsLength === 0 && rightBallsLength === 0) {
            const winnerId = lastState.movedBy === player ? player : opponent;
            const loserId = lastState.movedBy === player ? opponent : player;

            await updateUser(winnerId, 'win', gameId);
            await updateUser(loserId, 'lose', gameId);
        } else {
            await updateUser(player, 'tie', gameId);
            await updateUser(opponent, 'tie', gameId);
        }

        await pool.query('COMMIT');
    } catch (err) {
        await pool.query('ROLLBACK');
        console.error("Failed to update users:", err);
        return { status: false, message: err.message };
    }

    return { status: true, message: "Win reported successfully" };
}


export default async function handler(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Credentials", "true");

    if (req.method === "OPTIONS") return res.status(200).end();
    if (req.method !== "POST") return res.status(405).json({ error: "Only POST requests allowed" });

    const { action, body } = req.body;
    console.log("Requested body: ", req.body);

    if (!action || !body)
        return res.status(404).json({ message: "Missing action" });

    if (action === 'makenew') {
        const response = await generateNewGame(body);
        if (!response.status) return res.status(404).json(response);
        return res.status(200).json(response);
    }

    if (action === 'settime') {
        const response = await setTime(body);
        if (!response.status) return res.status(404).json(response);
        return res.status(200).json(response);
    }

    if (action === 'confirmmove') {
        const response = await confirmMove(body);
        if (!response.status) return res.status(400).json(response);
        return res.status(200).json(response);
    }

    if (action === 'endgame') {
        const response = await endGame(body);
        if (!response.status) return res.status(400).json(response);
        return res.status(200).json(response);
    }

    res.status(500).json({ error: "Action is invalid" });
}