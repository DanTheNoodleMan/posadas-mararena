"use client";

import React, { useState } from "react";
import { Waves, Users, Home, UtensilsCrossed, Wifi, ParkingCircle, ChefHat, Wind, TreePine, PartyPopper, X } from "lucide-react";
import Button from "@/components/ui/button";

// Datos de habitaciones organizadas por área
const habitacionesPorArea = {
	piscina: [
		{
			id: "standard-piscina-litera-1",
			nombre: "Standard Piscina (Litera)",
			descripcion: "Habitación estándar con litera, ubicada cerca de la piscina con acceso directo a cocina compartida",
			capacidad: 3,
			precio: 140,
			amenidades: ["Litera", "Cerca de piscina", "Acceso a cocina", "Aire acondicionado", "Baño privado"],
			imagenes: [
				"/images/posadas/inmarcesible/piscina/standard-litera-1.jpg",
				"/images/posadas/inmarcesible/piscina/standard-litera-2.jpg",
			],
			disponibles: 3,
		},
		{
			id: "standard-piscina-matrimonial",
			nombre: "Standard Piscina (Matrimonial)",
			descripcion: "Habitación con cama matrimonial, ubicada cerca de la piscina con acceso directo a cocina compartida",
			capacidad: 2,
			precio: 150,
			amenidades: ["Cama matrimonial", "Cerca de piscina", "Acceso a cocina", "Aire acondicionado", "Baño privado"],
			imagenes: [
				"/images/posadas/inmarcesible/piscina/standard-matrimonial-1.jpg",
				"/images/posadas/inmarcesible/piscina/standard-matrimonial-2.jpg",
			],
			disponibles: 1,
		},
	],
	churuataAlta: [
		{
			id: "junior-suite-churuata",
			nombre: "Junior Suite Churuata",
			descripcion: "Suites amplias en planta alta con cama queen y litera, ambiente acogedor con techos de palma",
			capacidad: 3,
			precio: 450,
			amenidades: ["Cama queen + litera", "Planta alta", "Vista panorámica", "Aire acondicionado", "Baño privado"],
			imagenes: [
				"/images/posadas/inmarcesible/churuata-alta/junior-suite-1.jpg",
				"/images/posadas/inmarcesible/churuata-alta/junior-suite-2.jpg",
				"/images/posadas/inmarcesible/churuata-alta/junior-suite-3.jpg",
			],
			disponibles: 4,
		},
	],
	churuataBaja: [
		{
			id: "standard-churuata-matrimonial",
			nombre: "Standard Churuata (Matrimonial)",
			descripcion: "Habitación en planta baja con cama matrimonial, fácil acceso y ambiente relajante",
			capacidad: 2,
			precio: 150,
			amenidades: ["Cama matrimonial", "Planta baja", "Aire acondicionado", "Baño privado"],
			imagenes: [
				"/images/posadas/inmarcesible/churuata-baja/standard-1.jpg",
				"/images/posadas/inmarcesible/churuata-baja/standard-2.jpg",
			],
			disponibles: 1,
		},
		{
			id: "premium-cocina-privada",
			nombre: "Premium con Cocina Privada",
			descripcion: "Habitación premium con cocina privada, cama matrimonial y litera, perfecta para familias",
			capacidad: 3,
			precio: 400,
			amenidades: ["Cama matrimonial", "Litera", "Cocina privada", "Aire acondicionado", "Baño privado"],
			imagenes: [
				"/images/posadas/inmarcesible/churuata-baja/premium-1.jpg",
				"/images/posadas/inmarcesible/churuata-baja/premium-2.jpg",
			],
			disponibles: 1,
		},
		{
			id: "doble-queen",
			nombre: "Habitación Doble Queen",
			descripcion: "Habitación amplia con dos camas queen, ideal para grupos o familias grandes",
			capacidad: 4,
			precio: 300,
			amenidades: ["2 camas queen", "Habitación amplia", "Aire acondicionado", "Baño privado"],
			imagenes: [
				"/images/posadas/inmarcesible/churuata-baja/doble-queen-1.jpg",
				"/images/posadas/inmarcesible/churuata-baja/doble-queen-2.jpg",
			],
			disponibles: 1,
		},
	],
};

