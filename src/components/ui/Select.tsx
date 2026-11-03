import { useEffect, useRef, useState } from "react"
import { Icon } from "../Icon";

const SortOptions = [
    { value: "name-asc", label: "Nombre: A - Z"},
    { value: "name-desc", label: "Nombre: Z - A"}
]

export function Select({
    sort,
    setSort
}: {
    sort: string,
    setSort: (value: string) => void
}) {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const selectedOption = SortOptions.find((option) => option.value == sort) ?? SortOptions[0]

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                dropdownRef.current && !dropdownRef.current.contains(event.target as Node)
            ) {
                setOpen(false)
            }
        }

        function handleEscape(event:KeyboardEvent) {
            if (event.key === "Escape") {
                setOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
            document.removeEventListener("keydown", handleEscape)
        }
    }, []);

    return (
        <div ref={dropdownRef} className="relative">
            <button
                type="button"
                aria-haspopup="listbox"
                aria-expanded={open}
                onClick={() => setOpen((previous) => !previous)}
                className="flex h-11 min-w-40 cursor-pointer items-center justify-between gap-4 rounded-full border border-foreground/15 bg-white pl-4 pr-3.5 text-sm font-bold outline-none transition hover:border-foreground/30 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
            >
                <span>{selectedOption.label}</span>
                <Icon
                    name="chevron"
                    className={`size-4 shrink-0 transition-transform duration-200 ${
                        open ? "rotate-180" : ""
                    }`}
                />
            </button>

            {open && (
                <div
                    role="listbox"
                    aria-label="Ordenar productos"
                    className="absolute right-0 top-full z-50 mt-2 min-w-full overflow-hidden rounded-2xl border border-foreground/10 bg-white p-1.5 shadow-lg shadow-foreground/5"
                >
                    {SortOptions.map((option) => {
                        const isSelected = sort === option.value;

                        return (
                            <button
                                key={option.value}
                                type="button"
                                role="option"
                                aria-selected={isSelected}
                                onClick={() => {
                                    setSort(option.value);
                                    setOpen(false);
                                }}
                                className={`w-full cursor-pointer whitespace-nowrap rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${
                                    isSelected
                                        ? "bg-primary/10 font-bold text-primary"
                                        : "text-foreground hover:bg-primary/10 hover:text-primary"
                                }`}
                            >
                                {option.label}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    )
}