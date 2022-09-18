// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBWCWYefReUsDxSYSeKlrZjFXk_Q6rFLDE",
  authDomain: "e-commerce-aa0b6.firebaseapp.com",
  projectId: "e-commerce-aa0b6",
  storageBucket: "e-commerce-aa0b6.appspot.com",
  messagingSenderId: "378840677616",
  appId: "1:378840677616:web:93b3e633f3e775a6519635",
  storageBucket: "gs://e-commerce-aa0b6.appspot.com",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
