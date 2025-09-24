-- ==============================================
-- MIGRATION 5: Row Level Security Policies
-- ==============================================

-- Habilitar RLS en todas las tablas
ALTER TABLE posadas ENABLE ROW LEVEL SECURITY;
ALTER TABLE habitaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE holds_temporales ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservas ENABLE ROW LEVEL SECURITY;
ALTER TABLE disponibilidad_especial ENABLE ROW LEVEL SECURITY;
ALTER TABLE logs_reservas ENABLE ROW LEVEL SECURITY;

-- Políticas para posadas (lectura pública, escritura admin)
CREATE POLICY "Posadas son públicas para lectura" ON posadas
    FOR SELECT USING (true);

CREATE POLICY "Solo admins pueden modificar posadas" ON posadas
    FOR ALL USING (auth.role() = 'authenticated');

-- Políticas para habitaciones (lectura pública, escritura admin)
CREATE POLICY "Habitaciones son públicas para lectura" ON habitaciones
    FOR SELECT USING (true);

CREATE POLICY "Solo admins pueden modificar habitaciones" ON habitaciones
    FOR ALL USING (auth.role() = 'authenticated');

-- Políticas para holds_temporales (solo la sesión que los creó)
CREATE POLICY "Solo la sesión puede ver sus holds" ON holds_temporales
    FOR SELECT USING (true); -- Temporal: permitir lectura para debugging

CREATE POLICY "Solo anónimos pueden crear holds" ON holds_temporales
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Solo la sesión puede modificar sus holds" ON holds_temporales --???
    FOR UPDATE USING (true);

CREATE POLICY "Solo la sesión puede eliminar sus holds" ON holds_temporales ---???
    FOR DELETE USING (true);

-- Políticas para reservas
CREATE POLICY "Reservas públicas para lectura" ON reservas
    FOR SELECT USING (true);

CREATE POLICY "Cualquiera puede crear reservas" ON reservas
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Solo admins pueden modificar reservas" ON reservas
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Solo admins pueden eliminar reservas" ON reservas
    FOR DELETE USING (auth.role() = 'authenticated');

-- Políticas para disponibilidad_especial
CREATE POLICY "Disponibilidad pública para lectura" ON disponibilidad_especial
    FOR SELECT USING (true);

CREATE POLICY "Solo admins pueden modificar disponibilidad" ON disponibilidad_especial
    FOR ALL USING (auth.role() = 'authenticated');

-- Políticas para logs_reservas (solo admins)
CREATE POLICY "Solo admins pueden ver logs" ON logs_reservas
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Sistema puede crear logs" ON logs_reservas
    FOR INSERT WITH CHECK (true);