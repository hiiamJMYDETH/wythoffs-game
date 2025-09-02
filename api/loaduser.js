import checkSession from "../config/checksession.js";

export default async function handler(req, res) {

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const sessionId = req.headers["authorization"]?.replace("Session ", "");
    if (!sessionId) return res.status(401).json({ message: "Unauthorized" });

    const userId = await checkSession(sessionId);
    if (!userId) return res.status(401).json({ message: "Invalid or expired session" });

    res.status(200).json({ message: "Authorized", userId });
  } catch (error) {
    console.error("Error in loaduser:", error);
    res.status(500).json({ message: error.message });
  }
}
