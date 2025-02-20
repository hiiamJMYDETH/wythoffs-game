import { connectToDatabase } from "./config/db.js";

export default async function handler(req, res) {
    // Add CORS headers to allow all domains for testing purposes
    res.setHeader('Access-Control-Allow-Origin', '*');  // Allow all origins
    res.setHeader('Access-Control-Allow-Methods', 'GET');  // Allow methods
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');  // Allow Content-Type header
  

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method === 'GET') {
        try {
            const client = await connectToDatabase();
            const results = await client.query("SELECT * FROM users;");
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
  