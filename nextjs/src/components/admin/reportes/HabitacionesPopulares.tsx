// Archivo: src/components/admin/reportes/HabitacionesPopulares.tsx
// Ranking de habitaciones más reservadas

import { Award, Bed } from "lucide-react";

interface Habitacion {
	id: string;
	nombre: string;
	numero: string;
	posada: string;
	count: number;
}

interface HabitacionesPopularesProps {
	habitaciones: Habitacion[];
}

function getMedalla(index: number) {
	if (index === 0) return { emoji: "🥇", color: "text-yellow-600" };
	if (index === 1) return { emoji: "🥈", color: "text-neutral-400" };
	if (index === 2) return { emoji: "🥉", color: "text-amber-600" };
	return { emoji: `#${index + 1}`, color: "text-neutral-600" };
}

export default function HabitacionesPopulares({ habitaciones }: HabitacionesPopularesProps) {
	const maxReservas = habitaciones.length > 0 ? habitaciones[0].count : 1;

	if (habitaciones.length === 0) {
		return (
			<div className="bg-white shadow rounded-lg p-6">
				<h2 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
					<Award className="w-5 h-5" />
					Habitaciones Más Populares
				</h2>
				<p className="text-sm text-neutral-500 text-center py-8">No hay suficientes datos de reservas todavía.</p>
			</div>
		);
	}

	return (
		<div className="bg-white shadow rounded-lg p-6">
			<div className="flex items-center justify-between mb-6">
				<div>
					<h2 className="text-lg font-semibold text-neutral-900 flex items-center gap-2">
						<Award className="w-5 h-5" />
						Habitaciones Más Populares
					</h2>
					<p className="text-sm text-neutral-500 mt-1">Ranking histórico de reservas</p>
				</div>
				<div className="p-3 bg-accent-100 rounded-lg">
					<Bed className="w-6 h-6 text-accent-600" />
				</div>
			</div>

			{/* Lista de habitaciones */}
			<div className="space-y-3">
				{habitaciones.map((habitacion, index) => {
					const medalla = getMedalla(index);
					const porcentaje = (habitacion.count / maxReservas) * 100;

					return (
						<div
							key={habitacion.id}
							className={`
                p-4 rounded-lg border-2 transition-all
                ${index < 3 ? "bg-accent-50 border-accent-200" : "bg-neutral-50 border-neutral-200"}
              `}
						>
							<div className="flex items-center gap-4">
								{/* Posición */}
								<div className={`text-2xl font-bold ${medalla.color} min-w-[40px] text-center`}>{medalla.emoji}</div>

								{/* Información */}
								<div className="flex-1 min-w-0">
									<div className="flex items-start justify-between gap-2 mb-1">
										<div>
											<h3 className="text-sm font-semibold text-neutral-900">{habitacion.nombre}</h3>
											<p className="text-xs text-neutral-500">{habitacion.posada}</p>
										</div>
										<div className="text-right">
											<p className="text-lg font-bold text-neutral-900">{habitacion.count}</p>
											<p className="text-xs text-neutral-500">reservas</p>
										</div>
									</div>

									{/* Barra de progreso */}
									<div className="w-full bg-neutral-200 rounded-full h-2 overflow-hidden mt-2">
										<div
											className="bg-gradient-to-r from-accent-500 to-accent-600 h-full rounded-full transition-all duration-500"
											style={{ width: `${porcentaje}%` }}
										/>
									</div>
								</div>
							</div>
						</div>
					);
				})}
			</div>

			{/* Info adicional */}
			<div className="mt-6 pt-4 border-t">
				<p className="text-xs text-neutral-500">
					💡 <strong>Insight:</strong> Las habitaciones más populares pueden ayudarte a optimizar precios y estrategias de
					marketing.
				</p>
			</div>
		</div>
	);
}
