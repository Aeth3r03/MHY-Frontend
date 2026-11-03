import { useEffect } from "react";
import { FAQCompontent } from "../../components/ui/FAQComponent";
import { Link, useLocation } from "react-router-dom";
import { Icon } from "../../components/Icon";

export function FAQ() {
	const { hash } = useLocation();
	const faqs = [
		{
			id: "como-comprar",
			question: "¿Como comprar?",
			answer:
				"No es necesario contar con tarjeta de crédito, al dare click al boton 'contactar' del producto deseado te redirijierá a WhatsApp con el numero de la dueña del negocio para hacer consultas y confirmar el pedido",
		},
		{
			id: "1",
			question: "¿Cómo puedo realizar una compra?",
			answer:
				"Puedes explorar nuestro catálogo, seleccionar los productos que deseas y contactarnos por WhatsApp para confirmar tu pedido.",
		},
		{
			id: "2",
			question: "¿Cuáles son los métodos de pago disponibles?",
			answer:
				"Aceptamos pagos en efectivo y transferencias bancarias. También puedes realizar un adelanto del 50% de tu compra.",
		},
		{
			id: "3",
			question: "¿Realizan entregas a domicilio?",
			answer:
				"Sí, realizamos entregas mediante nuestro servicio de transporte asociado. El costo depende de tu ubicación.",
		},
		{
			id: "4",
			question: "¿Puedo cancelar un pedido?",
			answer:
				"Puedes solicitar la cancelación antes de que el pedido haya sido preparado o enviado.",
		},
		{
			id: "5",
			question: "¿Cómo puedo consultar el precio de un producto?",
			answer:
				"Todos nuestros productos muestran su precio en el catálogo. Si tienes dudas, puedes escribirnos directamente.",
		},
		{
			id: "6",
			question: "¿Los productos tienen garantía?",
			answer:
				"Algunos productos cuentan con garantía del fabricante. Puedes consultar las condiciones específicas antes de comprar.",
		},
		{
			id: "7",
			question: "¿Puedo modificar mi pedido?",
			answer:
				"Sí, siempre que el pedido todavía no haya sido preparado para su entrega.",
		},
		{
			id: "8",
			question: "¿Cómo puedo contactar con atención al cliente?",
			answer:
				"Puedes comunicarte con nosotros mediante WhatsApp o nuestras redes sociales.",
		},
	];

	useEffect(() => {
		const id = hash.slice(1);
		const item = document.getElementById(id);

		if (item instanceof HTMLDetailsElement) {
			item.open = true;
			item.scrollIntoView({ behavior: "smooth", block: "start" });
		}
	}, [hash]);

	return (
		<main className="max-w-7xl mx-auto">
			<FAQCompontent title="Preguntas frecuentes" items={faqs} />
            <div className="flex items-center justify-center mb-5">
                <Link to="/" className="group mt-2 mb-5 flex gap-2 rounded-full py-4 px-5 bg-primary hover:bg-primary/85 cursor-pointer text-white">
                    Volver a la tienda <Icon name="home" className="size-5 transition-transform group-hover:-translate-y-1" /> 
                </Link>
            </div>
        </main>
	);
}
