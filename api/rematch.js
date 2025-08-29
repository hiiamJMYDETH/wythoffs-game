import { database } from "./config/firebase.js";
import { ref, get, update } from "firebase/database";

export default async function handler(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Credentials", "true");

    if (req.method === "OPTIONS") return res.status(200).end();
    if (req.method !== "POST") return res.status(405).json({ error: "Only POST requests allowed" });

    const {value, player, id} = req.body;
    if (value === null || !player || !id) return res.status(404).json({message: "Missing player choice or player"});

    const choiceRef = ref(database, `games/${id}/rematchState`);
    const choiceSnap = await get(choiceRef);
    if (!choiceSnap.exists()) return res.status(404).json({message: "Game rematch choice does not exist"});

    if (value === true) await update(choiceRef, {[`${player}`]: '1'});
    if (value === false) await update(choiceRef, {[`${player}`]: '0'});

    res.status(200).json({message: "Choice updated successfully", value});
}