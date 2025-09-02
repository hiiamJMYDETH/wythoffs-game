import dotenv from "dotenv";
import { createClient } from 'redis';

dotenv.config();

const redisClient = createClient({
    url: process.env.UPSTASH_REDIS_URL,
    socket: {
        tls: true, // required for most hosted Redis
    },
});

// redisClient.on('error', (err) => console.error('❌ Redis Error:', err));

// await redisClient.connect(); 

// export default redisClient;
export async function connectRedis() {
    if (!redisClient.isOpen) {
        await redisClient.connect();
    }
    return redisClient;
}