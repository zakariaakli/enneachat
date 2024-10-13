// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDPxy4xlCYUN0XfXtQsx8xYWO1AeCdqKGE",
  authDomain: "enneachat-3883f.firebaseapp.com",
  projectId: "enneachat-3883f",
  storageBucket: "enneachat-3883f.appspot.com",
  messagingSenderId: "157195361830",
  appId: "1:157195361830:web:23d4f488cbfedcd63390e7",
  measurementId: "G-MYJ9C0ESNJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

export { db };