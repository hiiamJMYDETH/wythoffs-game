import redisClient from "./config/redis.js";
import { v4 as uuidv4 } from "uuid";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Only POST allowed" });

  const playerId = String(req.body?.userId);
  if (!playerId) return res.status(400).json({ error: "Missing userId" });

  const lua = `
    local queueKey = KEYS[1]
    local player = ARGV[1]
    local now = ARGV[2]
    local expireTime = ARGV[3]
    local lobbyId = ARGV[4]

    -- Check if player already in any lobby
    local lobbyKeys = redis.call("KEYS", "lobby:*:users")
    for _, key in ipairs(lobbyKeys) do
      local members = redis.call("SMEMBERS", key)
      for _, p in ipairs(members) do
        if p == player then
          return {"ALREADY_IN_LOBBY", key}
        end
      end
    end

    -- Check if player already in queue
    local pos = redis.call("LPOS", queueKey, player)
    if not pos then
      redis.call("RPUSH", queueKey, player)
    end

    -- Check if at least 2 players in queue
    local length = redis.call("LLEN", queueKey)
    if length < 2 then
      return {}
    end

    -- Pop two players atomically
    local players = redis.call("LPOP", queueKey, 2)
    local p1, p2 = players[1], players[2]

    -- Create lobby set and metadata
    redis.call("SADD", "lobby:"..lobbyId..":users", p1, p2)
    redis.call("HSET", "lobby:"..lobbyId..":meta",
      "createdAt", now,
      "status", "active",
      "playerCount", 2,
      "expiresAt", expireTime,
      "winner", ""  -- empty until game ends
    )

    -- Initialize empty history list with first state
    local initialState = cjson.encode({
      left = {},
      right = {},
      move = 0
    })
    redis.call("RPUSH", "lobby:"..lobbyId..":history", initialState)

    return {lobbyId, p1, p2}
  `;


  const lobbyId = uuidv4();
  const now = Date.now();
  const expireTime = now + 3600000;

  try {
    const result = await redisClient.eval(lua, {
      keys: ["queue:queue"],
      arguments: [playerId, now.toString(), expireTime.toString(), lobbyId]
    });

    if (!result || result.length === 0) {
      return res.status(200).json({ message: "Waiting for opponent..." });
    }

    if (result[0] === "ALREADY_IN_LOBBY") {
      const lobbyKey = result[1];
      const existingLobbyId = lobbyKey.match(/lobby:(.*):users/)[1];
      const users = await redisClient.sMembers(`lobby:${existingLobbyId}:users`);
      const opponent = users.find(u => u !== playerId) || null;
      return res.status(200).json({
        message: "Already in a lobby",
        lobbyId: existingLobbyId,
        opponent
      });
    }

    const [createdLobbyId, player1, player2] = result;
    return res.status(200).json({
      lobbyId: createdLobbyId,
      player: playerId,
      opponent: playerId === player1 ? player2 : player1
    });

  } catch (err) {
    console.error("Lua/Redis error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
