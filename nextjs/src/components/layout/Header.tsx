"use client";

import { useState, useEffect, useRef } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from 'next/navigation';

interface HeaderProps {
    initialTransparent?: boolean;
}

const navItems = [
    { name: "BIENVENIDOS", href: "#bienvenidos" },
    { name: "POSADAS", href: "/posadas", hasDropdown: true }, // Agregado flag de dropdown
    { name: "SERVICIOS", href: "#servicios" },
];

const rightNavItems = [
    { name: "GALERÍA", href: "#galeria" },
    { name: "CONTACTO", href: "#contacto" },
];

// Opciones del dropdown de posadas
const posadasDropdown = [
    { name: "Vista al Mar", href: "/posadas/vista-al-mar", description: "Frente al mar" },
    { name: "Inmarcesible", href: "/posadas/inmarcesible", description: "Ideal para eventos" },
];

export default function Header({ initialTransparent = true }: HeaderProps) {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    
    const pathname = usePathname();
    const isLandingPage = pathname === '/'; 

    useEffect(() => {
        if (initialTransparent) {
            const handleScroll = () => {
                setIsScrolled(window.scrollY > 50);
            };

            window.addEventListener("scroll", handleScroll);
            return () => window.removeEventListener("scroll", handleScroll);
        }
    }, [initialTransparent]);

    // Cerrar dropdown al hacer click fuera
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

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

    const getNavigationAction = (href: string) => {
        if (href.startsWith('/') && !href.includes('#')) {
            return () => {
                window.location.href = href;
                setIsMobileMenuOpen(false);
                setDropdownOpen(false);
            };
        }
        
        if (isLandingPage) {
            return () => scrollToSection(href);
        } else {
            const hash = href.startsWith('#') ? href : `#${href.substring(1)}`;
            return () => {
                window.location.href = `/${hash}`;
                setIsMobileMenuOpen(false);
            };
        }
    };

    const headerBgClass = initialTransparent
        ? isScrolled
            ? "bg-primary-600 bg-opacity-95 backdrop-blur-sm shadow-lg"
            : "bg-transparent"
        : "bg-primary-600 shadow-lg"; 

    return (
        <>
            {/* Desktop Header */}
            <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${headerBgClass}`}>
                <nav className="section-padding">
                    <div className="flex items-center justify-between py-4">
                        {/* Left Navigation */}
                        <div className="hidden lg:flex items-center w-full justify-around mr-12">
                            {navItems.map((item) => (
                                <div key={item.name} className="relative">
                                    {item.hasDropdown ? (
                                        <div
                                            ref={dropdownRef}
                                            className="relative"
                                            onMouseEnter={() => setDropdownOpen(true)}
                                            onMouseLeave={() => setDropdownOpen(false)}
                                        >
                                            {/* Main Button */}
                                            <button
                                                onClick={getNavigationAction(item.href)}
                                                className="nav-link text-lg font-light flex items-center gap-1 group"
                                            >
                                                {item.name}
                                                <ChevronDown 
                                                    className={`w-4 h-4 transition-transform duration-300 ${
                                                        dropdownOpen ? 'rotate-180' : ''
                                                    }`} 
                                                />
                                            </button>

                                            {/* Dropdown Menu */}
                                            <div
                                                className={`absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 bg-primary-600 border-2 border-accent-500 shadow-2xl transition-all duration-300 ${
                                                    dropdownOpen 
                                                        ? 'opacity-100 visible translate-y-0' 
                                                        : 'opacity-0 invisible -translate-y-2'
                                                }`}
                                            >
                                                {/* Triangle indicator */}
                                                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-accent-500 rotate-45" />
                                                
                                                <div className="relative bg-primary-600 py-2">
                                                    {posadasDropdown.map((posada, index) => (
                                                        <Link
                                                            key={posada.href}
                                                            href={posada.href}
                                                            className={`block px-6 py-4 text-neutral-50 hover:bg-accent-500/20 transition-colors duration-300 group ${
                                                                index !== posadasDropdown.length - 1 ? 'border-b border-accent-500/30' : ''
                                                            }`}
                                                            onClick={() => setDropdownOpen(false)}
                                                        >
                                                            <div className="flex items-center justify-between">
                                                                <div>
                                                                    <div className="font-semibold text-base group-hover:text-accent-500 transition-colors">
                                                                        {posada.name}
                                                                    </div>
                                                                    <div className="text-xs text-neutral-50/70 mt-1">
                                                                        {posada.description}
                                                                    </div>
                                                                </div>
                                                                <ChevronDown className="w-4 h-4 -rotate-90 text-accent-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                            </div>
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <button onClick={getNavigationAction(item.href)} className="nav-link text-lg font-light">
                                            {item.name}
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Center Logo */}
                        <div className="flex-shrink-1">
                            <div className="w-16 h-16 lg:w-20 lg:h-20 bg-white rounded-full flex items-center justify-center shadow-lg">
                                <Link href="/">
                                    <Image src="/Logo.svg" alt="Mararena Posadas Logo" width={200} height={200} />
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
                    <div className="flex flex-col items-center justify-center h-full space-y-6 px-6">
                        {navItems.map((item) => (
                            <div key={item.name} className="w-full max-w-xs">
                                {item.hasDropdown ? (
                                    <div className="w-full">
                                        {/* Posadas Button con Dropdown Toggle */}
                                        <button
                                            onClick={() => setMobileDropdownOpen(!mobileDropdownOpen)}
                                            className="nav-link text-2xl flex items-center justify-center gap-2 w-full"
                                        >
                                            {item.name}
                                            <ChevronDown 
                                                className={`w-5 h-5 transition-transform duration-300 ${
                                                    mobileDropdownOpen ? 'rotate-180' : ''
                                                }`}
                                            />
                                        </button>

                                        {/* Mobile Dropdown Items */}
                                        <div
                                            className={`mt-4 space-y-3 overflow-hidden transition-all duration-300 ${
                                                mobileDropdownOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                            }`}
                                        >
                                            {/* Ver todas las posadas */}
                                            <Link
                                                href={item.href}
                                                onClick={() => {
                                                    setIsMobileMenuOpen(false);
                                                    setMobileDropdownOpen(false);
                                                }}
                                                className="block text-center py-3 px-6 bg-accent-500/20 border border-accent-500 text-neutral-50 text-lg hover:bg-accent-500/30 transition-colors"
                                            >
                                                Ver todas las posadas
                                            </Link>

                                            {/* Posadas individuales */}
                                            {posadasDropdown.map((posada) => (
                                                <Link
                                                    key={posada.href}
                                                    href={posada.href}
                                                    onClick={() => {
                                                        setIsMobileMenuOpen(false);
                                                        setMobileDropdownOpen(false);
                                                    }}
                                                    className="block text-center py-4 px-6 bg-primary-700/50 text-neutral-50 hover:bg-accent-500/20 transition-colors border-l-4 border-accent-500"
                                                >
                                                    <div className="font-semibold text-lg">{posada.name}</div>
                                                    <div className="text-xs text-neutral-50/70 mt-1">{posada.description}</div>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <button onClick={getNavigationAction(item.href)} className="nav-link text-2xl w-full text-center">
                                        {item.name}
                                    </button>
                                )}
                            </div>
                        ))}

                        {rightNavItems.map((item) => (
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