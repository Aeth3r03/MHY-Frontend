import { useId, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useProductSearch } from "../../hooks/useProductSearch";
import { Icon } from "../Icon";
import { AnimatePresence, motion } from "framer-motion";
import { placeholderFallback } from "../../lib/imagePlaceholder";

interface SearchAutoCompleteProps {
	value: string;
	onChange: (value: string) => void;
	onSubmit: (value: string) => void;
	placeholder?: string;
	className?: string;
	pageSize?: number
	categoryNameById: Map<string, string>
}

export function SearchAutoComplete({
	value,
	onChange,
	onSubmit,
	pageSize = 4,
	placeholder = "Buscar en MultiHogar Yadita...",
	className = "",
	categoryNameById
}: SearchAutoCompleteProps) {
	const [isOpen, setIsOpen] = useState(false);
	const inputId = useId();
	const location = useLocation();

	const isProductsPage = location.pathname.startsWith("/products");

	const { results, loading, error } = useProductSearch({
		query: value,
		enabled: !isProductsPage,
		limit: pageSize,
		categoryNameById: categoryNameById
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSubmit(value);
	};

	const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		onChange(e.target.value)
		setIsOpen(e.target.value.length > 1)
	}

	const handleBlur = () => {
		setTimeout(() => setIsOpen(false), 200);
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Escape") {
			setIsOpen(false);
		}
	};

	if (isProductsPage) {
		return (
			<form onSubmit={handleSubmit} className="relative flex-1">
				<Icon
					name="search"
					className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-foreground/45"
				/>
				<input
					value={value}
					onChange={handleOnChange}
					onBlur={handleBlur}
					onKeyDown={handleKeyDown}
					aria-label="Buscar productos"
					className={`h-12 w-full rounded-full border border-border/15 bg-card pl-12 pr-5 text-sm outline-none transition-shadow focus:border-primary focus:ring-1 focus:ring-ring ${className}`}
					placeholder={placeholder}
					autoComplete="off"
				/>
			</form>
		);
	}

	return (
		<div className="relative flex-1">
			<form onSubmit={handleSubmit} className="relative flex-1">
				<label className="sr-only" htmlFor={inputId}>Buscar productos</label>
				<Icon
					name="search"
					className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-foreground/45"
				/>
				<input
					id={inputId}
					value={value}
					onChange={handleOnChange}
					onBlur={handleBlur}
					onKeyDown={handleKeyDown}
					className={`h-12 w-full rounded-full border border-border/15 bg-card pl-12 pr-5 text-sm outline-none transition-shadow focus:border-primary focus:ring-1 focus:ring-primary ${className}`}
					placeholder={placeholder}
					autoComplete="off"
				/>
			</form>

			<AnimatePresence>
				{isOpen && (
					<motion.div
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: "auto" }}
						exit={{ opacity: 0, height: 0 }}
						className="absolute top-full left-0 right-0 mt-1 rounded-xl bg-white border border-foreground/10 shadow-xl py-2 z-50"
					>
						{results.length > 0 && (
							<>
								{results.slice(0, pageSize).map((product) => (
									<Link
										key={product.id}
										to={`/product/${product.id}`}
										className="flex items-center gap-3 px-4 py-3 hover:bg-foreground/5 transition-colors"
									>
										<img
											src={product.imageUrl || placeholderFallback}
											alt={product.name}
											className="size-12 rounded-lg object-cover"
										/>
										<div className="flex-1 min-w-0">
											<p className="font-medium text-sm truncate">
												{product.name}
											</p>
											<p className="text-xs text-foreground/50">
												{categoryNameById.get(product.categoryId) ?? "Sin categoría"}
											</p>
										</div>
									</Link>
								))}
							</>
						)}
						{loading && (
							<div className="px-4 py-3 text-center text-sm text-foreground/50">
								Buscando productos...
							</div>
						)}
						<Link
							to={`/products?search=${encodeURIComponent(value)}`}
							onClick={() => setIsOpen(false)}
							className="block px-4 py-3 text-center text-primary font-semibold hover:bg-foreground/5 rounded-b-xl transition-colors"
						>
							Ver todos los resultados para &quot;{value}&quot;
							<Icon name="arrow" className="inline size-4 ml-1" />
						</Link>
						{results.length === 0 && value.length >= 2 && !loading && (
							<div className="px-4 py-4 text-center text-foreground/50 text-sm">
								{error ?? `No se encontraron productos para “${value}”`}
							</div>
						)}
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
