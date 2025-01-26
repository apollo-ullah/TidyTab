import { initializeApp } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence, connectFirestoreEmulator } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyALnI3q9gp-gZ6YlqdudV3kceEnj0jLCdw",
  authDomain: "tidytab-b50a1.firebaseapp.com",
  projectId: "tidytab-b50a1",
  storageBucket: "tidytab-b50a1.firebasestorage.app",
  messagingSenderId: "985129593429",
  appId: "1:985129593429:web:8a95efff9c3d550062c2dc",
  measurementId: "G-NT1YLVEQR9"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Enable offline persistence
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
  } else if (err.code === 'unimplemented') {
    console.warn('The current browser does not support offline persistence.');
  }
});

export const auth = getAuth(app);
export const analytics = getAnalytics(app); 
