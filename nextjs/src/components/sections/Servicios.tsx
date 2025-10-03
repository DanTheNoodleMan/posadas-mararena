import React from "react";
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
		<section id="servicios" className="relative py-24 px-6 md:px-24 bg-neutral-50">
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

			{/* Services Grid */}
			<div className="mx-auto">
				<div className="grid grid-cols-1 md:grid-cols-11 gap-6 auto-rows-fr h-[600px]">
					{/* Column 1 - Left Small Cards */}
					<div className="md:col-span-3 flex flex-col gap-6">
						<ServiceCard service={services[0]} />
						<ServiceCard service={services[1]} />
					</div>

					{/* Column 2 - Center Large Card */}
					<div className="md:col-span-5">
						<ServiceCard service={services[2]} />
					</div>

					{/* Column 3 - Right Small Cards */}
					<div className="md:col-span-3 flex flex-col gap-6">
						<ServiceCard service={services[3]} />
						<ServiceCard service={services[4]} />
					</div>
				</div>
			</div>
		</section>
	);
};

const ServiceCard = ({ service }: { service: ServiceCard }) => {
	return (
		<div className="group relative overflow-hidden rounded-sm h-full min-h-[280px] cursor-pointer">
			{/* Background Image - using bg instead of img tag for better performance */}
			<div
				className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out will-change-transform group-hover:scale-105"
				style={{ backgroundImage: `url(${service.image})` }}
			/>

			{/* Overlay - ALWAYS dark enough to read white text, darkens MORE on hover */}
			<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30 transition-opacity duration-500 group-hover:from-black/90 group-hover:via-black/65 group-hover:to-black/40" />

			{/* Content */}
			<div className="relative h-full p-6 md:p-8 flex flex-col justify-end text-neutral-50">
				{/* Icon */}
				<div className="mb-3 text-accent-500 will-change-transform transition-transform duration-300 group-hover:scale-110">
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

			{/* Subtle border that appears on hover */}
			<div className="absolute inset-0 border-2 border-accent-500/0 group-hover:border-accent-500/30 transition-colors duration-500 pointer-events-none rounded-sm" />
		</div>
	);
};

export default Servicios;
