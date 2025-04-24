// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD1QlhGAW3fM0mT600qEAyd-ygw5hk5WPs",
  authDomain: "clicon-80e2a.firebaseapp.com",
  projectId: "clicon-80e2a",
  storageBucket: "clicon-80e2a.firebasestorage.app",
  messagingSenderId: "348193791831",
  appId: "1:348193791831:web:784f8f300b13bd4c76e812",
  measurementId: "G-EMMYYEJ994"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export default app;