import bcrypt from "bcrypt";
import { connectToDatabase } from "./config/db.js";

export default async function handler(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Credentials", "true");

    if (req.method === "OPTIONS") return res.status(200).end();
    if (req.method !== "POST") return res.status(405).json({ error: "Only POST requests allowed" });

    const { userId, oldUsername, newUsername, oldPassword, newPassword } = req.body;

    if (!newUsername && (!oldPassword || !newPassword)) {
        return res.status(404).json({ error: "Missing username and password" });
    }
    if (!userId || !oldUsername) {
        return res.status(404).json({ error: "Missing id or old username" });
    }

    const saltRounds = 10;
    const client = await connectToDatabase();
    const result = await client.query(
        "SELECT * FROM users WHERE username = $1 AND ID = $2",
        [oldUsername, userId]
    );

    if (result.rows.length === 0) {
        return res.status(401).json({ message: "Invalid login" });
    }

    const user = result.rows[0];

    const Oldmatch = await bcrypt.compare(oldPassword, user.usr_pwd);
    if (!Oldmatch) {
        return res.status(401).json({ message: "Wrong old password" });
    }
    if (newUsername) {
        await client.query(
            "UPDATE users SET username = $1 WHERE id = $2",
            [newUsername, userId]
        );
    }
    if (newPassword) {
        const oldNewMatch = await bcrypt.compare(newPassword, user.usr_pwd);
        if (oldNewMatch) {
            return res.status(401).json({message: "Same password! You can't use that"})
        }
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
        await client.query(
            "UPDATE users SET usr_pwd = $1 WHERE id = $2",
            [hashedPassword, userId]
        )
    }

    res.status(200).json({ message: "Successfully changed info" });
}