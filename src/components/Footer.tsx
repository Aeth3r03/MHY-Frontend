import { useNavigate } from "react-router-dom";
import { Icon } from "./Icon";

export function Footer() {
    const navigate = useNavigate();

	return (
		<main>
			<section className="bg-footer-top text-white">
				<div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 lg:px-8">
					<div>
						<p className="text-xs font-black uppercase tracking-[0.2em] text-[#f0b938]">
							La experiencia MultiHogar Yadita
						</p>
                        <h2 className="mt-4 max-w-md font-serif text-4xl font-bold leading-tight sm:text-5xl">
                            Cercanía que se siente en cada compra.
                        </h2>
					</div>
                    <div className="grid gap-3 sm:grid-cols-3">
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                            <Icon name="truck" className="size-6 text-[#f0b938]" />
                            <h3 className="mt-6 font-black">Entrega mediante CargoTrans</h3>
                            <p className="mt-1 text-sm text-white/55">Coordinamos contigo</p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                            <Icon name="shield" className="size-6 text-[#f0b938]" />
                            <h3 className="mt-6 font-black">Compra segura</h3>
                            <p className="mt-1 text-sm text-white/55">Información clara</p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                            <Icon name="headset" className="size-6 text-[#f0b938]" />
                            <h3 className="mt-6 font-black">Te ayudamos</h3>
                            <p className="mt-1 text-sm text-white/55">Puedes contactarnos al +505 82708806</p>
                        </div>
                    </div>
				</div>
			</section>

			<footer className="bg-footer px-4 py-7 text-white/50">
				<div className="mx-auto flex max-w-7xl flex-col gap-3 text-xs sm:flex-row sm:items-center sm:justify-between">
					<p>2026 MultiHogar Yadita. Hecho con ❤️.</p>
					<button
						onClick={() => navigate("/terms")}
						className="text-left font-bold text-white/80 hover:text-white"
					>
						Términos de Servicio
					</button>
				</div>
			</footer>
		</main>
	);
}
