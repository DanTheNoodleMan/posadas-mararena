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
				estado: "confirmada",
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
