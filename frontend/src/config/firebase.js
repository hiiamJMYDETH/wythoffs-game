// Minimal frontend Firebase config
import { initializeApp, getApps } from "firebase/app";
import { getDatabase } from "firebase/database";

// Only expose projectId and databaseURL
const firebaseConfig = {
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  databaseURL: import.meta.env.VITE_FIREBASE_DB_URL,
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
export const database = getDatabase(app);
