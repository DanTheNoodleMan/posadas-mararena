// Archivo: src/components/admin/reportes/ReporteIngresos.tsx
// Gráfico de barras de ingresos mensuales

import { DollarSign } from "lucide-react";

interface DatosMes {
	mes: string;
	total: number;
}

interface ReporteIngresosProps {
	datos: DatosMes[];
}

export default function ReporteIngresos({ datos }: ReporteIngresosProps) {
	const maxIngreso = Math.max(...datos.map((d) => d.total));
	const totalIngresos = datos.reduce((sum, d) => sum + d.total, 0);
	const promedioMensual = totalIngresos / datos.length;

	return (
		<div className="bg-white shadow rounded-lg p-6">
			<div className="flex items-center justify-between mb-6">
				<div>
					<h2 className="text-lg font-semibold text-neutral-900">Ingresos por Mes</h2>
					<p className="text-sm text-neutral-500 mt-1">Últimos 6 meses</p>
				</div>
				<div className="p-3 bg-green-100 rounded-lg">
					<DollarSign className="w-6 h-6 text-green-600" />
				</div>
			</div>

			{/* Métricas resumen */}
			<div className="grid grid-cols-2 gap-4 mb-6">
				<div className="p-4 bg-neutral-50 rounded-lg">
					<p className="text-xs text-neutral-500 mb-1">Total 6 Meses</p>
					<p className="text-lg font-bold text-neutral-900">${totalIngresos.toLocaleString("es-VE")}</p>
				</div>
				<div className="p-4 bg-neutral-50 rounded-lg">
					<p className="text-xs text-neutral-500 mb-1">Promedio Mensual</p>
					<p className="text-lg font-bold text-neutral-900">${Math.round(promedioMensual).toLocaleString("es-VE")}</p>
				</div>
			</div>

			{/* Gráfico de barras */}
			<div className="space-y-4">
				{datos.map((dato) => {
					const porcentaje = maxIngreso > 0 ? (dato.total / maxIngreso) * 100 : 0;

					return (
						<div key={dato.mes}>
							<div className="flex items-center justify-between text-sm mb-1">
								<span className="text-neutral-600 font-medium capitalize">{dato.mes}</span>
								<span className="text-neutral-900 font-semibold">${dato.total.toLocaleString("es-VE")}</span>
							</div>
							<div className="w-full bg-neutral-200 rounded-full h-3 overflow-hidden">
								<div
									className="bg-gradient-to-r from-green-500 to-green-600 h-full rounded-full transition-all duration-500"
									style={{ width: `${porcentaje}%` }}
								/>
							</div>
						</div>
					);
				})}
			</div>

			{/* Nota */}
			<p className="text-xs text-neutral-500 mt-4 border-t pt-4">* Solo incluye reservas confirmadas</p>
		</div>
	);
}
