// pages/api/loaduser.js
import { ref, child, get } from "firebase/database";
import { database } from "./config/firebase.js"; // import the shared Firebase instance

// Timeout helper
function timeout(ms, promise) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Firebase request timed out")), ms)
    ),
  ]);
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "GET") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  try {
    const sessionId = req.headers["authorization"]?.replace("Session ", "");
    if (!sessionId) return res.status(401).json({ message: "Unauthorized" });

    const sessionSnap = await timeout(
      5000,
      get(child(ref(database), `sessions/${sessionId}`))
    );

    if (!sessionSnap.exists() || !sessionSnap.val().user_id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = sessionSnap.val().user_id;

    const userSnap = await timeout(
      5000,
      get(child(ref(database), `users/${userId}`))
    );

    res.status(200).json(userSnap.exists() ? userSnap.val() : {});
  } catch (error) {
    console.error("Error in loaduser:", error);
    res.status(500).json({ message: error.message });
  }
}
