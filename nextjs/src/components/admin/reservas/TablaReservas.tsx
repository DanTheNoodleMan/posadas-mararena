// src/components/admin/reservas/TablaReservas.tsx
// Tabla de reservas con acciones
"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { createSPAClient } from "@/lib/supabase/client";

interface Reserva {
	id: string;
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
	posada: {
		nombre: string;
	} | null;
}

interface TablaReservasProps {
	reservas: Reserva[];
	loading: boolean;
}

function formatearFecha(fecha: string) {
	const date = new Date(fecha + "T12:00:00");
	return date.toLocaleDateString("es-VE", {
		day: "2-digit",
		month: "short",
		year: "numeric",
	});
}

function getEstadoBadge(estado: string) {
	const badges: Record<string, { bg: string; text: string; label: string }> = {
		pendiente: { bg: "bg-amber-100", text: "text-amber-800", label: "Pendiente" },
		confirmada: { bg: "bg-green-100", text: "text-green-800", label: "Confirmada" },
		cancelada: { bg: "bg-red-100", text: "text-red-800", label: "Cancelada" },
		completada: { bg: "bg-blue-100", text: "text-blue-800", label: "Completada" },
	};

	const badge = badges[estado] || badges.pendiente;

	return (
		<span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${badge.bg} ${badge.text}`}>
			{badge.label}
		</span>
	);
}

export default function TablaReservas({ reservas, loading }: TablaReservasProps) {
	const supabase = createSPAClient();
	const [actualizando, setActualizando] = useState<string | null>(null);

	const confirmarReserva = async (id: string) => {
		setActualizando(id);

		const { error } = await supabase.from("reservas").update({ estado: "confirmada" }).eq("id", id);

		if (!error) {
			window.location.reload();
		}

		setActualizando(null);
	};

	const cancelarReserva = async (id: string) => {
		if (!confirm("¿Estás seguro de cancelar esta reserva?")) return;

		setActualizando(id);

		const { error } = await supabase
			.from("reservas")
			.update({
				estado: "cancelada",
				cancelada_en: new Date().toISOString(),
				razon_cancelacion: "Cancelada por admin",
			})
			.eq("id", id);

		if (!error) {
			window.location.reload();
		}

		setActualizando(null);
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center py-12">
				<Loader2 className="w-8 h-8 animate-spin text-primary-600" />
			</div>
		);
	}

	if (reservas.length === 0) {
		return (
			<div className="text-center py-12">
				<p className="text-neutral-500">No se encontraron reservas con los filtros seleccionados.</p>
			</div>
		);
	}

	return (
		<div className="overflow-x-auto">
			<table className="min-w-full divide-y divide-neutral-200">
				<thead className="bg-neutral-50">
					<tr>
						<th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
							Código
						</th>
						<th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
							Cliente
						</th>
						<th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
							Posada
						</th>
						<th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
							Fechas
						</th>
						<th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
							Precio
						</th>
						<th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
							Estado
						</th>
						<th scope="col" className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
							Acciones
						</th>
					</tr>
				</thead>
				<tbody className="bg-white divide-y divide-neutral-200">
					{reservas.map((reserva) => (
						<tr key={reserva.id} className="hover:bg-neutral-50">
							<td className="px-6 py-4 whitespace-nowrap">
								<Link
									href={`/admin/reservas/${reserva.id}`}
									className="text-sm font-medium text-primary-600 hover:text-primary-700"
								>
									{reserva.codigo_reserva}
								</Link>
							</td>
							<td className="px-6 py-4">
								<div className="text-sm text-neutral-900 font-medium">{reserva.nombre_cliente}</div>
								<div className="text-sm text-neutral-500">{reserva.email_cliente}</div>
							</td>
							<td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">{reserva.posada?.nombre || "N/A"}</td>
							<td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
								{formatearFecha(reserva.fecha_inicio)} - {formatearFecha(reserva.fecha_fin)}
							</td>
							<td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-neutral-900">
								${reserva.precio_total.toLocaleString("es-VE")}
							</td>
							<td className="px-6 py-4 whitespace-nowrap">{getEstadoBadge(reserva.estado)}</td>
							<td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
								<div className="flex items-center justify-end gap-2">
									<Link
										href={`/admin/reservas/${reserva.id}`}
										className="text-primary-600 hover:text-primary-900"
										title="Ver detalles"
									>
										<Eye className="w-5 h-5" />
									</Link>

									{reserva.estado === "pendiente" && (
										<>
											<button
												onClick={() => confirmarReserva(reserva.id)}
												disabled={actualizando === reserva.id}
												className="text-green-600 hover:text-green-900 disabled:opacity-50"
												title="Confirmar"
											>
												<CheckCircle className="w-5 h-5" />
											</button>
											<button
												onClick={() => cancelarReserva(reserva.id)}
												disabled={actualizando === reserva.id}
												className="text-red-600 hover:text-red-900 disabled:opacity-50"
												title="Cancelar"
											>
												<XCircle className="w-5 h-5" />
											</button>
										</>
									)}
								</div>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
