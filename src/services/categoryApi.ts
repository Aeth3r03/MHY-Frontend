import { collection, getDocs, onSnapshot, query, type DocumentData, type QueryDocumentSnapshot } from "firebase/firestore";
import type { Category } from "../types/category";
import { db } from "./firebase";

const categoriesCol = collection(db, "categories");
const CATEGORY_CACHE_TTL_MS = 5 * 60 * 1000;

let categoriesCache: Category[] | null = null;
let categoriesCacheExpiresAt = 0;
let categoriesCacheRequest: Promise<Category[]> | null = null;

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

async function getCachedCategories(): Promise<Category[]> {
    if (categoriesCache && Date.now() < categoriesCacheExpiresAt) {
        return categoriesCache;
    }

    if (categoriesCacheRequest) return categoriesCacheRequest;

    categoriesCacheRequest = getDocs(categoriesCol)
        .then((snapshot) => {
            categoriesCache = snapshot.docs.map(docToCategory);
            categoriesCacheExpiresAt = Date.now() + CATEGORY_CACHE_TTL_MS;
            return categoriesCache;
        })
        .finally(() => {
            categoriesCacheRequest = null;
        });

    return categoriesCacheRequest;
}

export const categoriesApi = {
    async getCategories() {
        return getCachedCategories();
    },

    async getCategory(id: string) {
        const categories = await getCachedCategories();
        return categories.find((category) => category.id === id) ?? null;
    },

    subscribeToCategories(callback: (category: Category[]) => void): () => void {
        const q = query(categoriesCol)
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const categories = snapshot.docs.map(docToCategory)
            categoriesCache = categories;
            categoriesCacheExpiresAt = Date.now() + CATEGORY_CACHE_TTL_MS;
            callback(categories)
        })
        return unsubscribe
    }
}
