"use client";

import React, { useState } from "react";
import Image from "next/image";
import { 
	Waves, 
	Users, 
	Home, 
	UtensilsCrossed, 
	Wifi, 
	ParkingCircle, 
	Sparkles,
	Wind,
	TreePine,
	ChefHat,
	X
} from "lucide-react";
import Button from "@/components/ui/Button";

// Datos de habitaciones
const habitaciones = [
	{
		id: "suite-master",
		nombre: "Suite Master",
		descripcion: "Amplia suite principal con balcón privado, vestier espacioso y vista panorámica al mar",
		capacidad: 2,
		precio: 420,
		amenidades: ["Balcón privado", "Vista al mar", "Vestier", "Baño privado", "Ático amplio", "Aire acondicionado"],
		imagenes: [
			"/images/posadas/vista-al-mar/suite-master/1.jpg",
			"/images/posadas/vista-al-mar/suite-master/2.jpg",
			"/images/posadas/vista-al-mar/suite-master/3.jpg",
		],
		disponibles: 1
	},
	{
		id: "suite-junior",
		nombre: "Suite Junior",
		descripcion: "Suites acogedoras con baño privado y ático, perfectas para parejas",
		capacidad: 2,
		precio: 210,
		amenidades: ["Baño privado", "Ático", "Aire acondicionado", "Closet"],
		imagenes: [
			"/images/posadas/vista-al-mar/suite-junior/1.jpg",
			"/images/posadas/vista-al-mar/suite-junior/2.jpg",
			"/images/posadas/vista-al-mar/suite-junior/3.jpg",
		],
		disponibles: 4
	},
	{
		id: "habitacion-doble",
		nombre: "Habitación Doble con Anexo",
		descripcion: "Habitación en planta baja con anexo individual, ideal para familias pequeñas",
		capacidad: 3,
		precio: 250,
		amenidades: ["Planta baja", "Anexo individual", "Baño privado", "Aire acondicionado"],
		imagenes: [
			"/images/posadas/vista-al-mar/habitacion-doble/1.jpg",
			"/images/posadas/vista-al-mar/habitacion-doble/2.jpg",
		],
		disponibles: 1
	},
];

// Amenidades premium
const amenidadesPremium = [
	{
		icon: <Waves className="w-6 h-6" />,
		titulo: "Piscina Infinity",
		descripcion: "Vista panorámica al mar con jacuzzi integrado"
	},
	{
		icon: <Home className="w-6 h-6" />,
		titulo: "Playa Privada",
		descripcion: "Acceso exclusivo a playa tranquila"
	},
	{
		icon: <UtensilsCrossed className="w-6 h-6" />,
		titulo: "Churuata Gourmet",
		descripcion: "Parrillera, horno de pizza y área social"
	},
	{
		icon: <Wifi className="w-6 h-6" />,
		titulo: "WiFi Alta Velocidad",
		descripcion: "Conexión premium en toda la posada"
	},
	{
		icon: <ChefHat className="w-6 h-6" />,
		titulo: "Cocina Equipada",
		descripcion: "Cocina completa con todos los utensilios"
	},
	{
		icon: <ParkingCircle className="w-6 h-6" />,
		titulo: "Estacionamiento Privado",
		descripcion: "Espacio seguro para varios vehículos"
	},
	{
		icon: <Wind className="w-6 h-6" />,
		titulo: "Planta Eléctrica",
		descripcion: "Energía garantizada 24/7"
	},
	{
		icon: <TreePine className="w-6 h-6" />,
		titulo: "Jardín Tropical",
		descripcion: "Espacios verdes con hamacas"
	}
];

// Galería de espacios comunes
const galeriaEspacios = [
	{ src: "/images/posadas/vista-al-mar/espacios/piscina-1.jpg", alt: "Piscina infinity con vista al mar", categoria: "Piscina" },
	{ src: "/images/posadas/vista-al-mar/espacios/jacuzzi.jpg", alt: "Jacuzzi privado", categoria: "Piscina" },
	{ src: "/images/posadas/vista-al-mar/espacios/churuata-1.jpg", alt: "Churuata con parrillera", categoria: "Churuata" },
	{ src: "/images/posadas/vista-al-mar/espacios/cocina.jpg", alt: "Cocina equipada", categoria: "Cocina" },
	{ src: "/images/posadas/vista-al-mar/espacios/terraza.jpg", alt: "Terraza con vista", categoria: "Exteriores" },
	{ src: "/images/posadas/vista-al-mar/espacios/playa.jpg", alt: "Playa privada", categoria: "Playa" },
];

