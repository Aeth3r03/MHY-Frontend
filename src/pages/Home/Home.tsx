import { useEffect, useMemo, useState } from "react";
import { Icon } from "../../components/Icon";
import type { Category } from "../../types/category";
import type { Product } from "../../types/product";
import { categoriesApi } from "../../services/categoryApi";
import { productsApi } from "../../services/productApi";
import { ProductCard } from "../../components/ui/ProductCard";
import { TermsDialog } from "../../components/ui/TermsDialog";

export function Home() {
	const [categories, setCategories] = useState<Category[]>([]);
	const [products, setProducts] = useState<Product[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [activeCategory, setActiveCategory] = useState<string>("Todo");
	const [showTerms, setShowTerms] = useState(true)

	useEffect(() => {
		async function loadData() {
			try {
				setLoading(true);
				const [cats, prods] = await Promise.all([
					categoriesApi.getCategories(),
					productsApi.getProducts(),
				]);
				const categoryMap = new Map(cats.map((c) => [c.id, c.name]));
				const productsWithCategory = prods.map((p) => ({
					...p,
					categoryName: categoryMap.get(p.categoryId) || "Sin categoría",
				}));
				setCategories(cats);
				setProducts(productsWithCategory);
			} catch (e) {
				setError("No se pudieron cargar los datos");
				console.error(e);
			} finally {
				setLoading(false);
			}
		}
		loadData();
	}, []);

	useEffect(() => {
		const accepted = localStorage.getItem("termsAccepted");
		if (!accepted) {
			console.log("Mostrando términos")
			setShowTerms(true)
		}
	}, [])

	const categoryNames = [
		"Todo",
		...new Set(products.map((p) => p.categoryName).filter((c): c is string => c !== undefined)),
	];

	const handleAccept = () => {
		localStorage.setItem("termsAccepted", "true");
		setShowTerms(false)
	};

	const handleViewFull = () => {
		handleAccept();
		
	}

	const visibleProducts = useMemo(() => {
		if (activeCategory === "Todo") {
			const grouped = products.reduce(
				(acc, p) => {
					const cat = p.categoryName || "Sin categoría";
					if (!acc[cat]) acc[cat] = [];
					if (acc[cat].length < 2) {
						acc[cat].push(p);
					}
					return acc;
				},
				{} as Record<string, Product[]>,
			);
			return Object.values(grouped).flat();
		}
		return products
			.filter((p) => p.categoryName === activeCategory)
			.slice(0, 5);
	}, [products, activeCategory]);

	return (
		<main>
			{loading ? (
				<div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-6">
					<div className="size-12 animate-spin rounded-full border-4 border-accent border-t-accent/55" />
				</div>
			) : (
				<div>
					<section className="mx-auto max-w-7xl px-4 pb-4 pt-6 sm:px-6 lg:px-8">
						<div className="grid min-h-145 overflow-hidden rounded-4xl bg-accent lg:grid-cols-[1.04fr_.96fr]">
							<div className="relative z-12 flex flex-col justify-center px-6 py-14 sm:px-12 lg:px-16">
								<span className="mb-7 w-fit rounded-full border border-foreground/20 bg-white/35 px-4 py-2 text-xs font-black uppercase tracking-[0.18em]">
									Todo para tu hogar
								</span>
								<h1 className="max-w-2xl font-serif text-5xl font-bold leading-[0.98] tracking-[-0.04em] sm:text-6xl lg:text-7xl">
									Lo que necesitas,{" "}
									<span className="italic text-destructive">
										todo en un solo lugar
									</span>
								</h1>
								<p className="mt-7 max-w-lg text-base leading-7 text-foreground/75 sm:text-lg">
									Productos útiles, precios justos, de confíanza y buena
									atención
								</p>
								<div className="mt-9 flex flex-wrap gap-3">
									<button className="group flex items-center gap-3 rounded-full bg-foreground px-6 py-3.5 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-foreground/90">
										Ver productos
										<Icon
											name="arrow"
											className="size-4 transition-transform group-hover:translate-x-1"
										/>
									</button>
									<button className="rounded-full border border-foreground/25 bg-white/80 px-6 py-3.5 text-sm font-black transition hover:-translate-y-0.5 hover:bg-white">
										Cómo comprar
									</button>
								</div>
							</div>
							<div className="relative min-h-90 overflow-hidden lg:min-h-full">
								<img
									src="https://api.getpronto.io/v1/file/user-cmurjzh7y147199td9r49hxfog/hero-home-public-frontend-1792708791569-dae749cad54e05fa.jpg"
									alt="Cocina moderna equipada"
									className="absolute inset-0 size-full object-cover"
								/>
								<div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-foreground/35 lg:bg-linear-to-r lg:from-accent lg:via-transparent lg:to-transparent" />
								<div className="hidden sm:block absolute bottom-6 left-6 rounded-2xl bg-white/95 p-4 shadow-xl backdrop-blur sm:bottom-8 sm:left-8 ">
									<div className="flex items-center gap-3">
										<span className="grid size-11 place-items-center rounded-xl bg-green-500/15 text-green-500">
											<Icon name="shield" />
										</span>
										<div>
											<p className="text-xs font-semibold text-gray-500">
												Compra tranquila
											</p>
											<p className="font-black">Calidad verificada</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					</section>
					<section className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
						<div className="grid overflow-hidden rounded-2xl border border-primary/25 bg-accent/10 md:grid-cols-[auto_1fr_auto] md:items-center">
							<div className="grid size-16 place-items-center bg-primary text-white md:h-full md:w-20">
								<Icon name="shield" className="size-7" />
							</div>
							<div className="px-5 py-4">
								<p className="font-black">
									Antes de comprar, lee nuestros Términos de Servicio
								</p>
								<p className="mt-1 text-sm leading-6 text-foreground/70">
									Conoce claramente las condiciones de pago, entrega, cambios y
									garantías para evitar problemas o confusiones.
								</p>
							</div>
							<button className="group mx-5 mb-5 flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-black text-white transition hover:bg-primary/90 md:mb-0 md:mr-5 md:whitespace-nowrap">
								Leer los Términos de Servicio
								<Icon
									name="arrow"
									className="size-4 transition-transform group-hover:translate-x-1"
								/>
							</button>
						</div>
					</section>
					<div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
						<div className="flex gap-2 overflow-x-auto pb-3 -mx-4 px-4">
							{categoryNames.map((cat) => (
								<button
									key={cat}
									onClick={() => setActiveCategory(cat)}
									className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-bold transition ${activeCategory === cat ? "border-foreground bg-foreground text-white" : "border-foreground/10 bg-card hover:border-foreground/35"}`}
								>
									{cat}
								</button>
							))}
						</div>
					</div>
					<section
						id="productos"
						className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8"
					>
						<div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end mb-6">
							<div>
								<p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-destructive">
									Explora nuestra tienda
								</p>
								<h2 className="font-serif text-4xl font-bold tracking-tight sm:text-5xl">
									Encuéntralo aquí
								</h2>
							</div>
						</div>

						{visibleProducts.length > 0 ? (
							<div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
								{visibleProducts.map((product) => (
									<ProductCard key={product.id} product={product} />
								))}
							</div>
						) : (
							<div className="rounded-3xl border border-dashed border-foreground/20 bg-card py-16 text-center">
								<p className="font-serif text-2xl font-bold">
									No hay productos en esta categoría
								</p>
							</div>
						)}
					</section>
					<TermsDialog
							isOpen={showTerms}
							onAccept={handleAccept}
							onViewFull={handleViewFull}
						/>
				</div>
			)}
		</main>
	);
}
