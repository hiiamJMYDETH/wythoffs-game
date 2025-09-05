import pool from "./config/db.js";

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
            const client = pool;
            const results = await client.query("SELECT * FROM users");
            res.status(200).json(results.rows);
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
  