// Archivo: src/app/admin/page.tsx
// Dashboard principal del panel admin

import { createAdminClient } from "@/lib/auth-admin";
import { Calendar, DollarSign, Users, TrendingUp } from "lucide-react";
import ReservasProximas from "@/components/admin/dashboard/ReservasProximas";
import EstadisticasRapidas from "@/components/admin/dashboard/EstadisticasRapidas";

export default async function AdminDashboard() {
	const supabase = await createAdminClient();

	// Obtener métricas del mes actual
	const inicioMes = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
	const finMes = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

	const inicioMesStr = inicioMes.toISOString().split("T")[0];
	const finMesStr = finMes.toISOString().split("T")[0];

	// Reservas confirmadas del mes
	const { data: reservasConfirmadasMes, error: errorConfirmadas } = await supabase
		.from("reservas")
		.select("precio_total")
		.eq("estado", "confirmada")
		.gte("fecha_inicio", inicioMesStr)
		.lte("fecha_inicio", finMesStr);

	// Reservas pendientes
	const { data: reservasPendientes, error: errorPendientes } = await supabase.from("reservas").select("id").eq("estado", "pendiente");

	// Total de reservas confirmadas (histórico)
	const { count: totalReservas } = await supabase.from("reservas").select("*", { count: "exact", head: true }).eq("estado", "confirmada");

	// Próximas llegadas (próximos 7 días)
	const hoy = new Date().toISOString().split("T")[0];
	const en7Dias = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

	const { data: proximasLlegadas, error: errorProximas } = await supabase
		.from("reservas")
		.select(
			`
      *,
      posada:posadas(nombre),
      habitaciones:reservas_habitaciones(
        habitacion:habitaciones(nombre, numero)
      )
    `
		)
		.eq("estado", "confirmada")
		.gte("fecha_inicio", hoy)
		.lte("fecha_inicio", en7Dias)
		.order("fecha_inicio", { ascending: true });

	// Calcular ingresos del mes
	const ingresosMes = reservasConfirmadasMes?.reduce((sum, r) => sum + Number(r.precio_total), 0) || 0;

	const stats = [
		{
			name: "Ingresos del Mes",
			value: `$${ingresosMes.toLocaleString("es-VE")}`,
			icon: DollarSign,
			change: "+12.5%",
			changeType: "positive" as const,
		},
		{
			name: "Reservas Confirmadas",
			value: reservasConfirmadasMes?.length || 0,
			icon: Calendar,
			change: `${reservasConfirmadasMes?.length || 0} este mes`,
			changeType: "neutral" as const,
		},
		{
			name: "Reservas Pendientes",
			value: reservasPendientes?.length || 0,
			icon: Users,
			change: "Requieren confirmación",
			changeType: reservasPendientes && reservasPendientes.length > 0 ? ("warning" as const) : ("neutral" as const),
		},
		{
			name: "Total Histórico",
			value: totalReservas || 0,
			icon: TrendingUp,
			change: "Reservas confirmadas",
			changeType: "neutral" as const,
		},
	];

	return (
		<div className="space-y-6">
			{/* Header */}
			<div>
				<h1 className="text-3xl font-bold text-neutral-900">Dashboard</h1>
				<p className="mt-1 text-sm text-neutral-500">Resumen general de Mararena Posadas</p>
			</div>

			{/* Stats Grid */}
			<EstadisticasRapidas stats={stats} />

			{/* Próximas Llegadas */}
			<div className="bg-white shadow rounded-lg">
				<div className="px-6 py-5 border-b border-neutral-200">
					<h2 className="text-lg font-semibold text-neutral-900">Próximas Llegadas (7 días)</h2>
				</div>
				<ReservasProximas reservas={proximasLlegadas || []} />
			</div>
		</div>
	);
}
