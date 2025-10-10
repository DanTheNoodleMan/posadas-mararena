"use client";

import React, { useState } from "react";
import {
	Waves,
	Users,
	Home,
	UtensilsCrossed,
	Wifi,
	ParkingCircle,
	Sparkles,
	Wind,
	PartyPopper,
	ChefHat,
	X,
	ChevronLeft,
	ChevronRight,
	Image as ImageIcon,
} from "lucide-react";
import Button from "@/components/ui/button";

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
			"/images/posadas/vista-al-mar/suite/suite1.webp",
			"/images/posadas/vista-al-mar/suite/suite2.webp",
			"/images/posadas/vista-al-mar/suite/suite3.webp",
			"/images/posadas/vista-al-mar/suite/suite4.webp",
			"/images/galeria/terraza.webp",
			"/images/posadas/vista-al-mar/suite/suite5.webp",
			"/images/posadas/vista-al-mar/suite/suite6.webp",
		],
		disponibles: 1,
	},
	{
		id: "suite-junior",
		nombre: "Suite Junior",
		descripcion: "Suites acogedoras con baño privado y ático, perfectas para parejas",
		capacidad: 2,
		precio: 210,
		amenidades: ["Baño privado", "Ático", "Aire acondicionado", "Closet"],
		imagenes: [
			"/images/posadas/vista-al-mar/junior/junior1.webp",
			"/images/posadas/vista-al-mar/junior/junior2.webp",
			"/images/posadas/vista-al-mar/junior/junior3.webp",
			"/images/posadas/vista-al-mar/junior/junior4.webp",
			"/images/posadas/vista-al-mar/junior/junior5.webp",
			"/images/posadas/vista-al-mar/junior/junior6.webp",
			"/images/posadas/vista-al-mar/junior/junior7.webp",
			"/images/posadas/vista-al-mar/junior/junior8.webp",
			"/images/posadas/vista-al-mar/junior/junior9.webp",
			"/images/posadas/vista-al-mar/junior/junior10.webp",
		],
		disponibles: 4,
	},
	{
		id: "habitacion-doble",
		nombre: "Habitación Doble con Anexo",
		descripcion: "Habitación en planta baja con cama matrimonial y anexo con cama individual, ideal para familias pequeñas",
		capacidad: 3,
		precio: 250,
		amenidades: ["Planta baja", "Anexo individual", "Baño privado", "Aire acondicionado"],
		imagenes: [
			"/images/posadas/vista-al-mar/doble/doble1.webp",
			"/images/posadas/vista-al-mar/doble/doble2.webp",
			"/images/posadas/vista-al-mar/doble/doble3.webp",
		],
		disponibles: 1,
	},
];

// Amenidades premium
const amenidadesPremium = [
	{
		icon: <Waves className="w-6 h-6" />,
		titulo: "Piscina Infinity",
		descripcion: "Vista panorámica al mar con jacuzzi integrado",
	},
	{
		icon: <Home className="w-6 h-6" />,
		titulo: "Playa Privada",
		descripcion: "Acceso exclusivo a playa tranquila",
	},
	{
		icon: <UtensilsCrossed className="w-6 h-6" />,
		titulo: "Churuata Gourmet",
		descripcion: "Parrillera, horno de pizza y área social",
	},
	{
		icon: <Wifi className="w-6 h-6" />,
		titulo: "WiFi Alta Velocidad",
		descripcion: "Conexión premium en toda la posada",
	},
	{
		icon: <ChefHat className="w-6 h-6" />,
		titulo: "Cocina Equipada",
		descripcion: "Cocina completa con todos los utensilios",
	},
	{
		icon: <ParkingCircle className="w-6 h-6" />,
		titulo: "Estacionamiento Privado",
		descripcion: "Espacio seguro para varios vehículos",
	},
	{
		icon: <Wind className="w-6 h-6" />,
		titulo: "Planta Eléctrica y Tanque de agua",
		descripcion: "Energía y agua garantizada 24/7",
	},
	{
		icon: <PartyPopper className="w-6 h-6" />,
		titulo: "Espacio amplio para eventos",
		descripcion: "Ideal para celebraciones y reuniones de hasta 50 personas",
	},
];

