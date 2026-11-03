import { useCallback, useEffect, useState } from "react";
import type { Product } from "../types/product";
import { productsApi } from "../services/productApi";

interface UseProductsOptions {
    categoryId?: string;
    pageSize?: number;
    enabled?: boolean;
}

export function usePaginatedProducts(options: UseProductsOptions = {}) {
    const [lastDoc, setLastDoc] = useState<any>(null);
	const { categoryId, pageSize = 12, enabled = true } = options;

    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [error, setError] = useState<string | null>(null);

	const loadFirstPage = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
			const { products, lastDoc, hasMore } = await productsApi.getProductsPage({
                categoryId,
				pageSize,
            });
            setProducts(products)
            setLastDoc(lastDoc)
            setHasMore(hasMore)
        } catch (e) {
            setError("Error al cargar productos.");
            console.error(e)
        } finally {
            setLoading(false);
        }
	}, [categoryId, pageSize]);

    const loadMore = useCallback(async () => {
        if (!hasMore || loadingMore) return;
        setLoadingMore(true);
        try {
            const { products: newProducts, lastDoc: newLastDoc, hasMore } = await productsApi.getProductsPage({
                lastDoc,
                categoryId,
				pageSize,
            });
            setProducts(prev => [...prev, ...newProducts]);
            setLastDoc(newLastDoc);
            setHasMore(hasMore)
        } catch (e) {
            console.error("Error al cargar mas",  e)
        } finally {
            setLoadingMore(false)
        }
	}, [hasMore, loadingMore, lastDoc, categoryId, pageSize]);

    useEffect(() => {
		if (!enabled) {
			setProducts([]);
			setLastDoc(null);
			setHasMore(false);
			setLoading(false);
			return;
		}

        setProducts([]);
        setLastDoc(null);
        setHasMore(true);
		loadFirstPage();
	}, [enabled, loadFirstPage]);

    return {
        products,
        loading,
        loadingMore,
        hasMore,
        error,
        loadMore,
		refresh: loadFirstPage,
    }

}
