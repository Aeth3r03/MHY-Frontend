import { formatPrice } from "../../lib/currency";
import type { Product } from "../../types/product";
import { Icon } from "../Icon";

interface ProductCardProps {
    product: Product
}
export function ProductCard({ product }: ProductCardProps) {
    const whatsappMessage = encodeURIComponent(
        `Hola, me interesa: ${product.name} (${formatPrice(product.price, product.currency)}). Quiero mas info. (Url de la imagen: ${product.imageUrl})`
    );
    const whatsappUrl = `https://wa.me/50582708806?text=${whatsappMessage}`;

    return (
        <article className="group overflow-hidden rounded-2xl bg-card shadow-[0_8px_30px_rgba(23,34,56,0.07)]">
            <div className="relative aspect-square overflow-hidden bg-muted">
                <img
                    src={product.imageUrl || ""}
                    alt={product.name}
                    className="size-full object-cover transition duration-500 group-hover:scale-105"
                />
            </div>
            <div className="p-3.5 sm:p-5">
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-foreground/45">
                    {product.categoryName || "Sin categoría"}
                </p>
                <h3 className="mt-2 min-h-10 text-sm font-bold leading-5 sm:text-base">
                    {product.name}
                </h3>
                <div className="mt-4 flex items-end justify-between gap-2">
                    <div>
                        <p className="text-base font-black sm:text-lg">
                            {formatPrice(product.price, product.currency)}
                        </p>
                    </div>
                    <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 shrink-0 rounded-full bg-primary px-5 py-2.5 text-sm font-black text-white transition hover:bg-primary/90 hover:scale-[1.02]"
                        aria-label={`Contactar por ${product.name}`}
                    >
                        <span className="hidden sm:inline">Contactar</span>
                        <Icon name="telephone" className="size-4" />
                    </a>
                </div>
            </div>
        </article>
    )
}