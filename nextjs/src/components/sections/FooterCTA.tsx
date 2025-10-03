import React from "react";
import { Mail, Phone, Instagram, MapPin, Calendar } from "lucide-react";
import Link from "next/link";

const FooterCTA = () => {
	return (
		<>
			{/* CTA Section - Potente con imagen de fondo */}
			<section className="relative min-h-[600px] flex items-center justify-center">
				{/* Background Image */}
				<div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url(/images/inmarcesible-hero.webp)" }} />

				{/* Gradient Overlay - de transparente arriba a azul abajo */}
				<div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary-600/60 to-primary-600" />

				{/* Content */}
				<div className="relative z-10 text-center px-6 md:px-12 py-24">
					<div className="max-w-4xl mx-auto">
						<h2 className="font-display text-5xl md:text-6xl lg:text-7xl text-neutral-50 mb-8 leading-tight">
							Tu Escape al Caribe
							<br />
							<span className="text-accent-500">Te Espera</span>
						</h2>
						<p className="text-neutral-50/90 text-xl md:text-2xl leading-relaxed mb-12 max-w-2xl mx-auto">
							Reserva ahora y descubre por qué somos el destino favorito de quienes buscan lujo, tranquilidad y autenticidad
						</p>

						{/* CTA Buttons */}
						<div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
							<Link
								href="/reservas"
								className="px-10 py-5 bg-accent-500 text-primary-600 font-bold text-lg tracking-wider hover:bg-accent-600 transition-all duration-300 hover:scale-105 shadow-lg"
							>
								RESERVAR AHORA
							</Link>
							<a
								href="https://wa.me/584123112746"
								target="_blank"
								rel="noopener noreferrer"
								className="px-10 py-5 bg-transparent border-2 border-neutral-50 text-neutral-50 font-semibold text-lg tracking-wider hover:bg-neutral-50 hover:text-primary-600 transition-all duration-300 flex items-center gap-2"
							>
								<Phone className="w-5 h-5" />
								CONTACTAR VÍA WHATSAPP
							</a>
						</div>
					</div>
				</div>
			</section>

			{/* Footer - Limpio y profesional */}
			<footer className="bg-primary-600 text-neutral-50">
				<div className="px-6 md:px-12 lg:px-16 py-16">
					<div className="max-w-7xl mx-auto">
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
							{/* Logo & Tagline */}
							<div className="lg:col-span-1">
								<div className="flex items-center gap-3 mb-4">
									<div className="w-16 h-16 bg-accent-500/10 rounded-full flex items-center justify-center">
										<div className="text-accent-500 font-display text-2xl">M</div>
									</div>
									<div>
										<h3 className="font-display text-xl">MARARENA</h3>
										<p className="text-xs text-neutral-50/70 tracking-wider">POSADAS DE LUJO</p>
									</div>
								</div>
								<p className="text-sm text-neutral-50/80 font-serif italic leading-relaxed">
									Lujo, posadas de playa que vuelven al descanso
								</p>
								<p className="text-xs text-neutral-50/60 mt-2">Chirimena - Higuerote</p>
							</div>

							{/* Contacto */}
							<div>
								<h4 className="font-semibold text-accent-500 mb-4 tracking-wider text-sm">CONTACTO</h4>
								<div className="space-y-3">
									<a
										href="mailto:mararenaposadas@gmail.com"
										className="flex items-center gap-3 text-sm text-neutral-50/90 hover:text-accent-500 transition-colors group"
									>
										<Mail className="w-4 h-4 flex-shrink-0 group-hover:scale-110 transition-transform" />
										<span>mararenaposadas@gmail.com</span>
									</a>
									<a
										href="https://wa.me/584123112746"
										target="_blank"
										rel="noopener noreferrer"
										className="flex items-center gap-3 text-sm text-neutral-50/90 hover:text-accent-500 transition-colors group"
									>
										<Phone className="w-4 h-4 flex-shrink-0 group-hover:scale-110 transition-transform" />
										<span>+58 0412 311 27 46</span>
									</a>
									<a
										href="https://www.instagram.com/mararenaposadas"
										target="_blank"
										rel="noopener noreferrer"
										className="flex items-center gap-3 text-sm text-neutral-50/90 hover:text-accent-500 transition-colors group"
									>
										<Instagram className="w-4 h-4 flex-shrink-0 group-hover:scale-110 transition-transform" />
										<span>@mararenaposadas</span>
									</a>
								</div>
							</div>

							{/* Más Información */}
							<div>
								<h4 className="font-semibold text-accent-500 mb-4 tracking-wider text-sm">MÁS INFORMACIÓN</h4>
								<nav className="space-y-3">
									<Link
										href="/direccion"
										className="block text-sm text-neutral-50/90 hover:text-accent-500 transition-colors hover:translate-x-1 transform duration-200"
									>
										Dirección
									</Link>
									<Link
										href="/preguntas-frecuentes"
										className="block text-sm text-neutral-50/90 hover:text-accent-500 transition-colors hover:translate-x-1 transform duration-200"
									>
										Preguntas frecuentes
									</Link>
									<Link
										href="/terminos"
										className="block text-sm text-neutral-50/90 hover:text-accent-500 transition-colors hover:translate-x-1 transform duration-200"
									>
										Términos y condiciones
									</Link>
									<Link
										href="/politica-privacidad"
										className="block text-sm text-neutral-50/90 hover:text-accent-500 transition-colors hover:translate-x-1 transform duration-200"
									>
										Política de privacidad
									</Link>
								</nav>
							</div>

							{/* Mi Reserva */}
							<div>
								<h4 className="font-semibold text-accent-500 mb-4 tracking-wider text-sm">MI RESERVA</h4>
								<p className="text-sm text-neutral-50/80 mb-4">Consulta el estado de tu reserva con tu código</p>
								<Link
									href="/consultar-reserva"
									className="inline-flex items-center gap-2 px-6 py-3 bg-accent-500/10 border border-accent-500 text-accent-500 text-sm font-semibold hover:bg-accent-500 hover:text-primary-600 transition-all duration-300"
								>
									<Calendar className="w-4 h-4" />
									Consultar reserva
								</Link>
							</div>
						</div>

						{/* Bottom Bar */}
						<div className="pt-8 border-t border-neutral-50/10">
							<div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-neutral-50/60">
								<p>Copyright © 2025 Mararena Posadas. Todos los derechos reservados</p>
								<div className="flex items-center gap-2">
									<MapPin className="w-4 h-4" />
									<span>Chirimena - Higuerote, Estado Miranda, Venezuela</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</footer>
		</>
	);
};

export default FooterCTA;
