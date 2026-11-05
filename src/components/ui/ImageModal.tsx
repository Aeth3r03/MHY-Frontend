import { useEffect, useRef, useState } from "react";
import { Icon } from "../Icon";

interface ImageModalProps {
	isOpen: boolean;
	onClose: () => void;
	imageUrl: string;
	alt: string;
}

export function ImageModal({
	isOpen,
	onClose,
	imageUrl,
	alt,
}: ImageModalProps) {
	const [zoomLevel, setZoomLevel] = useState(1);
	const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
	const [isDragging, setIsDragging] = useState(false);
	const dragStart = useRef({ x: 0, y: 0 });

	useEffect(() => {
		if (!isOpen) return;
		const doc = document.body.style;
		const originalOverflow = doc.overflow;
		doc.overflow = "hidden";

		return () => {
			doc.overflow = originalOverflow;
		};
	}, [isOpen]);

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
		};

		if (isOpen) {
			window.addEventListener("keydown", handleKeyDown);
		}
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [isOpen, onClose]);

	useEffect(() => {
		setZoomLevel(1);
		setImagePosition({ x: 0, y: 0 });
	}, [imageUrl]);

    useEffect(() => {
        if (!isOpen) {
            setZoomLevel(1);
            setImagePosition({ x:0, y:0})
        }
    }, [isOpen])

	const handleWheel = (e: React.WheelEvent) => {
		e.preventDefault();
		setZoomLevel((prev) => {
			const delta = e.deltaY > 0 ? -0.15 : 0.15;
			return Math.min(Math.max(prev + delta, 1), 4);
		});
	};

	const handleMouseDown = (e: React.MouseEvent) => {
		if (zoomLevel <= 1) return; // Solo arrastrar si hay zoom
		setIsDragging(true);
		dragStart.current = {
			x: e.clientX - imagePosition.x,
			y: e.clientY - imagePosition.y,
		};
	};

	const handleMouseMove = (e: React.MouseEvent) => {
		if (!isDragging || zoomLevel <= 1) return;
		setImagePosition({
			x: e.clientX - dragStart.current.x,
			y: e.clientY - dragStart.current.y,
		});
	};

	const handleMouseUp = () => setIsDragging(false);

	const handleTouchStart = (e: React.TouchEvent) => {
		if (zoomLevel <= 1) return;
		setIsDragging(true);
		dragStart.current = {
			x: e.touches[0].clientX - imagePosition.x,
			y: e.touches[0].clientY - imagePosition.y,
		};
	};

	const handleTouchMove = (e: React.TouchEvent) => {
		if (!isDragging || zoomLevel <= 1) return;
		e.preventDefault();
		setImagePosition({
			x: e.touches[0].clientX - dragStart.current.x,
			y: e.touches[0].clientY - dragStart.current.y,
		});
	};

	const handleTouchEnd = () => setIsDragging(false);

	if (!isOpen) return;

	return (
		<main>
			<div
				className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm"
				onClick={onClose}
				role="dialog"
				aria-modal="true"
				aria-label={`${alt} - ampliada`}
			>
				<div
					className="flex items-center justify-center w-full h-[calc(100vh-1rem)] p-2"
					onClick={(e) => e.stopPropagation()}
				>
					<button
						onClick={onClose}
						className="absolute bottom-4 left-1/2 -translate-x-1/2 -translate-y-10 z-10 p-5 bg-primary/50 text-white rounded-full hover:bg-primary/70 transition sm:top-4 sm:right-4 sm:left-auto sm:bottom-auto sm:translate-x-0 sm:translate-y-0"
						aria-label="Cerrar imagen"
					>
						<Icon name="close" className="size-6" />
					</button>

					<div
						className="relative w-full max-w-5xl max-h-[90vh]"
						onWheel={handleWheel}
						onMouseDown={handleMouseDown}
						onMouseMove={handleMouseMove}
						onMouseUp={handleMouseUp}
						onMouseLeave={handleMouseUp}
						onTouchStart={handleTouchStart}
						onTouchMove={handleTouchMove}
						onTouchEnd={handleTouchEnd}
					>
						<img
							src={imageUrl}
							alt={alt}
							className="max-w-full max-h-[85vh] object-contain transition-transform duration-100"
							style={{
								transform: `translate(${imagePosition.x}px, ${imagePosition.y}px) scale(${zoomLevel})`,
								transformOrigin: "center center",
                                touchAction: (zoomLevel > 1 || isDragging) ? "none" : "auto"
							}}
						/>
					</div>
                    {zoomLevel > 1 && (
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-3 py-1 rounded-full text-sm font-medium">
                            {Math.round(zoomLevel * 100)}%
                        </div>
                    )}
				</div>
			</div>
		</main>
	);
}
