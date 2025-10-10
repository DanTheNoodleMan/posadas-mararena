"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from 'next/navigation';

interface HeaderProps {
    initialTransparent?: boolean;
}

// 1. MODIFICACIÓN: POSADAS ahora es una URL
const navItems = [
    { name: "BIENVENIDOS", href: "#bienvenidos" },
    { name: "POSADAS", href: "/posadas" }, // <-- URL directa
    { name: "SERVICIOS", href: "#servicios" },
];

const rightNavItems = [
    { name: "GALERÍA", href: "#galeria" },
    { name: "CONTACTO", href: "#contacto" },
];

export default function Header({ initialTransparent = true }: HeaderProps) {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    
    const pathname = usePathname();
    const isLandingPage = pathname === '/'; 

    useEffect(() => {
        // ... scroll logic remains the same ...
        if (initialTransparent) {
            const handleScroll = () => {
                setIsScrolled(window.scrollY > 50);
            };

            window.addEventListener("scroll", handleScroll);
            return () => window.removeEventListener("scroll", handleScroll);
        }
    }, [initialTransparent]);

    const handleReservar = () => {
        window.location.href = "/reservas";
    };

    const scrollToSection = (href: string) => {
        const element = document.querySelector(href);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
        setIsMobileMenuOpen(false);
    };

    // 2. MODIFICACIÓN: Lógica de navegación mejorada
    const getNavigationAction = (href: string) => {
        // Detectar si es una URL absoluta (inicia con '/') o no tiene un hash (#)
        if (href.startsWith('/') && !href.includes('#')) {
            // Caso 1: Navegación a una URL específica (ej: /posadas, /reservas)
            return () => {
                window.location.href = href;
                setIsMobileMenuOpen(false);
            };
        }
        
        // Caso 2: Navegación a una sección (hash)
        if (isLandingPage) {
            // Si está en la landing page, hacer scroll suave
            return () => scrollToSection(href);
        } else {
            // Si está en otra página, navegar a la landing con el hash
            // Quitamos el '#' del inicio para construir la URL correctamente
            const hash = href.startsWith('#') ? href : `#${href.substring(1)}`;
            return () => {
                window.location.href = `/${hash}`;
                setIsMobileMenuOpen(false);
            };
        }
    };

    // Determine the header background class (remains the same)
    const headerBgClass = initialTransparent
        ? isScrolled
            ? "bg-primary-600 bg-opacity-95 backdrop-blur-sm shadow-lg"
            : "bg-transparent"
        : "bg-primary-600 shadow-lg"; 

    return (
        <>
            {/* Desktop Header */}
            <header
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${headerBgClass}`}
            >
                <nav className="section-padding">
                    <div className="flex items-center justify-between py-4">
                        {/* Left Navigation */}
                        <div className="hidden lg:flex items-center w-full justify-around mr-12">
                            {navItems.map((item) => (
                                <button key={item.name} onClick={getNavigationAction(item.href)} className="nav-link text-lg font-light">
                                    {item.name}
                                </button>
                            ))}
                        </div>

                        {/* Center Logo (remains the same) */}
                        <div className="flex-shrink-1">
                            <div className="w-16 h-16 lg:w-20 lg:h-20 bg-white rounded-full flex items-center justify-center shadow-lg">
                                <Link href="/">
                                    <Image src="/Logo.svg" alt="Mararena Posadas Logo" width={200} height={200} className="" />
                                </Link>
                            </div>
                        </div>

                        {/* Right Navigation */}
                        <div className="hidden lg:flex items-center w-full justify-around ml-12">
                            {rightNavItems.map((item) => (
                                <button key={item.name} onClick={getNavigationAction(item.href)} className="nav-link text-lg font-light">
                                    {item.name}
                                </button>
                            ))}
                            <button onClick={handleReservar} className="btn-primary font-normal px-8 py-3">
                                RESERVAR
                            </button>
                        </div>

                        {/* Mobile Menu Button (remains the same) */}
                        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden p-2 text-neutral-50">
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </nav>
            </header>

            {/* Mobile Menu (Apply getNavigationAction here too) */}
            <div
                className={`fixed inset-0 z-40 lg:hidden transition-all duration-300 ${
                    isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
                }`}
            >
                <div className="absolute inset-0 bg-primary-600 bg-opacity-95 backdrop-blur-sm">
                    <div className="flex flex-col items-center justify-center h-full space-y-8">
                        {[...navItems, ...rightNavItems].map((item) => (
                            <button key={item.name} onClick={getNavigationAction(item.href)} className="nav-link text-2xl">
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