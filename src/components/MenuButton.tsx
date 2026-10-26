import { motion } from "framer-motion";

interface MenuButtonProps {
	isOpen?: boolean;
	onToggle: (open: boolean) => void;
}


export function MenuButton({ isOpen, onToggle }: MenuButtonProps) {
	const PATH_MAP = {
		top: {
			hamburger: "M 3 6 L 21 6",
			x: "M 18 6 L 6 18",
		},
		middle: {
			hamburger: "M 3 12 L 21 12",
			x: "M 12 12 L 12 12",
		},
		bottom: {
			hamburger: "M 3 18 L 21 18",
			x: "M 6 6 L 18 18",
		},
	};

	const transition = {
		type: "spring" as const,
		duration: 0.4,
		bounce: 0.25,
	};

	return (
		<button
			onClick={() => onToggle(!isOpen)}
			className="grid size-10 place-items-center rounded-full border border-foreground/15 bg-card transition-colors hover:border-ring sm:size-11 lg:hidden"
			aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
			aria-expanded={isOpen}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
				className="size-6"
				aria-hidden="true"
			>
				<motion.path
					initial={false}
					animate={{
						d: isOpen ? PATH_MAP.top.x : PATH_MAP.top.hamburger,
					}}
					transition={transition}
				/>

				<motion.path
					initial={false}
					animate={{
						d: isOpen ? PATH_MAP.middle.x : PATH_MAP.middle.hamburger,
						opacity: isOpen ? 0 : 1,
					}}
					transition={{
						...transition,
						duration: 0.3,
					}}
				/>

				<motion.path
					initial={false}
					animate={{
						d: isOpen ? PATH_MAP.bottom.x : PATH_MAP.bottom.hamburger,
					}}
					transition={transition}
				/>
			</svg>
		</button>
	);
}
