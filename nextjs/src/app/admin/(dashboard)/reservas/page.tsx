// src/app/admin/(dashboard)/reservas/page.tsx
// Lista de reservas con filtros avanzados 
"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Search, Filter, Download, Plus } from "lucide-react";
import Link from "next/link";
import TablaReservas from "@/components/admin/reservas/TablaReservas";

export default function ReservasListPage() {
	const supabase = createClient();

	const [reservas, setReservas] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");
	const [filtroEstado, setFiltroEstado] = useState("todas");
	const [filtroPosada, setFiltroPosada] = useState("todas");
	const [posadas, setPosadas] = useState<any[]>([]);

	// Cargar posadas para el filtro
	useEffect(() => {
		async function cargarPosadas() {
			const { data } = await supabase.from("posadas").select("id, nombre").order("nombre");

			if (data) setPosadas(data);
		}
		cargarPosadas();
	}, []);

	// Cargar reservas
	useEffect(() => {
		async function cargarReservas() {
			setLoading(true);

			try {
				// Query base - SIN joins complicados primero
				let query = supabase
					.from("reservas")
					.select(
						`
            *,
            posada:posadas(nombre)
          `
					)
					.order("created_at", { ascending: false });

				// Aplicar filtro de estado
				if (filtroEstado !== "todas") {
					query = query.eq("estado", filtroEstado);
				}

				// Aplicar filtro de posada
				if (filtroPosada !== "todas") {
					query = query.eq("posada_id", filtroPosada);
				}

				const { data, error } = await query;

				if (error) {
					console.error("Error al cargar reservas:", error);
					setReservas([]);
					setLoading(false);
					return;
				}

				if (data) {
					// Ahora cargar habitaciones por separado para cada reserva
					const reservasConHabitaciones = await Promise.all(
						data.map(async (reserva) => {
							const { data: habitaciones } = await supabase
								.from("reservas_habitaciones")
								.select(
									`
                  habitacion:habitaciones(
                    id,
                    nombre
                  )
                `
								)
								.eq("reserva_id", reserva.id);

							return {
								...reserva,
								habitaciones: habitaciones || [],
							};
						})
					);

					// Aplicar búsqueda por texto (código o nombre)
					let filteredData = reservasConHabitaciones;
					if (searchTerm) {
						const term = searchTerm.toLowerCase();
						filteredData = reservasConHabitaciones.filter(
							(r) =>
								r.codigo_reserva?.toLowerCase().includes(term) ||
								r.nombre_cliente?.toLowerCase().includes(term) ||
								r.email_cliente?.toLowerCase().includes(term)
						);
					}
					setReservas(filteredData);
				}
			} catch (err) {
				console.error("Error inesperado:", err);
				setReservas([]);
			}

			setLoading(false);
		}

		cargarReservas();
	}, [filtroEstado, filtroPosada, searchTerm]);

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<h1 className="text-3xl font-bold text-neutral-900">Reservas</h1>
					<p className="mt-1 text-sm text-neutral-500">Gestiona todas las reservas de Mararena Posadas</p>
				</div>
				<Link
					href="/admin/reservas/nueva"
					className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
				>
					<Plus className="w-5 h-5" />
					Nueva Reserva
				</Link>
			</div>

			{/* Filtros */}
			<div className="bg-white shadow rounded-lg p-4">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
					{/* Búsqueda */}
					<div className="md:col-span-2">
						<label htmlFor="search" className="block text-sm font-medium text-neutral-700 mb-2">
							Buscar
						</label>
						<div className="relative">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
							<input
								id="search"
								type="text"
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								placeholder="Código, nombre o email..."
								className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
							/>
						</div>
					</div>

					{/* Filtro Estado */}
					<div>
						<label htmlFor="estado" className="block text-sm font-medium text-neutral-700 mb-2">
							Estado
						</label>
						<select
							id="estado"
							value={filtroEstado}
							onChange={(e) => setFiltroEstado(e.target.value)}
							className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
						>
							<option value="todas">Todas</option>
							<option value="pendiente">Pendientes</option>
							<option value="confirmada">Confirmadas</option>
							<option value="cancelada">Canceladas</option>
							<option value="completada">Completadas</option>
						</select>
					</div>

					{/* Filtro Posada */}
					<div>
						<label htmlFor="posada" className="block text-sm font-medium text-neutral-700 mb-2">
							Posada
						</label>
						<select
							id="posada"
							value={filtroPosada}
							onChange={(e) => setFiltroPosada(e.target.value)}
							className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
						>
							<option value="todas">Todas</option>
							{posadas.map((posada) => (
								<option key={posada.id} value={posada.id}>
									{posada.nombre}
								</option>
							))}
						</select>
					</div>
				</div>
			</div>

			{/* Tabla de Reservas */}
			<div className="bg-white shadow rounded-lg overflow-hidden">
				<TablaReservas reservas={reservas} loading={loading} />
			</div>
		</div>
	);
}
