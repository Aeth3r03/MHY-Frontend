import { Link, useNavigate } from "react-router-dom";
import { Icon } from "../../components/Icon";
import { placeholderFallback } from "../../lib/imagePlaceholder";
import { LoadingBody } from "../../components/ui/LoadingBody";
import { useCategories } from "../../hooks/useCategories";

export function CategoriesPage() {
	const navigate = useNavigate();
	const {categories, loading} = useCategories();


	if (loading) {
		return (
			<LoadingBody />
		);
	}

	return (
		<main>
			<section className="mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6 sm:pt-14 lg:px-8">
				<div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
					<div>
						<p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-primary">
							Compra a tu manera
						</p>
						<h1 className="max-w-3xl font-serif text-5xl font-bold leading-[1.02] tracking-[-0.04em] sm:text-6xl">
							Todo lo que buscas, <span className="italic text-primary">en un solo lugar.</span>
						</h1>
						<p className="mt-5 max-w-2xl text-base leading-7 text-foreground/65 sm:text-lg">
							Elige una categoría para ir directamente a sus productos. Luego puedes usar el buscador para encontrar algo específico.
						</p>
					</div>
				</div>

				<div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
					{categories.map((cat, index) => {

						return (
						<button
							key={cat.id}
							onClick={() => navigate(`/products?category=${encodeURIComponent(cat.name)}`)}
							className={`group relative min-h-100 overflow-hidden rounded-[1.75rem] text-left shadow-[0_12px_35px_rgba(23,34,56,0.1)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(23,34,56,0.16)] ${
								index < 2 ? "lg:col-span-3" : "lg:col-span-2"
							}`}
						>
							<img
								src={
									cat.imageUrl ||
									placeholderFallback
								}
								alt={cat.name}
								className="absolute inset-0 size-full object-cover transition duration-700 group-hover:scale-105"
							/>
							<span className="absolute inset-0 bg-linear-to-t from-foreground via-foreground/25 to-transparent" />

							<span className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-7">

								<span className="flex items-end justify-between gap-4">
									<span>
										<span className="block font-serif text-3xl font-bold">
											{cat.name}
										</span>
										<span className="mt-2 block max-w-md text-sm leading-6 text-white/75">
											{cat.description || "Explora nuestros productos"}
										</span>
									</span>
									<span className="grid size-11 shrink-0 place-items-center rounded-full bg-white text-foreground transition-transform group-hover:translate-x-1">
										<Icon name="arrow" className="size-5" />
									</span>
								</span>
							</span>
						</button>)
					})}
				</div>

				<div className="mt-8 flex flex-col items-start justify-between gap-5 rounded-3xl bg-foreground p-6 text-white sm:flex-row sm:items-center sm:p-8">
					<div>
						<p className="font-serif text-2xl font-bold sm:text-3xl">
							¿Prefieres verlo todo junto?
						</p>
						<p className="mt-1 text-sm text-white/60">
							Abre el catálogo completo y filtra cuando lo necesites.
						</p>
					</div>
					<Link
						to="/products"
						className="flex shrink-0 items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-black transition hover:bg-primary/90"
					>
						Ver todos los productos <Icon name="arrow" className="size-4" />
					</Link>
				</div>
			</section>
		</main>
	);
}
