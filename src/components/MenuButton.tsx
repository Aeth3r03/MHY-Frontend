import { Icon } from "./Icon";
import { motion } from "framer-motion";

interface MenuButtonProps {
	isOpen?: boolean
	onToggle: (open: boolean) => void
}

const transition = { duration: 0.35, ease: [0.4, 0, 0.2, 1] as const };

export function MenuButton ({isOpen, onToggle}: MenuButtonProps) {

	return (
		<button
			onClick={() => onToggle(!isOpen)}
			className="grid size-10 place-items-center rounded-full border border-foregound/15 bg-card hover:border-ring transition-colors sm:size-11 lg:hidden"
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
				className="w-6 h-6"
			>
                <motion.path
                    animate={{
                        d: isOpen ? "M12 12l0 0" : "M3 6h18",
                    }}
                    transition={transition}
                />
                <motion.path
                    animate={{
                        d: isOpen ? "M12 12l0 0" : "M3 12h18",
                        opacity: isOpen ? 0 : 1
                    }}
                    transition={transition}
                />
                <motion.path
                    animate={{
                        d: isOpen ? "M18 6l-12 12" : "M3 18h18",
                    }}
                    transition={transition}
                />
            </svg>
		</button>
	);
};
