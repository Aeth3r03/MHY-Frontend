import {
	collection,
	doc,
	getDoc,
	getDocs,
	limit,
	onSnapshot,
	orderBy,
	query,
	startAfter,
	where,
	type DocumentData,
	type DocumentSnapshot,
	type QueryDocumentSnapshot,
} from "firebase/firestore";
import type { Product } from "../types/product";
import { db } from "./firebase";

const productsCol = collection(db, "products");
const DEFAULT_PAGE_SIZE = 12;
const SEARCH_CACHE_TTL_MS = 5 * 60 * 1000;

let productsCache: Product[] | null = null;
let productsCacheExpiresAt = 0;
let productsCacheRequest: Promise<Product[]> | null = null;

function docToProduct(docSnap: DocumentSnapshot<DocumentData>): Product {
	const data = docSnap.data();
	return {
		id: docSnap.id,
		name: data?.name,
		description: data?.description,
		price: data?.price,
		currency: data?.currency,
		categoryId: data?.categoryId,
		available: data?.available,
		imageUrl: data?.imageUrl,
		imageId: data?.imageId,
		createdAt: data?.createdAt?.toDate?.(),
		updatedAt: data?.updatedAt?.toDate?.(),
	};
}

export function normalize(value: string): string {
	return value
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.toLocaleLowerCase()
		.trim();
}

export async function getAllProductsForSearch(): Promise<Product[]> {
	if (productsCache && Date.now() < productsCacheExpiresAt) return productsCache;
	if (productsCacheRequest) return productsCacheRequest;

	productsCacheRequest = getDocs(query(productsCol, orderBy("name")))
		.then(async (snapshot) => {
			const products = snapshot.docs.map(docToProduct);
			productsCache = products;
			productsCacheExpiresAt = Date.now() + SEARCH_CACHE_TTL_MS;
			return productsCache;
		})
		.catch((error: unknown) => {
			productsCacheRequest = null;
			throw error;
		})
		.finally(() => {
			productsCacheRequest = null;
		});

	return productsCacheRequest;
}

export const productsApi = {
	async getProductsPage(options: {
		lastDoc?: QueryDocumentSnapshot<DocumentData> | null;
		categoryId?: string;
		pageSize?: number;
	} = {}): Promise<{
		products: Product[];
		lastDoc: QueryDocumentSnapshot<DocumentData> | null;
		hasMore: boolean;
	}> {
		const { lastDoc, categoryId, pageSize = DEFAULT_PAGE_SIZE } = options;
		const pageLimit = Math.max(1, Math.floor(pageSize));
		const constraints = [];

		if (categoryId) {
			constraints.push(where("categoryId", "==", categoryId));
		}

		const productsQuery = query(
			productsCol,
			orderBy("name"),
			...constraints,
			...(lastDoc ? [startAfter(lastDoc)] : []),
			limit(pageLimit + 1),
		);
		const snapshot = await getDocs(productsQuery);
		const hasMore = snapshot.docs.length > pageLimit;
		const pageDocs = snapshot.docs.slice(0, pageLimit);

		return {
			products: pageDocs.map(docToProduct),
			lastDoc: pageDocs.at(-1) ?? null,
			hasMore,
		};
	},

	async searchProducts(searchQuery: string, resultLimit?: number): Promise<Product[]> {
		const normalizedQuery = normalize(searchQuery);
		if (normalizedQuery.length < 2) return [];

		const allProducts = await getAllProductsForSearch();
		return allProducts
			.map((product) => {
				const name = normalize(product.name);
				const nameIndex = name.indexOf(normalizedQuery);
				let score = Number.POSITIVE_INFINITY;

				if (name === normalizedQuery) score = 0;
				else if (name.startsWith(normalizedQuery)) score = 1;
				else if (name.split(/\s+/).some((word) => word.startsWith(normalizedQuery))) score = 2;
				else if (nameIndex >= 0) score = 3 + nameIndex / 100;

				return { product, score };
			})
			.filter(({ score }) => Number.isFinite(score))
			.sort((a, b) => a.score - b.score || a.product.name.localeCompare(b.product.name))
			.slice(0, resultLimit === undefined ? undefined : Math.max(0, resultLimit))
			.map(({ product }) => product);
	},

	async getProduct(id: string): Promise<Product | null> {
		const snapshot = await getDoc(doc(db, "products", id));
		if (!snapshot.exists()) return null;
		return docToProduct(snapshot)
	},

	subscribeToProducts(callback: (products: Product[]) => void): () => void {
		const productsQuery = query(productsCol, orderBy("createdAt", "desc"));
		return onSnapshot(productsQuery, (snapshot) => {
			const products = snapshot.docs.map(docToProduct)
			productsCache = products;
			productsCacheExpiresAt = Date.now() + SEARCH_CACHE_TTL_MS;
			callback(products)
		});
	},
};
