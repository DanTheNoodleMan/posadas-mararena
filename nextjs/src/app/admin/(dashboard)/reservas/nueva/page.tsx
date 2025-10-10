'use client';

// Archivo: src/app/admin/reservas/nueva/page.tsx
// Página para crear reservas manuales desde el admin (SIMPLIFICADA)

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createSPAClient } from '@/lib/supabase/client';
import { ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function NuevaReservaPage() {
  const router = useRouter();
  const supabase = createSPAClient();

  // Estado del formulario
  const [posadas, setPosadas] = useState<any[]>([]);
  const [posadaId, setPosadaId] = useState('');
  const [posadaSeleccionada, setPosadaSeleccionada] = useState<any>(null);
  
  // Fechas como strings (YYYY-MM-DD)
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  
  // Datos del cliente
  const [nombreCliente, setNombreCliente] = useState('');
  const [emailCliente, setEmailCliente] = useState('');
  const [telefonoCliente, setTelefonoCliente] = useState('');
  const [numHuespedes, setNumHuespedes] = useState('2');
  const [notasCliente, setNotasCliente] = useState('');
  const [pagoConfirmado, setPagoConfirmado] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Cargar posadas
  useEffect(() => {
    async function cargarPosadas() {
      const { data } = await supabase
        .from('posadas')
        .select('*')
        .order('nombre');
      
      if (data) setPosadas(data);
    }
    cargarPosadas();
  }, []);

  // Actualizar posada seleccionada cuando cambia el ID
  useEffect(() => {
    if (posadaId && posadas.length > 0) {
      const posada = posadas.find(p => p.id === posadaId);
      setPosadaSeleccionada(posada);
    }
  }, [posadaId, posadas]);

  // Calcular precio total
  const calcularPrecioTotal = () => {
    if (!posadaSeleccionada || !fechaInicio || !fechaFin) return 0;

    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    const noches = Math.ceil((fin.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24));

    return posadaSeleccionada.precio_noche * noches;
  };

  const precioTotal = calcularPrecioTotal();
  const noches = fechaInicio && fechaFin 
    ? Math.ceil((new Date(fechaFin).getTime() - new Date(fechaInicio).getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  // Validaciones
  const validarFormulario = () => {
    if (!posadaId) {
      setError('Selecciona una posada');
      return false;
    }

    if (!fechaInicio || !fechaFin) {
      setError('Selecciona las fechas de la reserva');
      return false;
    }

    if (new Date(fechaInicio) >= new Date(fechaFin)) {
      setError('La fecha de salida debe ser posterior a la fecha de entrada');
      return false;
    }

    if (!nombreCliente || !emailCliente || !telefonoCliente) {
      setError('Completa todos los datos del cliente');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailCliente)) {
      setError('El email no es válido');
      return false;
    }

    if (parseInt(numHuespedes) < 1) {
      setError('Debe haber al menos 1 huésped');
      return false;
    }

    if (posadaSeleccionada && parseInt(numHuespedes) > posadaSeleccionada.capacidad_maxima) {
      setError(`La posada tiene capacidad máxima de ${posadaSeleccionada.capacidad_maxima} huéspedes`);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validarFormulario()) return;

    setLoading(true);

    try {
      // Crear reserva de posada completa
      const { data: reserva, error: errorReserva } = await supabase
        .from('reservas')
        .insert({
          posada_id: posadaId,
          tipo_reserva: 'posada_completa',
          fecha_inicio: fechaInicio,
          fecha_fin: fechaFin,
          num_huespedes: parseInt(numHuespedes),
          nombre_cliente: nombreCliente.trim(),
          email_cliente: emailCliente.trim().toLowerCase(),
          telefono_cliente: telefonoCliente.trim(),
          notas_cliente: notasCliente.trim() || null,
          precio_total: precioTotal,
          estado: pagoConfirmado ? 'confirmada' : 'pendiente',
          notas_admin: 'Reserva creada manualmente desde panel admin',
        })
        .select()
        .single();

      if (errorReserva) throw errorReserva;

      setSuccess(true);
      
      // Esperar 1.5 segundos y redirigir
      setTimeout(() => {
        router.push(`/admin/reservas/${reserva.id}`);
      }, 1500);

    } catch (err: any) {
      console.error('Error al crear reserva:', err);
      setError(err.message || 'Error al crear la reserva. Por favor intenta de nuevo.');
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto mt-20">
        <div className="bg-white shadow rounded-lg p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">
            ¡Reserva Creada!
          </h2>
          <p className="text-neutral-600 mb-4">
            La reserva se ha creado exitosamente.
          </p>
          <p className="text-sm text-neutral-500">
            Redirigiendo al detalle...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/reservas"
          className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a Reservas
        </Link>
      </div>

      <div>
        <h1 className="text-3xl font-bold text-neutral-900">Nueva Reserva Manual</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Crea una reserva manualmente (para reservas por teléfono o WhatsApp)
        </p>
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6 space-y-6">
        {/* Seleccionar Posada */}
        <div>
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">
            1. Selecciona la Posada
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {posadas.map((posada) => (
              <label
                key={posada.id}
                className={`
                  relative p-4 border-2 rounded-lg cursor-pointer transition-all
                  ${posadaId === posada.id
                    ? 'border-primary-600 bg-primary-50'
                    : 'border-neutral-300 hover:border-primary-400'
                  }
                `}
              >
                <input
                  type="radio"
                  name="posada"
                  value={posada.id}
                  checked={posadaId === posada.id}
                  onChange={(e) => setPosadaId(e.target.value)}
                  className="sr-only"
                />
                <h3 className="font-semibold text-neutral-900">{posada.nombre}</h3>
                <p className="text-sm text-neutral-500 mt-1">
                  Hasta {posada.capacidad_maxima} huéspedes • ${posada.precio_noche}/noche
                </p>
              </label>
            ))}
          </div>
        </div>

        {/* Fechas */}
        {posadaId && (
          <div>
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">
              2. Fechas de la Reserva
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Fecha de Entrada (Check-in) *
                </label>
                <input
                  type="date"
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  required
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <p className="text-xs text-neutral-500 mt-1">Check-in: 3:00 PM</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Fecha de Salida (Check-out) *
                </label>
                <input
                  type="date"
                  value={fechaFin}
                  onChange={(e) => setFechaFin(e.target.value)}
                  min={fechaInicio || new Date().toISOString().split('T')[0]}
                  required
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <p className="text-xs text-neutral-500 mt-1">Check-out: 11:00 AM</p>
              </div>
            </div>

            {noches > 0 && (
              <div className="mt-3 p-3 bg-primary-50 rounded-lg border border-primary-200">
                <p className="text-sm text-primary-900">
                  <span className="font-semibold">{noches}</span> noche{noches !== 1 ? 's' : ''} 
                  {precioTotal > 0 && (
                    <> • <span className="font-bold">${precioTotal.toLocaleString('es-VE')}</span> total</>
                  )}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Huéspedes */}
        {fechaInicio && fechaFin && (
          <div>
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">
              3. Número de Huéspedes
            </h2>
            <div className="max-w-xs">
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Cantidad de personas *
              </label>
              <input
                type="number"
                value={numHuespedes}
                onChange={(e) => setNumHuespedes(e.target.value)}
                min="1"
                max={posadaSeleccionada?.capacidad_maxima || 31}
                required
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              {posadaSeleccionada && (
                <p className="text-xs text-neutral-500 mt-1">
                  Máximo: {posadaSeleccionada.capacidad_maxima} huéspedes
                </p>
              )}
            </div>
          </div>
        )}

        {/* Datos del Cliente */}
        {parseInt(numHuespedes) > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">
              4. Datos del Cliente
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Nombre completo *
                </label>
                <input
                  type="text"
                  value={nombreCliente}
                  onChange={(e) => setNombreCliente(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Juan Pérez"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={emailCliente}
                  onChange={(e) => setEmailCliente(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="juan@ejemplo.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Teléfono *
                </label>
                <input
                  type="tel"
                  value={telefonoCliente}
                  onChange={(e) => setTelefonoCliente(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="+58 412 123 4567"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Notas adicionales
                </label>
                <textarea
                  value={notasCliente}
                  onChange={(e) => setNotasCliente(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Solicitudes especiales, alergias, etc."
                />
              </div>

              <div className="md:col-span-2">
                <label className="flex items-start gap-3 p-4 border border-neutral-300 rounded-lg hover:bg-neutral-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={pagoConfirmado}
                    onChange={(e) => setPagoConfirmado(e.target.checked)}
                    className="mt-1 w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
                  />
                  <div>
                    <span className="text-sm font-medium text-neutral-900">
                      El pago ya fue confirmado
                    </span>
                    <p className="text-xs text-neutral-500 mt-1">
                      Marcar solo si el cliente ya realizó el pago y fue verificado
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="flex items-start gap-2 p-4 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Resumen */}
        {precioTotal > 0 && nombreCliente && (
          <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-neutral-900 mb-3">Resumen</h3>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-neutral-600">Posada:</dt>
                <dd className="font-medium text-neutral-900">{posadaSeleccionada?.nombre}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-neutral-600">Noches:</dt>
                <dd className="font-medium text-neutral-900">{noches}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-neutral-600">Huéspedes:</dt>
                <dd className="font-medium text-neutral-900">{numHuespedes}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-neutral-600">Cliente:</dt>
                <dd className="font-medium text-neutral-900">{nombreCliente}</dd>
              </div>
              <div className="flex justify-between pt-2 border-t border-neutral-300">
                <dt className="font-semibold text-neutral-900">Total:</dt>
                <dd className="font-bold text-lg text-primary-600">
                  ${precioTotal.toLocaleString('es-VE')}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-neutral-600">Estado:</dt>
                <dd className={`font-medium ${pagoConfirmado ? 'text-green-600' : 'text-amber-600'}`}>
                  {pagoConfirmado ? 'Confirmada' : 'Pendiente de pago'}
                </dd>
              </div>
            </dl>
          </div>
        )}

        {/* Botones */}
        <div className="flex gap-4 pt-4 border-t">
          <Link
            href="/admin/reservas"
            className="px-6 py-2 border border-neutral-300 text-neutral-700 font-semibold rounded-lg hover:bg-neutral-50 transition-colors"
          >
            Cancelar
          </Link>
          
          <button
            type="submit"
            disabled={loading || !posadaId || !fechaInicio || !fechaFin || !nombreCliente}
            className="flex-1 px-6 py-2 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creando Reserva...' : 'Crear Reserva'}
          </button>
        </div>
      </form>
    </div>
  );
}