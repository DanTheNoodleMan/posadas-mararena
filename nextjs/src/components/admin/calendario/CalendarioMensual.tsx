// src/components/admin/calendario/CalendarioMensual.tsx
// Vista de calendario mensual con reservas
"use client";

import { useState } from "react";
import Link from "next/link";

interface Reserva {
	id: string;
	codigo_reserva: string;
	fecha_inicio: string;
	fecha_fin: string;
	nombre_cliente: string;
	estado: string;
	tipo_reserva: string;
	posada: {
		nombre: string;
	} | null;
}

interface CalendarioMensualProps {
	fecha: Date;
	reservas: Reserva[];
}

interface DiaCalendario {
	fecha: Date;
	esDelMes: boolean;
	reservas: Reserva[];
}

function getDiasDelMes(fecha: Date): DiaCalendario[] {
	const año = fecha.getFullYear();
	const mes = fecha.getMonth();

	// Primer y último día del mes
	const primerDia = new Date(año, mes, 1);
	const ultimoDia = new Date(año, mes + 1, 0);

	// Día de la semana del primer día (0 = domingo)
	const primerDiaSemana = primerDia.getDay();

	// Días a mostrar antes del mes (del mes anterior)
	const diasAnteriores = primerDiaSemana;

	// Días del mes
	const diasDelMes = ultimoDia.getDate();

	// Días a mostrar después (para completar la última semana)
	const totalDias = diasAnteriores + diasDelMes;
	const diasPosteriores = totalDias % 7 === 0 ? 0 : 7 - (totalDias % 7);

	const dias: DiaCalendario[] = [];

	// Días del mes anterior
	for (let i = diasAnteriores - 1; i >= 0; i--) {
		const fecha = new Date(año, mes, -i);
		dias.push({ fecha, esDelMes: false, reservas: [] });
	}

	// Días del mes actual
	for (let i = 1; i <= diasDelMes; i++) {
		const fecha = new Date(año, mes, i);
		dias.push({ fecha, esDelMes: true, reservas: [] });
	}

	// Días del siguiente mes
	for (let i = 1; i <= diasPosteriores; i++) {
		const fecha = new Date(año, mes + 1, i);
		dias.push({ fecha, esDelMes: false, reservas: [] });
	}

	return dias;
}

function estaEnRango(fecha: Date, inicio: string, fin: string): boolean {
	const fechaStr = fecha.toISOString().split("T")[0];
	return fechaStr >= inicio && fechaStr < fin; // fin es exclusivo
}

function getColorEstado(estado: string): string {
	const colores: Record<string, string> = {
		pendiente: "bg-amber-200 border-amber-400 text-amber-900",
		confirmada: "bg-green-200 border-green-400 text-green-900",
		completada: "bg-blue-200 border-blue-400 text-blue-900",
	};
	return colores[estado] || "bg-neutral-200 border-neutral-400 text-neutral-900";
}

export default function CalendarioMensual({ fecha, reservas }: CalendarioMensualProps) {
	const [diaSeleccionado, setDiaSeleccionado] = useState<Date | null>(null);

	const dias = getDiasDelMes(fecha);

	// Asignar reservas a cada día
	dias.forEach((dia) => {
		dia.reservas = reservas.filter((reserva) => estaEnRango(dia.fecha, reserva.fecha_inicio, reserva.fecha_fin));
	});

	const reservasDelDia = diaSeleccionado
		? dias.find((d) => d.fecha.toDateString() === diaSeleccionado.toDateString())?.reservas || []
		: [];

	return (
		<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
			{/* Calendario */}
			<div className="lg:col-span-2">
				{/* Días de la semana */}
				<div className="grid grid-cols-7 gap-px mb-2">
					{["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((dia) => (
						<div key={dia} className="text-center text-xs font-semibold text-neutral-600 py-2">
							{dia}
						</div>
					))}
				</div>

				{/* Grid de días */}
				<div className="grid grid-cols-7 gap-px bg-neutral-200 border border-neutral-200 rounded-lg overflow-hidden">
					{dias.map((dia, index) => {
						const esHoy = dia.fecha.toDateString() === new Date().toDateString();
						const esSeleccionado = diaSeleccionado && dia.fecha.toDateString() === diaSeleccionado.toDateString();

						return (
							<button
								key={index}
								onClick={() => setDiaSeleccionado(dia.fecha)}
								className={`
                  min-h-[80px] p-2 bg-white hover:bg-neutral-50 transition-colors text-left relative
                  ${!dia.esDelMes ? "opacity-40" : ""}
                  ${esSeleccionado ? "ring-2 ring-primary-500 ring-inset" : ""}
                `}
							>
								{/* Número del día */}
								<div className="flex items-center justify-between mb-1">
									<span
										className={`
                    text-sm font-semibold
                    ${
						esHoy
							? "bg-primary-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs"
							: "text-neutral-900"
					}
                    ${!dia.esDelMes && !esHoy ? "text-neutral-400" : ""}
                  `}
									>
										{dia.fecha.getDate()}
									</span>
									{dia.reservas.length > 0 && <span className="text-xs text-neutral-500">{dia.reservas.length}</span>}
								</div>

								{/* Indicadores de reservas */}
								<div className="space-y-1">
									{dia.reservas.slice(0, 2).map((reserva) => (
										<div
											key={reserva.id}
											className={`text-xs px-1 py-0.5 rounded truncate border ${getColorEstado(reserva.estado)}`}
											title={`${reserva.nombre_cliente} - ${reserva.posada?.nombre}`}
										>
											{reserva.codigo_reserva.split("-")[2]}
										</div>
									))}
									{dia.reservas.length > 2 && (
										<div className="text-xs text-neutral-500 px-1">+{dia.reservas.length - 2} más</div>
									)}
								</div>
							</button>
						);
					})}
				</div>
			</div>

			{/* Sidebar con reservas del día seleccionado */}
			<div className="lg:col-span-1">
				<div className="bg-neutral-50 rounded-lg p-4">
					<h3 className="text-sm font-semibold text-neutral-900 mb-4">
						{diaSeleccionado
							? diaSeleccionado.toLocaleDateString("es-VE", {
									weekday: "long",
									day: "numeric",
									month: "long",
							  })
							: "Selecciona un día"}
					</h3>

					{reservasDelDia.length === 0 ? (
						<p className="text-sm text-neutral-500">
							{diaSeleccionado ? "No hay reservas este día" : "Haz clic en un día para ver las reservas"}
						</p>
					) : (
						<ul className="space-y-2">
							{reservasDelDia.map((reserva) => (
								<li key={reserva.id}>
									<Link
										href={`/admin/reservas/${reserva.id}`}
										className="block p-3 bg-white rounded-lg hover:shadow-md transition-shadow border border-neutral-200"
									>
										<div className="flex items-start justify-between mb-1">
											<span className="text-xs font-mono text-primary-600">{reserva.codigo_reserva}</span>
											<span className={`text-xs px-2 py-0.5 rounded-full ${getColorEstado(reserva.estado)}`}>
												{reserva.estado}
											</span>
										</div>
										<p className="text-sm font-medium text-neutral-900">{reserva.nombre_cliente}</p>
										<p className="text-xs text-neutral-500">{reserva.posada?.nombre}</p>
									</Link>
								</li>
							))}
						</ul>
					)}
				</div>
			</div>
		</div>
	);
}
