import dotenv from "dotenv";
import { createClient } from 'redis';

dotenv.config();

const redisClient = createClient({
    url: process.env.UPSTASH_REDIS_URL,
    socket: {
        tls: true, 
    },
});

export async function connectRedis() {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
  return redisClient;
}