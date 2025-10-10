"use client";

import React, { useState } from "react";
import Button from "@/components/ui/button";
import { Search, Calendar, Users, Home, Phone, Mail, CheckCircle, XCircle, AlertTriangle, Loader2 } from "lucide-react";
import { createSPAClient } from "@/lib/supabase/client";

interface Reserva {
	id: string;
	codigo_reserva: string;
	tipo_reserva: string;
	fecha_inicio: string;
	fecha_fin: string;
	num_noches: number;
	nombre_cliente: string;
	email_cliente: string;
	telefono_cliente: string;
	num_huespedes: number;
	precio_total: number;
	estado: string;
	notas_cliente?: string;
	posada_nombre: string;
	habitacion_nombre?: string;
	created_at: string;
}

export default function ConsultarReservaPage() {
	const [codigoReserva, setCodigoReserva] = useState("");
	const [reserva, setReserva] = useState<Reserva | null>(null);
	const [loading, setLoading] = useState(false);
	const [loadingCancelacion, setLoadingCancelacion] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [successMessage, setSuccessMessage] = useState<string | null>(null);

	const supabase = createSPAClient();

	const buscarReserva = async () => {
		if (!codigoReserva.trim()) {
			setError("Por favor ingrese un código de reserva.");
			return;
		}

		setLoading(true);
		setError(null);
		setReserva(null);
		setSuccessMessage(null);

		try {
			const { data, error: dbError } = await supabase
				.from("reservas")
				.select(
					`
					*,
					posada:posadas(nombre),
					habitacion:habitaciones(nombre)
				`
				)
				.eq("codigo_reserva", codigoReserva.trim().toUpperCase())
				.single();

			if (dbError) throw dbError;

			if (!data) {
				setError("No se encontró ninguna reserva con ese código.");
				return;
			}

			setReserva({
				...data,
				posada_nombre: data.posada?.nombre || "N/A",
				habitacion_nombre: data.habitacion?.nombre || null,
			});
		} catch (err: any) {
			console.error("Error buscando reserva:", err);
			setError("No se encontró ninguna reserva con ese código. Verifique que esté escrito correctamente.");
		} finally {
			setLoading(false);
		}
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") {
			buscarReserva();
		}
	};

	const getEstadoBadge = (estado: string) => {
		const badges = {
			pendiente: {
				color: "bg-amber-100 text-amber-700 border-amber-300",
				icon: <AlertTriangle className="w-4 h-4" />,
				text: "Pago Pendiente",
			},
			confirmada: {
				color: "bg-green-100 text-green-700 border-green-300",
				icon: <CheckCircle className="w-4 h-4" />,
				text: "Confirmada",
			},
			cancelada: {
				color: "bg-red-100 text-red-700 border-red-300",
				icon: <XCircle className="w-4 h-4" />,
				text: "Cancelada",
			},
			completada: {
				color: "bg-blue-100 text-blue-700 border-blue-300",
				icon: <CheckCircle className="w-4 h-4" />,
				text: "Completada",
			},
		};

		const badge = badges[estado as keyof typeof badges] || badges.pendiente;

		return (
			<div className={`flex items-center gap-2 px-4 py-2 rounded-sm border ${badge.color}`}>
				{badge.icon}
				<span className="font-semibold text-sm">{badge.text}</span>
			</div>
		);
	};

	// Función para verificar si puede cancelar (72 horas antes del checkin)
	const puedeCancelar = (fechaInicio: string, estado: string): { puede: boolean; motivo?: string } => {
		// Solo puede cancelar si está pendiente o confirmada
		if (estado !== "pendiente" && estado !== "confirmada") {
			return { puede: false, motivo: "Esta reserva ya fue cancelada o completada." };
		}

		// Calcular horas hasta el checkin
		const ahora = new Date();
		const checkin = new Date(fechaInicio + "T15:00:00"); // 3pm checkin
		const horasHastaCheckin = (checkin.getTime() - ahora.getTime()) / (1000 * 60 * 60);

		if (horasHastaCheckin < 72) {
			return { puede: false, motivo: "No se puede cancelar con menos de 72 horas de anticipación." };
		}

		return { puede: true };
	};

	const cancelarReserva = async () => {
		if (!reserva) return;

		const verificacion = puedeCancelar(reserva.fecha_inicio, reserva.estado);
		if (!verificacion.puede) {
			alert(verificacion.motivo);
			return;
		}

		const confirmacion = window.confirm(
			`¿Está seguro que desea cancelar su reserva ${reserva.codigo_reserva}?\n\n` +
				`Esta acción no se puede deshacer. Si necesita reprogramar, contáctenos por WhatsApp después de cancelar.`
		);

		if (!confirmacion) return;

		setLoadingCancelacion(true);
		setError(null);

		try {
			const { error: updateError } = await supabase
				.from("reservas")
				.update({
					estado: "cancelada",
					cancelada_en: new Date().toISOString(),
					razon_cancelacion: "Cancelada por el cliente desde portal web",
				})
				.eq("id", reserva.id);

			if (updateError) throw updateError;

			setSuccessMessage("Su reserva ha sido cancelada exitosamente. Recibirá un email de confirmación.");

			// Actualizar el estado de la reserva en la UI
			setReserva({
				...reserva,
				estado: "cancelada",
			});
		} catch (err: any) {
			console.error("Error al cancelar reserva:", err);
			setError("Hubo un error al cancelar la reserva. Por favor contáctenos por WhatsApp.");
		} finally {
			setLoadingCancelacion(false);
		}
	};

	return (
		<>
			<div className="min-h-screen bg-neutral-50 pt-32 pb-20">
				<div className="container mx-auto px-6 py-12 max-w-3xl">
					<div className="text-center mb-12">
						<h1 className="font-display text-4xl md:text-5xl text-primary-600 mb-4">Consultar Reserva</h1>
						<p className="text-primary-600/70 text-lg">Ingrese su código de reserva para ver los detalles.</p>
					</div>

					{/* Success Message */}
					{successMessage && (
						<div className="mb-8 p-4 bg-green-50 border border-green-300 rounded-sm flex items-start gap-3">
							<CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
							<p className="text-green-700">{successMessage}</p>
						</div>
					)}

					{/* Search Input */}
					<div className="mb-8">
						<label htmlFor="codigo" className="block text-sm font-semibold text-primary-600 mb-3">
							Código de Reserva
						</label>
						<div className="flex gap-4">
							<input
								id="codigo"
								type="text"
								placeholder="MARA-1A2B3C4D"
								value={codigoReserva}
								onChange={(e) => setCodigoReserva(e.target.value.toUpperCase())}
								onKeyPress={handleKeyPress}
								className="flex-1 px-4 py-3 border-2 border-neutral-300 rounded-sm focus:border-accent-500 focus:outline-none font-mono text-lg"
								disabled={loading}
							/>
							<Button onClick={buscarReserva} disabled={loading} variant="primary" className="px-8">
								{loading ? (
									"Buscando..."
								) : (
									<>
										<Search className="w-5 h-5 mr-2" />
										Buscar
									</>
								)}
							</Button>
						</div>
						<p className="text-xs text-primary-600/60 mt-2">Su código fue enviado por email al confirmar su reserva.</p>
					</div>

					{/* Error Message */}
					{error && (
						<div className="mb-8 p-4 bg-red-50 border border-red-300 rounded-sm flex items-start gap-3">
							<XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
							<p className="text-red-700">{error}</p>
						</div>
					)}

					{/* Reserva Details */}
					{reserva && (
						<div className="bg-neutral-100 p-8 rounded-sm space-y-6">
							<div className="flex items-center justify-between pb-6 border-b border-neutral-300">
								<div>
									<h2 className="font-display text-2xl text-primary-600 mb-2">Reserva {reserva.codigo_reserva}</h2>
									<p className="text-sm text-primary-600/60">
										Creada el{" "}
										{new Date(reserva.created_at).toLocaleDateString("es-ES", {
											year: "numeric",
											month: "long",
											day: "numeric",
										})}
									</p>
								</div>
								{getEstadoBadge(reserva.estado)}
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div>
									<div className="flex items-start gap-3 mb-4">
										<Home className="w-5 h-5 text-accent-500 mt-1" />
										<div>
											<h3 className="font-semibold text-primary-600 mb-1">Posada</h3>
											<p className="text-primary-600/70">{reserva.posada_nombre}</p>
											{reserva.habitacion_nombre && (
												<p className="text-sm text-primary-600/60">{reserva.habitacion_nombre}</p>
											)}
											<p className="text-xs text-primary-600/50 mt-1">
												{reserva.tipo_reserva === "posada_completa" ? "Posada Completa" : "Habitación Individual"}
											</p>
										</div>
									</div>
								</div>

								<div>
									<div className="flex items-start gap-3 mb-4">
										<Calendar className="w-5 h-5 text-accent-500 mt-1" />
										<div>
											<h3 className="font-semibold text-primary-600 mb-1">Fechas</h3>
											<p className="text-primary-600/70">
												<strong>Entrada:</strong> {new Date(reserva.fecha_inicio).toLocaleDateString("es-ES")}
											</p>
											<p className="text-primary-600/70">
												<strong>Salida:</strong> {new Date(reserva.fecha_fin).toLocaleDateString("es-ES")}
											</p>
											<p className="text-sm text-primary-600/60 mt-1">
												{reserva.num_noches} {reserva.num_noches === 1 ? "noche" : "noches"}
											</p>
										</div>
									</div>
								</div>

								<div>
									<div className="flex items-start gap-3 mb-4">
										<Users className="w-5 h-5 text-accent-500 mt-1" />
										<div>
											<h3 className="font-semibold text-primary-600 mb-1">Huéspedes</h3>
											<p className="text-primary-600/70">
												{reserva.num_huespedes} {reserva.num_huespedes === 1 ? "persona" : "personas"}
											</p>
										</div>
									</div>
								</div>

								<div>
									<div className="flex items-start gap-3 mb-4">
										<Phone className="w-5 h-5 text-accent-500 mt-1" />
										<div>
											<h3 className="font-semibold text-primary-600 mb-1">Contacto</h3>
											<p className="text-primary-600/70">{reserva.nombre_cliente}</p>
											<p className="text-sm text-primary-600/60">{reserva.email_cliente}</p>
											<p className="text-sm text-primary-600/60">{reserva.telefono_cliente}</p>
										</div>
									</div>
								</div>
							</div>

							{reserva.notas_cliente && (
								<div className="pt-6 border-t border-neutral-300">
									<h3 className="font-semibold text-primary-600 mb-2">Notas Adicionales</h3>
									<p className="text-primary-600/70">{reserva.notas_cliente}</p>
								</div>
							)}

							<div className="pt-6 border-t border-neutral-300">
								<div className="flex justify-between items-center">
									<span className="font-display text-xl text-primary-600">Total:</span>
									<span className="font-display text-3xl text-accent-500">${reserva.precio_total}</span>
								</div>
							</div>

							{/* Información de cancelación */}
							{(reserva.estado === "pendiente" || reserva.estado === "confirmada") && (
								<div className="pt-6 border-t border-neutral-300">
									{puedeCancelar(reserva.fecha_inicio, reserva.estado).puede ? (
										<div className="bg-amber-50 border border-amber-300 p-4 rounded-sm mb-4">
											<p className="text-sm text-amber-800">
												<strong>Política de cancelación:</strong> Puede cancelar tu reserva hasta 72 horas antes
												del check-in.
											</p>
										</div>
									) : (
										<div className="bg-red-50 border border-red-300 p-4 rounded-sm mb-4">
											<p className="text-sm text-red-800">
												<strong>No se puede cancelar:</strong>{" "}
												{puedeCancelar(reserva.fecha_inicio, reserva.estado).motivo}. Para cambios de última hora,
												por favor contáctanos por WhatsApp.
											</p>
										</div>
									)}
								</div>
							)}

							<div className="flex flex-col sm:flex-row gap-4 pt-6">
								<Button
									variant="primary"
									href={`https://wa.me/584123112746?text=${encodeURIComponent(
										`Hola! Consulto sobre mi reserva ${reserva.codigo_reserva}`
									)}`}
									external
									className="flex-1"
								>
									Contactar por WhatsApp
								</Button>

								{/* Botón de cancelación */}
								{(reserva.estado === "pendiente" || reserva.estado === "confirmada") &&
									puedeCancelar(reserva.fecha_inicio, reserva.estado).puede && (
										<Button
											variant="ghost"
											onClick={cancelarReserva}
											disabled={loadingCancelacion}
											className="flex-1 border-red-500 text-red-600 hover:bg-red-600 hover:text-white"
										>
											{loadingCancelacion ? (
												<>
													<Loader2 className="w-5 h-5 mr-2 animate-spin" />
													Cancelando...
												</>
											) : (
												<>
													<XCircle className="w-5 h-5 mr-2" />
													Cancelar Reserva
												</>
											)}
										</Button>
									)}

								<Button
									variant="secondary"
									onClick={() => {
										setReserva(null);
										setCodigoReserva("");
										setError(null);
										setSuccessMessage(null);
									}}
									className="flex-1"
								>
									Nueva Búsqueda
								</Button>
							</div>
						</div>
					)}

					{/* Help Section */}
					{!reserva && !error && (
						<div className="text-center mt-12">
							<p className="text-primary-600/70 mb-4">¿No encuentra su código de reserva?</p>
							<p className="text-primary-600/70 mb-6">Contáctanos por WhatsApp para ayudarle.</p>
							<Button
								variant="secondary"
								href="https://wa.me/584123112746?text=Hola!%20No%20encuentro%20mi%20c%C3%B3digo%20de%20reserva"
								external
							>
								Contactar por WhatsApp
							</Button>
						</div>
					)}
				</div>
			</div>

		</>
	);
}
