import {database} from "../config/firebase.js";
import {ref, get} from "firebase/database";

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method === 'GET') {
        try {
            const gameId = req.query.id;
            const histRef = ref(database, `games/${gameId}/history`);
            const histSnap = await get(histRef);
            if (!histSnap.exists()) return res.status(404).json({message: "Does not exist"});
            const hist = histSnap.val() || {};
            const history = Object.values(hist);
            res.status(200).json({history});
        } catch (error) {
            console.error("Error fetching game data:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    } else {
        res.status(405).json({ message: "Method not allowed" });
    }
}