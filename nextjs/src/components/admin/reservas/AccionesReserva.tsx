// src/components/admin/reservas/AccionesReserva.tsx
// Sidebar con acciones de la reserva
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSPAClient } from "@/lib/supabase/client";
import { CheckCircle, XCircle, MessageCircle, Mail, AlertCircle, Loader2 } from "lucide-react";

interface Reserva {
	id: string;
	codigo_reserva: string;
	estado: string;
	nombre_cliente: string;
	email_cliente: string;
	telefono_cliente: string;
	posada: {
		nombre: string;
	} | null;
	fecha_inicio: string;
	fecha_fin: string;
}

interface AccionesReservaProps {
	reserva: Reserva;
}

function getEstadoBadge(estado: string) {
	const badges: Record<string, { bg: string; text: string; label: string }> = {
		pendiente: { bg: "bg-amber-100", text: "text-amber-800", label: "Pendiente de Pago" },
		confirmada: { bg: "bg-green-100", text: "text-green-800", label: "Pago Confirmado" },
		cancelada: { bg: "bg-red-100", text: "text-red-800", label: "Cancelada" },
		completada: { bg: "bg-blue-100", text: "text-blue-800", label: "Completada" },
	};

	const badge = badges[estado] || badges.pendiente;
	return badge;
}

export default function AccionesReserva({ reserva }: AccionesReservaProps) {
	const router = useRouter();
	const supabase = createSPAClient();
	const [loading, setLoading] = useState(false);
	const [showCancelModal, setShowCancelModal] = useState(false);
	const [razonCancelacion, setRazonCancelacion] = useState("");

	const badge = getEstadoBadge(reserva.estado);

	const confirmarPago = async () => {
		if (!confirm("¿Confirmar que se ha recibido el pago de esta reserva?")) return;

		setLoading(true);
		const { error } = await supabase
			.from("reservas")
			.update({
				estado: "confirmada",
				confirmada_en: new Date().toISOString(),
			})
			.eq("id", reserva.id);

		if (!error) {
			router.refresh();
		} else {
			alert("Error al confirmar el pago");
		}
		setLoading(false);
	};

	const cancelarReserva = async () => {
		if (!razonCancelacion.trim()) {
			alert("Por favor ingresa un motivo de cancelación");
			return;
		}

		setLoading(true);
		const { error } = await supabase
			.from("reservas")
			.update({
				estado: "cancelada",
				cancelada_en: new Date().toISOString(),
				razon_cancelacion: razonCancelacion,
			})
			.eq("id", reserva.id);

		if (!error) {
			setShowCancelModal(false);
			router.refresh();
		} else {
			alert("Error al cancelar la reserva");
		}
		setLoading(false);
	};

	const whatsappUrl = `https://wa.me/${reserva.telefono_cliente.replace(/\D/g, "")}?text=${encodeURIComponent(
		`Hola ${reserva.nombre_cliente}, te contactamos de Mararena Posadas sobre tu reserva ${reserva.codigo_reserva}.`
	)}`;

	return (
		<div className="space-y-4">
			{/* Estado actual */}
			<div className="bg-white shadow rounded-lg p-6">
				<h3 className="text-sm font-medium text-neutral-500 mb-2">Estado Actual</h3>
				<span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${badge.bg} ${badge.text}`}>
					{badge.label}
				</span>
			</div>

			{/* Acciones principales */}
			<div className="bg-white shadow rounded-lg p-6 space-y-3">
				<h3 className="text-sm font-medium text-neutral-900 mb-4">Acciones</h3>

				{reserva.estado === "pendiente" && (
					<button
						onClick={confirmarPago}
						disabled={loading}
						className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
					>
						{loading ? (
							<Loader2 className="w-5 h-5 animate-spin" />
						) : (
							<>
								<CheckCircle className="w-5 h-5" />
								Confirmar Pago Recibido
							</>
						)}
					</button>
				)}

				{(reserva.estado === "pendiente" || reserva.estado === "confirmada") && (
					<button
						onClick={() => setShowCancelModal(true)}
						disabled={loading}
						className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
					>
						<XCircle className="w-5 h-5" />
						Cancelar Reserva
					</button>
				)}

				<a
					href={whatsappUrl}
					target="_blank"
					rel="noopener noreferrer"
					className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors"
				>
					<MessageCircle className="w-5 h-5" />
					Enviar WhatsApp
				</a>

				<a
					href={`mailto:${reserva.email_cliente}`}
					className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-neutral-300 text-neutral-700 font-semibold rounded-lg hover:bg-neutral-50 transition-colors"
				>
					<Mail className="w-5 h-5" />
					Enviar Email
				</a>
			</div>

			{/* Info adicional */}
			<div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
				<div className="flex gap-2">
					<AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
					<div className="text-sm text-blue-800">
						<p className="font-medium mb-1">Instrucciones de Pago</p>
						<p className="text-xs">
							Los pagos se reciben por transferencia bancaria o efectivo. Confirma el pago una vez verificado.
						</p>
					</div>
				</div>
			</div>

			{/* Modal de cancelación */}
			{showCancelModal && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
					<div className="bg-white rounded-lg max-w-md w-full p-6">
						<h3 className="text-lg font-semibold text-neutral-900 mb-4">Cancelar Reserva</h3>
						<p className="text-sm text-neutral-600 mb-4">Por favor indica el motivo de la cancelación:</p>
						<textarea
							value={razonCancelacion}
							onChange={(e) => setRazonCancelacion(e.target.value)}
							className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
							rows={4}
							placeholder="Ej: Cliente solicitó cancelación, pago no recibido, etc."
						/>
						<div className="flex gap-3 mt-6">
							<button
								onClick={() => setShowCancelModal(false)}
								disabled={loading}
								className="flex-1 px-4 py-2 border border-neutral-300 text-neutral-700 font-semibold rounded-lg hover:bg-neutral-50"
							>
								Cerrar
							</button>
							<button
								onClick={cancelarReserva}
								disabled={loading || !razonCancelacion.trim()}
								className="flex-1 px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 disabled:opacity-50"
							>
								{loading ? "Cancelando..." : "Confirmar Cancelación"}
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
