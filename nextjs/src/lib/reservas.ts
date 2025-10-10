import { SupabaseClient } from "@supabase/supabase-js";

export interface CreateReservaData {
	tipo_reserva: "habitacion" | "posada_completa";
	posada_id: string;
	habitacion_id?: string | null;
	fecha_inicio: string;
	fecha_fin: string;
	nombre_cliente: string;
	email_cliente: string;
	telefono_cliente: string;
	num_huespedes: number;
	notas_cliente?: string;
	precio_por_noche: number;
	precio_total: number;
	session_id: string;
}

export interface CreateHoldData {
	session_id: string;
	posada_id: string;
	habitacion_id?: string | null;
	fecha_inicio: string;
	fecha_fin: string;
	tipo_reserva: "habitacion" | "posada_completa";
}

// ============================================
// NUEVAS INTERFACES (agregar después de las existentes)
// ============================================

export interface HabitacionDisponible {
	id: string;
	nombre: string;
	descripcion: string;
	capacidad: number;
	precio_por_noche: number;
	amenidades: string[];
	orden_display: number;
	disponible: boolean;
	motivo_no_disponible?: string;
}

export interface CreateHoldMultipleData {
	session_id: string;
	posada_id: string;
	fecha_inicio: string;
	fecha_fin: string;
	habitaciones_ids: string[]; // Array de IDs de habitaciones
}

export interface CreateReservaMultipleData {
	session_id: string;
	posada_id: string;
	fecha_inicio: string;
	fecha_fin: string;
	habitaciones_ids: string[];
	num_huespedes: number;
	nombre_cliente: string;
	email_cliente: string;
	telefono_cliente: string;
	notas_especiales?: string;
}

/**
 * Verificar disponibilidad de fechas
 */
export async function verificarDisponibilidad(
	supabase: SupabaseClient,
	posadaId: string,
	fechaInicio: string,
	fechaFin: string,
	habitacionId?: string | null,
	sessionId?: string | null
): Promise<boolean> {
	try {
		const { data, error } = await supabase.rpc("verificar_disponibilidad", {
			p_posada_id: posadaId,
			p_fecha_inicio: fechaInicio,
			p_fecha_fin: fechaFin,
			p_habitacion_id: habitacionId || null,
			p_session_id: sessionId || null,
		});

		if (error) throw error;
		return data === true;
	} catch (error) {
		console.error("Error verificando disponibilidad:", error);
		return false;
	}
}

/**
 * Crear hold temporal (30 minutos)
 */
export async function crearHoldTemporal(
	supabase: SupabaseClient,
	data: CreateHoldData
): Promise<{ success: boolean; holdId?: string; error?: string }> {
	try {
		// Verificar disponibilidad primero
		const disponible = await verificarDisponibilidad(
			supabase,
			data.posada_id,
			data.fecha_inicio,
			data.fecha_fin,
			data.habitacion_id,
			data.session_id
		);

		if (!disponible) {
			return {
				success: false,
				error: "Las fechas seleccionadas no están disponibles",
			};
		}

		const expiraEn = new Date(Date.now() + 30 * 60 * 1000); // 30 minutos

		const { data: hold, error } = await supabase
			.from("holds_temporales")
			.insert({
				...data,
				expira_en: expiraEn.toISOString(),
			})
			.select()
			.single();

		if (error) throw error;

		return {
			success: true,
			holdId: hold.id,
		};
	} catch (error: any) {
		console.error("Error creando hold temporal:", error);
		return {
			success: false,
			error: error.message || "Error creando hold temporal",
		};
	}
}

/**
 * Eliminar hold temporal
 */
export async function eliminarHoldTemporal(supabase: SupabaseClient, holdId: string): Promise<boolean> {
	try {
		const { error } = await supabase.from("holds_temporales").delete().eq("id", holdId);

		if (error) throw error;
		return true;
	} catch (error) {
		console.error("Error eliminando hold:", error);
		return false;
	}
}

/**
 * Limpiar holds expirados
 */
export async function limpiarHoldsExpirados(supabase: SupabaseClient): Promise<number> {
	try {
		const { data, error } = await supabase.rpc("limpiar_holds_expirados");

		if (error) throw error;
		return data || 0;
	} catch (error) {
		console.error("Error limpiando holds expirados:", error);
		return 0;
	}
}

/**
 * Crear reserva confirmada
 */
