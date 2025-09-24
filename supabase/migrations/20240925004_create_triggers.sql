-- ==============================================
-- MIGRATION 4: Triggers para automatización
-- ==============================================

-- Trigger para auto-generar código de reserva
CREATE OR REPLACE FUNCTION trigger_generar_codigo()
RETURNS TRIGGER AS $$
BEGIN
    -- Generar código automáticamente al crear reserva
    IF TG_OP = 'INSERT' THEN
        IF NEW.codigo_reserva IS NULL THEN
            NEW.codigo_reserva := generar_codigo_reserva();
        END IF;
        NEW.updated_at := NOW();
        RETURN NEW;
    END IF;
    
    -- Actualizar timestamp en updates
    IF TG_OP = 'UPDATE' THEN
        NEW.updated_at := NOW();
        RETURN NEW;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_reserva_codigo
    BEFORE INSERT OR UPDATE ON reservas
    FOR EACH ROW
    EXECUTE FUNCTION trigger_generar_codigo();

-- Trigger para logging de cambios en reservas
CREATE OR REPLACE FUNCTION trigger_log_reservas()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO logs_reservas (
            reserva_id, accion, estado_nuevo, detalles
        ) VALUES (
            NEW.id, 'created', NEW.estado, 
            json_build_object('tipo_reserva', NEW.tipo_reserva, 'posada_id', NEW.posada_id)
        );
        RETURN NEW;
    END IF;
    
    IF TG_OP = 'UPDATE' AND OLD.estado != NEW.estado THEN
        INSERT INTO logs_reservas (
            reserva_id, accion, estado_anterior, estado_nuevo, usuario_id
        ) VALUES (
            NEW.id, 'status_change', OLD.estado, NEW.estado, 
            COALESCE(NEW.confirmada_por, NULL)
        );
        RETURN NEW;
    END IF;
    
    IF TG_OP = 'UPDATE' THEN
        INSERT INTO logs_reservas (
            reserva_id, accion, detalles
        ) VALUES (
            NEW.id, 'updated', 
            json_build_object('changed_fields', 'general_update')
        );
        RETURN NEW;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_log_cambios
    AFTER INSERT OR UPDATE ON reservas
    FOR EACH ROW
    EXECUTE FUNCTION trigger_log_reservas();

-- Trigger para actualizar timestamp en posadas
CREATE OR REPLACE FUNCTION trigger_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at := NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_posadas_updated_at
    BEFORE UPDATE ON posadas
    FOR EACH ROW
    EXECUTE FUNCTION trigger_updated_at();