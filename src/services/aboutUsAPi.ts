import { doc, getDoc } from "firebase/firestore";
import type { AboutUsContent } from "../types/aboutUs";
import { db } from "./firebase";


function docToAbout(data: Record<string, unknown>): AboutUsContent {
    return {
        content: typeof data.content === "string" ? data.content : "",
        imageUrl: typeof data.imageUrl === "string" ? data.imageUrl : ""
    }
}

export const aboutUsApi = {
    async getAboutUs(): Promise<AboutUsContent | null> {
        const snapshot = await getDoc(doc(db, "about-us", "current"))
        if (!snapshot.exists()) return null
        return docToAbout(snapshot.data())
    }
}