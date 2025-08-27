import { database } from "../api/config/firebase.js";
import { ref, get, push } from "firebase/database";

export default async function handler(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Credentials", "true");

    if (req.method === "OPTIONS") return res.status(200).end();
    if (req.method !== "POST") return res.status(405).json({ error: "Only POST requests allowed" });

    const { id, left = [], right = [], move, playerTurn, movedBy } = req.body;

    if (
        !id ||
        move === undefined ||
        !playerTurn ||
        !movedBy
    ) {
        return res.status(400).json({ error: "Missing or invalid required fields" });
    }

    const histRef = ref(database, `games/${id}/history`);
    const histSnap = await get(histRef);
    if (!histSnap.exists()) {
        return res.status(404).json({ message: "Game history does not exist" });
    }

    const userSnap = await get(ref(database, `games/${id}/players`));
    if (!userSnap.exists()) {
        return res.status(404).json({ message: "Players not found" });
    }
    const hist = histSnap.val();
    const history = hist ? Object.values(hist) : [];
    const lastState = history[history.length - 1];


    const lastLeft = lastState?.left || [];
    const lastRight = lastState?.right || [];

    if (left.length === lastLeft.length && right.length === lastRight.length) {
        return res.status(400).json({ message: "No move initiated" });
    }

    const requestedMove = {
        left: Array.isArray(left) ? left : [],
        right: Array.isArray(right) ? right : [],
        move,
        movedBy,
        playerTurn
    };
    console.log("📝 Pushing move:", requestedMove);

    await push(histRef, requestedMove);

    return res.status(200).json({ message: "Move initiated successfully", move: requestedMove });
}
