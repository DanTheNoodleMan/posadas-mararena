// Tipos para las posadas y habitaciones
export interface Posada {
	id: string;
	nombre: string;
	slug: string;
	descripcion: string;
	descripcion_corta: string;
	capacidad_maxima: number;
	precio_por_noche: number;
	precio_posada_completa: number;
	amenidades: string[];
	orden_display: number;
	activa: boolean;
	created_at: string;
	updated_at: string;
}

export interface Habitacion {
	id: string;
	posada_id: string;
	nombre: string;
	descripcion: string;
	capacidad: number;
	precio_por_noche: number;
	amenidades: string[];
	orden_display: number;
	activa: boolean;
	created_at: string;
	updated_at: string;
}

// Tipos para reservas
export interface Reserva {
	id: string;
	posada_id?: string;
	habitacion_id?: string;
	codigo_reserva: string;
	fecha_inicio: string;
	fecha_fin: string;
	numero_huespedes: number;
	precio_total: number;
	estado: "pendiente" | "confirmada" | "cancelada" | "completada";
	nombre_cliente: string;
	email_cliente: string;
	telefono_cliente: string;
	notas_especiales?: string;
	notas_admin?: string;
	confirmada_por?: string;
	confirmada_en?: string;
	cancelada_en?: string;
	razon_cancelacion?: string;
	session_id?: string;
	ip_address?: string;
	user_agent?: string;
	created_at: string;
	updated_at: string;
}

// Tipos para holds temporales
export interface HoldTemporal {
	id: string;
	posada_id?: string;
	habitacion_id?: string;
	fecha_inicio: string;
	fecha_fin: string;
	session_id: string;
	expires_at: string;
	created_at: string;
}

// Tipos para la navegación
export interface NavItem {
	name: string;
	href: string;
	external?: boolean;
}

// Tipos para imágenes del Hero
export interface HeroImage {
	id: string;
	name: string;
	image: string;
	description: string;
	slug: string;
}

// Tipos para componentes UI
export interface ButtonProps {
	variant?: "primary" | "secondary" | "ghost";
	size?: "sm" | "md" | "lg";
	children: React.ReactNode;
	className?: string;
	onClick?: () => void;
	disabled?: boolean;
	type?: "button" | "submit" | "reset";
}

// Tipos para formularios de reserva
export interface ReservaFormData {
	posada_id?: string;
	habitacion_id?: string;
	fecha_inicio: string;
	fecha_fin: string;
	numero_huespedes: number;
	nombre_cliente: string;
	email_cliente: string;
	telefono_cliente: string;
	notas_especiales?: string;
}

// Tipos para disponibilidad
export interface DisponibilidadResponse {
	disponible: boolean;
	fechas_ocupadas: string[];
	holds_activos: string[];
	mensaje?: string;
}

// Tipos para la API
export interface ApiResponse<T = any> {
	success: boolean;
	data?: T;
	error?: string;
	message?: string;
}

// Tipos para SEO/metadata
export interface PageMetadata {
	title: string;
	description: string;
	keywords?: string[];
	image?: string;
	url?: string;
}

// Tipos para configuración del sitio
export interface SiteConfig {
	name: string;
	description: string;
	url: string;
	whatsapp: string;
	instagram: string;
	email: string;
	phone: string;
}
