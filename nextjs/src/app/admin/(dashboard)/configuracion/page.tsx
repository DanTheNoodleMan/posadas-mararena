"use client";

// Archivo: src/app/admin/configuracion/page.tsx
// Página de configuración del panel admin

import { useState, useEffect } from "react";
import { createSPAClient } from "@/lib/supabase/client";
import { Settings, Calendar, DollarSign, Save, AlertCircle } from "lucide-react";

export default function ConfiguracionPage() {
	const supabase = createSPAClient();

	const [fechasBloqueadas, setFechasBloqueadas] = useState<any[]>([]);
	const [loading, setLoading] = useState(false);
	const [mensaje, setMensaje] = useState("");

	// Formulario para bloquear fecha
	const [posadaSeleccionada, setPosadaSeleccionada] = useState("");
	const [fechaBloqueo, setFechaBloqueo] = useState("");
	const [razonBloqueo, setRazonBloqueo] = useState("");
	const [posadas, setPosadas] = useState<any[]>([]);

	// Cargar posadas
	useEffect(() => {
		async function cargarPosadas() {
			const { data } = await supabase.from("posadas").select("id, nombre").order("nombre");

			if (data) setPosadas(data);
		}
		cargarPosadas();
	}, []);

	// Cargar fechas bloqueadas
	useEffect(() => {
		async function cargarFechasBloqueadas() {
			const { data } = await supabase
				.from("disponibilidad_especial")
				.select(
					`
          *,
          posada:posadas(nombre)
        `
				)
				.eq("disponible", false)
				.order("fecha", { ascending: true });

			if (data) setFechasBloqueadas(data);
		}
		cargarFechasBloqueadas();
	}, []);

	const bloquearFecha = async () => {
		if (!posadaSeleccionada || !fechaBloqueo) {
			setMensaje("Por favor completa todos los campos");
			return;
		}

		setLoading(true);
		setMensaje("");

		const { error } = await supabase.from("disponibilidad_especial").insert({
			posada_id: posadaSeleccionada,
			fecha: fechaBloqueo,
			disponible: false,
			razon: razonBloqueo || "Bloqueado por admin",
		});

		if (error) {
			setMensaje("Error al bloquear la fecha");
		} else {
			setMensaje("Fecha bloqueada exitosamente");
			// Recargar lista
			const { data } = await supabase
				.from("disponibilidad_especial")
				.select(
					`
          *,
          posada:posadas(nombre)
        `
				)
				.eq("disponible", false)
				.order("fecha", { ascending: true });

			if (data) setFechasBloqueadas(data);

			// Limpiar formulario
			setPosadaSeleccionada("");
			setFechaBloqueo("");
			setRazonBloqueo("");
		}

		setLoading(false);
	};

	const desbloquearFecha = async (id: string) => {
		if (!confirm("¿Desbloquear esta fecha?")) return;

		const { error } = await supabase.from("disponibilidad_especial").delete().eq("id", id);

		if (!error) {
			setFechasBloqueadas(fechasBloqueadas.filter((f) => f.id !== id));
			setMensaje("Fecha desbloqueada exitosamente");
		}
	};

	return (
		<div className="space-y-6 max-w-4xl">
			{/* Header */}
			<div>
				<h1 className="text-3xl font-bold text-neutral-900 flex items-center gap-2">
					<Settings className="w-8 h-8" />
					Configuración
				</h1>
				<p className="mt-1 text-sm text-neutral-500">Gestiona la configuración del sistema de reservas</p>
			</div>

			{/* Bloquear fechas */}
			<div className="bg-white shadow rounded-lg p-6">
				<div className="flex items-center gap-2 mb-4">
					<Calendar className="w-5 h-5 text-primary-600" />
					<h2 className="text-lg font-semibold text-neutral-900">Bloquear Fechas</h2>
				</div>

				<p className="text-sm text-neutral-600 mb-4">Bloquea fechas específicas para mantenimiento o días no disponibles.</p>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<label className="block text-sm font-medium text-neutral-700 mb-2">Posada</label>
						<select
							value={posadaSeleccionada}
							onChange={(e) => setPosadaSeleccionada(e.target.value)}
							className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
						>
							<option value="">Selecciona una posada</option>
							{posadas.map((posada) => (
								<option key={posada.id} value={posada.id}>
									{posada.nombre}
								</option>
							))}
						</select>
					</div>

					<div>
						<label className="block text-sm font-medium text-neutral-700 mb-2">Fecha</label>
						<input
							type="date"
							value={fechaBloqueo}
							onChange={(e) => setFechaBloqueo(e.target.value)}
							className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
						/>
					</div>

					<div className="md:col-span-2">
						<label className="block text-sm font-medium text-neutral-700 mb-2">Razón (opcional)</label>
						<input
							type="text"
							value={razonBloqueo}
							onChange={(e) => setRazonBloqueo(e.target.value)}
							placeholder="Ej: Mantenimiento de piscina"
							className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
						/>
					</div>
				</div>

				<button
					onClick={bloquearFecha}
					disabled={loading}
					className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
				>
					<Save className="w-5 h-5" />
					{loading ? "Bloqueando..." : "Bloquear Fecha"}
				</button>

				{mensaje && (
					<div
						className={`mt-4 p-4 rounded-lg ${
							mensaje.includes("Error") ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"
						}`}
					>
						{mensaje}
					</div>
				)}
			</div>

			{/* Lista de fechas bloqueadas */}
			<div className="bg-white shadow rounded-lg p-6">
				<h3 className="text-lg font-semibold text-neutral-900 mb-4">Fechas Bloqueadas</h3>

				{fechasBloqueadas.length === 0 ? (
					<p className="text-sm text-neutral-500 text-center py-8">No hay fechas bloqueadas actualmente</p>
				) : (
					<ul className="divide-y divide-neutral-200">
						{fechasBloqueadas.map((bloqueo) => (
							<li key={bloqueo.id} className="py-4 flex items-center justify-between">
								<div>
									<p className="text-sm font-medium text-neutral-900">
										{new Date(bloqueo.fecha + "T12:00:00").toLocaleDateString("es-VE", {
											weekday: "long",
											day: "numeric",
											month: "long",
											year: "numeric",
										})}
									</p>
									<p className="text-sm text-neutral-500">
										{bloqueo.posada?.nombre} • {bloqueo.razon || "Sin razón especificada"}
									</p>
								</div>
								<button
									onClick={() => desbloquearFecha(bloqueo.id)}
									className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
								>
									Desbloquear
								</button>
							</li>
						))}
					</ul>
				)}
			</div>

			{/* Info adicional */}
			<div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
				<div className="flex gap-2">
					<AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
					<div className="text-sm text-blue-800">
						<p className="font-medium mb-1">Información Importante</p>
						<ul className="text-xs space-y-1 list-disc list-inside">
							<li>Las fechas bloqueadas no estarán disponibles para nuevas reservas.</li>
							<li>Las reservas existentes no se ven afectadas por los bloqueos.</li>
							<li>Puedes desbloquear fechas en cualquier momento.</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
}
