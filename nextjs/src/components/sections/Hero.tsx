"use client";

import { useState, useEffect } from "react";
import Button from "@/components/ui/button";

// Datos de las posadas con imágenes
const posadaImages = [
	{
		id: "vista-al-mar",
		name: "VISTA AL MAR",
		image: "/images/vista-al-mar-hero.webp",
		description: "Piscina infinita, jacuzzi y playa privada",
		slug: "vista-al-mar",
	},
	{
		id: "inmarcesible",
		name: "INMARCESIBLE",
		image: "/images/inmarcesible-hero.webp",
		description: "2 churuatas sociales y cocina industrial",
		slug: "inmarcesible",
	},
];

export default function Hero() {
	const [currentImageIndex, setCurrentImageIndex] = useState(0);
	const [isAutoRotating, setIsAutoRotating] = useState(true);
	const [buttonSize, setButtonSize] = useState<"sm" | "md" | "lg">("md");

	// Detectar tamaño de pantalla en el cliente
	useEffect(() => {
		const updateSize = () => {
			setButtonSize(window.innerWidth >= 1024 ? "lg" : "sm");
		};

		// Ejecutar inmediatamente
		updateSize();

		// Escuchar cambios de tamaño
		window.addEventListener("resize", updateSize);
		return () => window.removeEventListener("resize", updateSize);
	}, []);

	// Auto-rotate images every 5 seconds
	useEffect(() => {
		if (!isAutoRotating) return;

		const interval = setInterval(() => {
			setCurrentImageIndex((prev) => (prev + 1) % posadaImages.length);
		}, 5000);

		return () => clearInterval(interval);
	}, [isAutoRotating]);

	const handleImageChange = (index: number) => {
		setCurrentImageIndex(index);
		setIsAutoRotating(false);

		// Resume auto-rotation after 10 seconds
		setTimeout(() => {
			setIsAutoRotating(true);
		}, 10000);
	};

	const currentImage = posadaImages[currentImageIndex];

	const handleExplorarPosadas = () => {
		const element = document.querySelector("#posadas");
		if (element) {
			element.scrollIntoView({ behavior: "smooth" });
		}
	};

	const handleExplorarPosada = () => {
		if (currentImage.slug !== "general") {
			// Navigate to specific posada page
			window.location.href = `/posadas/${currentImage.slug}`;
		} else {
			handleExplorarPosadas();
		}
	};

	const handleReservarPosada = () => {
		// Navigate to reservations with pre-selected posada
		window.location.href = `/reservas?posada=${currentImage.slug}`;
	};

	const handleReservar = () => {
		const whatsappUrl = `https://wa.me/584123112746?text=${encodeURIComponent(
			`Hola! Me interesa hacer una reserva en ${currentImage.name}. ¿Podrían ayudarme con información disponible?`
		)}`;
		window.open(whatsappUrl, "_blank");
	};

	return (
		<section className="hero-height relative overflow-hidden">
			{/* Background Image */}
			<div
				className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 ease-in-out"
				style={{
					backgroundImage: `url(${currentImage.image})`,
				}}
			>
				{/* Overlay oscuro */}
				<div className="hero-overlay" />
			</div>

			{/* Main Content */}
			<div className="relative z-10 h-full flex items-center justify-center text-center section-padding">
				<div className="max-w-4xl mx-auto">
					{/* Subtitle */}
					<div className="hero-subtitle mb-4 ">CHIRIMENA - HIGUEROTE</div>

					{/* Main Title */}
					<h1 className="hero-title mb-6 text-shadow">
						POSADAS
						<br />
						MARARENA
					</h1>

					{/* Description */}
					<p className="hero-description mb-12 text-shadow tracking-widest">Lujosas posadas de playa que seducen el descanso</p>

					{/* CTA Buttons */}
					<div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
						<Button
							onClick={handleExplorarPosadas}
							variant="primary"
							size={buttonSize}
							className="text-base px-12 py-4 shadow-lg hover:shadow-xl"
						>
							EXPLORAR POSADAS
						</Button>

						{/* Show specific reservation button for individual posadas */}
						{currentImage.slug !== "general" && (
							<Button
								onClick={handleReservarPosada}
								variant="secondary"
								size={buttonSize}
								className="text-base px-12 py-4 shadow-lg hover:shadow-xl"
							>
								RESERVAR {currentImage.name}
							</Button>
						)}
					</div>
				</div>
			</div>

			{/* Right Side Controls */}
			<div className="flex flex-col absolute md:h-1/2 right-6 lg:right-12 top-[90%] md:top-[70%] transform -translate-y-1/2 z-20 justify-between">
				{/* Photo Indicators */}
				<div className="flex flex-col items-end space-y-4 mb-4">
					{posadaImages.map((_, index) => (
						<button
							key={index}
							onClick={() => handleImageChange(index)}
							className={`photo-indicator ${index === currentImageIndex ? "active" : ""}`}
							aria-label={`Ver imagen ${index + 1}`}
						/>
					))}
				</div>

				{/* Image Info */}
				<div className="flex flex-col text-right">
					<div className="text-neutral-50 font-display font-bold text-lg mb-2">POSADA {currentImage.name}</div>
					<button
						onClick={handleExplorarPosada}
						className="text-accent-500 font-accent text-sm italic hover:text-accent-600 transition-colors duration-200 flex items-center justify-end group"
					>
						Explorar
						<svg
							className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
						</svg>
					</button>
				</div>
			</div>

			{/* Bottom Scroll Indicator */}
			<div className="hidden sm:block absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 animate-bounce">
				<div className="w-6 h-10 border-2 border-neutral-50 rounded-full flex justify-center">
					<div className="w-1 h-3 bg-neutral-50 rounded-full mt-2 animate-pulse" />
				</div>
			</div>

			{/* Fallback for missing images */}
			<style jsx>{`
				.hero-height {
					background: linear-gradient(135deg, var(--color-primary-600) 0%, var(--color-primary-800) 100%);
				}
			`}</style>
		</section>
	);
}