// Galería de espacios comunes
const galeriaEspacios = [
	{ src: "/images/posadas/vista-al-mar/espacios/piscina.webp", alt: "Piscina infinity con vista al mar", categoria: "Piscina" },
	{ src: "/images/posadas/vista-al-mar/espacios/jacuzzi.webp", alt: "Jacuzzi privado", categoria: "Piscina" },
	{ src: "/images/posadas/vista-al-mar/exterior2.webp", alt: "Churuata con parrillera", categoria: "Churuata" },
	{ src: "/images/posadas/vista-al-mar/espacios/cocina.webp", alt: "Cocina equipada", categoria: "Cocina" },
	{ src: "/images/posadas/vista-al-mar/espacios/terraza.webp", alt: "Terraza con vista", categoria: "Exteriores" },
	{ src: "/images/posadas/vista-al-mar/interior1.webp", alt: "Salón Común", categoria: "Salón Común" },
];
export default function VistaAlMarPage() {
	const [lightboxOpen, setLightboxOpen] = useState(false);
	const [lightboxImage, setLightboxImage] = useState("");

	// Estados para galería de habitaciones
	const [roomGalleryOpen, setRoomGalleryOpen] = useState(false);
	const [currentRoom, setCurrentRoom] = useState<(typeof habitaciones)[0] | null>(null);
	const [currentImageIndex, setCurrentImageIndex] = useState(0);

	const openLightbox = (src: string) => {
		setLightboxImage(src);
		setLightboxOpen(true);
	};

	const closeLightbox = () => {
		setLightboxOpen(false);
		setLightboxImage("");
	};

	const openRoomGallery = (habitacion: (typeof habitaciones)[0], startIndex: number = 0) => {
		setCurrentRoom(habitacion);
		setCurrentImageIndex(startIndex);
		setRoomGalleryOpen(true);
	};

	const closeRoomGallery = () => {
		setRoomGalleryOpen(false);
		setCurrentRoom(null);
		setCurrentImageIndex(0);
	};

	const nextImage = () => {
		if (currentRoom) {
			setCurrentImageIndex((prev) => (prev + 1) % currentRoom.imagenes.length);
		}
	};

	const prevImage = () => {
		if (currentRoom) {
			setCurrentImageIndex((prev) => (prev - 1 + currentRoom.imagenes.length) % currentRoom.imagenes.length);
		}
	};

	return (
		<>
			{/* Hero Section */}
			<section className="relative min-h-[70vh] flex items-center justify-center bg-primary-600">
				<div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url(/images/vista-al-mar-hero.webp)" }} />
				<div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />

				<div className="relative z-10 text-center px-6 py-32">
					<div className="inline-block px-4 py-1 bg-accent-500/20 border border-accent-500 text-accent-500 text-xs font-semibold tracking-wider mb-6">
						FRENTE AL MAR
					</div>
					<h1 className="font-display text-5xl md:text-6xl lg:text-7xl text-neutral-50 mb-6">Vista al Mar</h1>
					<p className="text-neutral-50 text-xl md:text-2xl max-w-3xl mx-auto mb-8">Donde el lujo se encuentra con el océano</p>

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
					<h2 className="font-display text-4xl md:text-5xl text-primary-600 mb-6">Una Experiencia Inolvidable</h2>
					<p className="text-primary-600/80 text-lg leading-relaxed mb-8">
						Vista al Mar es el refugio perfecto para quienes buscan privacidad y exclusividad frente al océano. Con piscina
						infinity, jacuzzi privado y acceso directo a playa privada, cada momento se convierte en una experiencia sublime.
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
						<h2 className="font-display text-4xl md:text-5xl text-primary-600 mb-6">Nuestras Habitaciones</h2>
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
								onImageClick={(idx) => openRoomGallery(habitacion, idx)}
								onViewAllClick={() => openRoomGallery(habitacion)}
							/>
						))}
					</div>

					{/* Precio posada completa */}
					<div className="mt-16 bg-primary-600 p-8 md:p-12 rounded-sm text-center">
						<h3 className="font-display text-3xl md:text-4xl text-neutral-50 mb-4">¿Reservas la Posada Completa?</h3>
						<p className="text-neutral-50/80 text-lg mb-6">Disfruta de todas las 6 habitaciones y espacios exclusivos</p>
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
						<h2 className="font-display text-4xl md:text-5xl text-primary-600 mb-6">Amenidades Premium</h2>
						<p className="text-primary-600/80 text-lg max-w-2xl mx-auto">Todo lo que necesitas para una estadía perfecta</p>
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

			{/* Galería de Espacios Comunes */}
			<section className="bg-neutral-100 py-16 md:py-24">
				<div className="max-w-7xl mx-auto px-6 md:px-12">
					<div className="text-center mb-16">
						<p className="text-accent-500 tracking-[0.3em] text-sm font-light mb-4">DESCUBRE</p>
						<h2 className="font-display text-4xl md:text-5xl text-primary-600 mb-6">Espacios Comunes</h2>
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
									<span className="text-xs tracking-wider bg-accent-500 px-2 py-1">{imagen.categoria}</span>
									<p className="mt-2 text-sm">{imagen.alt}</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Lightbox Simple (para espacios comunes) */}
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

			{/* Lightbox con Carrusel (para habitaciones) */}
			{roomGalleryOpen && currentRoom && (
				<RoomGalleryLightbox
					room={currentRoom}
					currentIndex={currentImageIndex}
					onClose={closeRoomGallery}
					onNext={nextImage}
					onPrev={prevImage}
					onSelectImage={(index) => setCurrentImageIndex(index)}
				/>
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
	onViewAllClick,
}: {
	habitacion: (typeof habitaciones)[0];
	reverse: boolean;
	onImageClick: (index: number) => void;
	onViewAllClick: () => void;
}) => {
	// Mostrar máximo 3 imágenes en el preview
	const previewImages = habitacion.imagenes.slice(0, 3);
	const hasMoreImages = habitacion.imagenes.length > 3;

	return (
		<div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 items-center ${reverse ? "lg:flex-row-reverse" : ""}`}>
			{/* Galería de imágenes */}
			<div className={`${reverse ? "lg:order-2" : ""}`}>
				<div className="grid grid-cols-2 gap-4">
					{previewImages.map((img, idx) => (
						<div
							key={idx}
							className={`relative overflow-hidden rounded-sm group cursor-pointer ${idx === 0 ? "col-span-2 h-80" : "h-60"}`}
							onClick={() => onImageClick(idx)}
						>
							<div
								className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
								style={{ backgroundImage: `url(${img})` }}
							/>
							<div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
						</div>
					))}
				</div>

				{/* Botón "Ver más fotos" */}
				{hasMoreImages && (
					<button
						onClick={onViewAllClick}
						className="mt-4 w-full py-3 px-4 border-2 border-accent-500 text-accent-500 hover:bg-accent-500 hover:text-primary-600 transition-all duration-300 flex items-center justify-center gap-2 font-semibold tracking-wider"
					>
						<ImageIcon className="w-5 h-5" />
						Ver todas las fotos ({habitacion.imagenes.length})
					</button>
				)}
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
};

// Lightbox de Galería de Habitación con Carrusel
const RoomGalleryLightbox = ({
	room,
	currentIndex,
	onClose,
	onNext,
	onPrev,
	onSelectImage,
}: {
	room: (typeof habitaciones)[0];
	currentIndex: number;
	onClose: () => void;
	onNext: () => void;
	onPrev: () => void;
	onSelectImage: (index: number) => void;
}) => {
	// Navegación con teclado
	React.useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
			if (e.key === "ArrowLeft") onPrev();
			if (e.key === "ArrowRight") onNext();
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [onClose, onNext, onPrev]);

	return (
		<div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
			{/* Close Button */}
			<button
				onClick={onClose}
				className="absolute top-4 right-4 md:top-8 md:right-8 text-neutral-50 hover:text-accent-500 transition-all duration-300 z-50 hover:scale-110"
				aria-label="Cerrar galería"
			>
				<X className="w-8 h-8 md:w-10 md:h-10" />
			</button>

			{/* Room Title */}
			<div className="absolute top-12 left-4 md:top-8 md:left-8 z-50">
				<h3 className="text-neutral-50 font-display text-2xl md:text-3xl mb-1">{room.nombre}</h3>
				<p className="text-neutral-50/70 text-sm">{room.descripcion}</p>
			</div>

			{/* Previous Button */}
			<button
				onClick={onPrev}
				className="absolute left-4 md:left-8 text-neutral-50 hover:text-accent-500 transition-all duration-300 z-50 hover:scale-110 hover:-translate-x-1"
				aria-label="Imagen anterior"
			>
				<ChevronLeft className="w-8 h-8 md:w-12 md:h-12" />
			</button>

			{/* Image */}
			<div className="relative max-w-7xl max-h-[80vh] mx-4">
				<img
					src={room.imagenes[currentIndex]}
					alt={`${room.nombre} - Foto ${currentIndex + 1}`}
					className="max-w-full max-h-[80vh] object-contain transition-opacity duration-300"
				/>

				{/* Image Counter */}
				<div className="absolute -bottom-8 md:-bottom-12 left-1/2 transform -translate-x-1/2 text-neutral-50/80 text-sm md:text-base font-light tracking-wider">
					{currentIndex + 1} / {room.imagenes.length}
				</div>
			</div>

			{/* Next Button */}
			<button
				onClick={onNext}
				className="absolute right-4 md:right-8 text-neutral-50 hover:text-accent-500 transition-all duration-300 z-50 hover:scale-110 hover:translate-x-1"
				aria-label="Siguiente imagen"
			>
				<ChevronRight className="w-8 h-8 md:w-12 md:h-12" />
			</button>

			{/* Thumbnail Strip (opcional - solo en desktop) */}
			<div className="hidden lg:flex absolute bottom-8 left-1/2 transform -translate-x-1/2 gap-2 max-w-4xl overflow-x-auto px-4">
				{room.imagenes.map((img, idx) => (
					<button
						key={idx}
						onClick={() => onSelectImage(idx)}
						className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-sm overflow-hidden border-2 transition-all duration-300 ${
							idx === currentIndex ? "border-accent-500 scale-110" : "border-transparent opacity-60 hover:opacity-100"
						}`}
					>
						<div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${img})` }} />
					</button>
				))}
			</div>
		</div>
	);
};
