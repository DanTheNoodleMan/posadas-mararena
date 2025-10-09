// src/components/admin/dashboard/ReservasProximas.tsx
// Lista de próximas llegadas

import Link from "next/link";
import { Calendar, Users, MapPin } from "lucide-react";

interface Reserva {
	id: string;
	codigo_reserva: string;
	fecha_inicio: string;
	fecha_fin: string;
	num_huespedes: number;
	nombre_cliente: string;
	posada: {
		nombre: string;
	} | null;
	tipo_reserva: string;
}

interface ReservasProximasProps {
	reservas: Reserva[];
}

function formatearFecha(fecha: string) {
	const date = new Date(fecha + "T12:00:00");
	return date.toLocaleDateString("es-VE", {
		weekday: "short",
		day: "numeric",
		month: "short",
	});
}

function diasHasta(fecha: string) {
	const hoy = new Date();
	hoy.setHours(0, 0, 0, 0);
	const llegada = new Date(fecha + "T12:00:00");
	llegada.setHours(0, 0, 0, 0);
	const diff = llegada.getTime() - hoy.getTime();
	const dias = Math.ceil(diff / (1000 * 60 * 60 * 24));

	if (dias === 0) return "¡Hoy!";
	if (dias === 1) return "Mañana";
	return `En ${dias} días`;
}

export default function ReservasProximas({ reservas }: ReservasProximasProps) {
	if (reservas.length === 0) {
		return (
			<div className="px-6 py-12 text-center">
				<Calendar className="mx-auto h-12 w-12 text-neutral-400" />
				<h3 className="mt-2 text-sm font-semibold text-neutral-900">No hay llegadas próximas</h3>
				<p className="mt-1 text-sm text-neutral-500">No hay reservas confirmadas para los próximos 7 días.</p>
			</div>
		);
	}

	return (
		<div className="overflow-hidden">
			<ul className="divide-y divide-neutral-200">
				{reservas.map((reserva) => (
					<li key={reserva.id}>
						<Link href={`/admin/reservas/${reserva.id}`} className="block hover:bg-neutral-50 transition-colors">
							<div className="px-6 py-4">
								<div className="flex items-center justify-between">
									<div className="flex-1 min-w-0">
										{/* Código y nombre */}
										<div className="flex items-center gap-3 mb-2">
											<span className="inline-flex items-center rounded-md bg-primary-50 px-2.5 py-0.5 text-xs font-medium text-primary-700">
												{reserva.codigo_reserva}
											</span>
											<p className="text-sm font-semibold text-neutral-900 truncate">{reserva.nombre_cliente}</p>
										</div>

										{/* Detalles */}
										<div className="flex flex-wrap items-center gap-4 text-sm text-neutral-500">
											<div className="flex items-center gap-1">
												<MapPin className="h-4 w-4" />
												<span>{reserva.posada?.nombre || "Posada"}</span>
											</div>
											<div className="flex items-center gap-1">
												<Users className="h-4 w-4" />
												<span>{reserva.num_huespedes} huéspedes</span>
											</div>
											<div className="flex items-center gap-1">
												<Calendar className="h-4 w-4" />
												<span>
													{formatearFecha(reserva.fecha_inicio)} - {formatearFecha(reserva.fecha_fin)}
												</span>
											</div>
										</div>
									</div>

									{/* Días hasta llegada */}
									<div className="ml-4 flex-shrink-0">
										<span className="inline-flex items-center rounded-full bg-accent-100 px-3 py-1 text-xs font-medium text-accent-800">
											{diasHasta(reserva.fecha_inicio)}
										</span>
									</div>
								</div>
							</div>
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
}
