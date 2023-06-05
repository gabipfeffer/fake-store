// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCdapJcXywkUhScTHNwztFLt5AozUkGadI",
  authDomain: "fake-store-7f3a4.firebaseapp.com",
  projectId: "fake-store-7f3a4",
  storageBucket: "fake-store-7f3a4.appspot.com",
  messagingSenderId: "652642560830",
  appId: "1:652642560830:web:401054fd2b49a959e25a6f",
  measurementId: "G-JSMZ2VHF32",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
