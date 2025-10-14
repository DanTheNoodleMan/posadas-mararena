// src/app/api/reservas/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createSSRClient } from "@/lib/supabase/server";
import { crearReservaMultiple, CreateReservaMultipleData } from "@/lib/reservas";

export async function POST(request: NextRequest) {
	try {
		const supabase = await createSSRClient();
		const data: CreateReservaMultipleData = await request.json();

		// Crear la reserva (esto incluirá el envío de email)
		const resultado = await crearReservaMultiple(supabase, data);

		if (!resultado.success) {
			return NextResponse.json({ success: false, error: resultado.error }, { status: 400 });
		}

		return NextResponse.json({
			success: true,
			reserva: resultado.reserva,
		});
	} catch (error: any) {
		console.error("Error en API de reservas:", error);
		return NextResponse.json({ success: false, error: error.message || "Error creando reserva" }, { status: 500 });
	}
}
