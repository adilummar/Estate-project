// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "estate-bdcdc.firebaseapp.com",
  projectId: "estate-bdcdc",
  storageBucket: "estate-bdcdc.firebasestorage.app",
  messagingSenderId: "515814612481",
  appId: "1:515814612481:web:4d499d78ca712ed261ea00"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);