import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { FIREBASE_CONFIG } from "../utils/env";
import { getAnalytics, isSupported, logEvent } from "firebase/analytics";

const firebaseConfig = FIREBASE_CONFIG

const app = initializeApp(firebaseConfig)
const analyticsReady = (async () => {
    if (typeof window === "undefined" || !firebaseConfig.measurementId) return null
    if (!(await isSupported())) return null

    return getAnalytics(app)
})();

export async function logAnalyticsEvent(
    eventName: string,
    parameters?: Record<string, string | number>
) {
    const analytics = await analyticsReady
    if (!analytics) return 
    logEvent(analytics, eventName, parameters)
}

export const auth = getAuth(app)
export const db = getFirestore(app)