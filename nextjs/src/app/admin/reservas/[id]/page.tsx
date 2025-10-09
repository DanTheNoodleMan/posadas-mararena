// Archivo: src/app/admin/reservas/[id]/page.tsx
// Página de detalle de una reserva individual

import { createAdminClient } from "@/lib/auth-admin";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import DetalleReserva from "@/components/admin/reservas/DetalleReserva";
import AccionesReserva from "@/components/admin/reservas/AccionesReserva";
import HistorialReserva from "@/components/admin/reservas/HistorialReserva";

interface Props {
	params: Promise<{ id: string }>;
}

export default async function ReservaDetallePage({ params }: Props) {
	const { id } = await params;
	const supabase = await createAdminClient();

	// Obtener reserva completa
	const { data: reserva, error } = await supabase
		.from("reservas")
		.select(
			`
      *,
      posada:posadas(id, nombre, capacidad_maxima),
      habitaciones:reservas_habitaciones(
        habitacion:habitaciones(id, nombre, numero, precio_noche, capacidad)
      )
    `
		)
		.eq("id", id)
		.single();

	if (error || !reserva) {
		notFound();
	}

	// Obtener historial de cambios
	const { data: logs } = await supabase.from("logs_reservas").select("*").eq("reserva_id", id).order("created_at", { ascending: false });

	return (
		<div className="space-y-6">
			{/* Header con botón volver */}
			<div className="flex items-center gap-4">
				<Link href="/admin/reservas" className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900">
					<ArrowLeft className="w-4 h-4" />
					Volver a Reservas
				</Link>
			</div>

			{/* Título */}
			<div>
				<h1 className="text-3xl font-bold text-neutral-900">{reserva.codigo_reserva}</h1>
				<p className="mt-1 text-sm text-neutral-500">Detalles completos de la reserva</p>
			</div>

			{/* Grid Layout */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Columna principal - Detalles */}
				<div className="lg:col-span-2 space-y-6">
					<DetalleReserva reserva={reserva} />

					{/* Historial */}
					{logs && logs.length > 0 && <HistorialReserva logs={logs} />}
				</div>

				{/* Sidebar - Acciones */}
				<div className="lg:col-span-1">
					<AccionesReserva reserva={reserva} />
				</div>
			</div>
		</div>
	);
}
