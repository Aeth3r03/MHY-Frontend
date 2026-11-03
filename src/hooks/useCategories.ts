import { useEffect, useMemo, useState } from "react";
import type { Category } from "../types/category";
import { categoriesApi } from "../services/categoryApi";


export function useCategories () {
    const [categories, setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            setLoading(true)
            try {
                const data = await categoriesApi.getCategories();
                setCategories(data)
            } catch (e) {
                console.error(e)
            } finally {
                setLoading(false)
            }
        }

        load();

    }, []);

    const categoryNameById = useMemo(
        () => new Map(categories.map(({ id, name }) => [id, name] as const)),
        [categories]
    )

    return {
        categoryNameById, loading, categories
    }
}