import app from 'firebase/app';
import firebase from 'firebase';

const firebaseConfig = {
  apiKey: "AIzaSyDDpzs4nsDvKdWGalnkoeRA6ZfxSYyVn3Q",
  authDomain: "proyecto-integrador-21f04.firebaseapp.com",
  projectId: "proyecto-integrador-21f04",
  storageBucket: "proyecto-integrador-21f04.firebasestorage.app",
  messagingSenderId: "720364499399",
  appId: "1:720364499399:web:84174618e1922381c4a9e2"
};

app.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const db = app.firestore();