// Archivo: src/components/admin/reportes/ReporteOcupacion.tsx
// Reporte de ocupación por posada

import { TrendingUp } from "lucide-react";

interface DatosOcupacion {
	posada: string;
	ocupacion: number;
	nochesOcupadas: number;
	diasDelMes: number;
}

interface ReporteOcupacionProps {
	datos: DatosOcupacion[];
}

function getColorOcupacion(porcentaje: number) {
	if (porcentaje >= 80) return "from-green-500 to-green-600";
	if (porcentaje >= 50) return "from-amber-500 to-amber-600";
	return "from-red-500 to-red-600";
}

export default function ReporteOcupacion({ datos }: ReporteOcupacionProps) {
	const ocupacionPromedio = datos.reduce((sum, d) => sum + d.ocupacion, 0) / datos.length;

	return (
		<div className="bg-white shadow rounded-lg p-6">
			<div className="flex items-center justify-between mb-6">
				<div>
					<h2 className="text-lg font-semibold text-neutral-900">Ocupación del Mes Actual</h2>
					<p className="text-sm text-neutral-500 mt-1">Por posada</p>
				</div>
				<div className="p-3 bg-blue-100 rounded-lg">
					<TrendingUp className="w-6 h-6 text-blue-600" />
				</div>
			</div>

			{/* Ocupación promedio */}
			<div className="mb-6 p-4 bg-gradient-to-br from-primary-50 to-accent-50 rounded-lg border border-primary-200">
				<p className="text-sm text-neutral-600 mb-2">Ocupación Promedio</p>
				<div className="flex items-baseline gap-2">
					<span className="text-3xl font-bold text-primary-900">{Math.round(ocupacionPromedio)}%</span>
					<span className="text-sm text-neutral-600">del mes</span>
				</div>
			</div>

			{/* Lista de posadas */}
			<div className="space-y-6">
				{datos.map((dato) => (
					<div key={dato.posada}>
						<div className="flex items-center justify-between mb-2">
							<h3 className="text-sm font-semibold text-neutral-900">{dato.posada}</h3>
							<span className="text-2xl font-bold text-neutral-900">{dato.ocupacion}%</span>
						</div>

						{/* Barra de progreso */}
						<div className="w-full bg-neutral-200 rounded-full h-4 overflow-hidden mb-2">
							<div
								className={`bg-gradient-to-r ${getColorOcupacion(
									dato.ocupacion
								)} h-full rounded-full transition-all duration-500 flex items-center justify-end pr-2`}
								style={{ width: `${dato.ocupacion}%` }}
							>
								{dato.ocupacion > 20 && <span className="text-xs font-semibold text-white">{dato.ocupacion}%</span>}
							</div>
						</div>

						{/* Detalles */}
						<p className="text-xs text-neutral-500">
							{dato.nochesOcupadas} noches ocupadas de {dato.diasDelMes} días
						</p>
					</div>
				))}
			</div>

			{/* Leyenda */}
			<div className="mt-6 pt-4 border-t">
				<p className="text-xs text-neutral-500 mb-2">Leyenda de ocupación:</p>
				<div className="flex flex-wrap gap-3 text-xs">
					<div className="flex items-center gap-1">
						<div className="w-3 h-3 bg-gradient-to-r from-green-500 to-green-600 rounded"></div>
						<span className="text-neutral-600">≥80% Excelente</span>
					</div>
					<div className="flex items-center gap-1">
						<div className="w-3 h-3 bg-gradient-to-r from-amber-500 to-amber-600 rounded"></div>
						<span className="text-neutral-600">50-79% Buena</span>
					</div>
					<div className="flex items-center gap-1">
						<div className="w-3 h-3 bg-gradient-to-r from-red-500 to-red-600 rounded"></div>
						<span className="text-neutral-600">&lt;50% Baja</span>
					</div>
				</div>
			</div>
		</div>
	);
}
