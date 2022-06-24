import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getPerformance } from "firebase/performance";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyC0FV0jHT2CaYFO2Ij6abTq_y0Di37vdYU",
    authDomain: "mwitter-b608d.firebaseapp.com",
    projectId: "mwitter-b608d",
    storageBucket: "mwitter-b608d.appspot.com",
    messagingSenderId: "821044696022",
    appId: "1:821044696022:web:ca3790b020e255e5d34a77"
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const performance = getPerformance(app);
const storage = getStorage(app);

export default firestore
