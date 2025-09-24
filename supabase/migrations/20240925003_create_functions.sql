-- ==============================================
-- MIGRATION 3: Funciones para lógica de negocio
-- ==============================================

-- Función para generar códigos únicos de reserva
CREATE OR REPLACE FUNCTION generar_codigo_reserva()
RETURNS TEXT AS $$
DECLARE
    codigo TEXT;
    existe BOOLEAN;
    contador INTEGER := 0;
BEGIN
    LOOP
        -- Formato: MARA-YYYY-XXX (ej: MARA-2024-001)
        codigo := 'MARA-' || EXTRACT(YEAR FROM NOW()) || '-' || 
                  LPAD((FLOOR(RANDOM() * 999) + 1)::TEXT, 3, '0');
        
        -- Verificar si existe
        SELECT EXISTS(SELECT 1 FROM reservas WHERE codigo_reserva = codigo) INTO existe;
        
        -- Si no existe, salir del loop
        IF NOT existe THEN
            EXIT;
        END IF;
        
        -- Prevenir loop infinito
        contador := contador + 1;
        IF contador > 100 THEN
            -- Fallback: usar timestamp para garantizar unicidad
            codigo := 'MAR-' || EXTRACT(YEAR FROM NOW()) || '-' || 
                     EXTRACT(EPOCH FROM NOW())::TEXT;
            EXIT;
        END IF;
    END LOOP;
    
    RETURN codigo;
END;
$$ LANGUAGE plpgsql;

-- Función para verificar disponibilidad completa
CREATE OR REPLACE FUNCTION verificar_disponibilidad(
    p_posada_id UUID,
    p_fecha_inicio DATE,
    p_fecha_fin DATE,
    p_habitacion_id UUID DEFAULT NULL,
    p_session_id VARCHAR DEFAULT NULL
) RETURNS BOOLEAN AS $$
DECLARE
    conflictos INTEGER := 0;
BEGIN
    -- Validar fechas
    IF p_fecha_inicio >= p_fecha_fin THEN
        RETURN FALSE;
    END IF;
    
    IF p_fecha_inicio < CURRENT_DATE THEN
        RETURN FALSE;
    END IF;
    
    -- Verificar reservas confirmadas
    SELECT COUNT(*) INTO conflictos
    FROM reservas 
    WHERE posada_id = p_posada_id 
    AND (p_habitacion_id IS NULL OR habitacion_id = p_habitacion_id)
    AND estado IN ('confirmada', 'completada')
    AND NOT (fecha_fin <= p_fecha_inicio OR fecha_inicio >= p_fecha_fin);
    
    IF conflictos > 0 THEN
        RETURN FALSE;
    END IF;
    
    -- Verificar holds temporales de otros usuarios
    SELECT COUNT(*) INTO conflictos
    FROM holds_temporales 
    WHERE posada_id = p_posada_id 
    AND (p_habitacion_id IS NULL OR habitacion_id = p_habitacion_id)
    AND expira_en > NOW()
    AND (p_session_id IS NULL OR session_id != p_session_id)
    AND NOT (fecha_fin <= p_fecha_inicio OR fecha_inicio >= p_fecha_fin);
    
    RETURN conflictos = 0;
END;
$$ LANGUAGE plpgsql;

-- Función para limpiar holds expirados
CREATE OR REPLACE FUNCTION limpiar_holds_expirados()
RETURNS INTEGER AS $$
DECLARE
    eliminados INTEGER;
BEGIN
    DELETE FROM holds_temporales 
    WHERE expira_en < NOW();
    
    GET DIAGNOSTICS eliminados = ROW_COUNT;
    RETURN eliminados;
END;
$$ LANGUAGE plpgsql;

-- Función para obtener fechas ocupadas (para el calendario)
CREATE OR REPLACE FUNCTION obtener_fechas_ocupadas(
    p_posada_id UUID,
    p_fecha_desde DATE DEFAULT CURRENT_DATE,
    p_fecha_hasta DATE DEFAULT CURRENT_DATE + INTERVAL '1 year',
    p_habitacion_id UUID DEFAULT NULL
) RETURNS TABLE (
    fecha_inicio DATE,
    fecha_fin DATE,
    tipo VARCHAR(20)
) AS $$
BEGIN
    RETURN QUERY
    -- Reservas confirmadas
    SELECT 
        r.fecha_inicio,
        r.fecha_fin,
        'reservada'::VARCHAR(20) as tipo
    FROM reservas r
    WHERE r.posada_id = p_posada_id 
    AND (p_habitacion_id IS NULL OR r.habitacion_id = p_habitacion_id)
    AND r.estado IN ('confirmada', 'completada')
    AND r.fecha_fin >= p_fecha_desde
    AND r.fecha_inicio <= p_fecha_hasta
    
    UNION ALL
    
    -- Holds temporales activos
    SELECT 
        h.fecha_inicio,
        h.fecha_fin,
        'hold_temporal'::VARCHAR(20) as tipo
    FROM holds_temporales h
    WHERE h.posada_id = p_posada_id 
    AND (p_habitacion_id IS NULL OR h.habitacion_id = p_habitacion_id)
    AND h.expira_en > NOW()
    AND h.fecha_fin >= p_fecha_desde
    AND h.fecha_inicio <= p_fecha_hasta;
END;
$$ LANGUAGE plpgsql;