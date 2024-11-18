import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDqQqR0fM9dOBZwSB5yGtziBzK55q-Ql2U",
  authDomain: "brightsmile-8fa53.firebaseapp.com",
  projectId: "brightsmile-8fa53",
  storageBucket: "brightsmile-8fa53.firebasestorage.app",
  messagingSenderId: "133615874319",
  appId: "1:133615874319:web:592d5879845f8059340e7a"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Enable offline persistence
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
  } else if (err.code === 'unimplemented') {
    console.warn('The current browser doesn\'t support offline persistence');
  }
});