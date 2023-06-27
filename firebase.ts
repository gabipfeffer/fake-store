import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyCdapJcXywkUhScTHNwztFLt5AozUkGadI",
  authDomain: "fake-store-7f3a4.firebaseapp.com",
  projectId: "fake-store-7f3a4",
  storageBucket: "fake-store-7f3a4.appspot.com",
  messagingSenderId: "652642560830",
  appId: "1:652642560830:web:401054fd2b49a959e25a6f",
  measurementId: "G-JSMZ2VHF32",
};

const app = !firebase.apps.length
  ? firebase.initializeApp(firebaseConfig)
  : firebase.app();

const db = app.firestore();

export default db;
