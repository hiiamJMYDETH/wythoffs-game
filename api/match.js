import redisClient from "../config/redis.js";
import checkSession from "../config/checksession.js";
import { database } from "../config/firebase.js";
import { ref, set, get } from "firebase/database";

async function findOrCreateGame(playerId) {
  const luaScript = `
    local waiting = redis.call("LPOP", "matchmaking:queue")
    if waiting and waiting ~= ARGV[1] then
      local gameId = redis.call("INCR", "game:id:counter")
      -- store gameId for both players in Redis
      redis.call("HSET", "player:" .. waiting, "gameId", gameId)
      redis.call("HSET", "player:" .. ARGV[1], "gameId", gameId)
      return { tostring(gameId), waiting, ARGV[1] }
    else
      redis.call("RPUSH", "matchmaking:queue", ARGV[1])
      return nil
    end
  `;

  const result = await redisClient.eval(luaScript, {
    keys: [],
    arguments: [String(playerId)],
  });

  if (!result) return null;

  const [gameId, p1, p2] = result;

  const gameRef = ref(database, `games/${gameId}`);
  const gameSnap = await get(gameRef);
  if (!gameSnap.exists()) {
    const gameData = {
      gameId,
      players: [p1, p2],
      createdAt: Date.now(),
      state: "waitingToStart",
    };
    await set(gameRef, gameData);
  }

  return { gameId, players: [p1, p2] };
}

async function loadGame(playerId) {
  const gameId = await redisClient.hGet(`player:${playerId}`, "gameId");
  if (gameId) {
    const gameRef = ref(database, `games/${gameId}`);
    const gameSnap = await get(gameRef);
    if (gameSnap.exists()) return gameSnap.val();
  }

  const gameRef = ref(database, "games");
  const gameSnap = await get(gameRef);
  if (!gameSnap.exists()) return null;
  const games = gameSnap.val();
  for (const [id, game] of Object.entries(games)) {
    if (game.players && game.players.includes(playerId)) return game;
  }
  return null;
}


export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST")
    return res.status(405).json({ error: "Only POST allowed" });

  const sessionId = req.body?.sessionId || "";
  const playerId = await checkSession(sessionId);
  if (!playerId) return res.status(401).json({ error: "Invalid session" });

  try {
    let game = await loadGame(playerId);
    if (game) {
      return res.status(200).json({ message: "Already in a game", ...game });
    }

    game = await findOrCreateGame(playerId);
    if (!game) return res.status(200).json({ message: "Waiting" });

    return res.status(200).json({ message: "Found a pair", ...game });
  } catch (err) {
    console.error("Matchmaking error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
