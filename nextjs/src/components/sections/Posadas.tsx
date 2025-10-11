"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Waves, PartyPopper, Users, Home, UtensilsCrossed, Wifi, ParkingCircle } from "lucide-react";

const Posadas = () => {
	// Refs for intersection observer
	const vistaAlMarRef = useRef<HTMLElement>(null);
	const inmarcesibleRef = useRef<HTMLElement>(null);
	
	const [vistaAlMarVisible, setVistaAlMarVisible] = useState(false);
	const [inmarcesibleVisible, setInmarcesibleVisible] = useState(false);

	useEffect(() => {
		const observerOptions = {
			threshold: 0.15,
			rootMargin: "50px",
		};

		const vistaAlMarObserver = new IntersectionObserver(([entry]) => {
			if (entry.isIntersecting) {
				setVistaAlMarVisible(true);
				vistaAlMarObserver.unobserve(entry.target);
			}
		}, observerOptions);

		const inmarcesibleObserver = new IntersectionObserver(([entry]) => {
			if (entry.isIntersecting) {
				setInmarcesibleVisible(true);
				inmarcesibleObserver.unobserve(entry.target);
			}
		}, observerOptions);

		if (vistaAlMarRef.current) {
			vistaAlMarObserver.observe(vistaAlMarRef.current);
		}
		if (inmarcesibleRef.current) {
			inmarcesibleObserver.observe(inmarcesibleRef.current);
		}

		return () => {
			if (vistaAlMarRef.current) {
				vistaAlMarObserver.unobserve(vistaAlMarRef.current);
			}
			if (inmarcesibleRef.current) {
				inmarcesibleObserver.unobserve(inmarcesibleRef.current);
			}
		};
	}, []);

	return (
		<>
			{/* VISTA AL MAR - Light Section */}
			<section ref={vistaAlMarRef} className="relative bg-neutral-50" id="posadas">
				<div className="relative">
					{/* Content Top - Floats above image */}
					<div className="relative z-20 px-6 md:px-12 lg:px-16 bg-neutral-50">
						<div className="max-w-7xl mx-auto pt-16 pb-8 md:pt-20 md:pb-12">
							<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
								{/* Left - Title & Description */}
								<div
									className={`transition-all duration-1000 ease-out ${
										vistaAlMarVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
									}`}
								>
									<p className="text-accent-500 tracking-[0.3em] text-sm font-light mb-4">FRENTE AL MAR</p>
									<h2 className="font-display text-5xl md:text-6xl lg:text-7xl text-primary-600 mb-6">VISTA AL MAR</h2>
									<p className="text-primary-600/80 text-lg leading-relaxed">
										Una experiencia sublime donde el océano se convierte en protagonista. Amplias terrazas, piscina infinity
										y acceso directo a playa privada.
									</p>
								</div>

								{/* Right - Amenities & CTA */}
								<div
									className={`flex flex-col justify-between h-full transition-all duration-1000 ease-out ${
										vistaAlMarVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
									}`}
									style={{ transitionDelay: "200ms" }}
								>
									{/* Amenities Grid */}
									<div className="grid grid-cols-2 gap-x-6 md:gap-x-8 gap-y-4 mb-8">
										<AmenityItem 
											icon={<Waves className="w-5 h-5" />} 
											text="Piscina Infinity" 
											isVisible={vistaAlMarVisible}
											delay={300}
										/>
										<AmenityItem 
											icon={<Wifi className="w-5 h-5" />} 
											text="WiFi Premium" 
											isVisible={vistaAlMarVisible}
											delay={350}
										/>
										<AmenityItem 
											icon={<Home className="w-5 h-5" />} 
											text="Jacuzzi Privado" 
											isVisible={vistaAlMarVisible}
											delay={400}
										/>
										<AmenityItem 
											icon={<ParkingCircle className="w-5 h-5" />} 
											text="Estacionamiento Seguro" 
											isVisible={vistaAlMarVisible}
											delay={450}
										/>
										<AmenityItem 
											icon={<Users className="w-5 h-5" />} 
											text="Hasta 12 Huéspedes" 
											isVisible={vistaAlMarVisible}
											delay={500}
										/>
										<AmenityItem 
											icon={<UtensilsCrossed className="w-5 h-5" />} 
											text="Cocina Gourmet" 
											isVisible={vistaAlMarVisible}
											delay={550}
										/>
									</div>

									{/* CTA Button */}
									<Link
										href="/posadas/vista-al-mar"
										className="inline-block px-8 py-4 bg-accent-500 text-primary-600 font-semibold tracking-wider hover:bg-accent-600 transition-all duration-300 text-center hover:scale-105 hover:shadow-lg"
									>
										EXPLORAR
									</Link>
								</div>
							</div>
						</div>
					</div>

					{/* Image Bottom - with responsive height */}
					<div
						className={`relative h-[300px] md:h-[400px] lg:h-[600px] transition-all duration-1000 ease-out ${
							vistaAlMarVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
						}`}
						style={{ transitionDelay: "400ms" }}
					>
						{/* Main Image */}
						<div
							className="absolute inset-0 bg-cover bg-center"
							style={{ backgroundImage: "url(/images/posadas/vista-al-mar-posada.webp)" }}
						/>

						{/* Gradient Dissolve Top - blends into white background */}
						<div
							className="absolute inset-0 bg-gradient-to-b from-neutral-50 via-neutral-50/40 to-transparent"
							style={{
								maskImage: "linear-gradient(to bottom, white 0%, white 15%, transparent 100%)",
								WebkitMaskImage: "linear-gradient(to bottom, white 0%, white 15%, transparent 100%)",
							}}
						/>
					</div>
				</div>
			</section>

			{/* INMARCESIBLE - Dark Section */}
			<section ref={inmarcesibleRef} className="relative">
				{/* Background Image Container - responsive height */}
				<div
					className={`relative h-[650px] md:h-[750px] lg:h-[950px] transition-all duration-1000 ease-out ${
						inmarcesibleVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
					}`}
				>
					{/* Full Background Image */}
					<div
						className="absolute inset-0 bg-cover bg-center"
						style={{ backgroundImage: "url(/images/posadas/inmarcesible-posada.webp)" }}
					/>

					{/* Dark Overlay - responsive height to cover text content */}
					<div className="absolute top-0 left-0 right-0 h-[85%] md:h-[55%] lg:h-[50%] bg-gradient-to-b from-black/85 via-black/75 to-transparent" />

					{/* Gradient Dissolve Bottom - blends into white background */}
					<div className="absolute bottom-0 left-0 right-0 h-[150px] md:h-[200px] bg-gradient-to-t from-neutral-50 via-neutral-50/60 to-transparent" />
				</div>

				{/* Content - positioned absolutely over the background */}
				<div className="absolute top-0 left-0 right-0 z-10 px-6 md:px-12 lg:px-16">
					<div className="max-w-7xl mx-auto pt-16 pb-8 md:pt-20 md:pb-12">
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
							{/* Left - Title & Description */}
							<div
								className={`transition-all duration-1000 ease-out ${
									inmarcesibleVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
								}`}
								style={{ transitionDelay: "200ms" }}
							>
								<p className="text-accent-500 tracking-[0.3em] text-sm font-light mb-4">IDEAL PARA EVENTOS</p>
								<h2 className="font-display text-4xl md:text-5xl lg:text-7xl text-neutral-50 mb-6">INMARCESIBLE</h2>
								<p className="text-neutral-50/95 text-base md:text-lg leading-relaxed">
									Una experiencia sublime donde el océano se convierte en protagonista. Amplias terrazas, piscina infinity
									y acceso directo a playa privada.
								</p>
							</div>

							{/* Right - Amenities & CTA */}
							<div
								className={`flex flex-col justify-between h-full transition-all duration-1000 ease-out ${
									inmarcesibleVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
								}`}
								style={{ transitionDelay: "400ms" }}
							>
								{/* Amenities Grid */}
								<div className="grid grid-cols-2 gap-x-6 md:gap-x-8 gap-y-4 mb-8">
									<AmenityItemDark 
										icon={<PartyPopper className="w-5 h-5" />} 
										text="2 Churuatas Sociales" 
										isVisible={inmarcesibleVisible}
										delay={500}
									/>
									<AmenityItemDark 
										icon={<Wifi className="w-5 h-5" />} 
										text="WiFi Premium" 
										isVisible={inmarcesibleVisible}
										delay={550}
									/>
									<AmenityItemDark 
										icon={<Waves className="w-5 h-5" />} 
										text="Jacuzzi Privado" 
										isVisible={inmarcesibleVisible}
										delay={600}
									/>
									<AmenityItemDark 
										icon={<ParkingCircle className="w-5 h-5" />} 
										text="Estacionamiento Seguro" 
										isVisible={inmarcesibleVisible}
										delay={650}
									/>
									<AmenityItemDark 
										icon={<Users className="w-5 h-5" />} 
										text="Hasta 31 Huéspedes" 
										isVisible={inmarcesibleVisible}
										delay={700}
									/>
									<AmenityItemDark 
										icon={<UtensilsCrossed className="w-5 h-5" />} 
										text="Cocina Gourmet" 
										isVisible={inmarcesibleVisible}
										delay={750}
									/>
								</div>

								{/* CTA Button */}
								<Link
									href="/posadas/inmarcesible"
									className="inline-block px-8 py-4 bg-accent-500 text-primary-600 font-semibold tracking-wider hover:bg-accent-600 transition-all duration-300 text-center hover:scale-105 hover:shadow-lg"
								>
									EXPLORAR
								</Link>
							</div>
						</div>
					</div>
				</div>
			</section>
		</>
	);
};

// Amenity Item for Light Background (Vista al Mar)
const AmenityItem = ({ 
	icon, 
	text, 
	isVisible, 
	delay 
}: { 
	icon: React.ReactNode; 
	text: string; 
	isVisible: boolean; 
	delay: number; 
}) => (
	<div
		className={`flex items-center gap-3 transition-all duration-700 ease-out ${
			isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
		}`}
		style={{ transitionDelay: `${delay}ms` }}
	>
		<div className="text-accent-500 flex-shrink-0">{icon}</div>
		<span className="text-primary-600/80 text-sm font-light">{text}</span>
	</div>
);

// Amenity Item for Dark Background (Inmarcesible)
const AmenityItemDark = ({ 
	icon, 
	text, 
	isVisible, 
	delay 
}: { 
	icon: React.ReactNode; 
	text: string; 
	isVisible: boolean; 
	delay: number; 
}) => (
	<div
		className={`flex items-center gap-3 transition-all duration-700 ease-out ${
			isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
		}`}
		style={{ transitionDelay: `${delay}ms` }}
	>
		<div className="text-accent-500 flex-shrink-0">{icon}</div>
		<span className="text-neutral-50/95 text-sm font-light">{text}</span>
	</div>
);

export default Posadas;