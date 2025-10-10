import React from "react";
import { Waves, Users, Home, UtensilsCrossed, Wifi, ParkingCircle } from "lucide-react";
import Link from "next/link";

const Posadas = () => {
	return (
		<>
			{/* VISTA AL MAR - Light Section */}
			<section id="posadas" className="relative bg-neutral-50">
				<div className="">
					{/* Content Top */}
					<div className="mx-auto px-12 pt-16 pb-8 md:pt-20 md:pb-12">
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
							{/* Left - Title & Description */}
							<div>
								<p className="text-accent-500 tracking-[0.3em] text-sm font-light mb-4">FRENTE AL MAR</p>
								<h2 className="font-display text-5xl md:text-6xl lg:text-7xl text-primary-600 mb-6">VISTA AL MAR</h2>
								<p className="text-primary-600/80 text-lg leading-relaxed">
									Una experiencia sublime donde el océano se convierte en protagonista. Amplias terrazas, piscina infinity
									y acceso directo a playa privada.
								</p>
							</div>

							{/* Right - Amenities & CTA */}
							<div className="flex flex-col justify-between h-full">
								{/* Amenities Grid */}
								<div className="grid grid-cols-2 gap-x-8 gap-y-4 mb-8">
									<AmenityItem icon={<Waves className="w-5 h-5" />} text="Piscina Infinity" />
									<AmenityItem icon={<Wifi className="w-5 h-5" />} text="WiFi Premium" />
									<AmenityItem icon={<Home className="w-5 h-5" />} text="Jacuzzi Privado" />
									<AmenityItem icon={<ParkingCircle className="w-5 h-5" />} text="Estacionamiento" />
									<AmenityItem icon={<Users className="w-5 h-5" />} text="Hasta 15 Huéspedes" />
									<AmenityItem icon={<UtensilsCrossed className="w-5 h-5" />} text="Cocina Gourmet" />
								</div>

								{/* CTA Button */}
								<Link
									href="/posadas/vista-al-mar"
									className="inline-block px-8 py-4 bg-accent-500 text-primary-600 font-semibold tracking-wider hover:bg-accent-600 transition-colors duration-300 text-center"
								>
									EXPLORAR
								</Link>
							</div>
						</div>
					</div>

					{/* Image Bottom - Full Width with Gradient Dissolve */}
					<div className="relative h-[400px] md:h-[500px] lg:h-[600px]">
						{/* Main Image */}
						<div
							className="absolute inset-0 bg-cover bg-center"
							style={{ backgroundImage: "url(/images/posadas/vista-al-mar-hero.webp)" }}
						/>

						{/* Gradient Dissolve Top - blends into white background */}
						<div className="absolute h-[200px] inset-0 -top-1 bg-gradient-to-b from-neutral-50 via-neutral-50/40 to-transparent via-[15%] border-0" />
					</div>
				</div>
			</section>

			{/* INMARCESIBLE - Dark Section */}
			<section className="relative h-screen">
				{/* Full Background Image - covers entire section */}
				<div
					className="absolute inset-0 bg-cover bg-center h-[950px]"
					style={{ backgroundImage: "url(/images/inmarcesible-hero.webp)" }}
				/>

				{/* Dark Overlay - ONLY on top portion where text is */}
				<div className="absolute top-0 left-0 right-0 h-[35%] bg-black/75" />

				{/* Gradient Dissolve Top - blends into white background */}
				<div className="absolute bottom-12 md:bottom-24 left-0 right-0 h-[200px] bg-gradient-to-t from-neutral-50 via-neutral-50/40 to-transparent via-[15%]" />

				{/* Content - positioned on top of overlay */}
				<div className="relative z-10 px-12 lg:px-16">
					<div className="max-w-7xl mx-auto pt-16 pb-8 md:pt-20 md:pb-12">
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
							{/* Left - Title & Description */}
							<div>
								<p className="text-accent-500 tracking-[0.3em] text-sm font-light mb-4">IDEAL PARA EVENTOS</p>
								<h2 className="font-display text-5xl md:text-6xl lg:text-7xl text-neutral-50 mb-6">INMARCESIBLE</h2>
								<p className="text-neutral-50 text-lg leading-relaxed">
									Una experiencia sublime donde el océano se convierte en protagonista. Amplias terrazas, piscina infinity
									y acceso directo a playa privada.
								</p>
							</div>

							{/* Right - Amenities & CTA */}
							<div className="flex flex-col justify-between h-full">
								{/* Amenities Grid */}
								<div className="grid grid-cols-2 gap-x-8 gap-y-4 mb-8">
									<AmenityItemDark icon={<Waves className="w-5 h-5" />} text="Piscina Infinity" />
									<AmenityItemDark icon={<Wifi className="w-5 h-5" />} text="WiFi Premium" />
									<AmenityItemDark icon={<Home className="w-5 h-5" />} text="Jacuzzi Privado" />
									<AmenityItemDark icon={<ParkingCircle className="w-5 h-5" />} text="Estacionamiento" />
									<AmenityItemDark icon={<Users className="w-5 h-5" />} text="Hasta 15 Huéspedes" />
									<AmenityItemDark icon={<UtensilsCrossed className="w-5 h-5" />} text="Cocina Gourmet" />
								</div>

								{/* CTA Button */}
								<Link
									href="/posadas/inmarcesible"
									className="inline-block px-8 py-4 bg-accent-500 text-primary-600 font-semibold tracking-wider hover:bg-accent-600 transition-colors duration-300 text-center"
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
const AmenityItem = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
	<div className="flex items-center gap-3">
		<div className="text-accent-500 flex-shrink-0">{icon}</div>
		<span className="text-primary-600/80 text-sm font-light">{text}</span>
	</div>
);

// Amenity Item for Dark Background (Inmarcesible)
const AmenityItemDark = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
	<div className="flex items-center gap-3">
		<div className="text-accent-500 flex-shrink-0">{icon}</div>
		<span className="text-neutral-50 text-sm font-light">{text}</span>
	</div>
);

export default Posadas;
