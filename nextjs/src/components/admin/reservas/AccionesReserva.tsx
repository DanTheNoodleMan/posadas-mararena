// ============================================
// ARCHIVO: src/components/admin/reservas/AccionesReserva.tsx
// ============================================
// Componente para confirmar/cancelar reservas desde el panel admin

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  CheckCircle,
  XCircle,
  MessageSquare,
  Mail,
  Loader2,
  AlertCircle,
} from "lucide-react";

interface AccionesReservaProps {
  reserva: any;
}

export default function AccionesReserva({ reserva }: AccionesReservaProps) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const confirmarPago = async () => {
    if (!confirm("¿Confirmar que se recibió el pago de esta reserva?")) return;

    setLoading(true);
    setError("");

    try {
      const { error: updateError } = await supabase
        .from("reservas")
        .update({
          estado: "confirmada",
          confirmada_en: new Date().toISOString(),
          confirmada_por: "admin", // O el ID del usuario admin actual
        })
        .eq("id", reserva.id);

      if (updateError) throw updateError;

      // Recargar la página para ver los cambios
      router.refresh();
      alert("✅ Pago confirmado exitosamente");
    } catch (err: any) {
      console.error("Error al confirmar pago:", err);
      setError("Error al confirmar el pago. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const cancelarReserva = async () => {
    const motivo = prompt(
      "Ingresa el motivo de cancelación:"
    );

    if (!motivo || motivo.trim() === "") return;

    setLoading(true);
    setError("");

    try {
      const { error: updateError } = await supabase
        .from("reservas")
        .update({
          estado: "cancelada",
          cancelada_en: new Date().toISOString(),
          razon_cancelacion: motivo,
        })
        .eq("id", reserva.id);

      if (updateError) throw updateError;

      router.refresh();
      alert("❌ Reserva cancelada");
    } catch (err: any) {
      console.error("Error al cancelar:", err);
      setError("Error al cancelar la reserva. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const enviarWhatsApp = () => {
    const mensaje = `Hola ${reserva.nombre_cliente}! 

Te escribimos de Mararena Posadas sobre tu reserva ${reserva.codigo_reserva}.`;

    window.open(
      `https://wa.me/${reserva.telefono_cliente}?text=${encodeURIComponent(
        mensaje
      )}`,
      "_blank"
    );
  };

  const enviarEmail = () => {
    const asunto = `Reserva ${reserva.codigo_reserva} - Mararena Posadas`;
    window.open(
      `mailto:${reserva.email_cliente}?subject=${encodeURIComponent(asunto)}`,
      "_blank"
    );
  };

  return (
    <div className="bg-white shadow rounded-lg p-6 sticky top-6">
      <h3 className="text-lg font-semibold text-neutral-900 mb-4">Acciones</h3>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div className="space-y-3">
        {/* Confirmar Pago - Solo si está pendiente */}
        {reserva.estado === "pendiente" && (
          <button
            onClick={confirmarPago}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <CheckCircle className="w-5 h-5" />
            )}
            Confirmar Pago Recibido
          </button>
        )}

        {/* Cancelar Reserva - Solo si no está cancelada o completada */}
        {reserva.estado !== "cancelada" && reserva.estado !== "completada" && (
          <button
            onClick={cancelarReserva}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <XCircle className="w-5 h-5" />
            )}
            Cancelar Reserva
          </button>
        )}

        {/* Divider */}
        {(reserva.estado === "pendiente" ||
          (reserva.estado !== "cancelada" &&
            reserva.estado !== "completada")) && (
          <div className="border-t border-neutral-200 my-4"></div>
        )}

        {/* Contactar Cliente */}
        <button
          onClick={enviarWhatsApp}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-neutral-100 text-neutral-700 font-medium rounded-lg hover:bg-neutral-200 transition-colors"
        >
          <MessageSquare className="w-5 h-5" />
          Enviar WhatsApp
        </button>

        <button
          onClick={enviarEmail}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-neutral-100 text-neutral-700 font-medium rounded-lg hover:bg-neutral-200 transition-colors"
        >
          <Mail className="w-5 h-5" />
          Enviar Email
        </button>
      </div>

      {/* Info de Estado */}
      <div className="mt-6 pt-4 border-t border-neutral-200">
        <div className="text-sm text-neutral-600 space-y-2">
          <div className="flex justify-between">
            <span>Estado actual:</span>
            <span className="font-semibold">
              {reserva.estado === "pendiente" && "⏳ Pendiente"}
              {reserva.estado === "confirmada" && "✅ Confirmada"}
              {reserva.estado === "cancelada" && "❌ Cancelada"}
              {reserva.estado === "completada" && "🎉 Completada"}
            </span>
          </div>

          {reserva.estado === "pendiente" && (
            <p className="text-xs text-amber-600 mt-2">
              ⚠️ Esperando confirmación de pago del cliente
            </p>
          )}

          {reserva.confirmada_en && (
            <div className="text-xs text-neutral-500 mt-2">
              Confirmada:{" "}
              {new Date(reserva.confirmada_en).toLocaleString("es-ES")}
            </div>
          )}

          {reserva.cancelada_en && (
            <div className="text-xs text-neutral-500 mt-2">
              Cancelada: {new Date(reserva.cancelada_en).toLocaleString("es-ES")}
              {reserva.razon_cancelacion && (
                <div className="mt-1">Motivo: {reserva.razon_cancelacion}</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}