export async function crearReserva(
	supabase: SupabaseClient,
	data: CreateReservaData
): Promise<{ success: boolean; reserva?: any; error?: string }> {
	try {
		// Verificar disponibilidad una última vez
		const disponible = await verificarDisponibilidad(
			supabase,
			data.posada_id,
			data.fecha_inicio,
			data.fecha_fin,
			data.habitacion_id,
			data.session_id
		);

		if (!disponible) {
			return {
				success: false,
				error: "Las fechas seleccionadas ya no están disponibles",
			};
		}

		const { data: reserva, error } = await supabase
			.from("reservas")
			.insert({
				...data,
				estado: "pendiente", // Estado inicial
			})
			.select()
			.single();

		if (error) throw error;

		return {
			success: true,
			reserva,
		};
	} catch (error: any) {
		console.error("Error creando reserva:", error);
		return {
			success: false,
			error: error.message || "Error creando reserva",
		};
	}
}

/**
 * Obtener fechas ocupadas para calendario
 */
export async function obtenerFechasOcupadas(
	supabase: SupabaseClient,
	posadaId: string,
	fechaDesde?: string,
	fechaHasta?: string,
	habitacionId?: string | null
): Promise<any[]> {
	try {
		const { data, error } = await supabase.rpc("obtener_fechas_ocupadas", {
			p_posada_id: posadaId,
			p_fecha_desde: fechaDesde || new Date().toISOString().split("T")[0],
			p_fecha_hasta: fechaHasta || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
			p_habitacion_id: habitacionId || null,
		});

		if (error) throw error;
		return data || [];
	} catch (error) {
		console.error("Error obteniendo fechas ocupadas:", error);
		return [];
	}
}

/**
 * Buscar reserva por código
 */
export async function buscarReservaPorCodigo(
	supabase: SupabaseClient,
	codigoReserva: string
): Promise<{ success: boolean; reserva?: any; error?: string }> {
	try {
		const { data, error } = await supabase
			.from("reservas")
			.select(
				`
				*,
				posada:posadas(nombre, slug),
				habitacion:habitaciones(nombre)
			`
			)
			.eq("codigo_reserva", codigoReserva.toUpperCase())
			.single();

		if (error) throw error;

		if (!data) {
			return {
				success: false,
				error: "Reserva no encontrada",
			};
		}

		return {
			success: true,
			reserva: data,
		};
	} catch (error: any) {
		console.error("Error buscando reserva:", error);
		return {
			success: false,
			error: "Reserva no encontrada",
		};
	}
}

/**
 * Calcular precio total
 */
export function calcularPrecioTotal(
	precioPorNoche: number,
	fechaInicio: string,
	fechaFin: string
): { numNoches: number; precioTotal: number } {
	const inicio = new Date(fechaInicio);
	const fin = new Date(fechaFin);

	const numNoches = Math.ceil((fin.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24));

	return {
		numNoches,
		precioTotal: precioPorNoche * numNoches,
	};
}

// ============================================
// NUEVAS FUNCIONES (agregar al final del archivo)
// ============================================

/**
 * Obtener habitaciones con su disponibilidad para fechas específicas
 */
export async function obtenerHabitacionesDisponibles(
	supabase: SupabaseClient,
	posadaId: string,
	fechaInicio: string,
	fechaFin: string,
	sessionId?: string
): Promise<{ success: boolean; habitaciones?: HabitacionDisponible[]; error?: string }> {
	try {
		const { data, error } = await supabase.rpc("obtener_habitaciones_disponibles", {
			p_posada_id: posadaId,
			p_fecha_inicio: fechaInicio,
			p_fecha_fin: fechaFin,
			p_session_id: sessionId || null,
		});

		if (error) throw error;

		return {
			success: true,
			habitaciones: data || [],
		};
	} catch (error: any) {
		console.error("Error obteniendo habitaciones disponibles:", error);
		return {
			success: false,
			error: error.message || "Error obteniendo habitaciones",
		};
	}
}

/**
 * Crear hold temporal para múltiples habitaciones
 */
