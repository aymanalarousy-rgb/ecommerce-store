// lib/firebase.ts - COMPLETE FILE
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut,
  onAuthStateChanged 
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCBLVeUCC6G3VLqg5xY1uU05VWJ0RiA_LY",
  authDomain: "my-e-store-624a3.firebaseapp.com",
  projectId: "my-e-store-624a3",
  storageBucket: "my-e-store-624a3.firebasestorage.app",
  messagingSenderId: "93623461748",
  appId: "1:93623461748:web:f4990bf93357cc812dae21",
  measurementId: "G-K25DHXSDCL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// Export everything
export { 
  app, 
  auth, 
  db,
  googleProvider, 
  signInWithPopup, 
  signOut,
  onAuthStateChanged 
};