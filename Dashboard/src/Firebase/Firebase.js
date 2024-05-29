
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


const firebaseConfig = {
apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "alegria-de-vivir-99.firebaseapp.com",
  projectId: "alegria-de-vivir-99",
  storageBucket: "alegria-de-vivir-99.appspot.com",
  messagingSenderId: "188323063193",
  appId: "1:188323063193:web:ac37969f9f3eadadfd5f08",
  measurementId: "G-JWD264ZZNZ"
};


export const app = initializeApp(firebaseConfig);