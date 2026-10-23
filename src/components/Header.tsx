import { useState } from "react";
import { Icon } from "./Icon";
import { MenuButton } from "./MenuButton";

export function Header() {
    const [menuOpen, setMenuOpen] = useState(false)

	return (
		<header className="sticky top-0 z-40 border-b border-border/10 bg-background backdrop-blur-xl">
			<div className="mx-auto flex h-18 max-w-7xl items-center gap-3 px-4 sm:h-20 sm:gap-5 sm:px-6 lg:px-8 justify-between">
				<button
					className="flex shrink-0 items-center gap-2.5 text-left transition-opacity hover:opacity-80"
					//onClick={}
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
					<Icon name="search" className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-foreground/45"/>
					<input
						// value={}
						// onChange={}
						className="h-12 w-full rounded-full border border-border/15 bg-card pl-12 pr-5 text-sm outline-none transition focus:border-ring focus:ring-1 focus:ring-ring"
						placeholder="Buscar en MultiHogar Yadita..."
					/>
				</label>

				<nav className="ml-auto hidden items-center gap-7 text-sm font-semibold lg:flex">
					<button	className="transition-colors hover:text-primary">
						Productos
					</button>

					<button	className="transition-colors hover:text-primary">
						Categorías
					</button>

					<button	className="transition-colors hover:text-primary">
						Nosotros
					</button>
				</nav>
				<MenuButton isOpen={menuOpen} onToggle={setMenuOpen} />
			</div>
			<div className="md:hidden px-4 pb-4">
				<label className="relative block">
					<span className="sr-only">Buscar productos</span>
					<Icon name="search" className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-foreground/45" />
					<input
						className="h-12 w-full rounded-full border border-border bg-card pl-12 pr-5 text-sm outline-none transition focus:border-ring focus:ring-1 focus:ring-ring"
						placeholder="Buscar en MultiHogar Yadita..."
					/>
				</label>
			</div>
			{menuOpen && (
				<div className="border-t border-border/10 bg-white px-4 py-4 shadow-xl md:hidden">
					<div className="mx-auto flex max-w-7xl flex-wrap gap-2">
						{["Categorías", "Productos"].map((cat) => (
							<button
							key={cat}
							className="rounded-full px-4 py-2 text-sm font-bold bg-gray-200/85"
						>
							{cat}
						</button>
						))}
						<button className="rounded-full px-4 py-2 text-sm font-bold text-red-600 border border-red-500 bg-red-200">
							Términos
						</button>
						
					</div>
				</div>
			)}
		</header>
	);
}
