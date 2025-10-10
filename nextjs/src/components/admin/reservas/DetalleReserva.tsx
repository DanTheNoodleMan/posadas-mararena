// src/components/admin/reservas/DetalleReserva.tsx
// Componente con información completa de la reserva

import { Calendar, Users, MapPin, Phone, Mail, DollarSign, Home, Bed } from "lucide-react";

interface Reserva {
	codigo_reserva: string;
	fecha_inicio: string;
	fecha_fin: string;
	num_huespedes: number;
	nombre_cliente: string;
	email_cliente: string;
	telefono_cliente: string;
	precio_total: number;
	estado: string;
	tipo_reserva: string;
	notas_cliente: string | null;
	notas_admin: string | null;
	created_at: string;
	posada: {
		nombre: string;
	} | null;
	habitaciones: Array<{
		habitacion: {
			nombre: string;
			numero: string;
			precio_por_noche: number;
			capacidad: number;
		};
	}>;
}

interface DetalleReservaProps {
	reserva: Reserva;
}

function formatearFecha(fecha: string) {
	const date = new Date(fecha + "T12:00:00");
	return date.toLocaleDateString("es-VE", {
		weekday: "long",
		day: "numeric",
		month: "long",
		year: "numeric",
	});
}

function calcularNoches(inicio: string, fin: string) {
	const fechaInicio = new Date(inicio);
	const fechaFin = new Date(fin);
	const diff = fechaFin.getTime() - fechaInicio.getTime();
	return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export default function DetalleReserva({ reserva }: DetalleReservaProps) {
	const noches = calcularNoches(reserva.fecha_inicio, reserva.fecha_fin);

	console.log("Reserva detalles:", reserva);

	return (
		<div className="bg-white shadow rounded-lg divide-y divide-neutral-200">
			{/* Información de Fechas */}
			<div className="p-6">
				<h2 className="text-lg font-semibold text-neutral-900 mb-4">Información de la Reserva</h2>

				<dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div>
						<dt className="text-sm font-medium text-neutral-500 flex items-center gap-2 mb-1">
							<Calendar className="w-4 h-4" />
							Check-in
						</dt>
						<dd className="text-sm text-neutral-900 font-semibold">
							{formatearFecha(reserva.fecha_inicio)}
							<span className="text-neutral-500 font-normal ml-2">(3:00 PM)</span>
						</dd>
					</div>

					<div>
						<dt className="text-sm font-medium text-neutral-500 flex items-center gap-2 mb-1">
							<Calendar className="w-4 h-4" />
							Check-out
						</dt>
						<dd className="text-sm text-neutral-900 font-semibold">
							{formatearFecha(reserva.fecha_fin)}
							<span className="text-neutral-500 font-normal ml-2">(11:00 AM)</span>
						</dd>
					</div>

					<div>
						<dt className="text-sm font-medium text-neutral-500 flex items-center gap-2 mb-1">
							<MapPin className="w-4 h-4" />
							Posada
						</dt>
						<dd className="text-sm text-neutral-900">{reserva.posada?.nombre || "N/A"}</dd>
					</div>

					<div>
						<dt className="text-sm font-medium text-neutral-500 flex items-center gap-2 mb-1">
							<Home className="w-4 h-4" />
							Tipo de Reserva
						</dt>
						<dd className="text-sm text-neutral-900">
							{reserva.tipo_reserva === "posada_completa" ? "Posada Completa" : "Habitaciones Individuales"}
						</dd>
					</div>

					<div>
						<dt className="text-sm font-medium text-neutral-500 flex items-center gap-2 mb-1">
							<Users className="w-4 h-4" />
							Huéspedes
						</dt>
						<dd className="text-sm text-neutral-900">
							{reserva.num_huespedes} persona{reserva.num_huespedes !== 1 ? "s" : ""}
						</dd>
					</div>

					<div>
						<dt className="text-sm font-medium text-neutral-500 mb-1">Noches</dt>
						<dd className="text-sm text-neutral-900">
							{noches} noche{noches !== 1 ? "s" : ""}
						</dd>
					</div>
				</dl>
			</div>

			{/* Habitaciones */}
			{reserva.habitaciones && reserva.habitaciones.length > 0 && (
				<div className="p-6">
					<h3 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
						<Bed className="w-5 h-5" />
						Habitaciones Reservadas
					</h3>
					<ul className="space-y-2">
						{reserva.habitaciones.map((item, index) => (
							<li key={index} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
								<div>
									<p className="text-sm font-medium text-neutral-900">{item.habitacion.nombre}</p>
									<p className="text-xs text-neutral-500">Capacidad: {item.habitacion.capacidad} personas</p>
								</div>
								<p className="text-sm font-semibold text-neutral-900">${item.habitacion.precio_por_noche}/noche</p>
							</li>
						))}
					</ul>
				</div>
			)}

			{/* Información del Cliente */}
			<div className="p-6">
				<h3 className="text-lg font-semibold text-neutral-900 mb-4">Información del Cliente</h3>

				<dl className="space-y-3">
					<div>
						<dt className="text-sm font-medium text-neutral-500 mb-1">Nombre completo</dt>
						<dd className="text-sm text-neutral-900">{reserva.nombre_cliente}</dd>
					</div>

					<div>
						<dt className="text-sm font-medium text-neutral-500 flex items-center gap-2 mb-1">
							<Mail className="w-4 h-4" />
							Email
						</dt>
						<dd className="text-sm text-neutral-900">
							<a href={`mailto:${reserva.email_cliente}`} className="text-primary-600 hover:underline">
								{reserva.email_cliente}
							</a>
						</dd>
					</div>

					<div>
						<dt className="text-sm font-medium text-neutral-500 flex items-center gap-2 mb-1">
							<Phone className="w-4 h-4" />
							Teléfono
						</dt>
						<dd className="text-sm text-neutral-900">
							<a href={`tel:${reserva.telefono_cliente}`} className="text-primary-600 hover:underline">
								{reserva.telefono_cliente}
							</a>
						</dd>
					</div>
				</dl>
			</div>

			{/* Notas */}
			{(reserva.notas_cliente || reserva.notas_admin) && (
				<div className="p-6">
					<h3 className="text-lg font-semibold text-neutral-900 mb-4">Notas</h3>

					{reserva.notas_cliente && (
						<div className="mb-4">
							<dt className="text-sm font-medium text-neutral-500 mb-2">Notas del cliente</dt>
							<dd className="text-sm text-neutral-900 bg-neutral-50 p-3 rounded-lg">{reserva.notas_cliente}</dd>
						</div>
					)}

					{reserva.notas_admin && (
						<div>
							<dt className="text-sm font-medium text-neutral-500 mb-2">Notas administrativas</dt>
							<dd className="text-sm text-neutral-900 bg-amber-50 p-3 rounded-lg border border-amber-200">
								{reserva.notas_admin}
							</dd>
						</div>
					)}
				</div>
			)}

			{/* Precio */}
			<div className="p-6 bg-neutral-50">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<DollarSign className="w-5 h-5 text-neutral-500" />
						<span className="text-lg font-semibold text-neutral-900">Precio Total</span>
					</div>
					<span className="text-2xl font-bold text-primary-600">${reserva.precio_total.toLocaleString("es-VE")}</span>
				</div>
				<p className="text-xs text-neutral-500 mt-2">
					{noches} noche{noches !== 1 ? "s" : ""} × ${(reserva.precio_total / noches).toFixed(2)} promedio por noche
				</p>
			</div>
		</div>
	);
}
