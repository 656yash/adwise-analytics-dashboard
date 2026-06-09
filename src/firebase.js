import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCwuSh_3-AUZLrsuPk8JdM7_Wyeo5WQDHk",
  authDomain: "skillforgedemowebsite.firebaseapp.com",
  projectId: "skillforgedemowebsite",
  storageBucket: "skillforgedemowebsite.firebasestorage.app",
  messagingSenderId: "957822862900",
  appId: "1:957822862900:web:4bfcfd0f207d95ac8aec61"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
