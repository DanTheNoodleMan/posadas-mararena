"use client";

import React, { useEffect, useRef, useState } from "react";
import { Waves, UtensilsCrossed, Home, Leaf } from "lucide-react";

interface ServiceCard {
	id: string;
	title: string;
	description: string;
	image: string;
	icon: React.ReactNode;
	size: "small" | "large";
}

const Servicios = () => {
	const services: ServiceCard[] = [
		{
			id: "piscinas",
			title: "Piscinas Privadas",
			description: "Diseños únicos que se integran con el paisaje natural. Cada piscina cuenta una historia diferente.",
			image: "/images/servicios/piscinas.webp",
			icon: <Waves className="w-6 h-6" />,
			size: "small",
		},
		{
			id: "cocinas",
			title: "Cocinas Equipadas",
			description: "Espacios gourmet para crear memorias culinarias en familia. O simplemente disfrutar un café al amanecer.",
			image: "/images/servicios/cocinas.webp",
			icon: <UtensilsCrossed className="w-6 h-6" />,
			size: "small",
		},
		{
			id: "momentos",
			title: "Momentos Auténticos",
			description:
				"No organizamos actividades. Te damos el espacio para que redescubras el placer de no hacer nada, de conversar sin prisa, de disfrutar un atardecer sin horarios. Aquí, la experiencia eres tú.",
			image: "/images/servicios/momentos.webp",
			icon: <Leaf className="w-6 h-6" />,
			size: "large",
		},
		{
			id: "churuata",
			title: "Churuata Tradicional",
			description: "Arquitectura venezolana auténtica con comodidades contemporáneas. Tradición y modernidad en armonía.",
			image: "/images/servicios/churuata.webp",
			icon: <Home className="w-6 h-6" />,
			size: "small",
		},
		{
			id: "jardines",
			title: "Jardines Naturales",
			description: "Espacios verdes diseñados para la contemplación. La naturaleza venezolana como protagonista.",
			image: "/images/servicios/jardin.webp",
			icon: <Leaf className="w-6 h-6" />,
			size: "small",
		},
	];

	return (
		<section id="servicios" className="relative py-24 px-6 md:px-12 lg:px-24 bg-neutral-50">
			{/* Header */}
			<div className="max-w-7xl mx-auto text-center mb-16">
				<p className="text-accent-500 tracking-[0.3em] text-sm font-light mb-4">VIVE LA EXPERIENCIA</p>
				<h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-primary-600 mb-6">
					SERVICIOS QUE DESPIERTAN LOS SENTIDOS
				</h2>
				<p className="font-serif italic text-primary-600/70 text-lg max-w-3xl mx-auto">
					Cada detalle pensado para que se desconecte del mundo y se conecte consigo mismo
				</p>
			</div>

			{/* Services Grid - Mobile: Stack, Desktop: Complex Grid */}
			<div className="max-w-7xl mx-auto">
				{/* MOBILE: Simple vertical stack */}
				<div className="md:hidden flex flex-col gap-6">
					{services.map((service, index) => (
						<ServiceCard key={service.id} service={service} index={index} />
					))}
				</div>

				{/* DESKTOP: Original complex grid layout */}
				<div className="hidden md:grid md:grid-cols-2 lg:grid-cols-11 gap-6">
					{/* Column 1 - Left Small Cards */}
					<div className="lg:col-span-3 flex flex-col gap-6">
						<ServiceCard service={services[0]} index={0} />
						<ServiceCard service={services[1]} index={1} />
					</div>

					{/* Column 2 - Center Large Card */}
					<div className="lg:col-span-5">
						<ServiceCard service={services[2]} index={2} />
					</div>

					{/* Column 3 - Right Small Cards */}
					<div className="lg:col-span-3 flex flex-col gap-6">
						<ServiceCard service={services[3]} index={3} />
						<ServiceCard service={services[4]} index={4} />
					</div>
				</div>
			</div>
		</section>
	);
};

const ServiceCard = ({ service, index }: { service: ServiceCard; index: number }) => {
	const cardRef = useRef<HTMLDivElement>(null);
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setIsVisible(true);
					observer.unobserve(entry.target);
				}
			},
			{
				threshold: 0.1,
				rootMargin: "50px",
			}
		);

		if (cardRef.current) {
			observer.observe(cardRef.current);
		}

		return () => {
			if (cardRef.current) {
				observer.unobserve(cardRef.current);
			}
		};
	}, []);

	return (
		<div
			ref={cardRef}
			className={`
				group relative overflow-hidden rounded-sm 
				h-[320px] md:h-[380px] lg:h-full lg:min-h-[280px] 
				cursor-pointer
				transition-all duration-700 ease-out
				${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
			`}
			style={{
				transitionDelay: `${index * 150}ms`,
			}}
		>
			{/* Background Image */}
			<div
				className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out will-change-transform group-hover:scale-105"
				style={{ backgroundImage: `url(${service.image})` }}
			/>

			{/* Overlay - darker base, even darker on hover */}
			<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30 transition-opacity duration-500 group-hover:from-black/90 group-hover:via-black/65 group-hover:to-black/40" />

			{/* Content */}
			<div className="relative h-full p-6 md:p-8 flex flex-col justify-end text-neutral-50">
				{/* Icon with subtle animation */}
				<div className="mb-3 text-accent-500 will-change-transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
					{service.icon}
				</div>

				{/* Title with decorative line */}
				<div className="mb-3">
					<div className="w-12 h-[2px] bg-accent-500 mb-3 will-change-[width] transition-all duration-500 group-hover:w-20 group-hover:h-[3px]" />
					<h3 className="font-display text-xl md:text-2xl lg:text-3xl leading-tight">{service.title}</h3>
				</div>

				{/* Description */}
				<p className="text-neutral-50/95 text-sm md:text-base leading-relaxed font-light">{service.description}</p>
			</div>

			{/* Subtle border on hover */}
			<div className="absolute inset-0 border-2 border-accent-500/0 group-hover:border-accent-500/30 transition-colors duration-500 pointer-events-none rounded-sm" />
		</div>
	);
};

export default Servicios;