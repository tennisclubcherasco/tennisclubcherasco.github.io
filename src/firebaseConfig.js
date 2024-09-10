// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBuDVBtlFpOrG8IbG1BsPmKFVLxVHV2PQg",
    authDomain: "tennisclubcherasco.firebaseapp.com",
    projectId: "tennisclubcherasco",
    storageBucket: "tennisclubcherasco.appspot.com",
    messagingSenderId: "517529694857",
    appId: "1:517529694857:web:4dc98fd4d3a2204946cc58",
    measurementId: "G-T0GK14GBK7"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };