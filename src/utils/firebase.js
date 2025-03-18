// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAuQDfVzb8ix_IHtsTZmXoSfWbNauDhhTg",
  authDomain: "netflix-gpt-9f486.firebaseapp.com",
  projectId: "netflix-gpt-9f486",
  storageBucket: "netflix-gpt-9f486.firebasestorage.app",
  messagingSenderId: "837170023910",
  appId: "1:837170023910:web:d1d435a1822c761b9a1a27",
  measurementId: "G-1L2VL036C2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