// Amenidades premium
const amenidadesPremium = [
	{
		icon: <Home className="w-6 h-6" />,
		titulo: "2 Churuatas Sociales",
		descripcion: "Amplios espacios para eventos y reuniones",
	},
	{
		icon: <UtensilsCrossed className="w-6 h-6" />,
		titulo: "Parrillera y Horno",
		descripcion: "Equipos profesionales para preparar comidas",
	},
	{
		icon: <ChefHat className="w-6 h-6" />,
		titulo: "Cocina Industrial",
		descripcion: "Totalmente equipada para grandes grupos",
	},
	{
		icon: <Waves className="w-6 h-6" />,
		titulo: "Piscinas Múltiples",
		descripcion: "Varios espacios acuáticos para tu disfrute",
	},
	{
		icon: <PartyPopper className="w-6 h-6" />,
		titulo: "Eventos hasta 50",
		descripcion: "Perfecto para bodas, cumpleaños y retiros",
	},
	{
		icon: <Wifi className="w-6 h-6" />,
		titulo: "WiFi",
		descripcion: "Conexión en toda la posada",
	},
	{
		icon: <ParkingCircle className="w-6 h-6" />,
		titulo: "Estacionamiento Seguro",
		descripcion: "Amplio espacio para múltiples vehículos",
	},
	{
		icon: <Wind className="w-6 h-6" />,
		titulo: "Planta Eléctrica",
		descripcion: "Energía garantizada 24/7",
	},
];

// Galería de espacios
const galeriaEspacios = [
	{ src: "/images/posadas/inmarcesible/espacios/churuata-social-1.jpg", alt: "Churuata social principal", categoria: "Churuatas" },
	{ src: "/images/posadas/inmarcesible/espacios/churuata-social-2.jpg", alt: "Segunda churuata social", categoria: "Churuatas" },
	{ src: "/images/posadas/inmarcesible/espacios/cocina-industrial.jpg", alt: "Cocina industrial equipada", categoria: "Cocina" },
	{ src: "/images/posadas/inmarcesible/espacios/parrillera.jpg", alt: "Área de parrillera", categoria: "Exteriores" },
	{ src: "/images/posadas/inmarcesible/espacios/piscina-1.jpg", alt: "Piscina principal", categoria: "Piscinas" },
	{ src: "/images/posadas/inmarcesible/espacios/jardin.jpg", alt: "Jardines y áreas verdes", categoria: "Exteriores" },
];