export default function VistaAlMarPage() {
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

	return (
		<>
			{/* Hero Section */}
			<section className="relative min-h-[70vh] flex items-center justify-center bg-primary-600">
				<div
					className="absolute inset-0 bg-cover bg-center"
					style={{ backgroundImage: "url(/images/posadas/vista-al-mar/hero.jpg)" }}
				/>
				<div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />

				<div className="relative z-10 text-center px-6 py-32">
					<div className="inline-block px-4 py-1 bg-accent-500/20 border border-accent-500 text-accent-500 text-xs font-semibold tracking-wider mb-6">
						FRENTE AL MAR
					</div>
					<h1 className="font-display text-5xl md:text-6xl lg:text-7xl text-neutral-50 mb-6">
						Vista al Mar
					</h1>
					<p className="text-neutral-50 text-xl md:text-2xl max-w-3xl mx-auto mb-8">
						Donde el lujo se encuentra con el océano
					</p>

					{/* Stats rápidas */}
					<div className="flex flex-wrap justify-center gap-8 md:gap-12 mb-12">
						<StatQuick number="6" label="Habitaciones" />
						<StatQuick number="12+" label="Huéspedes" />
						<StatQuick number="$1,250" label="Posada completa" />
					</div>

					<Button variant="primary" href="/reservas?posada=vista-al-mar" size="lg">
						Reservar Vista al Mar
					</Button>
				</div>
			</section>

			{/* Introducción */}
			<section className="bg-neutral-50 py-16 md:py-24">
				<div className="max-w-4xl mx-auto px-6 md:px-12 text-center">
					<h2 className="font-display text-4xl md:text-5xl text-primary-600 mb-6">
						Una Experiencia Inolvidable
					</h2>
					<p className="text-primary-600/80 text-lg leading-relaxed mb-8">
						Vista al Mar es el refugio perfecto para quienes buscan privacidad y exclusividad frente al océano. 
						Con piscina infinity, jacuzzi privado y acceso directo a playa privada, cada momento se convierte 
						en una experiencia sublime.
					</p>
					<p className="text-primary-600/80 text-lg leading-relaxed">
						Ideal para familias y grupos pequeños que desean disfrutar del lujo tropical con todas las comodidades modernas.
					</p>
				</div>
			</section>

			{/* Habitaciones */}
			<section className="bg-neutral-100 py-16 md:py-24">
				<div className="max-w-7xl mx-auto px-6 md:px-12">
					<div className="text-center mb-16">
						<p className="text-accent-500 tracking-[0.3em] text-sm font-light mb-4">ALOJAMIENTO</p>
						<h2 className="font-display text-4xl md:text-5xl text-primary-600 mb-6">
							Nuestras Habitaciones
						</h2>
						<p className="text-primary-600/80 text-lg max-w-2xl mx-auto">
							Espacios diseñados para tu confort, cada uno con su carácter único
						</p>
					</div>

					<div className="space-y-12">
						{habitaciones.map((habitacion, index) => (
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
						<h3 className="font-display text-3xl md:text-4xl text-neutral-50 mb-4">
							¿Reservas la Posada Completa?
						</h3>
						<p className="text-neutral-50/80 text-lg mb-6">
							Disfruta de todas las 6 habitaciones y espacios exclusivos
						</p>
						<div className="flex items-baseline justify-center gap-3 mb-8">
							<span className="font-display text-5xl md:text-6xl text-accent-500">$1,250</span>
							<span className="text-neutral-50/80 text-lg">por noche</span>
						</div>
						<Button variant="primary" href="/reservas?posada=vista-al-mar&tipo=completa" size="lg">
							Reservar Posada Completa
						</Button>
					</div>
				</div>
			</section>

			{/* Amenidades Premium */}
			<section className="bg-neutral-50 py-16 md:py-24">
				<div className="max-w-7xl mx-auto px-6 md:px-12">
					<div className="text-center mb-16">
						<p className="text-accent-500 tracking-[0.3em] text-sm font-light mb-4">COMODIDADES</p>
						<h2 className="font-display text-4xl md:text-5xl text-primary-600 mb-6">
							Amenidades Premium
						</h2>
						<p className="text-primary-600/80 text-lg max-w-2xl mx-auto">
							Todo lo que necesitas para una estadía perfecta
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
						{amenidadesPremium.map((amenidad, index) => (
							<div 
								key={index}
								className="bg-neutral-100 p-6 rounded-sm hover:shadow-lg transition-shadow duration-300"
							>
								<div className="text-accent-500 mb-4">
									{amenidad.icon}
								</div>
								<h3 className="font-semibold text-primary-600 mb-2">
									{amenidad.titulo}
								</h3>
								<p className="text-primary-600/70 text-sm">
									{amenidad.descripcion}
								</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Galería de Espacios Comunes */}
			<section className="bg-neutral-100 py-16 md:py-24">
				<div className="max-w-7xl mx-auto px-6 md:px-12">
					<div className="text-center mb-16">
						<p className="text-accent-500 tracking-[0.3em] text-sm font-light mb-4">DESCUBRE</p>
						<h2 className="font-display text-4xl md:text-5xl text-primary-600 mb-6">
							Espacios Comunes
						</h2>
						<p className="text-primary-600/80 text-lg max-w-2xl mx-auto">
							Piscina, churuata, cocina y más espacios para disfrutar
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
									<span className="text-xs tracking-wider bg-accent-500 px-2 py-1">
										{imagen.categoria}
									</span>
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
					<h2 className="font-display text-4xl md:text-5xl text-neutral-50 mb-6">
						¿Listo para tu Escapada?
					</h2>
					<p className="text-neutral-50/80 text-lg mb-12">
						Reserva ahora y asegura las mejores fechas para tu estadía en Vista al Mar
					</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<Button variant="primary" href="/reservas?posada=vista-al-mar" size="lg">
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
				<div 
					className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
					onClick={closeLightbox}
				>
					<button
						onClick={closeLightbox}
						className="absolute top-4 right-4 text-neutral-50 hover:text-accent-500 transition-colors"
					>
						<X className="w-8 h-8" />
					</button>
					<img
						src={lightboxImage}
						alt="Vista ampliada"
						className="max-w-full max-h-full object-contain"
					/>
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
	onImageClick 
}: { 
	habitacion: typeof habitaciones[0]; 
	reverse: boolean;
	onImageClick: (src: string) => void;
}) => (
	<div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 items-center ${reverse ? 'lg:flex-row-reverse' : ''}`}>
		{/* Galería de imágenes */}
		<div className={`${reverse ? 'lg:order-2' : ''}`}>
			<div className="grid grid-cols-2 gap-4">
				{habitacion.imagenes.map((img, idx) => (
					<div 
						key={idx}
						className={`relative overflow-hidden rounded-sm group cursor-pointer ${idx === 0 ? 'col-span-2 h-80' : 'h-60'}`}
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
		<div className={`${reverse ? 'lg:order-1' : ''}`}>
			<div className="flex items-center justify-between mb-4">
				<h3 className="font-display text-3xl text-primary-600">{habitacion.nombre}</h3>
				{habitacion.disponibles > 1 && (
					<span className="text-xs text-accent-500 font-semibold">
						{habitacion.disponibles} disponibles
					</span>
				)}
			</div>

			<p className="text-primary-600/80 mb-6">{habitacion.descripcion}</p>

			<div className="flex items-baseline gap-3 mb-6">
				<span className="font-display text-4xl text-accent-500">${habitacion.precio}</span>
				<span className="text-primary-600/60 text-sm">por noche</span>
			</div>

			<div className="flex items-center gap-2 text-primary-600/70 mb-6">
				<Users className="w-5 h-5" />
				<span>Hasta {habitacion.capacidad} {habitacion.capacidad === 1 ? 'persona' : 'personas'}</span>
			</div>

			<div className="mb-8">
				<h4 className="font-semibold text-primary-600 mb-3">Amenidades:</h4>
				<ul className="grid grid-cols-2 gap-2">
					{habitacion.amenidades.map((amenidad, idx) => (
						<li key={idx} className="text-sm text-primary-600/70 flex items-center gap-2">
							<div className="w-1.5 h-1.5 bg-accent-500 rounded-full" />
							{amenidad}
						</li>
					))}
				</ul>
			</div>

			<Button variant="secondary" href={`/reservas?posada=vista-al-mar&habitacion=${habitacion.id}`}>
				Reservar esta habitación
			</Button>
		</div>
	</div>
);