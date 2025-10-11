import React from "react";
import Link from "next/link";
import { Waves, Users, Home, UtensilsCrossed, Wifi, ParkingCircle, Calendar, Sparkles, ChevronRight } from "lucide-react";
import Header from "@/components/layout/Header";
import Button from "@/components/ui/button";

export default function PosadasPage() {
	return (
		<>
			<Header />

			{/* Hero Section */}
			<section className="relative min-h-[60vh] flex items-center justify-center bg-primary-600">
				<div
					className="absolute inset-0 bg-cover bg-center"
					style={{ backgroundImage: "url(/images/galeria/grupo-relax.webp)" }}
				/>
				<div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-primary-600" />

				<div className="relative z-10 text-center px-6 py-24">
					<p className="text-accent-500 tracking-[0.3em] text-sm font-light mb-4">NUESTRAS POSADAS</p>
					<h1 className="font-display text-5xl md:text-6xl lg:text-7xl text-neutral-50 mb-6">Elija Su Experiencia</h1>
					<p className="text-neutral-50 text-xl max-w-3xl mx-auto">
						Dos espacios únicos diseñados para diferentes ocasiones. Ambas con el mismo compromiso: hacer de su estadía un
						momento inolvidable.
					</p>
				</div>
			</section>

			{/* Vista al Mar Section */}
			<section className="relative bg-neutral-50 py-24">
				<div className="max-w-7xl mx-auto px-6 md:px-12">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-12">
						{/* Image Gallery - 2x2 Grid */}
						<div className="grid grid-cols-2 gap-4">
							<div className="col-span-2 h-[300px] relative overflow-hidden group">
								<div
									className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
									style={{ backgroundImage: "url(/images/posadas/vista-al-mar/interior1.webp)" }}
								/>
							</div>
							<div className="h-[200px] relative overflow-hidden group">
								<div
									className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
									style={{ backgroundImage: "url(/images/posadas/vista-al-mar/exterior2.webp)" }}
								/>
							</div>
							<div className="h-[200px] relative overflow-hidden group">
								<div
									className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
									style={{ backgroundImage: "url(images/galeria/churuata-interior.webp)" }}
								/>
							</div>
						</div>

						{/* Content */}
						<div>
							<div className="inline-block px-4 py-1 bg-accent-500/10 border border-accent-500 text-accent-500 text-xs font-semibold tracking-wider mb-4">
								FRENTE AL MAR
							</div>
							<h2 className="font-display text-4xl md:text-5xl text-primary-600 mb-6">Vista al Mar</h2>
							<p className="text-primary-600/80 text-lg leading-relaxed mb-8">
								Una experiencia sublime donde el océano se convierte en protagonista. Amplias terrazas con piscina infinity,
								jacuzzi privado y acceso directo a playa privada. El refugio perfecto para familias y grupos pequeños que
								buscan privacidad y exclusividad frente al mar.
							</p>

							{/* Stats */}
							<div className="grid grid-cols-3 gap-6 mb-8">
								<StatBox number="6" label="Habitaciones" />
								<StatBox number="12" label="Huéspedes" />
								<StatBox number="$210+" label="Por noche" small />
							</div>

							{/* Key Features */}
							<div className="grid grid-cols-2 gap-3 mb-8">
								<FeatureItem icon={<Waves className="w-4 h-4" />} text="Piscina Infinity" />
								<FeatureItem icon={<Sparkles className="w-4 h-4" />} text="Jacuzzi Privado" />
								<FeatureItem icon={<Home className="w-4 h-4" />} text="Playa Privada" />
								<FeatureItem icon={<UtensilsCrossed className="w-4 h-4" />} text="Churuata + Parrilla" />
							</div>

							{/* CTA Buttons */}
							<div className="flex flex-col sm:flex-row gap-4">
								<Button variant="primary" href="/posadas/vista-al-mar" className="group">
									Ver detalles completos
									<ChevronRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
								</Button>
								<Button variant="secondary" href="/reservas?posada=vista-al-mar">
									Reservar ahora
								</Button>
							</div>
						</div>
					</div>

					{/* Habitaciones Preview */}
					<div className="bg-neutral-100 p-8 rounded-sm">
						<h3 className="font-display text-2xl text-primary-600 mb-6">Habitaciones disponibles</h3>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
							<RoomCard
								name="Suite Master"
								price="$420"
								capacity="2"
								features={["Balcón privado", "Vista al mar", "Vestier"]}
							/>
							<RoomCard
								name="Suite Junior"
								price="$210"
								capacity="2"
								features={["Baño privado", "Ático", "Aire acondicionado"]}
								count="4 disponibles"
							/>
							<RoomCard
								name="Habitación Doble"
								price="$250"
								capacity="3"
								features={["Planta baja", "Anexo individual", "Baño privado"]}
							/>
						</div>
					</div>
				</div>
			</section>

			{/* Inmarcesible Section */}
			<section className="relative bg-primary-600 py-24">
				<div className="max-w-7xl mx-auto px-6 md:px-12">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-12">
						{/* Content - Order inverted for visual variety */}
						<div className="order-2 lg:order-1">
							<div className="inline-block px-4 py-1 bg-accent-500/20 border border-accent-500 text-accent-500 text-xs font-semibold tracking-wider mb-4">
								IDEAL PARA EVENTOS
							</div>
							<h2 className="font-display text-4xl md:text-5xl text-neutral-50 mb-6">Inmarcesible</h2>
							<p className="text-neutral-50 text-lg leading-relaxed mb-8">
								Espacios amplios y versátiles diseñados para celebraciones memorables. Con 2 churuatas sociales, cocina
								industrial y capacidad para 31 huéspedes, es el escenario perfecto para bodas, cumpleaños, retiros
								empresariales y reuniones familiares grandes.
							</p>

							{/* Stats */}
							<div className="grid grid-cols-3 gap-6 mb-8">
								<StatBoxDark number="11" label="Habitaciones" />
								<StatBoxDark number="31" label="Huéspedes" />
								<StatBoxDark number="$140+" label="Por noche" small />
							</div>

							{/* Key Features */}
							<div className="grid grid-cols-2 gap-3 mb-8">
								<FeatureItemDark icon={<Home className="w-4 h-4" />} text="2 Churuatas Sociales" />
								<FeatureItemDark icon={<UtensilsCrossed className="w-4 h-4" />} text="Cocina Industrial" />
								<FeatureItemDark icon={<Waves className="w-4 h-4" />} text="Piscinas Múltiples" />
								<FeatureItemDark icon={<Users className="w-4 h-4" />} text="Eventos hasta 50" />
							</div>

							{/* CTA Buttons */}
							<div className="flex flex-col sm:flex-row gap-4">
								<Button variant="primary" href="/posadas/inmarcesible" className="group">
									Ver detalles completos
									<ChevronRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
								</Button>
								<Button
									variant="ghost"
									href="/reservas?posada=inmarcesible"
									className="border-neutral-50 text-neutral-50 hover:bg-neutral-50 hover:text-primary-600"
								>
									Reservar ahora
								</Button>
							</div>
						</div>

						{/* Image Gallery - 2x2 Grid */}
						<div className="grid grid-cols-2 gap-4 order-1 lg:order-2">
							<div className="col-span-2 h-[300px] relative overflow-hidden group">
								<div
									className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
									style={{ backgroundImage: "url(/images/posadas/inmarcesible-posada.webp)" }}
								/>
							</div>
							<div className="h-[200px] relative overflow-hidden group">
								<div
									className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
									style={{ backgroundImage: "url(/images/posadas/inmar/interior1.webp)" }}
								/>
							</div>
							<div className="h-[200px] relative overflow-hidden group">
								<div
									className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
									style={{ backgroundImage: "url(/images/posadas/inmar/cocina1.webp)" }}
								/>
							</div>
						</div>
					</div>

					{/* Habitaciones Preview - DISEÑO MEJORADO */}
					<div className="relative">
						{/* Fondo con gradiente sutil */}
						<div className="absolute inset-0 bg-gradient-to-br from-primary-700/50 via-primary-600/30 to-primary-500/50 rounded-sm" />

						{/* Contenido */}
						<div className="relative p-8 rounded-sm border border-accent-500/20">
							<h3 className="font-display text-2xl text-neutral-50 mb-6">Habitaciones disponibles</h3>
							<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
								<RoomCardDark
									name="Junior Suite Churuata"
									price="$450"
									capacity="3"
									features={["Planta alta", "Cama queen + litera", "Baño privado"]}
									count="4 disponibles"
								/>
								<RoomCardDark
									name="Standard Piscina"
									price="$140"
									capacity="3"
									features={["Cerca de piscina", "Acceso a cocina", "Litera"]}
									count="4 disponibles"
								/>
								<RoomCardDark
									name="Standard Churuata"
									price="$150"
									capacity="2"
									features={["Planta baja", "Cama matrimonial", "Aire acondicionado"]}
									count="3 disponibles"
								/>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Comparison CTA Section */}
			<section className="bg-neutral-100 py-16">
				<div className="max-w-4xl mx-auto px-6 text-center">
					<h3 className="font-display text-3xl md:text-4xl text-primary-600 mb-6">¿No está seguro cuál elegir?</h3>
					<p className="text-primary-600/80 text-lg mb-8">
						Contáctenos y le ayudaremos a encontrar la posada perfecta para su ocasión
					</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<Button variant="primary" href="/reservas">
							Iniciar reserva
						</Button>
						<Button variant="secondary" href="https://wa.me/584123112746" external>
							Contactar por WhatsApp
						</Button>
					</div>
				</div>
			</section>
		</>
	);
}

