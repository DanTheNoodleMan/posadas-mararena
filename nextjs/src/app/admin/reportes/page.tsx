// src/app/admin/reportes/page.tsx
// Página de reportes e insights del negocio

import { createAdminClient } from "@/lib/auth-admin";
import { Download } from "lucide-react";
import ReporteIngresos from "@/components/admin/reportes/ReporteIngresos";
import ReporteOcupacion from "@/components/admin/reportes/ReporteOcupacion";
import HabitacionesPopulares from "@/components/admin/reportes/HabitacionesPopulares";

export default async function ReportesPage() {
	const supabase = await createAdminClient();

	// Obtener año y mes actual
	const hoy = new Date();
	const añoActual = hoy.getFullYear();
	const mesActual = hoy.getMonth() + 1;

	// Calcular últimos 6 meses para gráficas
	const meses = [];
	for (let i = 5; i >= 0; i--) {
		const fecha = new Date(añoActual, mesActual - 1 - i, 1);
		meses.push({
			año: fecha.getFullYear(),
			mes: fecha.getMonth() + 1,
			nombre: fecha.toLocaleDateString("es-VE", { month: "short", year: "numeric" }),
		});
	}

	// Obtener ingresos por mes
	const ingresosPorMes = await Promise.all(
		meses.map(async ({ año, mes, nombre }) => {
			const inicioMes = new Date(año, mes - 1, 1);
			const finMes = new Date(año, mes, 0);

			const inicioStr = inicioMes.toISOString().split("T")[0];
			const finStr = finMes.toISOString().split("T")[0];

			const { data } = await supabase
				.from("reservas")
				.select("precio_total, posada_id")
				.eq("estado", "confirmada")
				.gte("fecha_inicio", inicioStr)
				.lte("fecha_inicio", finStr);

			const total = data?.reduce((sum, r) => sum + Number(r.precio_total), 0) || 0;

			return { mes: nombre, total };
		})
	);

	// Obtener ocupación por posada
	const { data: posadas } = await supabase.from("posadas").select("id, nombre");

	const ocupacionPorPosada = await Promise.all(
		(posadas || []).map(async (posada) => {
			// Reservas confirmadas de este mes
			const inicioMes = new Date(añoActual, mesActual - 1, 1);
			const finMes = new Date(añoActual, mesActual, 0);

			const inicioStr = inicioMes.toISOString().split("T")[0];
			const finStr = finMes.toISOString().split("T")[0];

			const { data: reservas } = await supabase
				.from("reservas")
				.select("fecha_inicio, fecha_fin")
				.eq("posada_id", posada.id)
				.eq("estado", "confirmada")
				.or(`fecha_inicio.lte.${finStr},fecha_fin.gte.${inicioStr}`);

			// Calcular noches ocupadas
			let nochesOcupadas = 0;
			reservas?.forEach((reserva) => {
				const inicio = new Date(reserva.fecha_inicio);
				const fin = new Date(reserva.fecha_fin);
				const noches = Math.ceil((fin.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24));
				nochesOcupadas += noches;
			});

			// Total de noches disponibles en el mes
			const diasDelMes = finMes.getDate();
			const porcentajeOcupacion = (nochesOcupadas / diasDelMes) * 100;

			return {
				posada: posada.nombre,
				ocupacion: Math.round(porcentajeOcupacion),
				nochesOcupadas,
				diasDelMes,
			};
		})
	);

	// Habitaciones más populares
	const { data: habitacionesData } = await supabase.from("reservas_habitaciones").select(`
      habitacion:habitaciones(id, nombre, numero, posada:posadas(nombre))
    `);

	// Contar frecuencia de cada habitación
	const frecuenciaHabitaciones: Record<string, any> = {};
	habitacionesData?.forEach((item: any) => {
		if (item.habitacion) {
			const id = item.habitacion.id;
			if (!frecuenciaHabitaciones[id]) {
				frecuenciaHabitaciones[id] = {
					id,
					nombre: item.habitacion.nombre,
					numero: item.habitacion.numero,
					posada: item.habitacion.posada?.nombre,
					count: 0,
				};
			}
			frecuenciaHabitaciones[id].count++;
		}
	});

	const habitacionesPopulares = Object.values(frecuenciaHabitaciones)
		.sort((a, b) => b.count - a.count)
		.slice(0, 10);

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<h1 className="text-3xl font-bold text-neutral-900">Reportes</h1>
					<p className="mt-1 text-sm text-neutral-500">Análisis de ingresos, ocupación y métricas del negocio</p>
				</div>

				<button
					className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
					onClick={() => alert("Funcionalidad de exportación en desarrollo")}
				>
					<Download className="w-5 h-5" />
					Exportar Reporte
				</button>
			</div>

			{/* Grid de reportes */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Ingresos por mes */}
				<ReporteIngresos datos={ingresosPorMes} />

				{/* Ocupación por posada */}
				<ReporteOcupacion datos={ocupacionPorPosada} />
			</div>

			{/* Habitaciones más populares */}
			<HabitacionesPopulares habitaciones={habitacionesPopulares} />
		</div>
	);
}
