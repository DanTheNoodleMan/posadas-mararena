"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { connection } from "next/server";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/FooterCTA";
import Button from "@/components/ui/button";
import Calendar from "@/components/ui/Calendar";
import GuestSelector from "@/components/ui/GuestSelector";
import HabitacionSelector from "@/components/ui/HabitacionSelector";
import { Check, ArrowRight, ArrowLeft, Loader2, Users as UsersIcon } from "lucide-react";
import { createSPAClient } from "@/lib/supabase/client";
import {
	limpiarHoldsExpirados,
	calcularPrecioTotal,
	// Funciones para sistema múltiple habitaciones
	obtenerHabitacionesDisponibles,
	crearHoldMultiple,
	crearReservaMultiple,
	eliminarHoldTemporal,
	type HabitacionDisponible,
} from "@/lib/reservas";

// Tipos
interface Posada {
	id: string;
	nombre: string;
	slug: string;
	capacidad_maxima: number;
	precio_posada_completa: number;
	descripcion_corta: string;
}

interface FechaOcupada {
	fecha_inicio: string;
	fecha_fin: string;
	tipo: string;
}

type TipoReserva = "habitacion" | "posada_completa";

export default async function ReservasPage() {
	await connection();
	const searchParams = useSearchParams();
	const supabase = createSPAClient();

	// Estados principales
	const [paso, setPaso] = useState(1);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Datos de posadas
	const [posadas, setPosadas] = useState<Posada[]>([]);
	const [habitacionesCount, setHabitacionesCount] = useState<{ [key: string]: number }>({});
	const [fechasOcupadas, setFechasOcupadas] = useState<FechaOcupada[]>([]);

	// NUEVO: Habitaciones disponibles con flag de disponibilidad
	const [habitacionesDisponibles, setHabitacionesDisponibles] = useState<HabitacionDisponible[]>([]);
	const [cargandoHabitaciones, setCargandoHabitaciones] = useState(false);

	// Selecciones del usuario
	const [posadaSeleccionada, setPosadaSeleccionada] = useState<string | null>(null);
	const [tipoReserva, setTipoReserva] = useState<TipoReserva>("posada_completa");
	const [habitacionesSeleccionadas, setHabitacionesSeleccionadas] = useState<string[]>([]);
	const [fechaInicio, setFechaInicio] = useState<string>("");
	const [fechaFin, setFechaFin] = useState<string>("");
	const [numHuespedes, setNumHuespedes] = useState<number>(1);

	// Datos del cliente
	const [nombreCliente, setNombreCliente] = useState("");
	const [emailCliente, setEmailCliente] = useState("");
	const [telefonoCliente, setTelefonoCliente] = useState("");
	const [notasCliente, setNotasCliente] = useState("");

	// Hold temporal y confirmación
	const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
	const [holdId, setHoldId] = useState<string | null>(null);
	const [codigoReserva, setCodigoReserva] = useState<string | null>(null);
	const [tiempoRestante, setTiempoRestante] = useState<number>(1800);

	// ============================================
	// EFECTOS INICIALES
	// ============================================

	// Limpiar holds expirados al comienzo
	useEffect(() => {
		limpiarHoldsExpirados(supabase);
	}, []);

	// Cargar posadas
	useEffect(() => {
		cargarPosadas();
		const posadaUrl = searchParams.get("posada");
		if (posadaUrl) {
			setPosadaSeleccionada(posadaUrl);
		}
	}, [searchParams]);

	// Cargar fechas ocupadas cuando se selecciona posada O cambia el tipo de reserva
	useEffect(() => {
		if (posadaSeleccionada) {
			cargarFechasOcupadas(posadaSeleccionada);
		}
	}, [posadaSeleccionada, tipoReserva]); // Agregar tipoReserva como dependencia

	// NUEVO: Cargar habitaciones disponibles cuando se seleccionan fechas
	useEffect(() => {
		if (posadaSeleccionada && fechaInicio && fechaFin && tipoReserva === "habitacion") {
			cargarHabitacionesDisponibles();
		}
	}, [posadaSeleccionada, fechaInicio, fechaFin, tipoReserva]);

	// Timer para hold temporal
	useEffect(() => {
		if (!holdId) return;

		const interval = setInterval(() => {
			setTiempoRestante((prev) => {
				if (prev <= 1) {
					clearInterval(interval);
					setError("Tu reserva temporal expiró. Por favor intenta nuevamente.");
					setPaso(1);
					setHoldId(null);
					return 0;
				}
				return prev - 1;
			});
		}, 1000);

		return () => clearInterval(interval);
	}, [holdId]);

	// ============================================
	// FUNCIONES DE CARGA DE DATOS
	// ============================================

	const cargarPosadas = async () => {
		try {
			const { data, error } = await supabase
				.from("posadas")
				.select("id, nombre, slug, capacidad_maxima, precio_posada_completa, descripcion_corta")
				.eq("activa", true)
				.order("orden_display");

			if (error) throw error;
			setPosadas(data || []);

			// Cargar conteo de habitaciones para cada posada
			if (data) {
				const counts: { [key: string]: number } = {};
				for (const posada of data) {
					const { count } = await supabase
						.from("habitaciones")
						.select("*", { count: "exact", head: true })
						.eq("posada_id", posada.id)
						.eq("activa", true);
					counts[posada.slug] = count || 0;
				}
				setHabitacionesCount(counts);
			}
		} catch (err) {
			console.error("Error cargando posadas:", err);
			setError("Error cargando posadas. Intenta recargar la página.");
		}
	};

	const cargarFechasOcupadas = async (posadaSlug: string) => {
		try {
			const { data: posadaData } = await supabase.from("posadas").select("id").eq("slug", posadaSlug).single();

			if (!posadaData) return;

			// Determinar qué función llamar según el tipo de reserva
			const funcionRPC =
				tipoReserva === "habitacion"
					? "obtener_fechas_sin_disponibilidad" // Solo muestra posada completa bloqueada
					: "obtener_fechas_ocupadas"; // Muestra todas las fechas ocupadas

			const { data, error } = await supabase.rpc(funcionRPC, {
				p_posada_id: posadaData.id,
				p_fecha_desde: new Date().toISOString().split("T")[0],
				p_fecha_hasta: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
			});

			if (error) throw error;
			setFechasOcupadas(data || []);
		} catch (err) {
			console.error("Error cargando fechas ocupadas:", err);
		}
	};

	// NUEVA FUNCIÓN: Cargar habitaciones con disponibilidad
	const cargarHabitacionesDisponibles = async () => {
		if (!posadaSeleccionada || !fechaInicio || !fechaFin) return;

		setCargandoHabitaciones(true);
		setError(null);

		try {
			const { data: posadaData } = await supabase.from("posadas").select("id").eq("slug", posadaSeleccionada).single();

			if (!posadaData) {
				throw new Error("Posada no encontrada");
			}

			const result = await obtenerHabitacionesDisponibles(supabase, posadaData.id, fechaInicio, fechaFin, sessionId);

			if (!result.success) {
				throw new Error(result.error || "Error cargando habitaciones");
			}

			setHabitacionesDisponibles(result.habitaciones || []);
			setHabitacionesSeleccionadas([]); // Reset selección cuando cambian las fechas
		} catch (err: any) {
			console.error("Error cargando habitaciones:", err);
			setError(err.message || "Error cargando habitaciones disponibles");
		} finally {
			setCargandoHabitaciones(false);
		}
	};

	// ============================================
	// VALIDACIONES
	// ============================================

	const validarEmail = (email: string): boolean => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	};

	const validarFechas = (): boolean => {
		if (!fechaInicio || !fechaFin) {
			setError("Por favor selecciona las fechas de tu estadía");
			return false;
		}

		const inicio = new Date(fechaInicio);
		const fin = new Date(fechaFin);
		const hoy = new Date();
		hoy.setHours(0, 0, 0, 0);

		if (inicio < hoy) {
			setError("La fecha de inicio no puede ser anterior a hoy");
			return false;
		}

		if (fin <= inicio) {
			setError("La fecha de fin debe ser posterior a la fecha de inicio");
			return false;
		}

		return true;
	};

	const validarSeleccionHabitaciones = (): boolean => {
		if (tipoReserva === "habitacion" && habitacionesSeleccionadas.length === 0) {
			setError("Por favor selecciona al menos una habitación");
			return false;
		}
		return true;
	};

	// ============================================
	// CREAR HOLD Y RESERVA
	// ============================================

	const crearHold = async () => {
		if (!posadaSeleccionada || !validarFechas() || !validarSeleccionHabitaciones()) return false;

		setLoading(true);
		setError(null);

		try {
			const { data: posadaData } = await supabase.from("posadas").select("id").eq("slug", posadaSeleccionada).single();

			if (!posadaData) throw new Error("Posada no encontrada");

			// NUEVA LÓGICA: Usar función para múltiples habitaciones
			if (tipoReserva === "habitacion") {
				const result = await crearHoldMultiple(supabase, {
					session_id: sessionId,
					posada_id: posadaData.id,
					fecha_inicio: fechaInicio,
					fecha_fin: fechaFin,
					habitaciones_ids: habitacionesSeleccionadas,
				});

				if (!result.success || !result.holdId) {
					setError(result.error || "Error creando hold temporal");
					return false;
				}

				setHoldId(result.holdId);
			} else {
				// Posada completa - usar lógica antigua
				const { data: hold, error } = await supabase
					.from("holds_temporales")
					.insert({
						session_id: sessionId,
						posada_id: posadaData.id,
						habitacion_id: null,
						fecha_inicio: fechaInicio,
						fecha_fin: fechaFin,
						expira_en: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
						tipo_reserva: "posada_completa",
					})
					.select()
					.single();

				if (error) throw error;
				setHoldId(hold.id);
			}

			setTiempoRestante(1800);
			return true;
		} catch (err: any) {
			console.error("Error creando hold:", err);
			setError("Error reservando temporalmente. Por favor intenta de nuevo.");
			return false;
		} finally {
			setLoading(false);
		}
	};

	const finalizarReserva = async () => {
		setLoading(true);
		setError(null);

		try {
			const { data: posadaData } = await supabase
				.from("posadas")
				.select("id, precio_posada_completa")
				.eq("slug", posadaSeleccionada)
				.single();

			if (!posadaData) throw new Error("Posada no encontrada");

			// NUEVA LÓGICA: Usar función para múltiples habitaciones
			if (tipoReserva === "habitacion") {
				const result = await crearReservaMultiple(supabase, {
					session_id: sessionId,
					posada_id: posadaData.id,
					fecha_inicio: fechaInicio,
					fecha_fin: fechaFin,
					habitaciones_ids: habitacionesSeleccionadas,
					num_huespedes: numHuespedes,
					nombre_cliente: nombreCliente,
					email_cliente: emailCliente,
					telefono_cliente: telefonoCliente,
					notas_especiales: notasCliente,
				});

				if (!result.success || !result.reserva) {
					setError(result.error || "Error creando reserva");
					return;
				}

				setCodigoReserva(result.reserva.codigo_reserva);
			} else {
				// Posada completa - lógica antigua
				const { numNoches, precioTotal } = calcularPrecioTotal(posadaData.precio_posada_completa, fechaInicio, fechaFin);

				const { data: reserva, error } = await supabase
					.from("reservas")
					.insert({
						tipo_reserva: "posada_completa",
						posada_id: posadaData.id,
						habitacion_id: null,
						fecha_inicio: fechaInicio,
						fecha_fin: fechaFin,
						nombre_cliente: nombreCliente,
						email_cliente: emailCliente,
						telefono_cliente: telefonoCliente,
						num_huespedes: numHuespedes,
						notas_cliente: notasCliente,
						precio_por_noche: posadaData.precio_posada_completa,
						precio_total: precioTotal,
						session_id: sessionId,
						estado: "pendiente",
					})
					.select()
					.single();

				if (error) throw error;
				setCodigoReserva(reserva.codigo_reserva);
			}

			// Eliminar hold temporal
			if (holdId) {
				await eliminarHoldTemporal(supabase, holdId);
			}

			setPaso(5);
		} catch (err: any) {
			console.error("Error creando reserva:", err);
			setError("Error completando la reserva. Por favor intenta de nuevo.");
		} finally {
			setLoading(false);
		}
	};

	// ============================================
	// NAVEGACIÓN
	// ============================================

	const siguientePaso = async () => {
		setError(null);

		if (paso === 1) {
			if (!posadaSeleccionada) {
				setError("Por favor selecciona una posada");
				return;
			}
			setPaso(2);
		} else if (paso === 2) {
			if (!validarFechas() || !validarSeleccionHabitaciones()) return;

			const holdCreado = await crearHold();
			if (holdCreado) {
				setPaso(3);
			}
		} else if (paso === 3) {
			if (!nombreCliente || !emailCliente || !telefonoCliente) {
				setError("Por favor completa todos los campos obligatorios");
				return;
			}
			if (!validarEmail(emailCliente)) {
				setError("Por favor ingresa un email válido");
				return;
			}
			setPaso(4);
		} else if (paso === 4) {
			await finalizarReserva();
		}
	};

	const pasoAnterior = () => {
		if (paso > 1) {
			setPaso(paso - 1);
			setError(null);
		}
	};

	// ============================================
	// CÁLCULOS
	// ============================================

	const calcularPrecio = () => {
		if (!fechaInicio || !fechaFin) return { noches: 0, total: 0, porNoche: 0 };

		const { numNoches } = calcularPrecioTotal(0, fechaInicio, fechaFin);
		const posada = posadas.find((p) => p.slug === posadaSeleccionada);
		if (!posada) return { noches: numNoches, total: 0, porNoche: 0 };

		let precioPorNoche = posada.precio_posada_completa;

		if (tipoReserva === "habitacion" && habitacionesSeleccionadas.length > 0) {
			precioPorNoche = habitacionesDisponibles
				.filter((h) => habitacionesSeleccionadas.includes(h.id))
				.reduce((sum, h) => sum + h.precio_por_noche, 0);
		}

		return {
			noches: numNoches,
			total: precioPorNoche * numNoches,
			porNoche: precioPorNoche,
		};
	};

	const formatearTiempo = (segundos: number) => {
		const mins = Math.floor(segundos / 60);
		const secs = segundos % 60;
		return `${mins}:${secs.toString().padStart(2, "0")}`;
	};

	const precio = calcularPrecio();
	const posadaActual = posadas.find((p) => p.slug === posadaSeleccionada);

	return (
		<>
			<Header />

			<div className="min-h-screen bg-neutral-50 py-16">
				<div className="max-w-4xl mx-auto px-6">
					{/* Header */}
					<div className="text-center mb-12">
						<h1 className="font-display text-4xl md:text-5xl text-primary-600 mb-4">Reserva tu Estadía</h1>
						<p className="text-primary-600/70 text-lg">Completa los siguientes pasos para confirmar tu reserva</p>
					</div>

					{/* Progress Bar */}
					<div className="mb-12">
						<div className="flex items-center justify-between mb-4">
							{["Posada", "Fechas", "Datos", "Confirmación"].map((label, idx) => (
								<div key={idx} className="flex-1 text-center">
									<div
										className={`inline-flex items-center justify-center w-10 h-10 rounded-full ${
											paso > idx + 1
												? "bg-accent-500 text-primary-600"
												: paso === idx + 1
												? "bg-primary-600 text-neutral-50"
												: "bg-neutral-200 text-primary-600/50"
										}`}
									>
										{paso > idx + 1 ? <Check className="w-5 h-5" /> : idx + 1}
									</div>
									<p className="text-xs mt-2 text-primary-600/70">{label}</p>
								</div>
							))}
						</div>
						<div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
							<div className="h-full bg-accent-500 transition-all duration-300" style={{ width: `${(paso / 4) * 100}%` }} />
						</div>
					</div>

					{/* Timer */}
					{holdId && paso >= 3 && paso < 5 && (
						<div className="mb-6 p-4 bg-accent-500/10 border border-accent-500 rounded-sm text-center">
							<p className="text-primary-600 font-semibold">Tiempo restante: {formatearTiempo(tiempoRestante)}</p>
						</div>
					)}

					{/* Error */}
					{error && (
						<div className="mb-6 p-4 bg-red-50 border border-red-300 rounded-sm">
							<p className="text-red-700">{error}</p>
						</div>
					)}

					{/* PASO 1: Selección de Posada */}
					{paso === 1 && (
						<div className="bg-neutral-100 p-8 rounded-sm">
							<h2 className="font-display text-2xl text-primary-600 mb-6">Selecciona una Posada</h2>
							<div className="space-y-4">
								{posadas.map((posada) => (
									<div
										key={posada.id}
										className={`p-6 border-2 rounded-sm cursor-pointer transition-all ${
											posadaSeleccionada === posada.slug
												? "border-accent-500 bg-accent-500/5"
												: "border-neutral-300 hover:border-accent-500/50"
										}`}
										onClick={() => setPosadaSeleccionada(posada.slug)}
									>
										<div className="flex items-start justify-between">
											<div>
												<h3 className="font-semibold text-xl text-primary-600 mb-2">{posada.nombre}</h3>
												<p className="text-primary-600/70 mb-4">{posada.descripcion_corta}</p>
												<div className="flex items-center gap-6 text-sm">
													<span className="flex items-center gap-2">
														<UsersIcon className="w-4 h-4 text-accent-500" />
														Hasta {posada.capacidad_maxima} personas
													</span>
													<span className="text-primary-600/60">
														{habitacionesCount[posada.slug] || 0} habitaciones
													</span>
													<span className="font-semibold text-accent-500">
														${posada.precio_posada_completa}/noche completa
													</span>
												</div>
											</div>
											<div
												className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
													posadaSeleccionada === posada.slug
														? "border-accent-500 bg-accent-500"
														: "border-neutral-300"
												}`}
											>
												{posadaSeleccionada === posada.slug && <Check className="w-4 h-4 text-primary-600" />}
											</div>
										</div>
									</div>
								))}
							</div>
						</div>
					)}

					{/* PASO 2: Fechas y Habitaciones */}
					{paso === 2 && posadaActual && (
						<div className="space-y-6">
							<div className="bg-neutral-100 p-2 md:p-8 rounded-sm">
								<h2 className="font-display text-2xl text-primary-600 mb-6">Fechas - {posadaActual.nombre}</h2>

								<Calendar
									fechaInicio={fechaInicio}
									fechaFin={fechaFin}
									onFechasChange={(inicio: any, fin: any) => {
										setFechaInicio(inicio);
										setFechaFin(fin);
									}}
									fechasOcupadas={fechasOcupadas}
								/>

								<div className="mt-6">
									<GuestSelector
										value={numHuespedes}
										onChange={setNumHuespedes}
										min={1}
										max={posadaActual.capacidad_maxima}
										label="Número de Huéspedes"
										className=""
									/>
								</div>

								<div className="mt-6">
									<h3 className="font-semibold text-primary-600 mb-4">Tipo de Reserva</h3>
									<div className="space-y-3">
										<div
											className={`p-4 border-2 rounded-sm cursor-pointer ${
												tipoReserva === "posada_completa"
													? "border-accent-500 bg-accent-500/5"
													: "border-neutral-300"
											}`}
											onClick={() => {
												setTipoReserva("posada_completa");
												setHabitacionesSeleccionadas([]);
											}}
										>
											<div className="flex items-center justify-between">
												<span className="font-semibold">Posada Completa</span>
												<span className="text-accent-500">${posadaActual.precio_posada_completa}/noche</span>
											</div>
										</div>
										<div
											className={`p-4 border-2 rounded-sm cursor-pointer ${
												tipoReserva === "habitacion" ? "border-accent-500 bg-accent-500/5" : "border-neutral-300"
											}`}
											onClick={() => setTipoReserva("habitacion")}
										>
											<div>
												<span className="font-semibold">Habitaciones Individuales</span>
												<p className="text-xs text-primary-600/60 mt-1">
													Elige las fechas y te mostraremos qué habitaciones están disponibles
												</p>
											</div>
										</div>
									</div>
								</div>

								{/* NUEVO: Selector visual de habitaciones */}
								{tipoReserva === "habitacion" && fechaInicio && fechaFin && (
									<div className="mt-6">
										{cargandoHabitaciones ? (
											<div className="text-center py-12">
												<Loader2 className="w-12 h-12 animate-spin text-primary-600 mx-auto mb-4" />
												<p className="text-primary-600/70">Cargando habitaciones disponibles...</p>
											</div>
										) : (
											<HabitacionSelector
												habitaciones={habitacionesDisponibles}
												habitacionesSeleccionadas={habitacionesSeleccionadas}
												onSeleccionChange={setHabitacionesSeleccionadas}
												numNoches={precio.noches}
											/>
										)}
									</div>
								)}

								{tipoReserva === "habitacion" && (!fechaInicio || !fechaFin) && (
									<div className="mt-6 p-4 bg-primary-600/5 border border-primary-600/20 rounded-sm">
										<p className="text-sm text-primary-600/70">
											Selecciona las fechas para ver las habitaciones disponibles
										</p>
									</div>
								)}
							</div>

							{/* Resumen Precio */}
							{fechaInicio && fechaFin && (tipoReserva === "posada_completa" || habitacionesSeleccionadas.length > 0) && (
								<div className="bg-primary-600 p-6 rounded-sm text-neutral-50">
									<h3 className="font-display text-xl mb-4">Resumen de Precio</h3>
									<div className="space-y-2">
										<div className="flex justify-between">
											<span>Precio por noche:</span>
											<span>${precio.porNoche}</span>
										</div>
										<div className="flex justify-between">
											<span>Número de noches:</span>
											<span>{precio.noches}</span>
										</div>
										<div className="border-t border-neutral-50/20 pt-2 mt-2">
											<div className="flex justify-between font-bold text-xl">
												<span>Total:</span>
												<span className="text-accent-500">${precio.total}</span>
											</div>
										</div>
									</div>
								</div>
							)}
						</div>
					)}

					{/* PASO 3: Datos */}
					{paso === 3 && (
						<div className="bg-neutral-100 p-8 rounded-sm">
							<h2 className="font-display text-2xl text-primary-600 mb-6">Tus Datos</h2>
							<div className="space-y-6">
								<div>
									<label className="block text-sm font-semibold text-primary-600 mb-2">Nombre Completo *</label>
									<input
										type="text"
										value={nombreCliente}
										onChange={(e) => setNombreCliente(e.target.value)}
										className="w-full px-4 py-3 border border-neutral-300 rounded-sm focus:border-accent-500 focus:outline-none"
										required
									/>
								</div>
								<div>
									<label className="block text-sm font-semibold text-primary-600 mb-2">Email *</label>
									<input
										type="email"
										value={emailCliente}
										onChange={(e) => setEmailCliente(e.target.value)}
										className="w-full px-4 py-3 border border-neutral-300 rounded-sm focus:border-accent-500 focus:outline-none"
										required
									/>
								</div>
								<div>
									<label className="block text-sm font-semibold text-primary-600 mb-2">
										Teléfono (con código de país) *
									</label>
									<input
										type="tel"
										value={telefonoCliente}
										onChange={(e) => setTelefonoCliente(e.target.value)}
										placeholder="+58 412 1234567"
										className="w-full px-4 py-3 border border-neutral-300 rounded-sm focus:border-accent-500 focus:outline-none"
										required
									/>
								</div>
								<div>
									<label className="block text-sm font-semibold text-primary-600 mb-2">
										Notas Adicionales (Opcional)
									</label>
									<textarea
										value={notasCliente}
										onChange={(e) => setNotasCliente(e.target.value)}
										rows={4}
										className="w-full px-4 py-3 border border-neutral-300 rounded-sm focus:border-accent-500 focus:outline-none"
										placeholder="Solicitudes especiales, hora estimada de llegada, etc."
									/>
								</div>
							</div>
						</div>
					)}

					{/* PASO 4: Confirmación */}
					{paso === 4 && posadaActual && (
						<div className="bg-neutral-100 p-8 rounded-sm">
							<h2 className="font-display text-2xl text-primary-600 mb-6">Confirmar Reserva</h2>
							<div className="space-y-6">
								<div>
									<h3 className="font-semibold text-primary-600 mb-2">Posada</h3>
									<p className="text-primary-600/70">{posadaActual.nombre}</p>
								</div>
								<div>
									<h3 className="font-semibold text-primary-600 mb-2">Fechas</h3>
									<p className="text-primary-600/70">
										Del {new Date(fechaInicio).toLocaleDateString("es-ES")} al{" "}
										{new Date(fechaFin).toLocaleDateString("es-ES")}
										<span className="ml-2">({precio.noches} noches)</span>
									</p>
								</div>
								<div>
									<h3 className="font-semibold text-primary-600 mb-2">Huéspedes</h3>
									<p className="text-primary-600/70">
										{numHuespedes} {numHuespedes === 1 ? "persona" : "personas"}
									</p>
								</div>
								<div>
									<h3 className="font-semibold text-primary-600 mb-2">Tipo de Reserva</h3>
									<p className="text-primary-600/70">
										{tipoReserva === "posada_completa" ? (
											"Posada Completa"
										) : (
											<>
												Habitaciones:{" "}
												{habitacionesSeleccionadas
													.map((id) => habitacionesDisponibles.find((h) => h.id === id)?.nombre)
													.join(", ")}
											</>
										)}
									</p>
								</div>
								<div>
									<h3 className="font-semibold text-primary-600 mb-2">Datos de Contacto</h3>
									<p className="text-primary-600/70">{nombreCliente}</p>
									<p className="text-primary-600/70">{emailCliente}</p>
									<p className="text-primary-600/70">{telefonoCliente}</p>
								</div>
								{notasCliente && (
									<div>
										<h3 className="font-semibold text-primary-600 mb-2">Notas</h3>
										<p className="text-primary-600/70">{notasCliente}</p>
									</div>
								)}
								<div className="border-t pt-6">
									<div className="flex justify-between items-center mb-4">
										<span className="font-display text-2xl text-primary-600">Total a Pagar:</span>
										<span className="font-display text-3xl text-accent-500">${precio.total}</span>
									</div>
									<div className="bg-primary-600/5 p-4 rounded-sm">
										<p className="text-sm text-primary-600">
											<strong>Instrucciones de Pago:</strong> Una vez confirmada tu reserva, recibirás un email con
											los detalles de pago (transferencia bancaria o efectivo). Tu reserva quedará confirmada de
											inmediato y tendrás 24 horas para realizar el pago.
										</p>
									</div>
								</div>
							</div>
						</div>
					)}

					{/* PASO 5: Confirmación Exitosa */}
					{paso === 5 && codigoReserva && (
						<div className="bg-neutral-100 p-8 rounded-sm text-center">
							<div className="w-16 h-16 bg-accent-500 rounded-full flex items-center justify-center mx-auto mb-6">
								<Check className="w-10 h-10 text-primary-600" />
							</div>
							<h2 className="font-display text-3xl text-primary-600 mb-4">¡Reserva Confirmada!</h2>
							<p className="text-primary-600/70 text-lg mb-8">Tu código de reserva es:</p>
							<div className="bg-primary-600 text-neutral-50 py-4 px-8 rounded-sm inline-block mb-8">
								<span className="font-mono text-2xl font-bold tracking-wider">{codigoReserva}</span>
							</div>
							<div className="space-y-4 text-left max-w-xl mx-auto mb-8">
								<p className="text-primary-600/80">
									<strong>¡Importante!</strong> Hemos enviado un email a <strong>{emailCliente}</strong> con:
								</p>
								<ul className="list-disc list-inside space-y-2 text-primary-600/70">
									<li>Detalles completos de tu reserva</li>
									<li>Instrucciones de pago (transferencia o efectivo)</li>
									<li>Datos de contacto de la posada</li>
									<li>Información adicional para tu estadía</li>
								</ul>
								<p className="text-primary-600/80">
									<strong>Plazo de pago:</strong> Tienes 24 horas para completar el pago y confirmar tu reserva.
								</p>
							</div>
							<div className="flex flex-col sm:flex-row gap-4 justify-center">
								<Button
									variant="primary"
									href={`https://wa.me/584123112746?text=${encodeURIComponent(
										`Hola! Acabo de hacer una reserva con código ${codigoReserva}`
									)}`}
									external
								>
									Contactar por WhatsApp
								</Button>
								<Button variant="secondary" href="/consultar-reserva">
									Consultar mi Reserva
								</Button>
							</div>
						</div>
					)}

					{/* Botones de Navegación */}
					{paso < 5 && (
						<div className="flex justify-between mt-8">
							{paso > 1 && (
								<Button variant="secondary" onClick={pasoAnterior} disabled={loading}>
									<ArrowLeft className="w-5 h-5 mr-2" />
									Anterior
								</Button>
							)}
							<Button
								variant="primary"
								onClick={siguientePaso}
								disabled={loading}
								className={`${paso === 1 ? "ml-auto" : ""}`}
							>
								{loading ? (
									<>
										<Loader2 className="w-5 h-5 mr-2 animate-spin" />
										Procesando...
									</>
								) : (
									<>
										{paso === 4 ? "Confirmar Reserva" : "Siguiente"}
										<ArrowRight className="w-5 h-5 ml-2" />
									</>
								)}
							</Button>
						</div>
					)}
				</div>
			</div>

			<Footer />
		</>
	);
}
