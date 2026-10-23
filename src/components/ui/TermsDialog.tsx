import { useEffect, useLayoutEffect, useRef } from "react";
import { Icon } from "../Icon";

interface TermsDialogProps {
	isOpen: boolean;
	onAccept: () => void;
	onViewFull: () => void;
}

export function TermsDialog({
	isOpen,
	onAccept,
	onViewFull,
}: TermsDialogProps) {
	const hasBlockedRef = useRef(false);

	useLayoutEffect(() => {
		if (!isOpen) return;

		const html = document.documentElement;
		const body = document.body;
		const scrollY = window.scrollY;

		const originalStyles = {
			htmlOverflow: html.style.overflow,
			htmlOverscrollBehavior: html.style.overscrollBehavior,
			bodyPosition: body.style.position,
			bodyTop: body.style.top,
			bodyLeft: body.style.left,
			bodyRight: body.style.right,
			bodyOverflow: body.style.overflow,
			bodyPaddingRight: body.style.paddingRight,
		}

		const scrollBarWidth = window.innerWidth - html.clientWidth;

		if (scrollBarWidth > 0) {
			const currentPadding = Number.parseFloat(getComputedStyle(body).paddingRight) || 0;

			body.style.paddingRight = `${currentPadding + scrollBarWidth}px`;
		}

		html.style.overflow = "hidden";
		html.style.overscrollBehavior = "none";

		body.style.position = "fixed";
		body.style.top = `-${scrollY}px`;
		body.style.left = "0";
		body.style.right = "0"
		body.style.overflow = "hidden";

		return () => {
			html.style.overflow = originalStyles.htmlOverflow;
			html.style.overscrollBehavior = originalStyles.htmlOverscrollBehavior;
			body.style.position = originalStyles.bodyPosition;
			body.style.top = originalStyles.bodyTop;
			body.style.left = originalStyles.bodyLeft;
			body.style.right = originalStyles.bodyRight;
			body.style.overflow = originalStyles.bodyOverflow;
			body.style.paddingRight = originalStyles.bodyPaddingRight;

			window.scrollTo(0, scrollY)
		}

	}, [isOpen]);

	if (!isOpen) {
		return null;
	}

	return (
		<div
			className="fixed inset-0 z-50 grid place-items-center bg-foreground/65 p-4 backdrop-blur-sm"
			role="dialog"
			aria-modal="true"
			aria-labelledby="terms-dialog-title"
		>
			<div
				className="w-full max-w-md rounded-2xl bg-card p-6 shadow-xl max-h-[90vh] flex flex-col"
				onClick={(e) => e.stopPropagation()}
			>
				<div className="flex items-center gap-3 bg-primary px-4 py-3 rounded-xl text-white mb-4 shrink-0">
					<Icon name="shield" className="size-5 shrink-0" />
					<h2
						id="terms-dialog-title"
						className="text-sm font-black uppercase tracking-[0.14em]"
					>
						Términos de Servicio
					</h2>
				</div>
				<p className="text-sm lg:text-base leading-6 text-foreground/65 mb-4 shrink-0">
					Antes de explorar la tienda es importante que conozcas nuestra
					condiciones
				</p>
				<div className="space-y-3 text-sm lg:text-base mb-6 flex-1 overflow-y-auto pr-1">
					{[
						[
							"Pagos y reservas",
							"Los pedidos se confirman al acordar y verificar el método de pago.",
						],
						[
							"Entregas",
							"Tiempo y costo dependen de la ubicacion; se informan antes de confirmar",
						],
						[
							"Cambios",
							"Aplican segun estado y tipo de producto. Conserva tu comprobante.",
						],
						[
							"Garantías",
							"Cobertura varía segun fabricante; se especifica al momento de la compra.",
						],
					].map(([title, text], i) => (
						<div key={title} className="flex gap-3 rounded-xl bg-muted p-3">
							<span className="flex shrink-0 size-7 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-black">
								{i + 1}
							</span>
							<div>
								<h3 className="font-black">{title}</h3>
								<p className="mt-1 text-foreground/60">{text}</p>
							</div>
						</div>
					))}
				</div>

				<div className="flex gap-3 shrink-0 pt-4 border-t border-foreground/10">
					<button
						onClick={onViewFull}
						className="flex-1 rounded-full border border-foreground/20 bg-transparent py-3 text-sm font-black text-foreground transition hover:bg-foreground/5"
					>
						Leer más
					</button>
					<button
						onClick={onAccept}
						className="flex-1 rounded-full bg-primary px-5 py-3 text-sm font-black text-white transition hover:bg-primary/90"
					>
						Aceptar y continuar
					</button>
				</div>
			</div>
		</div>
	);
}
