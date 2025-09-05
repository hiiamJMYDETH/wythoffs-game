// import pkg from 'pg';
// import dotenv from 'dotenv';
// const {Client} = pkg;

// dotenv.config(); 

// let client;

// const connectToDatabase = async () => {
//   if (client) return client; 
//   client = new Client({
//     connectionString: process.env.DATABASE_URL,
//     ssl: {
//       rejectUnauthorized: false
//     }
//   });

//   await client.connect();
//   return client;
// };

// export { connectToDatabase };
// db.js
import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" 
    ? { rejectUnauthorized: false }
    : false,
});

export default pool;

