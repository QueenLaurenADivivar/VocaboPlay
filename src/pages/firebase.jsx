// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// Replace these values with your actual Firebase config from Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyDB9FjlUXI7PJfSt0vAzAqyYmtgSsyZpek",
  authDomain: "vocaboplay-8b7cb.firebaseapp.com",
  projectId: "vocaboplay-8b7cb",
  storageBucket: "vocaboplay-8b7cb.firebasestorage.app",
  messagingSenderId: "274822950411",
  appId: "1:274822950411:web:9fd8d09c065960876f210e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;