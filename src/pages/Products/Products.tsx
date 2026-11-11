import { useEffect, useMemo, useState } from "react";
import { LoadingBody } from "../../components/ui/LoadingBody";
import { Icon } from "../../components/Icon";
import { Select } from "../../components/ui/Select";
import { ProductCard } from "../../components/ui/ProductCard";
import { ProductFilterDrawer } from "../../components/ui/ProductFilterDrawer";
import { usePaginatedProducts } from "../../hooks/usePaginatedProducts";
import { useSearchParams } from "react-router-dom";
import { productsApi } from "../../services/productApi";
import { useCategories } from "../../hooks/useCategories";

export function Products() {

    const [searchParams, setSearchParams] = useSearchParams();
    const categoryParam = searchParams.get("category");
    const [activeCategories, setActiveCategories] = useState<string[]>(() => categoryParam ? [categoryParam] : ["Todos"]);
    const [filterOpen, setFilterOpen] = useState(false);
    const [sort, setSort] = useState<string>("name-asc")
    const query = searchParams.get("search") ?? "";
    const [searchResults, setSearchResults] = useState<Awaited<ReturnType<typeof productsApi.searchProducts>>>([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const { categoryNameById, categories } = useCategories()

    const {
        products,
        loading,
        loadingMore,
        hasMore,
        loadMore,
    } = usePaginatedProducts({ enabled: !query.trim() })

    useEffect(() => {
        const searchTerm = query.trim();
        if (!searchTerm) {
            setSearchResults([]);
            setSearchLoading(false);
            return;
        }

        let isCurrentSearch = true;
		setSearchResults([]);
        setSearchLoading(true);
        productsApi.searchProducts(searchTerm)
            .then((results) => {
                if (isCurrentSearch) setSearchResults(results);
            })
            .catch((error: unknown) => console.error("Error al buscar productos", error))
            .finally(() => {
                if (isCurrentSearch) setSearchLoading(false);
            });

        return () => {
            isCurrentSearch = false;
        };
    }, [query]);

    const visibleProducts = useMemo(() => {
        const sourceProducts = query.trim() ? searchResults : products;
        let filtered = sourceProducts;

        if (!activeCategories.includes("Todos")) {
            filtered = filtered.filter(p => activeCategories.includes(categoryNameById.get(p.categoryId) ?? ""));
        }

        if (!query.trim()) {
            filtered = [...filtered].sort((a, b) => {
                switch (sort) {
                    case "name-asc": return a.name.localeCompare(b.name);
                    case "name-desc": return b.name.localeCompare(a.name);
                    default: return 0;
                }
            });
        }

        return filtered;
    }, [products, searchResults, activeCategories, sort, query]);

    const displayedProducts = query.trim() ? searchResults : products;
    const isLoading = query.trim() ? searchLoading : loading;


    const resetFilters = () => {
        setActiveCategories(["Todos"]);
        setSearchParams({});
        setSort("name-asc");
    };

    const handleCategoryChange = (cat: string) => {
        setActiveCategories(prev => {
            if (cat === "Todos") return ["Todos"];
            const withoutTodos = prev.filter(c => c !== "Todos")

            const next = withoutTodos.includes(cat) ? withoutTodos.filter(c => c !== cat) : [...withoutTodos, cat]
             return next.length > 0 ? next :  ["Todos"]
        })
    }

    if (isLoading) {
        return (
            <LoadingBody />
        )
    }

    return (
        <main>
            <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 sm:pt-11 lg:px-8">
                <div>
                    <div className="grid gap-2 text-xs font-black uppercase tracking-[0.18em] text-primary">
                        <span className="h-px w-8 bg-red" /> Nuestro catálogo
                    </div>
                    <h1 className="mt-5 max-w-3xl font-serif text-5xl font-bold leading-[0.98] tracking-[-0.04em] sm:text-6xl lg:text-7xl">
                        Encuentra justo lo que <span className="italic text-primary">buscas.</span>
                    </h1>
                    <p className="mt-5 max-w-xl text-sm leadiing-6 text-foreground/60 sm:text-base sm:leading-7">
                        Explora productos útiles para tu hogar y tu día a día. Filtra, compra y elige con tranquilidad
                    </p>
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
                <div className="border-t border-foreground/10 pt-6">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <p className="text-sm text-foreground/55">
                            Mostrando <strong className="text-foreground">{visibleProducts.length}</strong> de {displayedProducts.length} productos
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setFilterOpen(true)}
                                className="flex h-11 items-center gap-2 rounded-full border border-foreground/15 bg-white px-4 text-sm font-bold lg:hidden"
                            >
                                <Icon name="filter" className="size-4" /> Filtrar
                            </button>

                            <label className="relative">
                                <span className="sr-only">Ordenar productos</span>
                                <Select sort={sort} setSort={setSort} />
                            </label>
                        </div>
                    </div>

                    <div className="mt-7 grid gap-8 lg:grid-cols-[18rem_1fr] xl:grid-cols-[19rem_1fr}">
                        <aside className="col-span-1 hidden self-start rounded-3xl bg-white p-5 shadow-soft lg:sticky lg:top-28 lg:block">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-black">Filtros</h3>
                            </div>

                            <fieldset>
                                <legend className="text-xs font-black uppercase tracking-[0.16em] text-foreground/45 mb-3 mt-1">
                                    Categorías
                                </legend>
                                <div className="space-y-1.5">
                                    {["Todos", ...(categories?.map(c => c.name) ?? [])].map((cat) => (
                                        <button
                                            key={cat}
                                            onClick={ () => setActiveCategories([cat])}
                                            className={`w-full flex items-center justify-between rounded-xl px-3 py-2 text-sm font-semibold transition ${
                                                activeCategories.includes(cat)
                                                ? "bg-primary text-white"
                                                : "text-foreground/70 hover:bg-foreground/5"
                                            }`}
                                        >
                                            <span>{cat}</span>
                                            {activeCategories.includes(cat) && (
                                                <Icon name="check" className="size-4" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </fieldset>

                            <button
                                onClick={resetFilters}
                                className="mt-4 w-full flex items-center justify-center gap-2 rounded-xl border border-foreground/20 bg-transparent py-2.5 text-sm font-bold text-foreground hover:bg-foreground/5"
                            >
                                <Icon name="filterX" className="size-4" /> Limpiar filtros
                            </button>
                        </aside>

                        <div>
                            
                            {visibleProducts.length > 0 ? (
                                <>

                                    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
                                        {visibleProducts.map((p) => (
                                            <ProductCard key={p.id} product={p} categoryName={categoryNameById.get(p.categoryId)} />
                                        ))}

                                        {isLoading && (
                                        <LoadingBody />
                                    )}
                                    </div>

                                    {!query.trim() && hasMore && (
                                        <div className="mt-8 text-center">
                                            <button 
                                                onClick={loadMore}
                                                disabled={loadingMore}
                                                className="w-full max-w-md mx-auto py-3 rounded-xl bg-primary text-white font-bold transition hover:bg-primary/90 disabled:opacity-50"
                                            >
                                            {loadingMore ? (
                                                <span className="flex items-center justify-center gap-2">
                                                    <LoadingBody />
                                                    Cargando mas...
                                                </span>
                                            ) : (
                                                `Ver más productos (${products.length}+)`
                                            )}
                                            </button>
                                        </div>
                                    )}
                                </>
                            ) : (
                            <div className="grid min-h-120 place-items-center rounded-3xl border border-dashed border-foreground/20 bg-white p-8 text-center">
                                <div>
                                    <span className="mx-auto grid size-14 place-items-center rounded-full bg-primary/10 text-primary">
                                        <Icon name="search" className="size-7" />
                                    </span>
                                    <h2 className="mt-4 font-serif text-2xl font-bold">No encontramos coincidencias en {activeCategories}</h2>
                                    <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-foreground/55">
                                        Prueba otra categoría, cambia tu búsqueda o limpia los filtros.
                                    </p>
                                    <button onClick={resetFilters} className="mt-4 rounded-full bg-primary px-5 py-2.5 text-sm font-black text-white">
                                        Limpiar filtros
                                    </button>
                                </div>
                            </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
            <ProductFilterDrawer
                isOpen={filterOpen}
                onClose={() => setFilterOpen(false)}
                activeCategory={activeCategories}
                onCategoryChange={handleCategoryChange}
                onReset={resetFilters}
                categories={categories}
                visibleCount={visibleProducts.length}
            />
        </main>
    )
}
