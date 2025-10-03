"use client";

import React from "react";
import { MapPin, Clock, Waves, Sun, Navigation } from "lucide-react";
import Link from "next/link";

const Ubicacion = () => {
	// Coordenadas aproximadas de Chirimena
	const mapUrl =
		"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31421.2!2d-65.6895!3d10.6123!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8c2bb3a9c8c8c8c8%3A0x8c8c8c8c8c8c8c8c!2sChirimena%2C%20Miranda%2C%20Venezuela!5e0!3m2!1sen!2sus!4v1234567890123!5m2!1sen!2sus";

	return (
		<section id="ubicacion" className="relative bg-neutral-50">
			<div className="grid grid-cols-1 lg:grid-cols-2">
				{/* Left Side - Content */}
				<div className="flex items-center px-6 md:px-12 lg:px-16 py-16 lg:py-24 bg-neutral-100">
					<div className="max-w-xl mx-auto lg:mx-0">
						<p className="text-accent-500 tracking-[0.3em] text-sm font-light mb-4">UBICACIÓN PRIVILEGIADA</p>
						<h2 className="font-display text-5xl md:text-6xl lg:text-7xl text-primary-600 mb-8 leading-tight">
							PARAÍSO LE ESPERA
						</h2>
						<p className="text-primary-600/80 text-lg leading-relaxed mb-12">
							En la costa central de Venezuela, donde las montañas encuentran el Mar Caribe. Un destino que combina playa,
							montaña y la calidez del pueblo venezolano.
						</p>

						{/* Stats Cards */}
						<div className="grid grid-cols-1 gap-6 mb-12">
							<StatCard
								icon={<Clock className="w-6 h-6" />}
								number="2"
								label="HORAS DESDE CARACAS"
								description="Fácil acceso por autopista"
							/>
							<StatCard
								icon={<Waves className="w-6 h-6" />}
								number="2"
								label="KM DE PLAYA"
								description="Chirimena y Higuerote"
							/>
							<StatCard
								icon={<Sun className="w-6 h-6" />}
								number="365"
								label="DÍAS DE VERANO"
								description="Clima caribeño todo el año"
							/>
						</div>

						{/* CTA Link */}
						<Link
							href="#como-llegar"
							className="group inline-flex items-center gap-2 text-accent-500 font-serif italic text-lg hover:text-accent-600 transition-colors duration-300"
						>
							Cómo llegar
							<Navigation className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" />
						</Link>
					</div>
				</div>

				{/* Right Side - Interactive Map */}
				<div className="relative h-[400px] lg:h-auto min-h-[600px]">
					{/* Map Container */}
					<div className="absolute inset-0">
						<iframe
							src={mapUrl}
							width="100%"
							height="100%"
							style={{ border: 0 }}
							allowFullScreen
							loading="lazy"
							referrerPolicy="no-referrer-when-downgrade"
							title="Ubicación Mararena Posadas - Chirimena, Venezuela"
							className="w-full h-full"
						/>
					</div>

					{/* Location Badge Overlay */}
					<div className="absolute top-8 left-8 right-8 z-10">
						<div className="bg-neutral-50/95 backdrop-blur-sm px-6 py-4 shadow-lg inline-flex items-center gap-3 rounded-sm">
							<MapPin className="w-5 h-5 text-accent-500 flex-shrink-0" />
							<div>
								<p className="font-semibold text-primary-600 text-sm">Chirimena - Higuerote</p>
								<p className="text-primary-600/70 text-xs">Estado Miranda, Venezuela</p>
							</div>
						</div>
					</div>

					{/* Gradient Overlay - blends into left section on desktop */}
					<div className="hidden lg:block absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-neutral-100 to-transparent pointer-events-none" />
				</div>
			</div>
		</section>
	);
};

// Stat Card Component
const StatCard = ({ icon, number, label, description }: { icon: React.ReactNode; number: string; label: string; description: string }) => (
	<div className="flex items-start gap-4 p-5 bg-neutral-50 border-l-2 border-accent-500 hover:border-accent-600 transition-colors duration-300 group">
		<div className="text-accent-500 mt-1 group-hover:scale-110 transition-transform duration-300">{icon}</div>
		<div>
			<div className="flex items-baseline gap-2 mb-1">
				<span className="font-display text-4xl text-accent-500">{number}</span>
				<span className="text-primary-600 text-xs tracking-wider font-semibold">{label}</span>
			</div>
			<p className="text-primary-600/70 text-sm">{description}</p>
		</div>
	</div>
);

export default Ubicacion;
