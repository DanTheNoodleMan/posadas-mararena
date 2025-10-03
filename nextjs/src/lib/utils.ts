import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Utility function para combinar classNames de manera inteligente
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// Función para formatear precios en USD
export function formatPrice(price: number): string {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		minimumFractionDigits: 0,
	}).format(price);
}

// Función para crear enlaces de WhatsApp
export function createWhatsAppLink(phone: string, message: string): string {
	const formattedPhone = phone.replace(/[^\d]/g, "");
	const encodedMessage = encodeURIComponent(message);
	return `https://wa.me/${formattedPhone}?text=${encodedMessage}`;
}

// Función para scroll suave a secciones
export function scrollToSection(sectionId: string): void {
	const element = document.querySelector(sectionId);
	if (element) {
		element.scrollIntoView({ behavior: "smooth" });
	}
}

// Función para optimizar imágenes (placeholder para implementación futura)
export function getOptimizedImageUrl(imagePath: string, width?: number, height?: number): string {
	// Por ahora retorna la imagen original
	// En el futuro se puede integrar con Cloudinary o Next.js Image
	return imagePath;
}
