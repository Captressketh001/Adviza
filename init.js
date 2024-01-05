// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth, GoogleAuthProvider} from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAT_esfaBArPOCdb60lIMZdJ7ctVhE2cVA",
  authDomain: "dev-advice-408619.firebaseapp.com",
  projectId: "dev-advice-408619",
  storageBucket: "dev-advice-408619.appspot.com",
  messagingSenderId: "381201141788",
  appId: "1:381201141788:web:489b072e32f167ad248fd9",
  measurementId: "G-FQNX36RXBZ"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth =  getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const analytics = getAnalytics(app);

// export {app, analytics}