export async function crearHoldMultiple(
	supabase: SupabaseClient,
	data: CreateHoldMultipleData
): Promise<{ success: boolean; holdId?: string; error?: string }> {
	try {
		// Verificar que haya al menos una habitación
		if (!data.habitaciones_ids || data.habitaciones_ids.length === 0) {
			return {
				success: false,
				error: "Debes seleccionar al menos una habitación",
			};
		}

		// Verificar disponibilidad de todas las habitaciones
		const { data: disponible, error: errorVerificacion } = await supabase.rpc(
			"verificar_disponibilidad_habitaciones",
			{
				p_posada_id: data.posada_id,
				p_fecha_inicio: data.fecha_inicio,
				p_fecha_fin: data.fecha_fin,
				p_habitaciones_ids: data.habitaciones_ids,
				p_session_id: data.session_id,
			}
		);

		if (errorVerificacion) throw errorVerificacion;

		if (!disponible) {
			return {
				success: false,
				error: "Una o más habitaciones ya no están disponibles en estas fechas",
			};
		}

		const expiraEn = new Date(Date.now() + 30 * 60 * 1000); // 30 minutos

		// Crear el hold temporal principal (sin habitacion_id específica)
		const { data: hold, error: errorHold } = await supabase
			.from("holds_temporales")
			.insert({
				session_id: data.session_id,
				posada_id: data.posada_id,
				habitacion_id: null, // NULL para holds múltiples
				fecha_inicio: data.fecha_inicio,
				fecha_fin: data.fecha_fin,
				expira_en: expiraEn.toISOString(),
			})
			.select()
			.single();

		if (errorHold) throw errorHold;

		// Crear las relaciones con las habitaciones
		const habitacionesData = data.habitaciones_ids.map((habitacionId) => ({
			hold_id: hold.id,
			habitacion_id: habitacionId,
		}));

		const { error: errorHabitaciones } = await supabase
			.from("holds_habitaciones")
			.insert(habitacionesData);

		if (errorHabitaciones) {
			// Si falla, eliminar el hold creado
			await supabase.from("holds_temporales").delete().eq("id", hold.id);
			throw errorHabitaciones;
		}

		return {
			success: true,
			holdId: hold.id,
		};
	} catch (error: any) {
		console.error("Error creando hold múltiple:", error);
		return {
			success: false,
			error: error.message || "Error creando hold temporal",
		};
	}
}

/**
 * Crear reserva confirmada con múltiples habitaciones
 */
export async function crearReservaMultiple(
	supabase: SupabaseClient,
	data: CreateReservaMultipleData
): Promise<{ success: boolean; reserva?: any; error?: string }> {
	try {
		// Verificar que haya al menos una habitación
		if (!data.habitaciones_ids || data.habitaciones_ids.length === 0) {
			return {
				success: false,
				error: "Debes seleccionar al menos una habitación",
			};
		}

		// Verificar disponibilidad una última vez
		const { data: disponible, error: errorVerificacion } = await supabase.rpc(
			"verificar_disponibilidad_habitaciones",
			{
				p_posada_id: data.posada_id,
				p_fecha_inicio: data.fecha_inicio,
				p_fecha_fin: data.fecha_fin,
				p_habitaciones_ids: data.habitaciones_ids,
				p_session_id: data.session_id,
			}
		);

		if (errorVerificacion) throw errorVerificacion;

		if (!disponible) {
			return {
				success: false,
				error: "Una o más habitaciones ya no están disponibles",
			};
		}

		// Obtener información de las habitaciones para calcular precio total
		const { data: habitaciones, error: errorHabitaciones } = await supabase
			.from("habitaciones")
			.select("id, precio_por_noche")
			.in("id", data.habitaciones_ids);

		if (errorHabitaciones) throw errorHabitaciones;

		// Calcular precio total
		const precioTotal = habitaciones.reduce(
			(total, h) => total + parseFloat(h.precio_por_noche.toString()),
			0
		);

		// Calcular número de noches
		const inicio = new Date(data.fecha_inicio);
		const fin = new Date(data.fecha_fin);
		const numNoches = Math.ceil((fin.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24));

		// Crear la reserva principal
		const { data: reserva, error: errorReserva } = await supabase
			.from("reservas")
			.insert({
				posada_id: data.posada_id,
				habitacion_id: null, // NULL para reservas múltiples
				fecha_inicio: data.fecha_inicio,
				fecha_fin: data.fecha_fin,
				num_huespedes: data.num_huespedes,
				nombre_cliente: data.nombre_cliente,
				email_cliente: data.email_cliente,
				telefono_cliente: data.telefono_cliente,
				notas_especiales: data.notas_especiales,
				precio_por_noche: precioTotal, // Precio por noche de todas las habitaciones
				precio_total: precioTotal * numNoches,
				tipo_reserva: "habitacion",
				estado: "pendiente", // Estado inicial
			})
			.select()
			.single();

		if (errorReserva) throw errorReserva;

		// Crear las relaciones con las habitaciones
		const reservaHabitacionesData = habitaciones.map((h) => ({
			reserva_id: reserva.id,
			habitacion_id: h.id,
			precio_por_noche: h.precio_por_noche,
		}));

		const { error: errorRelaciones } = await supabase
			.from("reservas_habitaciones")
			.insert(reservaHabitacionesData);

		if (errorRelaciones) {
			// Si falla, eliminar la reserva creada
			await supabase.from("reservas").delete().eq("id", reserva.id);
			throw errorRelaciones;
		}

		// Eliminar hold temporal si existe
		await supabase
			.from("holds_temporales")
			.delete()
			.eq("session_id", data.session_id)
			.eq("posada_id", data.posada_id);

		return {
			success: true,
			reserva,
		};
	} catch (error: any) {
		console.error("Error creando reserva múltiple:", error);
		return {
			success: false,
			error: error.message || "Error creando reserva",
		};
	}
}