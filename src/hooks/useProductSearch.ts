import { useCallback, useEffect, useState } from "react";
import type { Product } from "../types/product";
import { getAllProductsForSearch } from "../services/productApi";

interface UseProductSearchOptions {
	query: string;
	enabled?: boolean;
	limit?: number;
	categoryNameById: Map<string, string>
}

const SEARCH_DEBOUNCE_MS = 300;

function normalize(txt: string) {
	return txt
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.toLocaleLowerCase()
		.trim()
}

export function useProductSearch({
	query,
	enabled = true,
	limit = 4,
	categoryNameById
}: UseProductSearchOptions) {
	const [results, setResults] = useState<Product[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const search = useCallback(() => getAllProductsForSearch(),
		[],
	);

	useEffect(() => {
		const normalizedQuery = normalize(query);
		let isCurrentSearch = true;

		if (!enabled || normalizedQuery.length < 2) {
			setResults([]);
			setLoading(false);
			setError(null);
			return;
		}

		setResults([]);
		setLoading(true);
		setError(null);

		const timer = window.setTimeout(() => {
			search()
				.then((prod) => {
					if (isCurrentSearch) {
						const prods = prod.map((p) => {
							const name = normalize(p.name)
							const category = normalize(categoryNameById.get(p.categoryId) ?? "")
							const nameIndex = name.indexOf(normalizedQuery);
							let score = Number.POSITIVE_INFINITY;

							if (name === normalizedQuery) score = 0;
							else if (name.startsWith(normalizedQuery)) score = 1;
							else if (name.split(/\s+/).some(word => word.startsWith(normalizedQuery))) score = 2;
							else if (nameIndex >= 0) score = 3 + nameIndex / 100;
							else if (category.includes(normalizedQuery)) score = 5;

							return { product: p, score}
						})

						const matches = prods.filter(item => Number.isFinite(item.score)); 
						matches.sort((a, b) => a.score - b.score)

						const topProducts = matches
								.slice(0, limit)
								.map((item) => item.product)

							setResults(topProducts)
					}
				})
				.catch((searchError: unknown) => {
					if (!isCurrentSearch) return;
					setError("No se pudieron cargar las sugerencias.");
					console.error(searchError);
				})
				.finally(() => {
					if (isCurrentSearch) setLoading(false);
				});
		}, SEARCH_DEBOUNCE_MS);

		return () => {
			isCurrentSearch = false;
			window.clearTimeout(timer);
		};
	}, [query, enabled, search, categoryNameById, limit]);

	return { results, loading, error, search };
}
