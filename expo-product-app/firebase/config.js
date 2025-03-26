import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCczfwxxRROnu5DNTLCQjWGBYKxEBuvPUY",
  authDomain: "expo-crud-66bf9.firebaseapp.com",
  projectId: "expo-crud-66bf9",
  storageBucket: "expo-crud-66bf9.firebasestorage.app",
  messagingSenderId: "1079039763716",
  appId: "1:1079039763716:web:dbf01ccacd1d184bd4dc51",
  measurementId: "G-F5X9HSSQ84"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
