import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  enableIndexedDbPersistence,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  doc,
  setDoc,
  CACHE_SIZE_UNLIMITED
} from 'firebase/firestore';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore with settings for better offline support and caching
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    cacheSizeBytes: CACHE_SIZE_UNLIMITED,
    tabManager: persistentMultipleTabManager()
  })
});

// Enable offline persistence with better error handling
const setupPersistence = async () => {
  try {
    await enableIndexedDbPersistence(db);
    console.log('Offline persistence enabled successfully');
  } catch (err: any) {
    if (err.code === 'failed-precondition') {
      console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
    } else if (err.code === 'unimplemented') {
      console.warn('The current browser does not support offline persistence.');
    } else {
      console.error('Error enabling offline persistence:', err);
    }
  }
};

// Initialize Auth
export const auth = getAuth(app);

// Initialize Analytics only in production
export const analytics = import.meta.env.PROD ? getAnalytics(app) : null;

// Function to check database connection with timeout
export const checkDatabaseConnection = async () => {
  try {
    const timeout = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Database connection timeout')), 10000)
    );
    
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

// Setup persistence
setupPersistence(); 