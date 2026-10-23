import { collection, doc, getDoc, getDocs, onSnapshot, query, type DocumentData, type QueryDocumentSnapshot } from "firebase/firestore";
import type { Category } from "../types/category";
import { db } from "./firebase";


function docToCategory(docSnap: QueryDocumentSnapshot<DocumentData>): Category {
    const data = docSnap.data()
    return {
        id: docSnap.id,
        name: data.name,
        description: data.description,
        imageUrl: data.imageUrl,
        imageId: data.imageId
    }
}

const categoriesCol = collection(db, 'categories')

export const categoriesApi = {
    async getCategories() {
        const snapshot = await getDocs(categoriesCol)
        return snapshot.docs.map(docToCategory)
    },

    async getCategory(id: string) {
        const snapshot = await getDoc(doc(db, 'categories', id))
        if(!snapshot.exists()) return null
        return docToCategory(snapshot)
    },

    subscribeToCategories(callback: (category: Category[]) => void): () => void {
        const q = query(categoriesCol)
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const categories = snapshot.docs.map(docToCategory)
            callback(categories)
        })
        return unsubscribe
    }
}