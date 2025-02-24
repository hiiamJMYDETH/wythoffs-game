// /api/hello.js

export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*'); // Allow all origins or specify your frontend domain
    res.setHeader('Access-Control-Allow-Methods', 'GET'); // Allow only GET requests
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); // Allow specific headers (if needed)
  
    // Handle preflight OPTIONS request
    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }
  
    // Actual GET request handling
    if (req.method === 'GET') {
      res.status(200).json({ message: 'Hello from the serverless function!' });
    } else {
      res.status(405).json({ error: 'Method Not Allowed' });
    }
  }
  