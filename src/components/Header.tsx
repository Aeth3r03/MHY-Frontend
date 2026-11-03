import { useState } from "react";
import { MenuButton } from "./MenuButton";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { SearchAutoComplete } from "./ui/SearchAutocomplete";
import { useCategories } from "../hooks/useCategories";
import { logAnalyticsEvent } from "../services/firebase";

export function Header() {
	const [menuOpen, setMenuOpen] = useState(false);
	const [searchValue, setSearchValue] = useState("")
	const navigate = useNavigate();
	const { categoryNameById } = useCategories()

	const handleSearchSubmit = (value: string) => {
		if (value.trim()) navigate(`/products?search=${encodeURIComponent(value.trim())}`)
	}

	const handleTermsButton = () => {
		setMenuOpen(false)
		navigate("/terms")
	}

	const handleCategoryButton = () => {
		setMenuOpen(false)
		navigate("/categories")
	}

	const handleHomeButton =  () => {
		setMenuOpen(false)
		navigate("/")
	}

	const handleAboutButton = () => {
		setMenuOpen(false)
		navigate("/about")
	}

	const handleProductsButton = () => {
		setMenuOpen(false)
		navigate("/products")
	}

	const handleFaqButton = () => {
		setMenuOpen(false)
		navigate("/faq")
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

				<div className="relative hidden flex-1 md:block">
					<SearchAutoComplete
						value={searchValue}
						onChange={setSearchValue}
						onSubmit={handleSearchSubmit}
						categoryNameById={categoryNameById}
						className="focus:border-primary"
					/>
				</div>

				<nav className="ml-auto hidden items-center gap-7 text-sm font-semibold lg:flex">
					<button className="transition-colors hover:text-primary" onClick={() => navigate("/products")}>
						Productos
					</button>

					<button className="transition-colors hover:text-primary" onClick={() => navigate("/categories")}>
						Categorías
					</button>

					<button className="transition-colors hover:text-primary" onClick={() => {navigate("/about"), logAnalyticsEvent("about_us_click")}}>
						Nosotros
					</button>

					<button className="transition-colors hover:text-primary" onClick={() => {navigate("/faq"), logAnalyticsEvent("faq_click")}}>
						Preguntas
					</button>
				</nav>
				<MenuButton isOpen={menuOpen} onToggle={setMenuOpen} />
			</div>
			<div className="md:hidden px-4 pb-4">
				<div className="relative block">
					<SearchAutoComplete
						value={searchValue}
						onChange={setSearchValue}
						onSubmit={handleSearchSubmit}
						placeholder="Buscar en MultiHogar Yadita..."
						categoryNameById={categoryNameById}
					/>
				</div>
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
									className="rounded-full border border-bord-button bg-button px-4 py-2 text-sm font-bold"
									onClick={handleHomeButton}	
								>
									Inicio
								</button>
								<button
									className="rounded-full border border-bord-button bg-button  px-4 py-2 text-sm font-bold"
									onClick={handleCategoryButton}
								>
									Categorías
								</button>

								<button
									className="rounded-full border border-bord-button bg-button px-4 py-2 text-sm font-bold"
									onClick={handleProductsButton}
								>
									Productos
								</button>

								<button
									className="rounded-full border border-bord-button bg-button px-4 py-2 text-sm font-bold"
									onClick={handleAboutButton}
								>
									Nosotros
								</button>

								<button
									className="rounded-full border border-bord-button bg-button px-4 py-2 text-sm font-bold"
									onClick={handleFaqButton}
								>
									Preguntas
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
