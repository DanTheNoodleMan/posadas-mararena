// src/app/admin/(dashboard)/page.tsx
// Dashboard OPTIMIZADO con queries más eficientes

import { createAdminClient } from "@/lib/auth-admin";
import { Calendar, DollarSign, Users, Clock, Eye, Plus, MessageCircle, AlertTriangle, Home, Bed } from "lucide-react";
import Link from "next/link";

export const metadata = {
	title: "Dashboard - Panel Admin",
	description: "Vista general de reservas y métricas",
};

export default async function DashboardPage() {
	const supabase = await createAdminClient();

	// Fechas útiles
	const now = new Date();
	const hoy = now.toISOString().split("T")[0];
	const primerDiaMes = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0];
	const ultimoDiaMes = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split("T")[0];
	const en7Dias = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

	// ============================================
	// QUERIES OPTIMIZADAS - HACER EN PARALELO
	// ============================================

	const [
		{ data: reservasPendientes, count: countPendientes },
		{ count: reservasMes },
		{ data: ingresosMes },
		{ data: proximasLlegadas },
		{ data: reservasRecientes },
		{ data: reservasDelMes }
	] = await Promise.all([
		// Pendientes con habitaciones
		supabase
			.from("reservas")
			.select(`
				*,
				posada:posadas(nombre),
				reservas_habitaciones(
					habitacion:habitaciones(nombre)
				)
			`, { count: "exact" })
			.eq("estado", "pendiente")
			.order("created_at", { ascending: false })
			.limit(5),

		// Count reservas mes
		supabase
			.from("reservas")
			.select("*", { count: "exact", head: true })
			.in("estado", ["confirmada", "pendiente"])
			.gte("fecha_inicio", primerDiaMes)
			.lte("fecha_inicio", ultimoDiaMes),

		// Ingresos mes
		supabase
			.from("reservas")
			.select("precio_total")
			.eq("estado", "confirmada")
			.gte("fecha_inicio", primerDiaMes)
			.lte("fecha_inicio", ultimoDiaMes),

		// Próximas llegadas con habitaciones
		supabase
			.from("reservas")
			.select(`
				*,
				posada:posadas(nombre),
				reservas_habitaciones(
					habitacion:habitaciones(nombre)
				)
			`)
			.in("estado", ["confirmada", "pendiente"])
			.gte("fecha_inicio", hoy)
			.lte("fecha_inicio", en7Dias)
			.order("fecha_inicio", { ascending: true })
			.limit(10),

		// Reservas recientes con habitaciones
		supabase
			.from("reservas")
			.select(`
				*,
				posada:posadas(nombre),
				reservas_habitaciones(
					habitacion:habitaciones(nombre)
				)
			`)
			.order("created_at", { ascending: false })
			.limit(10),

		// Reservas del mes para calendario
		supabase
			.from("reservas")
			.select("fecha_inicio, fecha_fin, estado, tipo_reserva")
			.in("estado", ["confirmada", "pendiente", "completada"])
			.or(`fecha_inicio.lte.${ultimoDiaMes},fecha_fin.gte.${primerDiaMes}`)
	]);

	const totalIngresos = ingresosMes?.reduce((sum, r) => sum + (r.precio_total || 0), 0) || 0;

	// ============================================
	// HELPERS
	// ============================================

	const formatearFecha = (fecha: string) => {
		const date = new Date(fecha + "T12:00:00");
		return date.toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit" });
	};

	const formatearFechaCompleta = (fecha: string) => {
		const date = new Date(fecha + "T12:00:00");
		return date.toLocaleDateString("es-ES", { 
			weekday: "short", 
			day: "numeric", 
			month: "short" 
		});
	};

	const diasHasta = (fecha: string) => {
		const hoyDate = new Date();
		hoyDate.setHours(0, 0, 0, 0);
		const llegada = new Date(fecha + "T12:00:00");
		llegada.setHours(0, 0, 0, 0);
		const diff = llegada.getTime() - hoyDate.getTime();
		const dias = Math.ceil(diff / (1000 * 60 * 60 * 24));
		if (dias === 0) return "¡Hoy!";
		if (dias === 1) return "Mañana";
		return `En ${dias} días`;
	};

	const getTipoReservaInfo = (reserva: any) => {
		if (reserva.tipo_reserva === "posada_completa") {
			return {
				icon: <Home className="w-3 h-3" />,
				texto: "Posada Completa",
				color: "text-purple-600 bg-purple-50"
			};
		} else {
			const numHabitaciones = reserva.reservas_habitaciones?.length || 0;
			return {
				icon: <Bed className="w-3 h-3" />,
				texto: numHabitaciones === 1 ? "1 Habitación" : `${numHabitaciones} Habitaciones`,
				color: "text-blue-600 bg-blue-50"
			};
		}
	};

	const generarCalendarioMes = () => {
		const year = now.getFullYear();
		const month = now.getMonth();
		const primerDia = new Date(year, month, 1);
		const ultimoDia = new Date(year, month + 1, 0);
		
		const dias = [];
		
		for (let i = 0; i < primerDia.getDay(); i++) {
			dias.push(null);
		}
		
		for (let dia = 1; dia <= ultimoDia.getDate(); dia++) {
			const fechaStr = new Date(year, month, dia).toISOString().split("T")[0];
			const tieneReserva = reservasDelMes?.some(r => {
				return fechaStr >= r.fecha_inicio && fechaStr < r.fecha_fin;
			});
			const esHoy = fechaStr === hoy;
			
			dias.push({ dia, fecha: fechaStr, tieneReserva, esHoy });
		}
		
		return dias;
	};

	const diasCalendario = generarCalendarioMes();
	const nombreMes = now.toLocaleString("es-ES", { month: "long", year: "numeric" });

	return (
		<div className="space-y-8">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold text-neutral-900">Dashboard</h1>
					<p className="text-neutral-600 mt-2">Vista general de reservas y métricas</p>
				</div>
				
				<Link
					href="/admin/reservas/nueva"
					className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
				>
					<Plus className="w-5 h-5" />
					Nueva Reserva
				</Link>
			</div>

			{/* Alerta Pendientes */}
			{countPendientes && countPendientes > 0 && (
				<div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-lg">
					<div className="flex items-center gap-3">
						<AlertTriangle className="w-5 h-5 text-amber-600" />
						<p className="text-sm text-amber-800">
							<strong>{countPendientes}</strong> {countPendientes === 1 ? "reserva pendiente" : "reservas pendientes"} de confirmar pago
						</p>
					</div>
				</div>
			)}

			{/* Métricas */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
					<p className="text-xs text-neutral-500 mt-4">Esperando confirmación</p>
				</div>

				<div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-medium text-neutral-600">Reservas - {now.toLocaleString("es-ES", { month: "long" })}</p>
							<p className="text-3xl font-bold text-primary-600 mt-2">{reservasMes || 0}</p>
						</div>
						<div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
							<Calendar className="w-6 h-6 text-blue-600" />
						</div>
					</div>
					<p className="text-xs text-neutral-500 mt-4">Este mes</p>
				</div>

				<div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-medium text-neutral-600">Ingresos - {now.toLocaleString("es-ES", { month: "long" })}</p>
							<p className="text-3xl font-bold text-primary-600 mt-2">${totalIngresos.toLocaleString()}</p>
						</div>
						<div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
							<DollarSign className="w-6 h-6 text-green-600" />
						</div>
					</div>
					<p className="text-xs text-neutral-500 mt-4">Confirmadas</p>
				</div>

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
					<p className="text-xs text-neutral-500 mt-4">Próximos 7 días</p>
				</div>
			</div>

			{/* Grid Principal */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				
				{/* Columna Izquierda: Listas */}
				<div className="lg:col-span-2 space-y-6">
					
					{/* Pendientes */}
					<div className="bg-white rounded-xl shadow-sm border border-neutral-200">
						<div className="p-6 border-b border-neutral-200">
							<div className="flex items-center justify-between">
								<h2 className="text-lg font-semibold text-neutral-900">Reservas Pendientes</h2>
								<Link href="/admin/reservas?estado=pendiente" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
									Ver todas →
								</Link>
							</div>
						</div>

						{!reservasPendientes || reservasPendientes.length === 0 ? (
							<p className="text-neutral-500 text-center py-8">No hay reservas pendientes</p>
						) : (
							<div className="divide-y divide-neutral-200">
								{reservasPendientes.map((reserva) => {
									const tipoInfo = getTipoReservaInfo(reserva);
									return (
										<div key={reserva.id} className="p-4 hover:bg-neutral-50 transition-colors">
											<div className="flex items-start justify-between gap-4">
												<div className="flex-1">
													<div className="flex items-center gap-2 mb-2 flex-wrap">
														<span className="inline-block px-2 py-0.5 text-xs font-mono font-semibold bg-neutral-100 text-neutral-700 rounded">
															{reserva.codigo_reserva}
														</span>
														<span className="inline-block px-2 py-0.5 text-xs font-medium bg-amber-100 text-amber-700 rounded">
															Pendiente
														</span>
														<span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded ${tipoInfo.color}`}>
															{tipoInfo.icon}
															{tipoInfo.texto}
														</span>
													</div>
													<p className="font-semibold text-neutral-900">{reserva.nombre_cliente}</p>
													<p className="text-sm text-neutral-600 mt-1">
														{/* @ts-ignore */}
														{reserva.posada?.nombre} • {formatearFecha(reserva.fecha_inicio)} - {formatearFecha(reserva.fecha_fin)}
													</p>
													<p className="text-xs text-neutral-500 mt-1">{reserva.num_huespedes} huéspedes</p>
												</div>
												<div className="flex items-center gap-2">
													<p className="font-bold text-primary-600">${reserva.precio_total}</p>
													<div className="flex gap-1">
														<Link
															href={`/admin/reservas/${reserva.id}`}
															className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-primary-100 text-primary-600 hover:bg-primary-200 transition-colors"
														>
															<Eye className="w-4 h-4" />
														</Link>
														<a
															href={`https://wa.me/${reserva.telefono_cliente.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(`Hola ${reserva.nombre_cliente}! Te escribo sobre tu reserva ${reserva.codigo_reserva}`)}`}
															target="_blank"
															rel="noopener noreferrer"
															className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
														>
															<MessageCircle className="w-4 h-4" />
														</a>
													</div>
												</div>
											</div>
										</div>
									);
								})}
							</div>
						)}
					</div>

					{/* Próximas Llegadas */}
					<div className="bg-white rounded-xl shadow-sm border border-neutral-200">
						<div className="p-6 border-b border-neutral-200">
							<h2 className="text-lg font-semibold text-neutral-900">Próximas Llegadas (7 días)</h2>
						</div>

						{!proximasLlegadas || proximasLlegadas.length === 0 ? (
							<p className="text-neutral-500 text-center py-8">No hay llegadas próximas</p>
						) : (
							<div className="divide-y divide-neutral-200">
								{proximasLlegadas.map((reserva) => {
									const tipoInfo = getTipoReservaInfo(reserva);
									return (
										<Link 
											key={reserva.id}
											href={`/admin/reservas/${reserva.id}`}
											className="block p-4 hover:bg-neutral-50 transition-colors"
										>
											<div className="flex items-start justify-between gap-4">
												<div className="flex-1">
													<div className="flex items-center gap-2 mb-2 flex-wrap">
														<span className="inline-block px-2 py-1 text-xs font-medium bg-accent-100 text-accent-800 rounded-full">
															{diasHasta(reserva.fecha_inicio)}
														</span>
														<span className="text-xs text-neutral-500">{reserva.codigo_reserva}</span>
														<span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded ${tipoInfo.color}`}>
															{tipoInfo.icon}
															{tipoInfo.texto}
														</span>
													</div>
													<p className="font-semibold text-neutral-900">{reserva.nombre_cliente}</p>
													<p className="text-sm text-neutral-600 mt-1">
														{/* @ts-ignore */}
														{reserva.posada?.nombre} • {reserva.num_huespedes} huéspedes
													</p>
													<p className="text-xs text-neutral-500 mt-1">
														{formatearFechaCompleta(reserva.fecha_inicio)}
													</p>
												</div>
												<div className="text-right">
													<p className="font-bold text-primary-600">${reserva.precio_total}</p>
													<span className={`inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded ${
														reserva.estado === 'confirmada' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
													}`}>
														{reserva.estado === 'confirmada' ? 'Confirmada' : 'Pendiente'}
													</span>
												</div>
											</div>
										</Link>
									);
								})}
							</div>
						)}
					</div>

					{/* Reservas Recientes */}
					<div className="bg-white rounded-xl shadow-sm border border-neutral-200">
						<div className="p-6 border-b border-neutral-200">
							<div className="flex items-center justify-between">
								<h2 className="text-lg font-semibold text-neutral-900">Reservas Recientes</h2>
								<Link href="/admin/reservas" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
									Ver todas →
								</Link>
							</div>
							<p className="text-sm text-neutral-500 mt-1">Últimas reservas creadas</p>
						</div>

						{!reservasRecientes || reservasRecientes.length === 0 ? (
							<p className="text-neutral-500 text-center py-8">No hay reservas recientes</p>
						) : (
							<div className="divide-y divide-neutral-200">
								{reservasRecientes.slice(0, 8).map((reserva) => {
									const createdDate = new Date(reserva.created_at);
									const tiempoTranscurrido = Math.floor((now.getTime() - createdDate.getTime()) / (1000 * 60));
									let tiempoTexto = "";
									if (tiempoTranscurrido < 60) {
										tiempoTexto = `Hace ${tiempoTranscurrido}m`;
									} else if (tiempoTranscurrido < 1440) {
										tiempoTexto = `Hace ${Math.floor(tiempoTranscurrido / 60)}h`;
									} else {
										tiempoTexto = `Hace ${Math.floor(tiempoTranscurrido / 1440)}d`;
									}

									const tipoInfo = getTipoReservaInfo(reserva);

									return (
										<div key={reserva.id} className="p-4 hover:bg-neutral-50 transition-colors">
											<div className="flex items-start justify-between gap-4">
												<div className="flex-1">
													<div className="flex items-center gap-2 mb-2 flex-wrap">
														<span className="inline-block px-2 py-0.5 text-xs font-mono font-semibold bg-neutral-100 text-neutral-700 rounded">
															{reserva.codigo_reserva}
														</span>
														<span className="text-xs text-neutral-400">{tiempoTexto}</span>
														<span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded ${tipoInfo.color}`}>
															{tipoInfo.icon}
															{tipoInfo.texto}
														</span>
													</div>
													<p className="font-semibold text-neutral-900">{reserva.nombre_cliente}</p>
													<p className="text-sm text-neutral-600 mt-1">
														{/* @ts-ignore */}
														{reserva.posada?.nombre} • {formatearFecha(reserva.fecha_inicio)} - {formatearFecha(reserva.fecha_fin)}
													</p>
												</div>
												<div className="flex items-center gap-2">
													<p className="font-bold text-primary-600">${reserva.precio_total}</p>
													<div className="flex gap-1">
														<Link
															href={`/admin/reservas/${reserva.id}`}
															className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-neutral-100 text-neutral-600 hover:bg-neutral-200 transition-colors"
														>
															<Eye className="w-4 h-4" />
														</Link>
														<a
															href={`https://wa.me/${reserva.telefono_cliente.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(`Hola ${reserva.nombre_cliente}! Te escribo sobre tu reserva ${reserva.codigo_reserva}`)}`}
															target="_blank"
															rel="noopener noreferrer"
															className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
														>
															<MessageCircle className="w-4 h-4" />
														</a>
													</div>
												</div>
											</div>
										</div>
									);
								})}
							</div>
						)}
					</div>
				</div>

				{/* Columna Derecha: Calendario */}
				<div className="lg:col-span-1">
					<div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6 sticky top-6">
						<h2 className="text-lg font-semibold text-neutral-900 mb-4 capitalize">{nombreMes}</h2>
						
						<div className="flex items-center gap-4 mb-4 text-xs">
							<div className="flex items-center gap-1.5">
								<div className="w-3 h-3 bg-primary-100 border border-primary-300 rounded"></div>
								<span className="text-neutral-600">Ocupado</span>
							</div>
							<div className="flex items-center gap-1.5">
								<div className="w-3 h-3 bg-white border border-neutral-300 rounded"></div>
								<span className="text-neutral-600">Libre</span>
							</div>
						</div>

						<div className="grid grid-cols-7 gap-1 mb-2">
							{["D", "L", "M", "M", "J", "V", "S"].map((dia, idx) => (
								<div key={idx} className="text-center text-xs font-semibold text-neutral-600">
									{dia}
								</div>
							))}
						</div>

						<div className="grid grid-cols-7 gap-1">
							{diasCalendario.map((dia, idx) => {
								if (!dia) return <div key={`empty-${idx}`} className="aspect-square"></div>;

								return (
									<div
										key={idx}
										className={`
											aspect-square flex items-center justify-center text-xs rounded border transition-colors
											${dia.tieneReserva 
												? "bg-primary-100 border-primary-300 text-primary-900 font-semibold" 
												: "bg-white border-neutral-200 text-neutral-700"
											}
											${dia.esHoy ? "ring-2 ring-accent-500" : ""}
										`}
									>
										{dia.dia}
									</div>
								);
							})}
						</div>

						<div className="mt-4 pt-4 border-t border-neutral-200">
							<Link
								href="/admin/calendario"
								className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center justify-center gap-2"
							>
								<Calendar className="w-4 h-4" />
								Ver Calendario Completo
							</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}