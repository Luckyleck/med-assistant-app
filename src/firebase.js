// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage"; // Import the storage service

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBVf6aa1JZ6DtYgsN9dQ8dULm-D-7MwtAI",
  authDomain: "merenza-c1c1d.firebaseapp.com",
  projectId: "merenza-c1c1d",
  storageBucket: "merenza-c1c1d.appspot.com",
  messagingSenderId: "148997078996",
  appId: "1:148997078996:web:2208a888988c313affa041"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Storage and export it
const storage = getStorage(app);
export { storage };