"use client";

import React from "react";
import { Users, Check, X } from "lucide-react";

interface Habitacion {
	id: string;
	nombre: string;
	descripcion: string;
	capacidad: number;
	precio_por_noche: number;
	amenidades: string[];
	disponible: boolean;
	motivo_no_disponible?: string;
}

interface HabitacionSelectorProps {
	habitaciones: Habitacion[];
	habitacionesSeleccionadas: string[];
	onSeleccionChange: (habitacionesIds: string[]) => void;
	numNoches: number;
}

export default function HabitacionSelector({
	habitaciones,
	habitacionesSeleccionadas,
	onSeleccionChange,
	numNoches,
}: HabitacionSelectorProps) {
	const toggleHabitacion = (habitacionId: string) => {
		if (habitacionesSeleccionadas.includes(habitacionId)) {
			// Deseleccionar
			onSeleccionChange(habitacionesSeleccionadas.filter((id) => id !== habitacionId));
		} else {
			// Seleccionar
			onSeleccionChange([...habitacionesSeleccionadas, habitacionId]);
		}
	};

	// Calcular precio total
	const calcularPrecioTotal = () => {
		return habitaciones
			.filter((h) => habitacionesSeleccionadas.includes(h.id))
			.reduce((total, h) => total + h.precio_por_noche * numNoches, 0);
	};

	const precioTotal = calcularPrecioTotal();
	const habitacionesDisponibles = habitaciones.filter((h) => h.disponible);
	const todasOcupadas = habitacionesDisponibles.length === 0;

	if (todasOcupadas) {
		return (
			<div className="bg-red-50 border border-red-200 rounded-sm p-8 text-center">
				<X className="w-12 h-12 text-red-400 mx-auto mb-4" />
				<h3 className="font-display text-2xl text-primary-600 mb-2">No hay habitaciones disponibles</h3>
				<p className="text-primary-600/70 mb-6">
					Lo sentimos, todas las habitaciones están ocupadas en estas fechas. Por favor elija otras fechas o contáctenos por
					WhatsApp.
				</p>
				<div className="flex flex-col sm:flex-row gap-4 justify-center">
					<button
						type="button"
						className="px-6 py-3 bg-primary-600 text-neutral-50 rounded-sm hover:bg-primary-700 transition-colors"
						onClick={() => window.location.reload()}
					>
						Elegir otras fechas
					</button>
					<a
						href="https://wa.me/584123112746"
						target="_blank"
						rel="noopener noreferrer"
						className="px-6 py-3 border border-primary-600 text-primary-600 rounded-sm hover:bg-primary-50 transition-colors"
					>
						Contactar por WhatsApp
					</a>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Header con contador */}
			<div className="flex items-center justify-between">
				<div>
					<h3 className="font-display text-2xl text-primary-600 mb-1">Selecciona tus habitaciones</h3>
					<p className="text-primary-600/70 text-sm">
						{habitacionesDisponibles.length} de {habitaciones.length} habitaciones disponibles
					</p>
				</div>
				{habitacionesSeleccionadas.length > 0 && (
					<div className="text-right">
						<p className="text-sm text-primary-600/70">
							{habitacionesSeleccionadas.length} seleccionada{habitacionesSeleccionadas.length !== 1 ? "s" : ""}
						</p>
						<p className="font-display text-2xl text-accent-500">${precioTotal.toLocaleString()}</p>
						<p className="text-xs text-primary-600/70">
							{numNoches} noche{numNoches !== 1 ? "s" : ""}
						</p>
					</div>
				)}
			</div>

			{/* Grid de habitaciones */}
			<div className="grid grid-cols-1 gap-4">
				{habitaciones.map((habitacion) => {
					const isSelected = habitacionesSeleccionadas.includes(habitacion.id);
					const isDisponible = habitacion.disponible;

					return (
						<div
							key={habitacion.id}
							className={`
								border rounded-sm p-4 transition-all
								${isDisponible ? "cursor-pointer hover:border-primary-600" : "opacity-60 cursor-not-allowed"}
								${isSelected ? "border-primary-600 bg-primary-600/5" : "border-neutral-300 bg-neutral-50"}
							`}
							onClick={() => isDisponible && toggleHabitacion(habitacion.id)}
						>
							<div className="flex items-start gap-4">
								{/* Checkbox */}
								<div
									className={`
									flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition-colors
									${isSelected ? "bg-primary-600 border-primary-600" : "border-neutral-300 bg-neutral-50"}
									${!isDisponible && "opacity-50"}
								`}
								>
									{isSelected && <Check className="w-4 h-4 text-neutral-50" />}
								</div>

								{/* Contenido */}
								<div className="flex-1">
									<div className="flex items-start justify-between mb-2">
										<div className="flex-1">
											<h4 className="font-semibold text-primary-600 mb-1">{habitacion.nombre}</h4>
											<p className="text-sm text-primary-600/70 mb-2">{habitacion.descripcion}</p>
										</div>

										<div className="text-right ml-4">
											<p className="font-display text-2xl text-accent-500">${habitacion.precio_por_noche}</p>
											<p className="text-xs text-primary-600/70">por noche</p>
										</div>
									</div>

									{/* Capacidad y amenidades */}
									<div className="flex flex-wrap items-center gap-3 text-sm text-primary-600/70">
										<div className="flex items-center gap-1">
											<Users className="w-4 h-4" />
											<span>{habitacion.capacidad} personas</span>
										</div>

										{habitacion.amenidades && habitacion.amenidades.length > 0 && (
											<>
												<span className="text-primary-600/30">•</span>
												<span className="line-clamp-1">{habitacion.amenidades.slice(0, 3).join(" • ")}</span>
											</>
										)}
									</div>

									{/* Estado no disponible */}
									{!isDisponible && habitacion.motivo_no_disponible && (
										<div className="mt-2 inline-block px-3 py-1 bg-red-100 border border-red-200 text-red-600 text-xs font-medium rounded-sm">
											{habitacion.motivo_no_disponible}
										</div>
									)}
								</div>
							</div>
						</div>
					);
				})}
			</div>

			{/* Resumen de selección */}
			{habitacionesSeleccionadas.length > 0 && (
				<div className="bg-accent-500/10 border border-accent-500 rounded-sm p-6">
					<div className="flex items-center justify-between mb-4">
						<h4 className="font-display text-xl text-primary-600">Resumen de su selección</h4>
						<button
							type="button"
							onClick={() => onSeleccionChange([])}
							className="text-sm text-primary-600/70 hover:text-primary-600 underline"
						>
							Limpiar selección
						</button>
					</div>

					<div className="space-y-2 mb-4">
						{habitaciones
							.filter((h) => habitacionesSeleccionadas.includes(h.id))
							.map((h) => (
								<div key={h.id} className="flex justify-between text-sm">
									<span className="text-primary-600/70">{h.nombre}</span>
									<span className="font-semibold text-primary-600">
										${h.precio_por_noche} × {numNoches} = ${(h.precio_por_noche * numNoches).toLocaleString()}
									</span>
								</div>
							))}
					</div>

					<div className="pt-4 border-t border-accent-500/30 flex justify-between items-center">
						<span className="font-display text-xl text-primary-600">Total</span>
						<span className="font-display text-3xl text-accent-500">${precioTotal.toLocaleString()}</span>
					</div>
				</div>
			)}
		</div>
	);
}
