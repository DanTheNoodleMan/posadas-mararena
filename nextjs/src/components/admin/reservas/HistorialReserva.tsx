// src/components/admin/reservas/HistorialReserva.tsx
// Timeline de cambios de la reserva

import { Clock } from "lucide-react";

interface Log {
	id: string;
	accion: string;
	estado_anterior: string | null;
	estado_nuevo: string | null;
	detalles: Record<string, any>;
	created_at: string;
}

interface HistorialReservaProps {
	logs: Log[];
}

function formatearFechaHora(fecha: string) {
	const date = new Date(fecha);
	return date.toLocaleString("es-VE", {
		day: "2-digit",
		month: "short",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	});
}

function getAccionLabel(accion: string, estadoAnterior: string | null, estadoNuevo: string | null) {
	const acciones: Record<string, string> = {
		reserva_creada: "Reserva creada",
		hold_creado: "Hold temporal creado",
		estado_actualizado: `Estado cambiado: ${estadoAnterior} → ${estadoNuevo}`,
		reserva_modificada: "Reserva modificada",
		pago_confirmado: "Pago confirmado",
		reserva_cancelada: "Reserva cancelada",
	};

	return acciones[accion] || accion;
}

function getAccionColor(accion: string) {
	const colores: Record<string, string> = {
		reserva_creada: "bg-blue-100 text-blue-800",
		hold_creado: "bg-purple-100 text-purple-800",
		estado_actualizado: "bg-amber-100 text-amber-800",
		pago_confirmado: "bg-green-100 text-green-800",
		reserva_cancelada: "bg-red-100 text-red-800",
	};

	return colores[accion] || "bg-neutral-100 text-neutral-800";
}

export default function HistorialReserva({ logs }: HistorialReservaProps) {
	return (
		<div className="bg-white shadow rounded-lg p-6">
			<h2 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
				<Clock className="w-5 h-5" />
				Historial de Cambios
			</h2>

			<div className="flow-root">
				<ul className="-mb-8">
					{logs.map((log, index) => (
						<li key={log.id}>
							<div className="relative pb-8">
								{/* Line connecting events */}
								{index < logs.length - 1 && (
									<span className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-neutral-200" aria-hidden="true" />
								)}

								<div className="relative flex space-x-3">
									{/* Icon */}
									<div>
										<span
											className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${getAccionColor(
												log.accion
											)}`}
										>
											<Clock className="h-4 w-4" />
										</span>
									</div>

									{/* Content */}
									<div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
										<div>
											<p className="text-sm text-neutral-900 font-medium">
												{getAccionLabel(log.accion, log.estado_anterior, log.estado_nuevo)}
											</p>

											{/* Detalles adicionales */}
											{log.detalles && Object.keys(log.detalles).length > 0 && (
												<div className="mt-2 text-xs text-neutral-500">
													{Object.entries(log.detalles).map(([key, value]) => (
														<div key={key}>
															<span className="font-medium">{key}:</span> {String(value)}
														</div>
													))}
												</div>
											)}
										</div>

										<div className="whitespace-nowrap text-right text-sm text-neutral-500">
											{formatearFechaHora(log.created_at)}
										</div>
									</div>
								</div>
							</div>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
}
