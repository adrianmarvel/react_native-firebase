import { initializeApp } from "firebase/app";
import {getFirestore} from "@firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCcC7a-uRzhMr6WF9HVZYd09675eBEj9QE",
    authDomain: "crud-73f52.firebaseapp.com",
    databaseURL: "https://crud-73f52-default-rtdb.firebaseio.com",
    projectId: "crud-73f52",
    storageBucket: "crud-73f52.appspot.com",
    messagingSenderId: "662371225264",
    appId: "1:662371225264:web:8f1457c9fc00cb2d8ff575",
    measurementId: "G-HEGGGWZQ2F"
  };
  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  export const db = getFirestore(app);