import { collection, doc, getDoc, getDocs, onSnapshot, orderBy, query, type DocumentData, type QueryDocumentSnapshot } from "firebase/firestore";
import type { Product } from "../types/product";
import { db } from "./firebase";


function docToProduct(docSnap: QueryDocumentSnapshot<DocumentData>): Product {
    const data = docSnap.data()
    return {
        id: docSnap.id,
        name: data.name,
        description: data.description,
        price: data.price,
        currency: data.currency,
        categoryId: data.categoryId,
        available: data.available,
        imageUrl: data.imageUrl,
        imageId: data.imageId,
        createdAt: data.createdAt?.toDate?.() || new Date(),
        updatedAt: data.updateAt?.toDate?.() || new Date(),
    }
}

const productsCol = collection(db, 'products')

export const productsApi = {
    async getProducts() {
        const snapshot = await getDocs(query(productsCol, orderBy('createdAt', 'desc')))
        return snapshot.docs.map(docToProduct)
    },

    async getProduct(id: string) {
        const snapshot = await getDoc(doc(db, 'products', id))
        if(!snapshot.exists()) return null
        return docToProduct(snapshot)
    },

    subscribeToProducts(callback: (products: Product[]) => void): () => void {
        const q = query(productsCol, orderBy('createdAt', 'desc'))
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const products = snapshot.docs.map(docToProduct)
            callback(products)
        })
        return unsubscribe
    }
}