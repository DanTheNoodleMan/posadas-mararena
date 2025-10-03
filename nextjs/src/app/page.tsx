import Header from "@/components/layout/Header";
import Hero from "@/components/sections/Hero";
import Bienvenidos from "@/components/sections/Bienvenidos";

export default function Home() {
	return (
		<>
			<Header />
			<main>
				<Hero />

				<Bienvenidos />

        {/* Placeholder sections for future content */}

				<section id="servicios" className="min-h-screen bg-neutral-50 flex items-center justify-center">
					<div className="text-center">
						<h2 className="text-4xl font-display font-bold text-primary-600 mb-4">Servicios</h2>
						<p className="text-lg text-primary-500">Sección en desarrollo</p>
					</div>
				</section>

				<section id="posadas" className="min-h-screen bg-neutral-100 flex items-center justify-center">
					<div className="text-center">
						<h2 className="text-4xl font-display font-bold text-primary-600 mb-4">Nuestras Posadas</h2>
						<p className="text-lg text-primary-500">Sección en desarrollo</p>
					</div>
				</section>

				<section id="galeria" className="min-h-screen bg-neutral-50 flex items-center justify-center">
					<div className="text-center">
						<h2 className="text-4xl font-display font-bold text-primary-600 mb-4">Galería</h2>
						<p className="text-lg text-primary-500">Sección en desarrollo</p>
					</div>
				</section>

				<section id="contacto" className="min-h-screen bg-neutral-100 flex items-center justify-center">
					<div className="text-center">
						<h2 className="text-4xl font-display font-bold text-primary-600 mb-4">Contacto</h2>
						<p className="text-lg text-primary-500">Sección en desarrollo</p>
					</div>
				</section>
			</main>
		</>
	);
}
