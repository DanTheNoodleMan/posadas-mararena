// Archivo: src/app/admin/(dashboard)/page.tsx
// Dashboard principal del panel admin

import { createAdminClient } from "@/lib/auth-admin";
import { Calendar, DollarSign, Users, Clock } from "lucide-react";

export const metadata = {
	title: "Dashboard - Panel Admin",
	description: "Vista general de reservas y métricas",
};

export default async function DashboardPage() {
	const supabase = await createAdminClient();

	// Métricas del mes actual
	const now = new Date();
	const primerDiaMes = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0];
	const ultimoDiaMes = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split("T")[0];

	// Reservas pendientes
	const { data: reservasPendientes, count: countPendientes } = await supabase
		.from("reservas")
		.select("*", { count: "exact" })
		.eq("estado", "pendiente")
		.order("created_at", { ascending: false });

	// Reservas confirmadas del mes
	const { count: reservasMes } = await supabase
		.from("reservas")
		.select("*", { count: "exact" })
		.eq("estado", "confirmada")
		.gte("fecha_inicio", primerDiaMes)
		.lte("fecha_inicio", ultimoDiaMes);

	// Ingresos del mes
	const { data: ingresosMes } = await supabase
		.from("reservas")
		.select("precio_total")
		.eq("estado", "confirmada")
		.gte("fecha_inicio", primerDiaMes)
		.lte("fecha_inicio", ultimoDiaMes);

	const totalIngresos = ingresosMes?.reduce((sum, r) => sum + (r.precio_total || 0), 0) || 0;

	// Próximas llegadas (próximos 7 días)
	const hoy = now.toISOString().split("T")[0];
	const en7Dias = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

	const { data: proximasLlegadas, error: errorLlegadas } = await supabase
		.from("reservas")
		.select(
			`
      *,
      posada:posadas(nombre)
    `
		)
		.eq("estado", "confirmada")
		.gte("fecha_inicio", hoy)
		.lte("fecha_inicio", en7Dias)
		.order("fecha_inicio", { ascending: true })
		.limit(5);

	// Log para debug si hay error
	if (errorLlegadas) {
		console.error("Error al cargar próximas llegadas:", errorLlegadas);
	}

	return (
		<div className="space-y-8">
			{/* Header */}
			<div>
				<h1 className="text-3xl font-bold text-neutral-900">Dashboard</h1>
				<p className="text-neutral-600 mt-2">Vista general de reservas y métricas</p>
			</div>

			{/* Métricas Cards */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				{/* Reservas Pendientes */}
				<div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-medium text-neutral-600">Pendientes</p>
							<p className="text-3xl font-bold text-primary-600 mt-2">{countPendientes || 0}</p>
						</div>
						<div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
							<Clock className="w-6 h-6 text-amber-600" />
						</div>
					</div>
					<p className="text-xs text-neutral-500 mt-4">Esperando confirmación de pago</p>
				</div>

				{/* Reservas del Mes */}
				<div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-medium text-neutral-600">
								Reservas - {now.toLocaleString("es-ES", { month: "long" })}
							</p>
							<p className="text-3xl font-bold text-primary-600 mt-2">{reservasMes || 0}</p>
						</div>
						<div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
							<Calendar className="w-6 h-6 text-blue-600" />
						</div>
					</div>
					<p className="text-xs text-neutral-500 mt-4">Confirmadas este mes</p>
				</div>

				{/* Ingresos del Mes */}
				<div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-medium text-neutral-600">
								Ingresos - {now.toLocaleString("es-ES", { month: "long" })}
							</p>
							<p className="text-3xl font-bold text-primary-600 mt-2">${totalIngresos.toLocaleString()}</p>
						</div>
						<div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
							<DollarSign className="w-6 h-6 text-green-600" />
						</div>
					</div>
					<p className="text-xs text-neutral-500 mt-4">Total reservas confirmadas</p>
				</div>

				{/* Próximas Llegadas */}
				<div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-medium text-neutral-600">Próximas Llegadas</p>
							<p className="text-3xl font-bold text-primary-600 mt-2">{proximasLlegadas?.length || 0}</p>
						</div>
						<div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
							<Users className="w-6 h-6 text-purple-600" />
						</div>
					</div>
					<p className="text-xs text-neutral-500 mt-4">En los próximos 7 días</p>
				</div>
			</div>

			{/* Dos columnas */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Reservas Pendientes */}
				<div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
					<h2 className="text-lg font-semibold text-neutral-900 mb-4">Reservas Pendientes de Confirmar</h2>

					{!reservasPendientes || reservasPendientes.length === 0 ? (
						<p className="text-neutral-500 text-center py-8">No hay reservas pendientes</p>
					) : (
						<div className="space-y-3">
							{reservasPendientes.slice(0, 5).map((reserva) => (
								<a
									key={reserva.id}
									href={`/admin/reservas/${reserva.id}`}
									className="block p-4 rounded-lg border border-neutral-200 hover:border-amber-400 hover:bg-amber-50 transition-all"
								>
									<div className="flex items-start justify-between">
										<div className="flex-1">
											<p className="font-semibold text-neutral-900">{reserva.nombre_cliente}</p>
											<p className="text-sm text-neutral-600 mt-1">
												{new Date(reserva.fecha_inicio).toLocaleDateString("es-ES")} -{" "}
												{new Date(reserva.fecha_fin).toLocaleDateString("es-ES")}
											</p>
											<p className="text-xs text-neutral-500 mt-1">Código: {reserva.codigo_reserva}</p>
										</div>
										<div className="text-right">
											<p className="font-bold text-primary-600">${reserva.precio_total}</p>
											<span className="inline-block mt-1 px-2 py-1 text-xs font-medium bg-amber-100 text-amber-700 rounded">
												Pendiente
											</span>
										</div>
									</div>
								</a>
							))}
						</div>
					)}
				</div>

				{/* Próximas Llegadas */}
				<div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
					<h2 className="text-lg font-semibold text-neutral-900 mb-4">Próximas Llegadas (7 días)</h2>

					{!proximasLlegadas || proximasLlegadas.length === 0 ? (
						<p className="text-neutral-500 text-center py-8">No hay llegadas próximas</p>
					) : (
						<div className="space-y-3">
							{proximasLlegadas.map((reserva) => (
								<a
									key={reserva.id}
									href={`/admin/reservas/${reserva.id}`}
									className="block p-4 rounded-lg border border-neutral-200 hover:border-primary-400 hover:bg-primary-50 transition-all"
								>
									<div className="flex items-start justify-between">
										<div className="flex-1">
											<p className="font-semibold text-neutral-900">{reserva.nombre_cliente}</p>
											<p className="text-sm text-neutral-600 mt-1">
												{/* @ts-ignore */}
												{reserva.posada?.nombre}
											</p>
											<p className="text-xs text-neutral-500 mt-1">
												Checkin: {new Date(reserva.fecha_inicio).toLocaleDateString("es-ES")}
											</p>
										</div>
										<div className="text-right">
											<p className="font-bold text-primary-600">${reserva.precio_total}</p>
											<p className="text-xs text-neutral-500 mt-1">{reserva.numero_huespedes} huéspedes</p>
										</div>
									</div>
								</a>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
