import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Optionally import the services that you want to use
// import {...} from "firebase/auth";
// import {...} from "firebase/database";
// import {...} from "firebase/firestore";
// import {...} from "firebase/functions";
// import {...} from "firebase/storage";

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyArva7PR9W7Sl6O03H3JvGztURqzKDMPd8",
  authDomain: "kikisdelivery-44503.firebaseapp.com",
  databaseURL: '',
  projectId: "kikisdelivery-44503",
  storageBucket: "kikisdelivery-44503.appspot.com",
  messagingSenderId: "61734388843",
  appId: "1:61734388843:web:101c249fa585e8b0319d2e",
  measurementId: "G-90K7ETW99H"
};

export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIRESTORE_DB = getFirestore(FIREBASE_APP);

// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase