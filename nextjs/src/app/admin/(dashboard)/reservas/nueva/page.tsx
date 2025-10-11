'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createSPAClient } from '@/lib/supabase/client';
import { ArrowLeft, AlertCircle, CheckCircle, Calendar as CalendarIcon, Users, Loader2, Info } from 'lucide-react';
import Link from 'next/link';

// Tipos
interface Posada {
  id: string;
  nombre: string;
  capacidad_maxima: number;
  precio_noche: number;
  precio_posada_completa: number;
}

interface Habitacion {
  id: string;
  nombre: string;
  capacidad: number;
  precio_por_noche: number;
  disponible: boolean;
  motivo_no_disponible?: string;
  fechas_conflicto?: { fecha_inicio: string; fecha_fin: string }[];
}

interface ReservaCalendario {
  fecha_inicio: string;
  fecha_fin: string;
  tipo: 'posada_completa' | 'parcial';
  habitaciones?: string[];
  codigo_reserva?: string;
}

export default function NuevaReservaPage() {
  const router = useRouter();
  const supabase = createSPAClient();

  // Estado del formulario
  const [posadas, setPosadas] = useState<Posada[]>([]);
  const [posadaId, setPosadaId] = useState('');
  const [posadaSeleccionada, setPosadaSeleccionada] = useState<Posada | null>(null);
  
  const [tipoReserva, setTipoReserva] = useState<'habitacion' | 'posada_completa'>('posada_completa');
  const [habitacionesDisponibles, setHabitacionesDisponibles] = useState<Habitacion[]>([]);
  const [habitacionesSeleccionadas, setHabitacionesSeleccionadas] = useState<string[]>([]);
  
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  
  const [nombreCliente, setNombreCliente] = useState('');
  const [emailCliente, setEmailCliente] = useState('');
  const [telefonoCliente, setTelefonoCliente] = useState('');
  const [numHuespedes, setNumHuespedes] = useState('2');
  const [notasCliente, setNotasCliente] = useState('');
  const [pagoConfirmado, setPagoConfirmado] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [loadingHabitaciones, setLoadingHabitaciones] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Calendario de disponibilidad - ahora siempre visible
  const [reservasCalendario, setReservasCalendario] = useState<ReservaCalendario[]>([]);
  const [loadingCalendario, setLoadingCalendario] = useState(false);

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

  // Actualizar posada seleccionada
  useEffect(() => {
    if (posadaId && posadas.length > 0) {
      const posada = posadas.find(p => p.id === posadaId);
      setPosadaSeleccionada(posada || null);
      
      // Limpiar selecciones
      setHabitacionesSeleccionadas([]);
      setHabitacionesDisponibles([]);
      setFechaInicio('');
      setFechaFin('');
    }
  }, [posadaId, posadas]);

  // Cargar calendario cuando se selecciona posada
  useEffect(() => {
    if (posadaId) {
      cargarCalendarioCompleto();
    }
  }, [posadaId]);

  // Cargar habitaciones disponibles
  useEffect(() => {
    if (tipoReserva === 'habitacion' && posadaId && fechaInicio && fechaFin) {
      cargarHabitacionesDisponibles();
    } else {
      setHabitacionesDisponibles([]);
      setHabitacionesSeleccionadas([]);
    }
  }, [tipoReserva, posadaId, fechaInicio, fechaFin]);

  const cargarCalendarioCompleto = async () => {
    if (!posadaId) return;

    setLoadingCalendario(true);
    try {
      // Obtener todas las reservas de esta posada (próximos 3 meses)
      const hoy = new Date();
      const tresMesesDespues = new Date();
      tresMesesDespues.setMonth(tresMesesDespues.getMonth() + 3);

      const { data: reservas, error } = await supabase
        .from('reservas')
        .select(`
          fecha_inicio,
          fecha_fin,
          tipo_reserva,
          codigo_reserva,
          estado,
          habitacion_id,
          reservas_habitaciones(
            habitacion:habitaciones(id, nombre)
          )
        `)
        .eq('posada_id', posadaId)
        .in('estado', ['confirmada', 'pendiente'])
        .gte('fecha_fin', hoy.toISOString().split('T')[0])
        .lte('fecha_inicio', tresMesesDespues.toISOString().split('T')[0])
        .order('fecha_inicio');

      if (error) throw error;

      // Procesar reservas
      const reservasProc: ReservaCalendario[] = (reservas || []).map(r => {
        if (r.tipo_reserva === 'posada_completa') {
          return {
            fecha_inicio: r.fecha_inicio,
            fecha_fin: r.fecha_fin,
            tipo: 'posada_completa',
            codigo_reserva: r.codigo_reserva
          };
        } else {
          const habitaciones = r.reservas_habitaciones?.map((rh: any) => rh.habitacion?.nombre).filter(Boolean) || [];
          return {
            fecha_inicio: r.fecha_inicio,
            fecha_fin: r.fecha_fin,
            tipo: 'parcial',
            habitaciones,
            codigo_reserva: r.codigo_reserva
          };
        }
      });

      setReservasCalendario(reservasProc);
    } catch (err) {
      console.error('Error cargando calendario:', err);
    } finally {
      setLoadingCalendario(false);
    }
  };

  const cargarHabitacionesDisponibles = async () => {
    if (!posadaId || !fechaInicio || !fechaFin) return;

    setLoadingHabitaciones(true);
    try {
      const { data, error } = await supabase.rpc('obtener_habitaciones_disponibles', {
        p_posada_id: posadaId,
        p_fecha_inicio: fechaInicio,
        p_fecha_fin: fechaFin,
        p_session_id: 'admin-manual'
      });

      if (error) throw error;

      // Enriquecer con información de fechas de conflicto
      const habitacionesEnriquecidas = await Promise.all((data || []).map(async (hab: any) => {
        if (!hab.disponible) {
          // Obtener reservas que afectan esta habitación en el rango
          const { data: reservas } = await supabase
            .from('reservas')
            .select('fecha_inicio, fecha_fin, tipo_reserva, codigo_reserva')
            .eq('posada_id', posadaId)
            .in('estado', ['confirmada', 'pendiente'])
            .or(`tipo_reserva.eq.posada_completa,and(habitacion_id.eq.${hab.id},tipo_reserva.eq.habitacion)`)
            .lte('fecha_inicio', fechaFin)
            .gte('fecha_fin', fechaInicio);

          // También buscar en reservas_habitaciones
          const { data: reservasHab } = await supabase
            .from('reservas_habitaciones')
            .select(`
              reserva:reservas(fecha_inicio, fecha_fin, codigo_reserva, estado)
            `)
            .eq('habitacion_id', hab.id);

          const fechasConflicto: { fecha_inicio: string; fecha_fin: string; codigo: string }[] = [];

          (reservas || []).forEach((r: any) => {
            if (r.fecha_inicio <= fechaFin && r.fecha_fin >= fechaInicio) {
              fechasConflicto.push({
                fecha_inicio: r.fecha_inicio,
                fecha_fin: r.fecha_fin,
                codigo: r.codigo_reserva
              });
            }
          });

          (reservasHab || []).forEach((rh: any) => {
            if (rh.reserva && ['confirmada', 'pendiente'].includes(rh.reserva.estado)) {
              if (rh.reserva.fecha_inicio <= fechaFin && rh.reserva.fecha_fin >= fechaInicio) {
                fechasConflicto.push({
                  fecha_inicio: rh.reserva.fecha_inicio,
                  fecha_fin: rh.reserva.fecha_fin,
                  codigo: rh.reserva.codigo_reserva
                });
              }
            }
          });

          // Eliminar duplicados
          const uniqueFechas = Array.from(
            new Map(fechasConflicto.map(f => [`${f.fecha_inicio}-${f.fecha_fin}`, f])).values()
          );

          return {
            ...hab,
            fechas_conflicto: uniqueFechas
          };
        }
        return hab;
      }));

      setHabitacionesDisponibles(habitacionesEnriquecidas);
    } catch (err) {
      console.error('Error cargando habitaciones:', err);
      setError('Error al cargar habitaciones disponibles');
    } finally {
      setLoadingHabitaciones(false);
    }
  };

  const toggleHabitacion = (habId: string) => {
    setHabitacionesSeleccionadas(prev => 
      prev.includes(habId) 
        ? prev.filter(id => id !== habId)
        : [...prev, habId]
    );
  };

  const calcularPrecioTotal = () => {
    if (!fechaInicio || !fechaFin) return { noches: 0, precioTotal: 0, precioPorNoche: 0 };

    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    const noches = Math.ceil((fin.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24));

    let precioPorNoche = 0;

    if (tipoReserva === 'posada_completa' && posadaSeleccionada) {
      precioPorNoche = posadaSeleccionada.precio_posada_completa;
    } else if (tipoReserva === 'habitacion' && habitacionesSeleccionadas.length > 0) {
      precioPorNoche = habitacionesDisponibles
        .filter(h => habitacionesSeleccionadas.includes(h.id))
        .reduce((sum, h) => sum + h.precio_por_noche, 0);
    }

    return {
      noches,
      precioPorNoche,
      precioTotal: precioPorNoche * noches
    };
  };

  const { noches, precioTotal, precioPorNoche } = calcularPrecioTotal();

  const validarFormulario = () => {
    if (!posadaId) {
      setError('Selecciona una posada');
      return false;
    }

    if (tipoReserva === 'habitacion' && habitacionesSeleccionadas.length === 0) {
      setError('Selecciona al menos una habitación');
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

    const capacidadTotal = tipoReserva === 'posada_completa'
      ? posadaSeleccionada?.capacidad_maxima || 0
      : habitacionesDisponibles
          .filter(h => habitacionesSeleccionadas.includes(h.id))
          .reduce((sum, h) => sum + h.capacidad, 0);

    if (parseInt(numHuespedes) > capacidadTotal) {
      setError(`Capacidad máxima: ${capacidadTotal} huéspedes`);
      return false;
    }

    if (precioPorNoche === 0) {
      setError('No se pudo calcular el precio');
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
      if (tipoReserva === 'posada_completa') {
        const { data: reserva, error: errorReserva } = await supabase
          .from('reservas')
          .insert({
            posada_id: posadaId,
            habitacion_id: null,
            tipo_reserva: 'posada_completa',
            fecha_inicio: fechaInicio,
            fecha_fin: fechaFin,
            num_huespedes: parseInt(numHuespedes),
            nombre_cliente: nombreCliente.trim(),
            email_cliente: emailCliente.trim().toLowerCase(),
            telefono_cliente: telefonoCliente.trim(),
            notas_cliente: notasCliente.trim() || null,
            precio_por_noche: precioPorNoche,
            precio_total: precioTotal,
            estado: pagoConfirmado ? 'confirmada' : 'pendiente',
            notas_admin: 'Reserva creada manualmente desde panel admin',
          })
          .select()
          .single();

        if (errorReserva) throw errorReserva;

        setSuccess(true);
        setTimeout(() => {
          router.push(`/admin/reservas/${reserva.id}`);
        }, 1500);

      } else {
        const { data: reserva, error: errorReserva } = await supabase
          .from('reservas')
          .insert({
            posada_id: posadaId,
            habitacion_id: null,
            tipo_reserva: 'habitacion',
            fecha_inicio: fechaInicio,
            fecha_fin: fechaFin,
            num_huespedes: parseInt(numHuespedes),
            nombre_cliente: nombreCliente.trim(),
            email_cliente: emailCliente.trim().toLowerCase(),
            telefono_cliente: telefonoCliente.trim(),
            notas_cliente: notasCliente.trim() || null,
            precio_por_noche: precioPorNoche,
            precio_total: precioTotal,
            estado: pagoConfirmado ? 'confirmada' : 'pendiente',
            notas_admin: 'Reserva creada manualmente desde panel admin',
          })
          .select()
          .single();

        if (errorReserva) throw errorReserva;

        const habitacionesData = habitacionesDisponibles
          .filter(h => habitacionesSeleccionadas.includes(h.id))
          .map(h => ({
            reserva_id: reserva.id,
            habitacion_id: h.id,
            precio_por_noche: h.precio_por_noche
          }));

        const { error: errorRelaciones } = await supabase
          .from('reservas_habitaciones')
          .insert(habitacionesData);

        if (errorRelaciones) {
          await supabase.from('reservas').delete().eq('id', reserva.id);
          throw errorRelaciones;
        }

        setSuccess(true);
        setTimeout(() => {
          router.push(`/admin/reservas/${reserva.id}`);
        }, 1500);
      }

    } catch (err: any) {
      console.error('Error al crear reserva:', err);
      setError(err.message || 'Error al crear la reserva. Por favor intenta de nuevo.');
      setLoading(false);
    }
  };

  const formatearFecha = (fecha: string) => {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
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
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
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

      {/* Layout: Formulario + Calendario */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Columna Izquierda: Formulario */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6 space-y-6">
            
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {/* 1. Seleccionar Posada */}
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
                        : 'border-neutral-200 hover:border-neutral-300'
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
                    <div>
                      <h3 className="font-semibold text-neutral-900">{posada.nombre}</h3>
                      <p className="text-sm text-neutral-600 mt-1">
                        Capacidad: {posada.capacidad_maxima} huéspedes
                      </p>
                      <p className="text-sm font-semibold text-primary-600 mt-2">
                        ${posada.precio_posada_completa}/noche (completa)
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* 2. Tipo de Reserva */}
            {posadaId && (
              <div>
                <h2 className="text-lg font-semibold text-neutral-900 mb-4">
                  2. Tipo de Reserva
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <label
                    className={`
                      p-4 border-2 rounded-lg cursor-pointer transition-all
                      ${tipoReserva === 'posada_completa'
                        ? 'border-primary-600 bg-primary-50'
                        : 'border-neutral-200 hover:border-neutral-300'
                      }
                    `}
                  >
                    <input
                      type="radio"
                      name="tipo"
                      value="posada_completa"
                      checked={tipoReserva === 'posada_completa'}
                      onChange={() => setTipoReserva('posada_completa')}
                      className="sr-only"
                    />
                    <div className="text-center">
                      <h3 className="font-semibold text-neutral-900">Posada Completa</h3>
                      <p className="text-sm text-neutral-600 mt-1">
                        Todas las habitaciones
                      </p>
                    </div>
                  </label>

                  <label
                    className={`
                      p-4 border-2 rounded-lg cursor-pointer transition-all
                      ${tipoReserva === 'habitacion'
                        ? 'border-primary-600 bg-primary-50'
                        : 'border-neutral-200 hover:border-neutral-300'
                      }
                    `}
                  >
                    <input
                      type="radio"
                      name="tipo"
                      value="habitacion"
                      checked={tipoReserva === 'habitacion'}
                      onChange={() => setTipoReserva('habitacion')}
                      className="sr-only"
                    />
                    <div className="text-center">
                      <h3 className="font-semibold text-neutral-900">Por Habitaciones</h3>
                      <p className="text-sm text-neutral-600 mt-1">
                        Selecciona habitaciones específicas
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {/* 3. Fechas */}
            {posadaId && (
              <div>
                <h2 className="text-lg font-semibold text-neutral-900 mb-4">
                  3. Fechas de la Reserva
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Check-in
                    </label>
                    <input
                      type="date"
                      value={fechaInicio}
                      onChange={(e) => setFechaInicio(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Check-out
                    </label>
                    <input
                      type="date"
                      value={fechaFin}
                      onChange={(e) => setFechaFin(e.target.value)}
                      min={fechaInicio || new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                {noches > 0 && (
                  <p className="text-sm text-neutral-600 mt-2">
                    {noches} {noches === 1 ? 'noche' : 'noches'}
                  </p>
                )}
              </div>
            )}

            {/* 4. Selector de Habitaciones */}
            {tipoReserva === 'habitacion' && fechaInicio && fechaFin && (
              <div>
                <h2 className="text-lg font-semibold text-neutral-900 mb-4">
                  4. Selecciona Habitaciones
                </h2>
                
                {loadingHabitaciones ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
                  </div>
                ) : habitacionesDisponibles.length === 0 ? (
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-sm text-amber-800">
                      No hay habitaciones disponibles para estas fechas.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {habitacionesDisponibles.map((hab) => (
                      <label
                        key={hab.id}
                        className={`
                          block p-4 border-2 rounded-lg transition-all
                          ${!hab.disponible 
                            ? 'border-neutral-200 bg-neutral-50 opacity-75'
                            : habitacionesSeleccionadas.includes(hab.id)
                              ? 'border-primary-600 bg-primary-50 cursor-pointer'
                              : 'border-neutral-200 hover:border-neutral-300 cursor-pointer'
                          }
                        `}
                      >
                        <input
                          type="checkbox"
                          checked={habitacionesSeleccionadas.includes(hab.id)}
                          onChange={() => toggleHabitacion(hab.id)}
                          disabled={!hab.disponible}
                          className="sr-only"
                        />
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-neutral-900">{hab.nombre}</h3>
                            <p className="text-sm text-neutral-600 mt-1">
                              Capacidad: {hab.capacidad} {hab.capacidad === 1 ? 'huésped' : 'huéspedes'}
                            </p>
                            {!hab.disponible && (
                              <div className="mt-2 space-y-1">
                                <p className="text-xs font-medium text-red-600">
                                  {hab.motivo_no_disponible || 'No disponible'}
                                </p>
                                {hab.fechas_conflicto && hab.fechas_conflicto.length > 0 && (
                                  <div className="text-xs text-red-600 space-y-0.5">
                                    {hab.fechas_conflicto.map((conflicto: any, idx: number) => (
                                      <div key={idx} className="flex items-center gap-1">
                                        <CalendarIcon className="w-3 h-3" />
                                        <span>
                                          {formatearFecha(conflicto.fecha_inicio)} - {formatearFecha(conflicto.fecha_fin)}
                                          {conflicto.codigo && ` (${conflicto.codigo})`}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-primary-600">
                              ${hab.precio_por_noche}/noche
                            </p>
                          </div>
                        </div>
                      </label>
                    ))}

                    {habitacionesSeleccionadas.length > 0 && (
                      <div className="p-3 bg-primary-50 border border-primary-200 rounded-lg">
                        <p className="text-sm font-medium text-primary-900">
                          {habitacionesSeleccionadas.length} {habitacionesSeleccionadas.length === 1 ? 'habitación seleccionada' : 'habitaciones seleccionadas'}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* 5. Datos del Cliente */}
            {posadaId && fechaInicio && fechaFin && (tipoReserva === 'posada_completa' || habitacionesSeleccionadas.length > 0) && (
              <div>
                <h2 className="text-lg font-semibold text-neutral-900 mb-4">
                  {tipoReserva === 'habitacion' ? '5' : '4'}. Datos del Cliente
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Nombre Completo *
                    </label>
                    <input
                      type="text"
                      value={nombreCliente}
                      onChange={(e) => setNombreCliente(e.target.value)}
                      placeholder="Juan Pérez"
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      required
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
                      placeholder="juan@example.com"
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      required
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
                      placeholder="+58 412 123 4567"
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Número de Huéspedes *
                    </label>
                    <input
                      type="number"
                      value={numHuespedes}
                      onChange={(e) => setNumHuespedes(e.target.value)}
                      min="1"
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Notas del Cliente (opcional)
                    </label>
                    <textarea
                      value={notasCliente}
                      onChange={(e) => setNotasCliente(e.target.value)}
                      rows={3}
                      placeholder="Comentarios o solicitudes especiales..."
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 6. Estado de Pago */}
            {nombreCliente && emailCliente && telefonoCliente && (
              <div>
                <h2 className="text-lg font-semibold text-neutral-900 mb-4">
                  {tipoReserva === 'habitacion' ? '6' : '5'}. Estado de Pago
                </h2>
                <label className="flex items-center gap-3 p-4 border border-neutral-300 rounded-lg cursor-pointer hover:bg-neutral-50">
                  <input
                    type="checkbox"
                    checked={pagoConfirmado}
                    onChange={(e) => setPagoConfirmado(e.target.checked)}
                    className="w-4 h-4 text-primary-600 rounded focus:ring-2 focus:ring-primary-500"
                  />
                  <div>
                    <p className="font-medium text-neutral-900">Pago confirmado</p>
                    <p className="text-sm text-neutral-600">
                      Marca esta casilla si el cliente ya realizó el pago
                    </p>
                  </div>
                </label>
              </div>
            )}

            {/* Resumen de Precio */}
            {precioTotal > 0 && (
              <div className="bg-primary-50 border border-primary-200 rounded-lg p-6">
                <h3 className="font-semibold text-primary-900 mb-4">Resumen de la Reserva</h3>
                <dl className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <dt className="text-primary-700">Precio por noche:</dt>
                    <dd className="font-semibold text-primary-900">${precioPorNoche.toFixed(2)}</dd>
                  </div>
                  <div className="flex justify-between text-sm">
                    <dt className="text-primary-700">Noches:</dt>
                    <dd className="font-semibold text-primary-900">{noches}</dd>
                  </div>
                  {tipoReserva === 'habitacion' && habitacionesSeleccionadas.length > 0 && (
                    <div className="flex justify-between text-sm">
                      <dt className="text-primary-700">Habitaciones:</dt>
                      <dd className="font-semibold text-primary-900">
                        {habitacionesSeleccionadas.length}
                      </dd>
                    </div>
                  )}
                  <div className="flex justify-between text-sm pt-2 border-t border-primary-300">
                    <dt className="text-primary-700">Huéspedes:</dt>
                    <dd className="font-semibold text-primary-900">{numHuespedes}</dd>
                  </div>
                  <div className="flex justify-between pt-3 border-t-2 border-primary-300">
                    <dt className="text-lg font-bold text-primary-900">Total:</dt>
                    <dd className="text-xl font-bold text-primary-900">${precioTotal.toFixed(2)}</dd>
                  </div>
                  <div className="flex justify-between text-sm pt-2">
                    <dt className="text-primary-700">Estado:</dt>
                    <dd className={`font-semibold ${pagoConfirmado ? 'text-green-600' : 'text-amber-600'}`}>
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
                disabled={loading || !posadaId || !fechaInicio || !fechaFin || !nombreCliente || precioTotal === 0 || (tipoReserva === 'habitacion' && habitacionesSeleccionadas.length === 0)}
                className="flex-1 px-6 py-2 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Creando Reserva...
                  </span>
                ) : (
                  'Crear Reserva'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Columna Derecha: Calendario Permanente */}
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <CalendarioDisponibilidadSidebar 
              posadaId={posadaId}
              reservasCalendario={reservasCalendario}
              loadingCalendario={loadingCalendario}
              fechaInicio={fechaInicio}
              fechaFin={fechaFin}
              formatearFecha={formatearFecha}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente de Calendario en Sidebar (siempre visible)
function CalendarioDisponibilidadSidebar({ 
  posadaId,
  reservasCalendario, 
  loadingCalendario,
  fechaInicio, 
  fechaFin,
  formatearFecha
}: { 
  posadaId: string;
  reservasCalendario: ReservaCalendario[];
  loadingCalendario: boolean;
  fechaInicio: string;
  fechaFin: string;
  formatearFecha: (fecha: string) => string;
}) {
  
  if (!posadaId) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="font-semibold text-neutral-900 mb-4 flex items-center gap-2">
          <CalendarIcon className="w-5 h-5" />
          Calendario de Disponibilidad
        </h3>
        <p className="text-sm text-neutral-600 text-center py-8">
          Selecciona una posada para ver su disponibilidad
        </p>
      </div>
    );
  }

  if (loadingCalendario) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="font-semibold text-neutral-900 mb-4 flex items-center gap-2">
          <CalendarIcon className="w-5 h-5" />
          Calendario de Disponibilidad
        </h3>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
        </div>
      </div>
    );
  }

  // Generar 3 meses
  const hoy = new Date();
  const meses = [];
  
  for (let i = 0; i < 3; i++) {
    const mes = new Date(hoy.getFullYear(), hoy.getMonth() + i, 1);
    meses.push(mes);
  }

  const nombresMeses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const diasSemana = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];

  const obtenerEstadoDia = (fecha: Date) => {
    const fechaStr = fecha.toISOString().split('T')[0];
    
    // Verificar si es la reserva que se está creando (verde)
    if (fechaInicio && fechaFin) {
      // El último día (checkout) NO se cuenta como ocupado
      if (fechaStr >= fechaInicio && fechaStr < fechaFin) {
        return { tipo: 'nueva', color: 'bg-green-200 border-green-400 text-green-900' };
      }
    }

    // Verificar reservas existentes
    for (const reserva of reservasCalendario) {
      // El día de checkout NO se cuenta como ocupado
      if (fechaStr >= reserva.fecha_inicio && fechaStr < reserva.fecha_fin) {
        if (reserva.tipo === 'posada_completa') {
          return { 
            tipo: 'completa', 
            color: 'bg-red-200 border-red-400 text-red-900',
            reserva 
          };
        } else {
          return { 
            tipo: 'parcial', 
            color: 'bg-amber-200 border-amber-400 text-amber-900',
            reserva 
          };
        }
      }
    }

    return { tipo: 'disponible', color: 'bg-white border-neutral-300 text-neutral-700' };
  };

  const getDiasDelMes = (mes: Date) => {
    const año = mes.getFullYear();
    const mesNum = mes.getMonth();
    const primerDia = new Date(año, mesNum, 1);
    const ultimoDia = new Date(año, mesNum + 1, 0);
    
    const dias = [];
    
    // Días vacíos al inicio
    for (let i = 0; i < primerDia.getDay(); i++) {
      dias.push(null);
    }
    
    // Días del mes
    for (let dia = 1; dia <= ultimoDia.getDate(); dia++) {
      dias.push(new Date(año, mesNum, dia));
    }
    
    return dias;
  };

  // Agrupar reservas por fecha para el listado
  const reservasListado = reservasCalendario.map(r => ({
    ...r,
    inicio: new Date(r.fecha_inicio),
    fin: new Date(r.fecha_fin)
  })).sort((a, b) => a.inicio.getTime() - b.inicio.getTime());

  return (
    <div className="bg-white shadow rounded-lg p-6 space-y-6">
      <div>
        <h3 className="font-semibold text-neutral-900 mb-2 flex items-center gap-2">
          <CalendarIcon className="w-5 h-5" />
          Calendario de Disponibilidad
        </h3>
        <p className="text-xs text-neutral-600">
          Próximos 3 meses
        </p>
      </div>

      {/* Leyenda */}
      <div className="space-y-2 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-200 border border-red-400 rounded"></div>
          <span className="text-neutral-700">Posada completa</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-amber-200 border border-amber-400 rounded"></div>
          <span className="text-neutral-700">Reserva parcial</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-200 border border-green-400 rounded"></div>
          <span className="text-neutral-700">Su reserva</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-white border border-neutral-300 rounded"></div>
          <span className="text-neutral-700">Disponible</span>
        </div>
      </div>

      {/* Nota sobre checkout */}
      <div className="bg-blue-50 border border-blue-200 rounded p-3">
        <p className="text-xs text-blue-800 flex items-start gap-2">
          <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>El día de checkout se marca como ocupado, pero se permite check-in el mismo día por la tarde.</span>
        </p>
      </div>

      {/* Calendarios */}
      <div className="space-y-6">
        {meses.map((mes, idx) => {
          const dias = getDiasDelMes(mes);
          
          return (
            <div key={idx}>
              <h4 className="font-semibold text-sm text-neutral-900 mb-3">
                {nombresMeses[mes.getMonth()]} {mes.getFullYear()}
              </h4>
              
              {/* Header días */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {diasSemana.map(dia => (
                  <div key={dia} className="text-center text-xs font-medium text-neutral-600">
                    {dia}
                  </div>
                ))}
              </div>
              
              {/* Días del mes */}
              <div className="grid grid-cols-7 gap-1">
                {dias.map((fecha, i) => {
                  if (!fecha) {
                    return <div key={i} className="aspect-square"></div>;
                  }

                  const estado = obtenerEstadoDia(fecha);
                  const esHoy = fecha.toDateString() === new Date().toDateString();
                  
                  return (
                    <div
                      key={i}
                      className={`
                        aspect-square flex items-center justify-center text-xs rounded
                        border transition-colors
                        ${estado.color}
                        ${esHoy ? 'ring-2 ring-primary-500 font-bold' : ''}
                      `}
                      title={estado.reserva ? `${estado.reserva.codigo_reserva || ''} (${formatearFecha(estado.reserva.fecha_inicio)} - ${formatearFecha(estado.reserva.fecha_fin)})` : ''}
                    >
                      {fecha.getDate()}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Listado de Reservas Próximas */}
      {reservasListado.length > 0 && (
        <div className="border-t pt-6">
          <h4 className="font-semibold text-sm text-neutral-900 mb-3">
            Reservas Próximas
          </h4>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {reservasListado.slice(0, 10).map((reserva, idx) => (
              <div 
                key={idx} 
                className={`
                  p-3 rounded border-l-4 text-xs
                  ${reserva.tipo === 'posada_completa' 
                    ? 'border-red-500 bg-red-50' 
                    : 'border-amber-500 bg-amber-50'
                  }
                `}
              >
                <div className="font-semibold text-neutral-900 mb-1">
                  {reserva.codigo_reserva || 'Sin código'}
                </div>
                <div className="text-neutral-700 mb-1">
                  {formatearFecha(reserva.fecha_inicio)} - {formatearFecha(reserva.fecha_fin)}
                </div>
                <div className="text-neutral-600">
                  {reserva.tipo === 'posada_completa' ? (
                    'Posada Completa'
                  ) : (
                    `${reserva.habitaciones?.length || 0} hab: ${reserva.habitaciones?.join(', ') || ''}`
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}