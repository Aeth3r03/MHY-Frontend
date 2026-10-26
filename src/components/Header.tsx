import { useState } from "react";
import { Icon } from "./Icon";
import { MenuButton } from "./MenuButton";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

export function Header() {
	const [menuOpen, setMenuOpen] = useState(false);
	const navigate = useNavigate();

	const handleTermsButton = () => {
		setMenuOpen(false)
		navigate("/terms")
	}

	const handleCategoryButton = () => {
		setMenuOpen(false)
		navigate("/categories")
	}

	return (
		<header className="sticky top-0 z-40 border-b border-border/10 bg-background backdrop-blur-xl">
			<div className="mx-auto flex h-18 max-w-7xl items-center gap-3 px-4 sm:h-20 sm:gap-5 sm:px-6 lg:px-8 justify-between">
				<button
					className="flex shrink-0 items-center gap-2.5 text-left transition-opacity hover:opacity-80"
					onClick={() => navigate("/")}
					aria-label="Ir al inicio"
				>
					<span className="grid size-10 place-items-center rounded-full bg-primary text-sm font-black text-primary-foreground transition-transform hover:rotate-3 sm:size-11">
						MHY
					</span>
					<span className="leading-tight">
						<span className="block text-sm font-black">MultiHogar</span>
						<span className="block text-xs font-semibold text-foreground/50">
							Yadita
						</span>
					</span>
				</button>

				<label className="relative hidden flex-1 md:block">
					<span className="sr-only">Buscar productos</span>
					<Icon
						name="search"
						className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-foreground/45"
					/>
					<input
						// value={}
						// onChange={}
						className="h-12 w-full rounded-full border border-border/15 bg-card pl-12 pr-5 text-sm outline-none transition focus:border-ring focus:ring-1 focus:ring-ring"
						placeholder="Buscar en MultiHogar Yadita..."
					/>
				</label>

				<nav className="ml-auto hidden items-center gap-7 text-sm font-semibold lg:flex">
					<button className="transition-colors hover:text-primary">
						Productos
					</button>

					<button className="transition-colors hover:text-primary" onClick={() => navigate("/categories")}>
						Categorías
					</button>

					<button className="transition-colors hover:text-primary">
						Nosotros
					</button>
				</nav>
				<MenuButton isOpen={menuOpen} onToggle={setMenuOpen} />
			</div>
			<div className="md:hidden px-4 pb-4">
				<label className="relative block">
					<span className="sr-only">Buscar productos</span>
					<Icon
						name="search"
						className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-foreground/45"
					/>
					<input
						className="h-12 w-full rounded-full border border-border bg-card pl-12 pr-5 text-sm outline-none transition focus:border-ring focus:ring-1 focus:ring-ring"
						placeholder="Buscar en MultiHogar Yadita..."
					/>
				</label>
			</div>

			<AnimatePresence initial={false}>
				{menuOpen && (
					<motion.div
						key="mobile-menu"
						initial={{
							height: 0,
							opacity: 0,
						}}
						animate={{
							height: "auto",
							opacity: 1,
						}}
						exit={{
							height: 0,
							opacity: 0,
						}}
						transition={{
							height: {
								duration: 0.05,
								ease: [0.22, 1, 0.36, 1],
							},
							opacity: {
								duration: 0.2,
							},
						}}
						className="overflow-hidden border-t border-border/10 bg-white shadow-xl md:hidden"
					>
						<div className="px-4 py-4">
							<div className="mx-auto flex max-w-7xl flex-wrap gap-2">
								<button
									className="rounded-full border border-bord-button bg-button  px-4 py-2 text-sm font-bold"
									onClick={handleCategoryButton}
								>
									Categorías
								</button>

								<button
									 className="rounded-full border border-bord-button bg-button px-4 py-2 text-sm font-bold"
								>
									Productos
								</button>

								<button
									className="rounded-full border border-red-500 bg-red-200 px-4 py-2 text-sm font-bold text-red-600"
									onClick={handleTermsButton}
								>
									Términos
								</button>
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</header>
	);
}
