// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDlHAEB0HxntFwotGfYmOPFydLe5BCjKp8",
  authDomain: "fantasia-chess.firebaseapp.com",
  databaseURL: "https://fantasia-chess-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "fantasia-chess",
  storageBucket: "fantasia-chess.firebasestorage.app",
  messagingSenderId: "949437574032",
  appId: "1:949437574032:web:51df59782bbf55a1d16115",
  measurementId: "G-FMMBV8P0Z4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
const database = getDatabase(app);

export { app, analytics, database };
