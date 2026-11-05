import { useEffect, useState } from "react";
import type { Product } from "../../types/product";
import { productsApi } from "../../services/productApi";
import { useNavigate, useParams } from "react-router-dom";
import { LoadingBody } from "../../components/ui/LoadingBody";
import { placeholderFallback } from "../../lib/imagePlaceholder";
import { Icon } from "../../components/Icon";
import { formatPrice } from "../../lib/currency";
import { whatsappUrl } from "../../utils/whatsapp";
import { ImageModal } from "../../components/ui/ImageModal";
import { useCategories } from "../../hooks/useCategories";
import { logAnalyticsEvent } from "../../services/firebase";

export function ProductDetail() {
	const [loading, setLoading] = useState(true);
	const [product, setProduct] = useState<Product | null>();
	const { id } = useParams<{ id: string }>();
	const [isImageModalOpen, setIsImageModalOpen] = useState(false);
	const { categoryNameById } = useCategories();
	const navigate = useNavigate();

	useEffect(() => {
		async function load() {
			if (!id) return;
			try {
				const prod = await productsApi.getProduct(id);
				setProduct(prod);
			} catch (e) {
				console.error(e);
			} finally {
				setLoading(false);
			}
		}

		load();
	}, [id]);

	if (loading) {
		return <LoadingBody />;
	}

	if (!product) {
		return (
			<main className="mx-auto max-w-7xl px-4 min-h-dvh text-center justify-center">
				<p className="mt-8 font-serif text-2xl font-bold text-foreground">
					Producto no encontrado
				</p>
				<button
					onClick={() => window.history.back()}
					className="mt-8 text-primary hover:underline"
				>
					Volver
				</button>
			</main>
		);
	}

	const displayPrice = product
		? formatPrice(product.price ?? 0, product.currency ?? "NIO")
		: "-";
	const whatsappMessage = encodeURIComponent(
		`Hola, me interesa ${product.name} (${formatPrice(product.price, product.currency)}). Quiero mas info.\n\n(URL de la imagen: ${product.imageUrl})`,
	);
	const wspUrl = `${whatsappUrl}${whatsappMessage}`;
	const categoryName =
		categoryNameById.get(product.categoryId) ?? "Sin categoría";

	return (
		<main>
			<section className="mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6 sm:pt-9 lg:px-8">
				<div className="mt-6 grid gap-8 lg:grid-cols-[1.08fr_.92fr] lg:gap-14">
					<div>
						<button
							className="group mb-4 flex items-center gap-1 rounded-full bg-primary text-white px-5 py-2 hover:bg-primary/85"
							onClick={() => navigate(-1)}
						>
							<Icon
								name="arrow"
								className="size-4 rotate-180 transition-transform group-hover:-translate-x-1"
							/>
							Volver
						</button>
						<div className="overflow-hidden rounded-4xl bg-[#eeeae0]">
							<img
								src={product.imageUrl || placeholderFallback}
								alt={product.name}
								className="aspect-square size-full object-cover cursor-zoom-in transition-transform duration-200 hover:scale-[1.02]"
								onClick={() => setIsImageModalOpen(true)}
							/>
						</div>

						<div>
							<p className="mt-4 font-bold text-sm text-center ">
								Puedes hacer click en la imagen para verla mas de cerca
							</p>
						</div>

						<div className="mt-4 flex justify-center gap-2">
							<div className="rounded-2xl bg-white p-5 text-center shadow-[0_6px_20px_rgba(23,34,56,0.05)]">
								<Icon name="shield" className="size-5 mx-auto text-[#d83d2d]" />
								<p className="mt-2 text-[11px] font-bold leading-4 text-[#172238] sm:text-xs">
									Calidad verificada
								</p>
							</div>
							<div className="rounded-2xl bg-white p-5 text-center shadow-[0_6px_20px_rgba(23,34,56,0.05)]">
								<Icon name="truck" className="size-5 mx-auto text-[#d83d2d]" />
								<p className="mt-2 text-[11px] font-bold leading-4 text-[#172238] sm:text-xs">
									Envíos mediante CargoTrans
								</p>
							</div>
						</div>
					</div>

					<div className="lg:py-4">
						<p className="text-xl font-black uppercase tracking-[0.2em] text-primary">
							{categoryName}
						</p>
						<h1 className="mt-3 font-serif text-4xl font-bold leading-tight tracking-[-0.03em] sm:text-5xl lg:text-6xl">
							{product.name}
						</h1>
						<div className="mt-15 flex items-center gap-5 border-b border-foreground/10 pb-7">
							<span
								className={`rounded-full ${product.available ? "bg-green-100" : "bg-red-100"} px-5 py-3 text-sm font-black ${product?.available ? "text-green-500" : "text-red-500"}`}
							>
								{product?.available ? "Disponible" : "No disponible"}
							</span>
							<div className="mt-1 flex items-end gap-3">
								<p className="text-3xl font-black sm:text-4xl">
									{displayPrice}
								</p>
							</div>
						</div>

						<p className="mt-7 text-base leading-7 text-foreground/65">
							{product.description}
						</p>

						<a
							href={wspUrl}
							onClick={() =>
								logAnalyticsEvent("contact_click", {
									product_id: product.id,
									product_name: product.name,
								})
							}
							className="group flex h-14 w-full mt-5 flex-1 items-center justify-center gap-3 rounded-full bg-primary px-6 text-sm font-black text-white transition hover:bg-primary/90"
						>
							<Icon
								name="telephone"
								className="size-5 transition-transform duration-200 group-hover:animate-ring"
							/>
							Contactar
						</a>

						<div className="mt-5 flex items-start gap-3 rounded-2xl border border-primary/60 bg-primary/15 p-4">
							<Icon
								name="headset"
								className="mt-0.5 size-5 shrink-0 text-primary"
							/>
							<div>
								<p className="text-sm font-black">¿Tienes alguna duda?</p>
								<p className="mt-1 text-sm leading-5">
									Confirma disponibilidad, colores o detalles dándole click al
									boton
								</p>
							</div>
						</div>
					</div>
				</div>

				<div className="mt-14 flex flex-col items-start justify-between gap-5 border-t border-foreground/10 pt-8 sm:flex-row sm:items-center">
					<div>
						<p className="font-serif text-2xl font-bold">
							Sigue explorando {categoryName}
						</p>
						<p className="mt-1 text-sm text-foreground/55">
							Encuentra mas opciones que te pueden interesar.
						</p>
					</div>
					<button
						className="flex items-center gap-2 rounded-full bg-foreground px-5 py-3 text-sm font-black text-white transition hover:bg-footer"
						onClick={() =>
							navigate(`/products?category=${encodeURIComponent(categoryName)}`)
						}
					>
						Ver categoría <Icon name="arrow" className="size-4" />
					</button>
				</div>
			</section>
			<ImageModal
				isOpen={isImageModalOpen}
				onClose={() => setIsImageModalOpen(false)}
				imageUrl={product.imageUrl || placeholderFallback}
				alt={product.name}
			/>
		</main>
	);
}
