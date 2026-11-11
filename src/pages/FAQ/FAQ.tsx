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
				"Simplemente exploras el catálogo o buscas el producto que desees, le das click al boton contactar y automáticamente te llevará a WhatsApp (No elimines el link, nos ayudará a identificar mejor el producto).",
		},
		{
			id: "2",
			question: "¿Cuáles son los métodos de pago disponibles?",
			answer:
				"Los métodos de pagos actuales disponibles es por Billetera Móvil. Tambien en efectivo si vienes a nuestro local.",
		},
		{
			id: "3",
			question: "¿Realizan entregas a domicilio?",
			answer:
				"Sí, realizamos entregas mediante CargoTrans. El costo depende de tu ubicación.",
		},
		{
			id: "4",
			question: "¿Puedo cancelar un pedido?",
			answer:
				"Despues de haber confirmado la compra del producto y haber pagado, no es posible cancelar el pedido.",
		},
		{
			id: "5",
			question: "¿Cómo puedo consultar el precio de un producto?",
			answer:
				"Todos nuestros productos muestran su precio en el catálogo. Si tienes dudas, puedes escribirnos directamente.",
		},
		{
			id: "6",
			question: "¿Cómo puedo contactar con atención al cliente?",
			answer:
				"Puedes contactarnos al 8270 8806",
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