// Helper Components
const StatBox = ({ number, label, small }: { number: string; label: string; small?: boolean }) => (
	<div className="text-center">
		<div className={`font-display ${small ? "text-3xl" : "text-4xl"} text-accent-500 mb-1`}>{number}</div>
		<div className="text-primary-600/70 text-xs tracking-wider">{label}</div>
	</div>
);

const StatBoxDark = ({ number, label, small }: { number: string; label: string; small?: boolean }) => (
	<div className="text-center">
		<div className={`font-display ${small ? "text-3xl" : "text-4xl"} text-accent-500 mb-1`}>{number}</div>
		<div className="text-neutral-50/70 text-xs tracking-wider">{label}</div>
	</div>
);

const FeatureItem = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
	<div className="flex items-center gap-2">
		<div className="text-accent-500">{icon}</div>
		<span className="text-primary-600/80 text-sm">{text}</span>
	</div>
);

const FeatureItemDark = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
	<div className="flex items-center gap-2">
		<div className="text-accent-500">{icon}</div>
		<span className="text-neutral-50 text-sm">{text}</span>
	</div>
);

const RoomCard = ({
	name,
	price,
	capacity,
	features,
	count,
}: {
	name: string;
	price: string;
	capacity: string;
	features: string[];
	count?: string;
}) => (
	<div className="bg-neutral-50 p-6 rounded-sm border border-primary-600/10 hover:border-accent-500/50 transition-colors">
		<div className="flex justify-between items-start mb-3">
			<h4 className="font-semibold text-primary-600">{name}</h4>
			{count && <span className="text-xs text-accent-500">{count}</span>}
		</div>
		<div className="flex items-baseline gap-2 mb-4">
			<span className="text-2xl font-display text-accent-500">{price}</span>
			<span className="text-xs text-primary-600/60">por noche</span>
		</div>
		<div className="flex items-center gap-2 text-sm text-primary-600/70 mb-4">
			<Users className="w-4 h-4" />
			<span>Hasta {capacity} personas</span>
		</div>
		<ul className="space-y-2">
			{features.map((feature, i) => (
				<li key={i} className="text-xs text-primary-600/70 flex items-center gap-2">
					<div className="w-1 h-1 bg-accent-500 rounded-full" />
					{feature}
				</li>
			))}
		</ul>
	</div>
);

const RoomCardDark = ({
	name,
	price,
	capacity,
	features,
	count,
}: {
	name: string;
	price: string;
	capacity: string;
	features: string[];
	count?: string;
}) => (
	<div className="bg-primary-700/40 backdrop-blur-sm p-6 rounded-sm border border-accent-500/30 hover:border-accent-500 hover:bg-primary-700/60 transition-all duration-300">
		<div className="flex justify-between items-start mb-3">
			<h4 className="font-semibold text-neutral-50">{name}</h4>
			{count && <span className="text-xs text-accent-500">{count}</span>}
		</div>
		<div className="flex items-baseline gap-2 mb-4">
			<span className="text-2xl font-display text-accent-500">{price}</span>
			<span className="text-xs text-neutral-50/80">por noche</span>
		</div>
		<div className="flex items-center gap-2 text-sm text-neutral-50/90 mb-4">
			<Users className="w-4 h-4" />
			<span>Hasta {capacity} personas</span>
		</div>
		<ul className="space-y-2">
			{features.map((feature, i) => (
				<li key={i} className="text-xs text-neutral-50/80 flex items-center gap-2">
					<div className="w-1 h-1 bg-accent-500 rounded-full" />
					{feature}
				</li>
			))}
		</ul>
	</div>
);
