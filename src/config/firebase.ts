import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
// Only import Analytics if you're sure you need it in a browser environment
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyALnI3q9gp-gZ6YlqdudV3kceEnj0jLCdw",
  authDomain: "tidytab-b50a1.firebaseapp.com",
  projectId: "tidytab-b50a1",
  storageBucket: "tidytab-b50a1.firebasestorage.app",
  messagingSenderId: "985129593429",
  appId: "1:985129593429:web:8a95efff9c3d550062c2dc",
  measurementId: "G-NT1YLVEQR9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

/**
 * If you're in a Next.js or server-rendered environment, you might get errors
 * from `getAnalytics` because Analytics requires a window/document environment.
 * To avoid this, only initialize Analytics in a browser check.
 */
let analytics;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, analytics, auth, db, storage };

/**
 * Helper function to check database connection with a timeout.
 * This writes a test document to Firestore. If it succeeds, your Firestore is connected.
 */
export const checkDatabaseConnection = async () => {
  try {
    const timeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Database connection timeout')), 10000)
    );

    // Write a test doc to verify that we can connect and write to Firestore
    const testDoc = doc(db, '_health', '_test');
    await Promise.race([
      setDoc(testDoc, { timestamp: new Date() }),
      timeout
    ]);

    console.log('Database connection successful');
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
};