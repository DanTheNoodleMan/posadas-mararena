"use client";

import React, { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/FooterCTA";
import Button from "@/components/ui/button";
import { Search, Calendar, Users, Home, Phone, Mail, CheckCircle, XCircle } from "lucide-react";
import { createSPAClient } from "@/lib/supabase/client";

interface Reserva {
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
	const [error, setError] = useState<string | null>(null);

	const supabase = createSPAClient();

	const buscarReserva = async () => {
		if (!codigoReserva.trim()) {
			setError("Por favor ingresa un código de reserva");
			return;
		}

		setLoading(true);
		setError(null);
		setReserva(null);

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
				setError("No se encontró ninguna reserva con ese código");
				return;
			}

			setReserva({
				...data,
				posada_nombre: data.posada?.nombre || "N/A",
				habitacion_nombre: data.habitacion?.nombre || null,
			});
		} catch (err: any) {
			console.error("Error buscando reserva:", err);
			setError("No se encontró ninguna reserva con ese código. Verifica que esté escrito correctamente.");
		} finally {
			setLoading(false);
		}
	};

	const getEstadoBadge = (estado: string) => {
		const badges = {
			confirmada: { bg: "bg-green-100", text: "text-green-700", label: "Confirmada" },
			cancelada: { bg: "bg-red-100", text: "text-red-700", label: "Cancelada" },
			completada: { bg: "bg-blue-100", text: "text-blue-700", label: "Completada" },
			no_show: { bg: "bg-gray-100", text: "text-gray-700", label: "No Show" },
		};

		const badge = badges[estado as keyof typeof badges] || badges.confirmada;

		return (
			<span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${badge.bg} ${badge.text} text-sm font-semibold`}>
				{estado === "confirmada" && <CheckCircle className="w-4 h-4" />}
				{estado === "cancelada" && <XCircle className="w-4 h-4" />}
				{badge.label}
			</span>
		);
	};

	return (
		<>
			<Header />

			<div className="min-h-screen bg-neutral-50 py-16">
				<div className="max-w-3xl mx-auto px-6">
					<div className="text-center mb-12">
						<h1 className="font-display text-4xl md:text-5xl text-primary-600 mb-4">Consultar Reserva</h1>
						<p className="text-primary-600/70 text-lg">Ingresa tu código de reserva para ver los detalles</p>
					</div>

					{/* Search Box */}
					<div className="bg-neutral-100 p-8 rounded-sm mb-8">
						<label className="block text-sm font-semibold text-primary-600 mb-3">Código de Reserva</label>
						<div className="flex gap-3">
							<input
								type="text"
								value={codigoReserva}
								onChange={(e) => setCodigoReserva(e.target.value.toUpperCase())}
								onKeyPress={(e) => e.key === "Enter" && buscarReserva()}
								placeholder="MARA-2024-001"
								className="flex-1 px-4 py-3 border border-neutral-300 rounded-sm focus:border-accent-500 focus:outline-none font-mono text-lg"
							/>
							<Button variant="primary" onClick={buscarReserva} disabled={loading}>
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
						<p className="text-xs text-primary-600/60 mt-2">Ejemplo: MARA-2024-001 (tu código fue enviado por email)</p>
					</div>

					{/* Error Message */}
					{error && (
						<div className="mb-8 p-4 bg-red-50 border border-red-300 rounded-sm">
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

							{reserva.estado === "confirmada" && (
								<div className="bg-accent-500/10 border border-accent-500 p-4 rounded-sm">
									<p className="text-primary-600 text-sm">
										<strong>¿Necesitas ayuda?</strong> Contáctanos por WhatsApp para cualquier consulta sobre tu
										reserva.
									</p>
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
								<Button
									variant="secondary"
									onClick={() => {
										setReserva(null);
										setCodigoReserva("");
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
							<p className="text-primary-600/70 mb-4">¿No encuentras tu código de reserva?</p>
							<Button variant="secondary" href="https://wa.me/584123112746" external>
								Contactar Soporte
							</Button>
						</div>
					)}
				</div>
			</div>

			<Footer />
		</>
	);
}
