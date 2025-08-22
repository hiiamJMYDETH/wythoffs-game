import redisClient from "./config/redis.js";

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
            // const lastSnapshot = await redisClient.lIndex(`lobby:${gameId}:history`, -1);
            // if (!lastSnapshot) {
            //     return res.status(404).json({ message: "Game not found" });
            // }
            // res.status(200).json({message: "Game data retrieved successfully", GameData: JSON.parse(lastSnapshot)});
            const history = await redisClient.lRange(`lobby:${gameId}:history`, 0, -1);
            const parsed = history.map(h => JSON.parse(h));
            res.json({ history: parsed });
        } catch (error) {
            console.error("Error fetching game data:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    } else {
        res.status(405).json({ message: "Method not allowed" });
    }
}