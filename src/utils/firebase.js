// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const analytics = getAnalytics(app);

export const auth = getAuth();
