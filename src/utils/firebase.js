import { initializeApp } from "firebase/app";
import { getDatabase, ref } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBjcezuoyH5DsraqvaD2S-ZCryMTvivYuY",
  authDomain: "react-video-call-145be.firebaseapp.com",
  databaseURL: "https://react-video-call-145be-default-rtdb.firebaseio.com",
  projectId: "react-video-call-145be",
  storageBucket: "react-video-call-145be.appspot.com",
  messagingSenderId: "128135216630",
  appId: "1:128135216630:web:9dc767e8fd612296b95bd7",
  measurementId: "G-DZPY93JD9V",
};

export function firebaseSlugBase() {
  return ref(getDatabase(), slug);
}

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);

export const slug = "dccb5954";
