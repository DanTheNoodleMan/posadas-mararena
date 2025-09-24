-- ==============================================
-- MIGRATION 2: Crear índices para performance
-- ==============================================

-- Índices para posadas
CREATE INDEX idx_posadas_slug ON posadas(slug);
CREATE INDEX idx_posadas_activa ON posadas(activa);
CREATE INDEX idx_posadas_orden ON posadas(orden_display);

-- Índices para habitaciones
CREATE INDEX idx_habitaciones_posada ON habitaciones(posada_id);
CREATE INDEX idx_habitaciones_activa ON habitaciones(activa);
CREATE INDEX idx_habitaciones_orden ON habitaciones(posada_id, orden_display);

-- Índices para holds_temporales (críticos para performance)
CREATE INDEX idx_holds_fechas ON holds_temporales(fecha_inicio, fecha_fin);
CREATE INDEX idx_holds_expira ON holds_temporales(expira_en);
CREATE INDEX idx_holds_session ON holds_temporales(session_id);
CREATE INDEX idx_holds_posada ON holds_temporales(posada_id);
CREATE INDEX idx_holds_posada_fechas ON holds_temporales(posada_id, fecha_inicio, fecha_fin);

-- Índices para reservas (consultas frecuentes)
CREATE UNIQUE INDEX idx_reservas_codigo ON reservas(codigo_reserva);
CREATE INDEX idx_reservas_estado ON reservas(estado);
CREATE INDEX idx_reservas_fechas ON reservas(fecha_inicio, fecha_fin);
CREATE INDEX idx_reservas_posada ON reservas(posada_id);
CREATE INDEX idx_reservas_posada_fechas ON reservas(posada_id, fecha_inicio, fecha_fin);
CREATE INDEX idx_reservas_email ON reservas(email_cliente);
CREATE INDEX idx_reservas_telefono ON reservas(telefono_cliente);
CREATE INDEX idx_reservas_created ON reservas(created_at);

-- Índices para disponibilidad_especial
CREATE UNIQUE INDEX idx_disponibilidad_fecha_habitacion ON disponibilidad_especial(fecha, posada_id, COALESCE(habitacion_id, '00000000-0000-0000-0000-000000000000'::uuid));

-- Índices para logs_reservas
CREATE INDEX idx_logs_reserva ON logs_reservas(reserva_id);
CREATE INDEX idx_logs_fecha ON logs_reservas(created_at);
CREATE INDEX idx_logs_accion ON logs_reservas(accion);