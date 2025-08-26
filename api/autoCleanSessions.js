import cleanupsessions from "./config/cleanupsessions.js";

export default async function handler(req, res) {
    try {
        await cleanupsessions();
        res.status(200).json({ message: "Expired sessions cleaned up successfully" });
    }
    catch (error) {
        console.error("Error in autoCleanSessions:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}