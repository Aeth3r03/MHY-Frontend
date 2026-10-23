import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { FIREBASE_CONFIG } from "../utils/env";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = FIREBASE_CONFIG

const app = initializeApp(firebaseConfig)

let analytics = null;

if(typeof window !== "undefined" && firebaseConfig.measurementId) {
    isSupported().then((yes) => {
        if (yes) analytics = getAnalytics(app)
    })
}

export { analytics }
export const auth = getAuth(app)
export const db = getFirestore(app)