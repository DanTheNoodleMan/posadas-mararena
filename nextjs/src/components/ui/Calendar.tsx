"use client";

import React, { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface FechaOcupada {
	fecha_inicio: string;
	fecha_fin: string;
}

interface CalendarioReservasProps {
	fechaInicio: string | null;
	fechaFin: string | null;
	onFechasChange: (inicio: string, fin: string) => void;
	fechasOcupadas: FechaOcupada[];
	minNights?: number;
}

export default function CalendarioReservas({
	fechaInicio,
	fechaFin,
	onFechasChange,
	fechasOcupadas = [],
	minNights = 1
}: CalendarioReservasProps) {
	const [mesActual, setMesActual] = useState(new Date());
	const [seleccionando, setSeleccionando] = useState<"inicio" | "fin">("inicio");

	// Convertir Date a string local (sin problemas de timezone)
	const dateToLocalString = (date: Date): string => {
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const day = String(date.getDate()).padStart(2, '0');
		return `${year}-${month}-${day}`;
	};

	// Generar días del mes
	const diasDelMes = useMemo(() => {
		const year = mesActual.getFullYear();
		const month = mesActual.getMonth();
		const primerDia = new Date(year, month, 1);
		const ultimoDia = new Date(year, month + 1, 0);
		
		const dias = [];
		const primerDiaSemana = primerDia.getDay();
		
		// Días vacíos al inicio
		for (let i = 0; i < primerDiaSemana; i++) {
			dias.push(null);
		}
		
		// Días del mes
		for (let dia = 1; dia <= ultimoDia.getDate(); dia++) {
			dias.push(new Date(year, month, dia));
		}
		
		return dias;
	}, [mesActual]);

	// ✅ NUEVA FUNCIÓN: Verificar si una fecha es el primer día (checkin) de una reserva existente
	const esCheckinDay = (fecha: Date): boolean => {
		const fechaStr = dateToLocalString(fecha);
		return fechasOcupadas.some(ocupada => {
			// Es checkin day si coincide exactamente con fecha_inicio
			return fechaStr === ocupada.fecha_inicio;
		});
	};

	// Verificar si una fecha puede ser checkout de otra reserva
	const esCheckoutDay = (fecha: Date): boolean => {
		const fechaStr = dateToLocalString(fecha);
		return fechasOcupadas.some(ocupada => {
			// Es checkout day si coincide exactamente con fecha_fin
			return fechaStr === ocupada.fecha_fin;
		});
	};

	// Verificar si una fecha está ocupada como NOCHE (no puede estar dentro de un rango)
	const estaOcupadaComoNoche = (fecha: Date): boolean => {
		const fechaStr = dateToLocalString(fecha);
		return fechasOcupadas.some(ocupada => {
			// Una fecha está ocupada como noche si:
			// - Es DESPUÉS del inicio (>) Y ANTES del fin (<)
			// - Esto excluye tanto el checkin day como el checkout day
			return fechaStr > ocupada.fecha_inicio && fechaStr < ocupada.fecha_fin;
		});
	};

	// ✅ FUNCIÓN ACTUALIZADA: Verificar si una fecha es seleccionable
	const esSeleccionable = (fecha: Date): boolean => {
		const hoy = new Date();
		hoy.setHours(0, 0, 0, 0);
		
		// No se puede seleccionar fechas pasadas
		if (fecha < hoy) return false;
		
		// Si la fecha está ocupada como noche, NO es seleccionable bajo ninguna circunstancia
		if (estaOcupadaComoNoche(fecha)) return false;
		
		// Si estamos seleccionando el inicio de una nueva reserva:
		if (seleccionando === "inicio" || !fechaInicio) {
			// El inicio puede ser:
			// 1. Un día completamente libre
			// 2. Un checkout day (último día de otra reserva)
			// NO puede ser un checkin day (primer día de otra reserva)
			if (esCheckinDay(fecha)) return false;
			return true;
		}
		
		// Si estamos seleccionando el fin de una nueva reserva:
		// El fin puede ser:
		// 1. Un día completamente libre
		// 2. Un checkin day (primer día de otra reserva)
		// NO puede ser un checkout day (último día de otra reserva)
		if (esCheckoutDay(fecha)) return false;
		return true;
	};

	// Verificar si una fecha está en el rango seleccionado
	const estaEnRango = (fecha: Date): boolean => {
		if (!fechaInicio || !fechaFin) return false;
		const fechaStr = dateToLocalString(fecha);
		return fechaStr > fechaInicio && fechaStr < fechaFin;
	};

	// Manejar click en día
	const handleDiaClick = (fecha: Date) => {
		if (!esSeleccionable(fecha)) return;

		const fechaStr = dateToLocalString(fecha);

		// ✅ NUEVO: Si haces clic en la misma fecha de inicio (y no hay fin), deseleccionar todo
		if (fechaStr === fechaInicio && !fechaFin) {
			onFechasChange("", "");
			setSeleccionando("inicio");
			return;
		}

		if (seleccionando === "inicio" || !fechaInicio) {
			onFechasChange(fechaStr, "");
			setSeleccionando("fin");
		} else if (seleccionando === "fin") {
			const inicio = new Date(fechaInicio);
			const fin = fecha;
			
			// Verificar que fin sea después de inicio
			if (fin <= inicio) {
				onFechasChange(fechaStr, "");
				setSeleccionando("fin");
				return;
			}
			
			// ✅ CORREGIDO: Verificar que no haya conflictos DENTRO del rango
			let hayConflicto = false;
			const diffTime = Math.abs(fin.getTime() - inicio.getTime());
			const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
			
			// Verificar cada día DENTRO del rango (no incluir el último día)
			for (let i = 0; i < diffDays; i++) {
				const checkDate = new Date(inicio);
				checkDate.setDate(checkDate.getDate() + i);
				
				// Un día genera conflicto si:
				// 1. Es un checkin day (primer día de otra reserva)
				// 2. Está ocupado como noche de otra reserva
				if (esCheckinDay(checkDate) || estaOcupadaComoNoche(checkDate)) {
					hayConflicto = true;
					break;
				}
			}
			
			if (hayConflicto) {
				// Resetear y empezar de nuevo
				onFechasChange(fechaStr, "");
				setSeleccionando("fin");
				return;
			}
			
			onFechasChange(fechaInicio, fechaStr);
			setSeleccionando("inicio");
		}
	};

	// Navegar meses
	const mesAnterior = () => {
		setMesActual(new Date(mesActual.getFullYear(), mesActual.getMonth() - 1));
	};

	const mesSiguiente = () => {
		setMesActual(new Date(mesActual.getFullYear(), mesActual.getMonth() + 1));
	};

	// Formatear nombre del mes
	const nombreMes = mesActual.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });

	return (
		<div className="bg-neutral-50 border border-neutral-300 rounded-sm p-6">
			{/* Header del calendario */}
			<div className="flex items-center justify-between mb-6">
				<button
					onClick={mesAnterior}
					className="p-2 hover:bg-neutral-200 rounded-full transition-colors"
					type="button"
				>
					<ChevronLeft className="w-5 h-5" />
				</button>
				<h3 className="font-semibold text-primary-600 capitalize">{nombreMes}</h3>
				<button
					onClick={mesSiguiente}
					className="p-2 hover:bg-neutral-200 rounded-full transition-colors"
					type="button"
				>
					<ChevronRight className="w-5 h-5" />
				</button>
			</div>

			{/* Días de la semana */}
			<div className="grid grid-cols-7 gap-2 mb-2">
				{['D', 'L', 'M', 'M', 'J', 'V', 'S'].map((dia, idx) => (
					<div key={idx} className="text-center text-sm font-semibold text-primary-600/70">
						{dia}
					</div>
				))}
			</div>

			{/* Grid de días */}
			<div className="grid grid-cols-7 gap-2">
				{diasDelMes.map((fecha, idx) => {
					if (!fecha) {
						return <div key={`empty-${idx}`} />;
					}

					const fechaStr = dateToLocalString(fecha);
					const esInicio = fechaStr === fechaInicio;
					const esFin = fechaStr === fechaFin;
					const enRango = estaEnRango(fecha);
					const ocupadaComoNoche = estaOcupadaComoNoche(fecha);
					const checkinDay = esCheckinDay(fecha);
					const checkoutDay = esCheckoutDay(fecha);
					const seleccionable = esSeleccionable(fecha);

					// ✅ CORREGIDO: Prioridad de estilos
					// 1. Seleccionado (inicio/fin) - siempre tiene prioridad
					// 2. En rango
					// 3. Checkin/Checkout disponible
					// 4. Ocupado como noche
					// 5. Normal seleccionable

					let claseEstilo = '';
					if (esInicio || esFin) {
						claseEstilo = 'bg-primary-600 text-neutral-50 font-bold';
					} else if (enRango) {
						claseEstilo = 'bg-primary-600/20';
					} else if (ocupadaComoNoche) {
						claseEstilo = 'bg-red-50 text-red-300';
					} else if ((checkinDay || checkoutDay) && seleccionable) {
						claseEstilo = 'bg-amber-50 border border-amber-300 text-primary-600';
					} else if (seleccionable) {
						claseEstilo = 'hover:bg-neutral-200';
					}

					return (
						<button
							key={idx}
							onClick={() => handleDiaClick(fecha)}
							disabled={!seleccionable}
							type="button"
							className={`
								aspect-square flex items-center justify-center text-sm rounded-sm transition-all relative
								${!seleccionable ? 'text-neutral-300 cursor-not-allowed line-through' : 'cursor-pointer'}
								${claseEstilo}
							`}
						>
							{fecha.getDate()}
						</button>
					);
				})}
			</div>

			{/* Leyenda */}
			<div className="mt-6 flex flex-wrap gap-4 text-xs">
				<div className="flex items-center gap-2">
					<div className="w-4 h-4 bg-primary-600 rounded-sm" />
					<span>Seleccionado</span>
				</div>
				<div className="flex items-center gap-2">
					<div className="w-4 h-4 bg-primary-600/20 rounded-sm" />
					<span>En rango</span>
				</div>
				<div className="flex items-center gap-2">
					<div className="w-4 h-4 bg-red-50 border border-red-200 rounded-sm" />
					<span>No disponible</span>
				</div>
				<div className="flex items-center gap-2">
					<div className="w-4 h-4 bg-amber-50 border border-amber-300 rounded-sm" />
					<span>Checkin/Checkout disponible</span>
				</div>
			</div>

			{/* Info de selección */}
			{fechaInicio && fechaFin && (
				<div className="mt-4 p-3 bg-accent-500/10 border border-accent-500 rounded-sm">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-semibold text-primary-600">
								{new Date(fechaInicio).toLocaleDateString('es-ES')} → {new Date(fechaFin).toLocaleDateString('es-ES')}
							</p>
							<p className="text-xs text-primary-600/70 mt-1">
								{Math.ceil((new Date(fechaFin).getTime() - new Date(fechaInicio).getTime()) / (1000 * 60 * 60 * 24))} noches
							</p>
						</div>
						<button
							type="button"
							onClick={() => {
								onFechasChange("", "");
								setSeleccionando("inicio");
							}}
							className="text-xs text-primary-600/70 hover:text-primary-600 underline"
						>
							Limpiar
						</button>
					</div>
				</div>
			)}
			
			{/* Info si solo hay inicio seleccionado */}
			{fechaInicio && !fechaFin && (
				<div className="mt-4 p-3 bg-primary-600/5 border border-primary-600/20 rounded-sm">
					<div className="flex items-center justify-between">
						<p className="text-sm text-primary-600/70">
							Fecha de inicio: {new Date(fechaInicio).toLocaleDateString('es-ES')}
						</p>
						<button
							type="button"
							onClick={() => {
								onFechasChange("", "");
								setSeleccionando("inicio");
							}}
							className="text-xs text-primary-600/70 hover:text-primary-600 underline"
						>
							Limpiar
						</button>
					</div>
				</div>
			)}
		</div>
	);
}