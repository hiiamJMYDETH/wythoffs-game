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
            const sessionId = req.headers['authorization']?.replace('Session ', '');
            console.log("Session ID:", sessionId);
            const sessionData = await redisClient.hGetAll(`session:${sessionId}`);
            console.log("Session Data:", sessionData);
            if (!sessionData || !sessionData.user_id) {
                return res.status(401).json({ message: "Unauthorized" });
            }
            const userId = sessionData.user_id;
            const temp_user = await redisClient.hGetAll(`user:${userId}`);
            res.status(200).json(temp_user);
        }
        catch (error) {
            console.log("Error message: ", error);
            res.status(500).json({Error: error.message});
        }
    }
    else {
        res.status(500).json({message: "Method not allowed"});
    }
  }
  