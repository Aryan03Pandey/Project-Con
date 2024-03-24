// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyAfsuxbEyvxL3KL_9nWP89NBGbUolHKvRM",
  authDomain: "thoughts-b92d1.firebaseapp.com",
  projectId: "thoughts-b92d1",
  storageBucket: "thoughts-b92d1.appspot.com",
  messagingSenderId: "468055975815",
  appId: "1:468055975815:web:f265929c00cfd55b105522",
  measurementId: "G-KTRB7CEY4Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

//google auth

const provider = new GoogleAuthProvider();

const auth = getAuth();

export const authWithGoogle = async () => {
    let user = null;

    await signInWithPopup(auth, provider)
    .then((result) => {
        user = result.user;
    })
    .catch((err) => {
        console.log(err);
    })

    return user;
}