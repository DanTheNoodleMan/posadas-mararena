"use client";

import { useEffect, useRef, useState } from "react";
import Button from "@/components/ui/button";

const features = [
	{
		title: "Piscinas Infinity",
		description: "que abrazan el horizonte",
	},
	{
		title: "2 posadas exclusivas",
		description: "con personalidad única",
	},
	{
		title: "Tradición venezolana reimaginada",
		description: "en lujo tropical",
	},
	{
		title: "Amplios Espacios",
		description: "para hasta 31 personas",
	},
];

export default function Bienvenidos() {
	const [isVisible, setIsVisible] = useState(false);
	const sectionRef = useRef<HTMLElement>(null);

	useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setIsVisible(true);
				}
			},
			{ threshold: 0.2 }
		);

		if (sectionRef.current) {
			observer.observe(sectionRef.current);
		}

		return () => {
			if (sectionRef.current) {
				observer.unobserve(sectionRef.current);
			}
		};
	}, []);

	const handleExplorarPosadas = () => {
		const element = document.querySelector("#posadas");
		if (element) {
			element.scrollIntoView({ behavior: "smooth" });
		}
	};

	return (
		<section ref={sectionRef} id="bienvenidos" className="relative min-h-screen flex items-center overflow-hidden bg-neutral-100">
			{/* Desktop Layout */}
			<div className="hidden lg:block absolute inset-0">
				{/* Background Grid */}
				<div className="absolute inset-0 grid grid-cols-[35%_65%]">
					{/* Left - Cream */}
					<div className="bg-neutral-100" />

					{/* Right - Image */}
					<div
						className="bg-cover bg-center"
						style={{
							backgroundImage: "url('/images/bienvenidos-deck.webp')",
						}}
					>
						{/* Subtle gradient overlay for better text contrast if needed */}
						<div className="absolute inset-0 bg-gradient-to-r from-neutral-100/30 to-transparent" />
					</div>
				</div>
			</div>

			{/* Mobile Background */}
			<div className="lg:hidden absolute inset-0">
				<div
					className="absolute inset-0 bg-cover bg-center"
					style={{
						backgroundImage: "url('/images/bienvenidos-deck.webp')",
					}}
				>
					<div className="absolute inset-0 bg-neutral-100/60" />
				</div>
			</div>

			{/* Content Wrapper */}
			<div className="relative z-10 w-full">
				<div className="max-w-7xl mx-auto px-6 lg:px-12 xl:px-24 py-16 lg:py-24">
					{/* White Card Container - Positioned to overlap both sections */}
					<div
						className={`relative lg:absolute lg:left-12 xl:left-24 lg:top-1/2 lg:-translate-y-1/2 lg:w-[550px] xl:w-[650px] transition-all duration-1000 ${
							isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
						}`}
					>
						{/* White Card with Shadow */}
						<div className="bg-white shadow-[0_20px_60px_rgba(0,0,0,0.15)] rounded-sm p-8 lg:p-10 xl:p-14">
							{/* Subtitle with line accent */}
							<div className="flex items-center gap-4 mb-6">
								<div className="h-px w-12 bg-accent-500" />
								<span className="text-accent-500 font-body font-medium text-xs lg:text-sm uppercase tracking-[0.25em]">
									BIENVENIDOS A MARARENA
								</span>
							</div>

							{/* Main Title */}
							<h2 className="font-display font-bold text-primary-600 text-4xl lg:text-5xl xl:text-6xl leading-[1.1] mb-8">
								LUJO
								<br />
								TROPICAL
								<br />
								VENEZOLANO
							</h2>

							{/* Description */}
							<p className="font-body font-light text-primary-600 text-base lg:text-lg leading-relaxed mb-12 tracking-wide">
								En el corazón de Chirimena, donde las montañas abrazan el mar, hemos creado un santuario que celebra la
								esencia más pura de la hospitalidad venezolana.
							</p>

							{/* Features List */}
							<div className="space-y-3 lg:space-y-4 mb-8 lg:mb-10">
								{features.map((feature, index) => (
									<div
										key={index}
										className={`transition-all duration-700 delay-${index * 100} ${
											isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
										}`}
									>
										<div className="font-accent font-bold text-accent-500 text-md lg:text-lg leading-tight">
											{feature.title}{" "}
											<span className="font-accent font-normal italic text-primary-600 opacity-80">
												{feature.description}
											</span>
										</div>
									</div>
								))}
							</div>

							{/* CTA Button */}
							<Button onClick={handleExplorarPosadas} variant="primary" size="lg" className="w-full sm:w-auto px-10">
								EXPLORAR POSADAS
							</Button>
						</div>

						{/* Decorative accent line - extends from card */}
						<div className="hidden lg:block absolute -right-16 top-1/2 w-16 h-px bg-accent-500 opacity-40" />
					</div>
				</div>
			</div>

			{/* Optional: Decorative vertical line at split point */}
			<div className="hidden lg:block absolute left-[35%] top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-accent-500/20 to-transparent" />
		</section>
	);
}
