import { Icon } from "../Icon";

interface ProductFilterDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    activeCategory: string[];
    onCategoryChange: (cat: string) => void;
    onReset: () => void;
    categories: {name: string}[];
    visibleCount: number;
};

export function ProductFilterDrawer({
    isOpen,
    onClose,
    activeCategory,
    onCategoryChange,
    onReset,
    categories,
    visibleCount,
}: ProductFilterDrawerProps ) {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm lg:hidden"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-label="Filtros"
        >
            <aside
                className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-4xl bg-white p-2 pb-8 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-foreground/15" />
                <button
                    onClick={onClose}
                    className="absolute right-5 top-5 grid size-9 place-items-center rounded-full bg-white shadow-sm"
                    aria-label="Cerrar filtros"
                >
                    <Icon name="close" className="size-5" />
                </button>

                <fieldset>
                    <legend className="text-xs font-black uppercase tracking-[0.16em] text-foreground/45 mb-3">
                        Categorías
                    </legend>
                    <div className="space-y-1.5 max-h-60 overflow-y-auto">
                            {["Todos", ...(categories?.map(c => c.name) ?? [])].map((c) => (
                                <button
                                    key={c}
                                    onClick={() => {onCategoryChange(c)}}
                                    className={`w-full flex items-center justify-between rounded-xl p-3 py-2.5 text-sm font-semibold transition ${
                                        activeCategory.includes(c) ? "bg-primary text-white" : "text-foreground/70 hover:bg-foreground/5"
                                    }`}
                                >
                                    <span>{c}</span>
                                    {activeCategory.includes(c) && <Icon name="check" className="size-4" /> }
                                </button>
                            ))}
                        </div>
                </fieldset>

                <div className="mt-6 space-y-2">
                    <button 
                        onClick={onReset}
                        className="w-full flex items-center justify-center gap-2 rounded-xl border border-foreground/20 bg-transparent py-2.5 text-sm font-bold text-foreground hover:bg-foreground/5"
                    >
                        <Icon name="filter" className="size-4" /> Limpiar filtros
                    </button>
                    <button
                        onClick={onClose}
                        className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-sm font-bold text-white transition hover:bg-primary/90"
                    >
                        Ver {visibleCount} productos
                    </button>
                </div>
            </aside>
        </div>
    )
}