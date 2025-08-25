import dotenv from "dotenv";
import { createClient } from 'redis';

dotenv.config();

const redisClient = createClient({
    url: process.env.REDIS_URL
});

redisClient.on('error', (err) => console.error('❌ Redis Error:', err));

await redisClient.connect(); 

export default redisClient;
