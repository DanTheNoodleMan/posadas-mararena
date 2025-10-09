// Archivo: src/app/admin/calendario/page.tsx
// Vista de calendario con ocupación de posadas
"use client";

import { useState, useEffect } from "react";
import { createSPAClient } from "@/lib/supabase/client";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import CalendarioMensual from "@/components/admin/calendario/CalendarioMensual";

export default function CalendarioAdminPage() {
	const supabase = createSPAClient();

	const [currentDate, setCurrentDate] = useState(new Date());
	const [reservas, setReservas] = useState<any[]>([]);
	const [posadas, setPosadas] = useState<any[]>([]);
	const [filtroPosada, setFiltroPosada] = useState("todas");
	const [loading, setLoading] = useState(true);

	// Cargar posadas
	useEffect(() => {
		async function cargarPosadas() {
			const { data } = await supabase.from("posadas").select("id, nombre").order("nombre");

			if (data) setPosadas(data);
		}
		cargarPosadas();
	}, []);

	// Cargar reservas del mes
	useEffect(() => {
		async function cargarReservas() {
			setLoading(true);

			// Calcular rango del mes
			const inicioMes = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
			const finMes = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

			const inicioStr = inicioMes.toISOString().split("T")[0];
			const finStr = finMes.toISOString().split("T")[0];

			let query = supabase
				.from("reservas")
				.select(
					`
          *,
          posada:posadas(nombre)
        `
				)
				.or(`fecha_inicio.lte.${finStr},fecha_fin.gte.${inicioStr}`)
				.neq("estado", "cancelada");

			// Aplicar filtro de posada
			if (filtroPosada !== "todas") {
				query = query.eq("posada_id", filtroPosada);
			}

			const { data } = await query;

			if (data) {
				setReservas(data);
			}

			setLoading(false);
		}

		cargarReservas();
	}, [currentDate, filtroPosada]);

	const mesAnterior = () => {
		setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
	};

	const mesSiguiente = () => {
		setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
	};

	const mesActual = () => {
		setCurrentDate(new Date());
	};

	const mesNombre = currentDate.toLocaleDateString("es-VE", { month: "long", year: "numeric" });

	return (
		<div className="space-y-6">
			{/* Header */}
			<div>
				<h1 className="text-3xl font-bold text-neutral-900">Calendario de Ocupación</h1>
				<p className="mt-1 text-sm text-neutral-500">Vista mensual de reservas y disponibilidad</p>
			</div>

			{/* Controles */}
			<div className="bg-white shadow rounded-lg p-4">
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
					{/* Navegación de mes */}
					<div className="flex items-center gap-2">
						<button onClick={mesAnterior} className="p-2 hover:bg-neutral-100 rounded-lg transition-colors">
							<ChevronLeft className="w-5 h-5" />
						</button>

						<button
							onClick={mesActual}
							className="px-4 py-2 text-sm font-semibold text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors capitalize min-w-[180px]"
						>
							{mesNombre}
						</button>

						<button onClick={mesSiguiente} className="p-2 hover:bg-neutral-100 rounded-lg transition-colors">
							<ChevronRight className="w-5 h-5" />
						</button>
					</div>

					{/* Filtro de posada */}
					<div className="flex items-center gap-2">
						<label htmlFor="posada-filter" className="text-sm font-medium text-neutral-700">
							Posada:
						</label>
						<select
							id="posada-filter"
							value={filtroPosada}
							onChange={(e) => setFiltroPosada(e.target.value)}
							className="px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
						>
							<option value="todas">Todas las Posadas</option>
							{posadas.map((posada) => (
								<option key={posada.id} value={posada.id}>
									{posada.nombre}
								</option>
							))}
						</select>
					</div>
				</div>
			</div>

			{/* Leyenda */}
			<div className="bg-white shadow rounded-lg p-4">
				<h3 className="text-sm font-semibold text-neutral-900 mb-3">Leyenda</h3>
				<div className="flex flex-wrap gap-4">
					<div className="flex items-center gap-2">
						<div className="w-4 h-4 bg-green-200 border border-green-400 rounded"></div>
						<span className="text-sm text-neutral-700">Confirmada</span>
					</div>
					<div className="flex items-center gap-2">
						<div className="w-4 h-4 bg-amber-200 border border-amber-400 rounded"></div>
						<span className="text-sm text-neutral-700">Pendiente</span>
					</div>
					<div className="flex items-center gap-2">
						<div className="w-4 h-4 bg-blue-200 border border-blue-400 rounded"></div>
						<span className="text-sm text-neutral-700">Completada</span>
					</div>
				</div>
			</div>

			{/* Calendario */}
			<div className="bg-white shadow rounded-lg p-6">
				{loading ? (
					<div className="flex items-center justify-center py-12">
						<Loader2 className="w-8 h-8 animate-spin text-primary-600" />
					</div>
				) : (
					<CalendarioMensual fecha={currentDate} reservas={reservas} />
				)}
			</div>
		</div>
	);
}