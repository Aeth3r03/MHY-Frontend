import { doc, getDoc } from "firebase/firestore";
import type { TermsServiceContent } from "../types/termsService";
import { db } from "./firebase";


function docToTerms(data: Record<string, unknown>): TermsServiceContent{
    return {
        content: typeof data.content === "string" ? data.content : ""
    }
}

export const termsServiceApi = {
    async getTermsService(): Promise<TermsServiceContent | null> {
        const snapshot = await getDoc(doc(db, "terms-service", "current"))
        if (!snapshot.exists()) return null
        return docToTerms(snapshot.data())
    }
}