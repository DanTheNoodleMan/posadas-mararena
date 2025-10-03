"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const navItems = [
	{ name: "BIENVENIDOS", href: "#bienvenidos" },
	{ name: "POSADAS", href: "#posadas" },
	{ name: "SERVICIOS", href: "#servicios" },
];

const rightNavItems = [
	{ name: "GALERÍA", href: "#galeria" },
	{ name: "CONTACTO", href: "#contacto" },
];

export default function Header() {
	const [isScrolled, setIsScrolled] = useState(false);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 50);
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const handleReservar = () => {
		// Navigate to reservations page/flow
		window.location.href = "/reservas";
	};

	const scrollToSection = (href: string) => {
		const element = document.querySelector(href);
		if (element) {
			element.scrollIntoView({ behavior: "smooth" });
		}
		setIsMobileMenuOpen(false);
	};

	return (
		<>
			{/* Desktop Header */}
			<header
				className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
					isScrolled ? "bg-primary-600 bg-opacity-95 backdrop-blur-sm shadow-lg" : "bg-transparent"
				}`}
			>
				<nav className="section-padding">
					<div className="flex items-center justify-between py-4 lg:py-6">
						{/* Left Navigation */}
						<div className="hidden lg:flex items-center w-full justify-around mr-12">
							{navItems.map((item) => (
								<button key={item.name} onClick={() => scrollToSection(item.href)} className="nav-link text-lg font-light">
									{item.name}
								</button>
							))}
						</div>

						{/* Center Logo */}
						<div className="flex-shrink-1">
							<div className="w-16 h-16 lg:w-20 lg:h-20 bg-white rounded-full flex items-center justify-center shadow-lg">
								{/* Logo Mararena - circular con ondas doradas */}
								<div className="w-12 h-12 lg:w-16 lg:h-16 bg-primary-600 rounded-full border-2 border-accent-500 flex items-center justify-center relative overflow-hidden">
									{/* Ondas doradas */}
									<div className="absolute inset-0 flex items-center justify-center">
										<div className="w-full h-full relative">
											<div className="absolute inset-0 opacity-60">
												<svg viewBox="0 0 40 40" className="w-full h-full">
													<path
														d="M5 20 Q10 15 15 20 T25 20 T35 20"
														stroke="currentColor"
														strokeWidth="1.5"
														fill="none"
														className="text-accent-500"
													/>
													<path
														d="M5 22 Q10 17 15 22 T25 22 T35 22"
														stroke="currentColor"
														strokeWidth="1.5"
														fill="none"
														className="text-accent-500"
													/>
													<path
														d="M5 18 Q10 13 15 18 T25 18 T35 18"
														stroke="currentColor"
														strokeWidth="1.5"
														fill="none"
														className="text-accent-500"
													/>
												</svg>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>

						{/* Right Navigation */}
						<div className="hidden lg:flex items-center w-full justify-around ml-12">
							{rightNavItems.map((item) => (
								<button key={item.name} onClick={() => scrollToSection(item.href)} className="nav-link text-lg font-light">
									{item.name}
								</button>
							))}
							<button onClick={handleReservar} className="btn-primary text-sm px-8 py-3">
								RESERVAR
							</button>
						</div>

						{/* Mobile Menu Button */}
						<button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden p-2 text-neutral-50">
							{isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
						</button>
					</div>
				</nav>
			</header>

			{/* Mobile Menu */}
			<div
				className={`fixed inset-0 z-40 lg:hidden transition-all duration-300 ${
					isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
				}`}
			>
				<div className="absolute inset-0 bg-primary-600 bg-opacity-95 backdrop-blur-sm">
					<div className="flex flex-col items-center justify-center h-full space-y-8">
						{[...navItems, ...rightNavItems].map((item) => (
							<button key={item.name} onClick={() => scrollToSection(item.href)} className="nav-link text-2xl">
								{item.name}
							</button>
						))}
						<button onClick={handleReservar} className="btn-primary text-lg px-12 py-4 mt-8">
							RESERVAR
						</button>
					</div>
				</div>
			</div>
		</>
	);
}
