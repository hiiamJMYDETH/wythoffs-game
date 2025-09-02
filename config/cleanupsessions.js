import { database } from "./firebase.js"; 
import { ref, get, child, remove } from "firebase/database";

export default async function cleanupsessions() {
    const sessionsRef = ref(database, 'sessions');
    const snapshot = await get(sessionsRef);
    if (!snapshot.exists()) return;
    const sessions = snapshot.val();
    const now = Date.now();
    for (const [sessionId, session] of Object.entries(sessions)) {
        if (session.expiresAt < now) {
            console.log(`Cleaning up expired session: ${sessionId}`);
            await remove(child(sessionsRef, sessionId));
        }
    }
}