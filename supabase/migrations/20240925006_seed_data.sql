-- ==============================================
-- MIGRATION 6: Datos reales de las posadas Mararena
-- ==============================================

-- Insertar las dos posadas principales con información real
INSERT INTO posadas (nombre, slug, descripcion, descripcion_corta, capacidad_maxima, precio_por_noche, precio_posada_completa, amenidades, orden_display) VALUES 
(
    'Vista al Mar',
    'vista-al-mar',
    'Posada con 6 amplias habitaciones, piscina infinita con jacuzzi y vista al mar. Incluye churuata con parrillera y horno de pizza, playa privada de acceso exclusivo, cocina equipada, WiFi de alta velocidad, lavandería, estacionamiento privado, planta eléctrica y tanque de agua. Ideal para eventos hasta 50 personas.',
    'Posada con vista panorámica al mar, piscina infinita, jacuzzi y playa privada',
    12, -- Capacidad base (puede expandirse con anexo)
    210.00, -- Precio mínimo por habitación
    1250.00, -- Precio posada completa
    '["Piscina infinita", "Jacuzzi con vista al mar", "Churuata con parrillera", "Horno de pizza", "Playa privada", "WiFi alta velocidad", "Lavandería", "Estacionamiento privado", "Planta eléctrica", "Tanque de agua", "Cocina equipada", "Aire acondicionado", "Baño privado con agua caliente"]'::jsonb,
    1
),
(
    'Inmarcesible',
    'inmarcesible',
    'Posada con espacios exclusivos para 31 personas. Cuenta con 2 churuatas sociales con parrillera, horno y mesones, cocina industrial totalmente equipada, WiFi, estacionamiento seguro, planta eléctrica y tanque de agua. Ideal para eventos hasta 50 personas como bodas, cumpleaños y retiros.',
    'Posada exclusiva con 2 churuatas sociales y cocina industrial para eventos',
    31,
    140.00, -- Precio mínimo por habitación
    1980.00, -- Precio posada completa
    '["2 churuatas sociales", "Parrillera", "Horno", "Mesones", "Cocina industrial equipada", "WiFi", "Estacionamiento seguro", "Planta eléctrica", "Tanque de agua", "Aire acondicionado", "Baño privado con agua caliente"]'::jsonb,
    2
);

-- Insertar habitaciones reales para Vista al Mar
INSERT INTO habitaciones (posada_id, nombre, descripcion, capacidad, precio_por_noche, amenidades, orden_display)
SELECT 
    p.id,
    'Suite Master con Balcón y Vista al Mar',
    'Amplia suite con balcón privado, vestier, baño privado, ático amplio y vista panorámica al mar',
    2,
    420.00,
    '["Balcón privado", "Vista al mar", "Vestier", "Baño privado", "Ático amplio", "Aire acondicionado"]'::jsonb,
    1
FROM posadas p WHERE p.slug = 'vista-al-mar'

UNION ALL

SELECT 
    p.id,
    'Habitación Doble Planta Baja con Anexo',
    'Habitación con cama matrimonial en planta baja más anexo con cama individual',
    3,
    250.00,
    '["Cama matrimonial", "Anexo con cama individual", "Baño privado", "Aire acondicionado"]'::jsonb,
    2
FROM posadas p WHERE p.slug = 'vista-al-mar'

UNION ALL

SELECT 
    p.id,
    'Suite Junior ' || num.n,
    'Suite con baño privado, acogedor ático y aire acondicionado',
    2,
    210.00,
    '["Baño privado", "Ático", "Aire acondicionado"]'::jsonb,
    2 + num.n
FROM posadas p
CROSS JOIN generate_series(1, 4) num(n)
WHERE p.slug = 'vista-al-mar';

-- Insertar habitaciones reales para Inmarcesible

-- Área detrás de la piscina
INSERT INTO habitaciones (posada_id, nombre, descripcion, capacidad, precio_por_noche, amenidades, orden_display)
SELECT 
    p.id,
    'Habitación Standard Piscina ' || num.n,
    'Habitación estándar con litera ubicada detrás de la piscina, con acceso a cocina incluida',
    3,
    140.00,
    '["Litera", "Acceso a cocina", "Aire acondicionado", "Baño privado"]'::jsonb,
    num.n
FROM posadas p
CROSS JOIN generate_series(1, 3) num(n)
WHERE p.slug = 'inmarcesible'

UNION ALL

SELECT 
    p.id,
    'Habitación Standard Matrimonial Piscina',
    'Habitación estándar con cama matrimonial ubicada detrás de la piscina, con acceso a cocina incluida',
    2,
    150.00,
    '["Cama matrimonial", "Acceso a cocina", "Aire acondicionado", "Baño privado"]'::jsonb,
    4
FROM posadas p WHERE p.slug = 'inmarcesible'

-- Churuata - Planta Alta
UNION ALL

SELECT 
    p.id,
    'Junior Suite Churuata ' || num.n,
    'Junior Suite en planta alta de churuata con cama queen y litera',
    3,
    450.00,
    '["Cama queen", "Litera", "Planta alta", "Aire acondicionado", "Baño privado"]'::jsonb,
    4 + num.n
FROM posadas p
CROSS JOIN generate_series(1, 4) num(n)
WHERE p.slug = 'inmarcesible'

-- Churuata - Planta Baja
UNION ALL

SELECT 
    p.id,
    'Habitación Standard Churuata',
    'Habitación estándar en planta baja de churuata con cama matrimonial',
    2,
    150.00,
    '["Cama matrimonial", "Planta baja", "Aire acondicionado", "Baño privado"]'::jsonb,
    9
FROM posadas p WHERE p.slug = 'inmarcesible'

UNION ALL

SELECT 
    p.id,
    'Habitación Premium con Cocina Privada',
    'Habitación premium con cama matrimonial, litera y cocina privada',
    3,
    400.00,
    '["Cama matrimonial", "Litera", "Cocina privada", "Aire acondicionado", "Baño privado"]'::jsonb,
    10
FROM posadas p WHERE p.slug = 'inmarcesible'

UNION ALL

SELECT 
    p.id,
    'Habitación Doble Queen',
    'Habitación amplia con dos camas queen',
    4,
    300.00,
    '["2 camas queen", "Habitación amplia", "Aire acondicionado", "Baño privado"]'::jsonb,
    11
FROM posadas p WHERE p.slug = 'inmarcesible';

-- Crear función para limpiar datos de prueba (útil en desarrollo)
CREATE OR REPLACE FUNCTION limpiar_datos_prueba()
RETURNS TEXT AS $$
BEGIN
    DELETE FROM logs_reservas;
    DELETE FROM reservas WHERE created_at > CURRENT_DATE - INTERVAL '1 day';
    DELETE FROM holds_temporales;
    
    RETURN 'Datos de prueba limpiados';
END;
$$ LANGUAGE plpgsql;

-- Función de verificación para confirmar datos insertados
CREATE OR REPLACE FUNCTION verificar_datos_mararena()
RETURNS TABLE (
    posada VARCHAR,
    habitaciones_count BIGINT,
    capacidad_total BIGINT,
    precio_min DECIMAL,
    precio_max DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.nombre::VARCHAR,
        COUNT(h.id) as habitaciones_count,
        SUM(h.capacidad) as capacidad_total,
        MIN(h.precio_por_noche) as precio_min,
        MAX(h.precio_por_noche) as precio_max
    FROM posadas p
    LEFT JOIN habitaciones h ON p.id = h.posada_id
    WHERE p.activa = true
    GROUP BY p.id, p.nombre, p.orden_display
    ORDER BY p.orden_display;
END;
$$ LANGUAGE plpgsql;