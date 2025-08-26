import { database } from "./firebase.js"; 
import { ref, get, child } from "firebase/database";

export default async function checkSession(sessionId, withUser = false) {
    const sessionSnap = await get(child(ref(database), `sessions/${sessionId}`));
    if (!sessionSnap.exists()) return null;
    const session = sessionSnap.val();
    if (!session.user_id || session.expiresAt < Date.now()) return null; 
    if (!withUser) return session.user_id;
    const userSnap = await get(child(ref(database), `users/${session.user_id}`));
    if (!userSnap.exists()) return null;
    return userSnap.val();
}