export default function InmarcesiblePage() {
	const [lightboxOpen, setLightboxOpen] = useState(false);
	const [lightboxImage, setLightboxImage] = useState("");

	const openLightbox = (src: string) => {
		setLightboxImage(src);
		setLightboxOpen(true);
	};

	const closeLightbox = () => {
		setLightboxOpen(false);
		setLightboxImage("");
	};

	// Calcular totales
	const totalHabitaciones = Object.values(habitacionesPorArea).flat().length;
	const capacidadTotal = Object.values(habitacionesPorArea)
		.flat()
		.reduce((sum, hab) => sum + hab.capacidad, 0);

	return (
		<>
			{/* Hero Section */}
			<section className="relative min-h-[70vh] flex items-center justify-center bg-primary-600">
				<div
					className="absolute inset-0 bg-cover bg-center"
					style={{ backgroundImage: "url(/images/posadas/inmarcesible/hero.jpg)" }}
				/>
				<div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />

				<div className="relative z-10 text-center px-6 py-32">
					<div className="inline-block px-4 py-1 bg-accent-500/20 border border-accent-500 text-accent-500 text-xs font-semibold tracking-wider mb-6">
						IDEAL PARA EVENTOS
					</div>
					<h1 className="font-display text-5xl md:text-6xl lg:text-7xl text-neutral-50 mb-6">Inmarcesible</h1>
					<p className="text-neutral-50 text-xl md:text-2xl max-w-3xl mx-auto mb-8">
						El escenario perfecto para celebraciones memorables
					</p>

					{/* Stats rápidas */}
					<div className="flex flex-wrap justify-center gap-8 md:gap-12 mb-12">
						<StatQuick number="11" label="Habitaciones" />
						<StatQuick number="31" label="Huéspedes" />
						<StatQuick number="$1,980" label="Posada completa" />
					</div>

					<Button variant="primary" href="/reservas?posada=inmarcesible" size="lg">
						Reservar Inmarcesible
					</Button>
				</div>
			</section>

			{/* Introducción */}
			<section className="bg-neutral-50 py-16 md:py-24">
				<div className="max-w-4xl mx-auto px-6 md:px-12 text-center">
					<h2 className="font-display text-4xl md:text-5xl text-primary-600 mb-6">Espacios Diseñados para Celebrar</h2>
					<p className="text-primary-600/80 text-lg leading-relaxed mb-8">
						Inmarcesible es la posada perfecta para eventos especiales y grupos grandes. Con 11 habitaciones distribuidas en
						áreas estratégicas, 2 churuatas sociales amplias y cocina industrial completa, cada celebración se convierte en un
						momento inolvidable.
					</p>
					<p className="text-primary-600/80 text-lg leading-relaxed">
						Ideal para bodas, cumpleaños, retiros empresariales y reuniones familiares de hasta 31 huéspedes, con capacidad de
						eventos hasta 50 personas.
					</p>
				</div>
			</section>

			{/* Habitaciones por Área - ÁREA PISCINA */}
			<section className="bg-neutral-100 py-16 md:py-24">
				<div className="max-w-7xl mx-auto px-6 md:px-12">
					<div className="mb-12">
						<div className="inline-block px-4 py-1 bg-accent-500/10 border border-accent-500 text-accent-500 text-xs font-semibold tracking-wider mb-4">
							ZONA 1
						</div>
						<h2 className="font-display text-4xl md:text-5xl text-primary-600 mb-4">Área Piscina</h2>
						<p className="text-primary-600/80 text-lg max-w-2xl">
							Habitaciones ubicadas cerca de las piscinas con acceso directo a cocina compartida
						</p>
					</div>

					<div className="space-y-12">
						{habitacionesPorArea.piscina.map((habitacion, index) => (
							<HabitacionCard
								key={habitacion.id}
								habitacion={habitacion}
								reverse={index % 2 !== 0}
								onImageClick={openLightbox}
							/>
						))}
					</div>
				</div>
			</section>

			{/* CHURUATA - PLANTA ALTA */}
			<section className="bg-neutral-50 py-16 md:py-24">
				<div className="max-w-7xl mx-auto px-6 md:px-12">
					<div className="mb-12">
						<div className="inline-block px-4 py-1 bg-accent-500/10 border border-accent-500 text-accent-500 text-xs font-semibold tracking-wider mb-4">
							ZONA 2
						</div>
						<h2 className="font-display text-4xl md:text-5xl text-primary-600 mb-4">Churuata - Planta Alta</h2>
						<p className="text-primary-600/80 text-lg max-w-2xl">
							Junior Suites amplias con vistas panorámicas y techos de palma tradicionales
						</p>
					</div>

					<div className="space-y-12">
						{habitacionesPorArea.churuataAlta.map((habitacion, index) => (
							<HabitacionCard key={habitacion.id} habitacion={habitacion} reverse={false} onImageClick={openLightbox} />
						))}
					</div>
				</div>
			</section>

			{/* CHURUATA - PLANTA BAJA */}
			<section className="bg-neutral-100 py-16 md:py-24">
				<div className="max-w-7xl mx-auto px-6 md:px-12">
					<div className="mb-12">
						<div className="inline-block px-4 py-1 bg-accent-500/10 border border-accent-500 text-accent-500 text-xs font-semibold tracking-wider mb-4">
							ZONA 3
						</div>
						<h2 className="font-display text-4xl md:text-5xl text-primary-600 mb-4">Churuata - Planta Baja</h2>
						<p className="text-primary-600/80 text-lg max-w-2xl">
							Habitaciones en planta baja con fácil acceso, incluyendo opciones premium con cocina privada
						</p>
					</div>

					<div className="space-y-12">
						{habitacionesPorArea.churuataBaja.map((habitacion, index) => (
							<HabitacionCard
								key={habitacion.id}
								habitacion={habitacion}
								reverse={index % 2 !== 0}
								onImageClick={openLightbox}
							/>
						))}
					</div>

					{/* Precio posada completa */}
					<div className="mt-16 bg-primary-600 p-8 md:p-12 rounded-sm text-center">
						<h3 className="font-display text-3xl md:text-4xl text-neutral-50 mb-4">¿Reservas la Posada Completa?</h3>
						<p className="text-neutral-50/80 text-lg mb-6">
							Disfruta de todas las 11 habitaciones y espacios para eventos hasta 50 personas
						</p>
						<div className="flex items-baseline justify-center gap-3 mb-8">
							<span className="font-display text-5xl md:text-6xl text-accent-500">$1,980</span>
							<span className="text-neutral-50/80 text-lg">por noche</span>
						</div>
						<Button variant="primary" href="/reservas?posada=inmarcesible&tipo=completa" size="lg">
							Reservar Posada Completa
						</Button>
					</div>
				</div>
			</section>

			{/* Amenidades Premium */}
			<section className="bg-neutral-50 py-16 md:py-24">
				<div className="max-w-7xl mx-auto px-6 md:px-12">
					<div className="text-center mb-16">
						<p className="text-accent-500 tracking-[0.3em] text-sm font-light mb-4">INSTALACIONES</p>
						<h2 className="font-display text-4xl md:text-5xl text-primary-600 mb-6">Amenidades para Eventos</h2>
						<p className="text-primary-600/80 text-lg max-w-2xl mx-auto">
							Todo lo necesario para hacer de tu celebración un éxito
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
						{amenidadesPremium.map((amenidad, index) => (
							<div key={index} className="bg-neutral-100 p-6 rounded-sm hover:shadow-lg transition-shadow duration-300">
								<div className="text-accent-500 mb-4">{amenidad.icon}</div>
								<h3 className="font-semibold text-primary-600 mb-2">{amenidad.titulo}</h3>
								<p className="text-primary-600/70 text-sm">{amenidad.descripcion}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Galería de Espacios */}
			<section className="bg-neutral-100 py-16 md:py-24">
				<div className="max-w-7xl mx-auto px-6 md:px-12">
					<div className="text-center mb-16">
						<p className="text-accent-500 tracking-[0.3em] text-sm font-light mb-4">DESCUBRE</p>
						<h2 className="font-display text-4xl md:text-5xl text-primary-600 mb-6">Espacios Sociales</h2>
						<p className="text-primary-600/80 text-lg max-w-2xl mx-auto">
							Churuatas, cocina industrial, piscinas y más áreas para disfrutar
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{galeriaEspacios.map((imagen, index) => (
							<div
								key={index}
								className="relative h-80 overflow-hidden rounded-sm group cursor-pointer"
								onClick={() => openLightbox(imagen.src)}
							>
								<div
									className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
									style={{ backgroundImage: `url(${imagen.src})` }}
								/>
								<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
								<div className="absolute bottom-4 left-4 text-neutral-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
									<span className="text-xs tracking-wider bg-accent-500 px-2 py-1">{imagen.categoria}</span>
									<p className="mt-2 text-sm">{imagen.alt}</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* CTA Final */}
			<section className="bg-primary-600 py-16 md:py-24">
				<div className="max-w-4xl mx-auto px-6 md:px-12 text-center">
					<h2 className="font-display text-4xl md:text-5xl text-neutral-50 mb-6">¿Listo para tu Evento?</h2>
					<p className="text-neutral-50/80 text-lg mb-12">
						Reserva ahora y asegura las mejores fechas para tu celebración en Inmarcesible
					</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<Button variant="primary" href="/reservas?posada=inmarcesible" size="lg">
							Reservar Ahora
						</Button>
						<Button
							variant="ghost"
							href="https://wa.me/584123112746"
							external
							className="border-neutral-50 text-neutral-50 hover:bg-neutral-50 hover:text-primary-600"
						>
							Consultar Disponibilidad
						</Button>
					</div>
				</div>
			</section>

			{/* Lightbox */}
			{lightboxOpen && (
				<div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4" onClick={closeLightbox}>
					<button
						onClick={closeLightbox}
						className="absolute top-4 right-4 text-neutral-50 hover:text-accent-500 transition-colors"
					>
						<X className="w-8 h-8" />
					</button>
					<img src={lightboxImage} alt="Vista ampliada" className="max-w-full max-h-full object-contain" />
				</div>
			)}
		</>
	);
}

// Componentes auxiliares
const StatQuick = ({ number, label }: { number: string; label: string }) => (
	<div className="text-center">
		<div className="font-display text-3xl md:text-4xl text-accent-500 mb-1">{number}</div>
		<div className="text-neutral-50/80 text-xs tracking-wider uppercase">{label}</div>
	</div>
);

const HabitacionCard = ({
	habitacion,
	reverse,
	onImageClick,
}: {
	habitacion: any;
	reverse: boolean;
	onImageClick: (src: string) => void;
}) => (
	<div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 items-center ${reverse ? "lg:flex-row-reverse" : ""}`}>
		{/* Galería de imágenes */}
		<div className={`${reverse ? "lg:order-2" : ""}`}>
			<div className="grid grid-cols-2 gap-4">
				{habitacion.imagenes.map((img: string, idx: number) => (
					<div
						key={idx}
						className={`relative overflow-hidden rounded-sm group cursor-pointer ${idx === 0 ? "col-span-2 h-80" : "h-60"}`}
						onClick={() => onImageClick(img)}
					>
						<div
							className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
							style={{ backgroundImage: `url(${img})` }}
						/>
					</div>
				))}
			</div>
		</div>

		{/* Información */}
		<div className={`${reverse ? "lg:order-1" : ""}`}>
			<div className="flex items-center justify-between mb-4">
				<h3 className="font-display text-3xl text-primary-600">{habitacion.nombre}</h3>
				{habitacion.disponibles > 1 && (
					<span className="text-xs text-accent-500 font-semibold">{habitacion.disponibles} disponibles</span>
				)}
			</div>

			<p className="text-primary-600/80 mb-6">{habitacion.descripcion}</p>

			<div className="flex items-baseline gap-3 mb-6">
				<span className="font-display text-4xl text-accent-500">${habitacion.precio}</span>
				<span className="text-primary-600/60 text-sm">por noche</span>
			</div>

			<div className="flex items-center gap-2 text-primary-600/70 mb-6">
				<Users className="w-5 h-5" />
				<span>
					Hasta {habitacion.capacidad} {habitacion.capacidad === 1 ? "persona" : "personas"}
				</span>
			</div>

			<div className="mb-8">
				<h4 className="font-semibold text-primary-600 mb-3">Amenidades:</h4>
				<ul className="grid grid-cols-2 gap-2">
					{habitacion.amenidades.map((amenidad: string, idx: number) => (
						<li key={idx} className="text-sm text-primary-600/70 flex items-center gap-2">
							<div className="w-1.5 h-1.5 bg-accent-500 rounded-full" />
							{amenidad}
						</li>
					))}
				</ul>
			</div>

			<Button variant="secondary" href={`/reservas?posada=inmarcesible&habitacion=${habitacion.id}`}>
				Reservar esta habitación
			</Button>
		</div>
	</div>
);
