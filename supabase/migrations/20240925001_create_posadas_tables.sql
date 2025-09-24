-- ==============================================
-- MIGRATION 1: Crear tablas principales
-- ==============================================

-- Tabla: posadas
CREATE TABLE posadas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    descripcion TEXT,
    descripcion_corta VARCHAR(255),
    capacidad_maxima INTEGER NOT NULL,
    precio_por_noche DECIMAL(10,2),
    precio_posada_completa DECIMAL(10,2),
    imagenes JSONB DEFAULT '[]'::jsonb,
    amenidades JSONB DEFAULT '[]'::jsonb,
    activa BOOLEAN DEFAULT true,
    orden_display INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla: habitaciones
CREATE TABLE habitaciones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    posada_id UUID REFERENCES posadas(id) ON DELETE CASCADE,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    capacidad INTEGER NOT NULL,
    precio_por_noche DECIMAL(10,2),
    imagenes JSONB DEFAULT '[]'::jsonb,
    amenidades JSONB DEFAULT '[]'::jsonb,
    activa BOOLEAN DEFAULT true,
    orden_display INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla: holds_temporales (clave para evitar conflictos)
CREATE TABLE holds_temporales (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id VARCHAR(255) NOT NULL,
    posada_id UUID REFERENCES posadas(id) ON DELETE CASCADE,
    habitacion_id UUID REFERENCES habitaciones(id) ON DELETE CASCADE NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    tipo_reserva VARCHAR(20) NOT NULL CHECK (tipo_reserva IN ('habitacion', 'posada_completa')),
    expira_en TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla: reservas
CREATE TABLE reservas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    codigo_reserva VARCHAR(20) UNIQUE,
    
    -- Información de la reserva
    tipo_reserva VARCHAR(20) NOT NULL CHECK (tipo_reserva IN ('habitacion', 'posada_completa')),
    posada_id UUID REFERENCES posadas(id) NOT NULL,
    habitacion_id UUID REFERENCES habitaciones(id) NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    num_noches INTEGER GENERATED ALWAYS AS (fecha_fin - fecha_inicio) STORED,
    
    -- Información del cliente
    nombre_cliente VARCHAR(100) NOT NULL,
    email_cliente VARCHAR(255) NOT NULL,
    telefono_cliente VARCHAR(20) NOT NULL,
    num_huespedes INTEGER NOT NULL CHECK (num_huespedes > 0),
    notas_cliente TEXT,
    
    -- Información financiera
    precio_por_noche DECIMAL(10,2) NOT NULL,
    precio_total DECIMAL(10,2) NOT NULL,
    descuento DECIMAL(10,2) DEFAULT 0,
    
    -- Estados y gestión
    estado VARCHAR(20) DEFAULT 'confirmada' NOT NULL CHECK (estado IN ('confirmada', 'cancelada', 'completada', 'no_show')),
    
    -- Información administrativa
    notas_admin TEXT,
    confirmada_por UUID REFERENCES auth.users(id) NULL,
    confirmada_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    cancelada_en TIMESTAMP WITH TIME ZONE NULL,
    razon_cancelacion TEXT,
    
    -- Metadata
    session_id VARCHAR(255),
    ip_address INET,
    user_agent TEXT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CHECK (fecha_fin > fecha_inicio),
    CHECK (precio_total >= 0)
);

-- Tabla: disponibilidad_especial (opcional, para fechas con precios especiales)
CREATE TABLE disponibilidad_especial (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    posada_id UUID REFERENCES posadas(id) ON DELETE CASCADE,
    habitacion_id UUID REFERENCES habitaciones(id) ON DELETE CASCADE NULL,
    fecha DATE NOT NULL,
    disponible BOOLEAN DEFAULT true,
    precio_especial DECIMAL(10,2) NULL,
    razon VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla: logs_reservas (auditoría)
CREATE TABLE logs_reservas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reserva_id UUID REFERENCES reservas(id) ON DELETE CASCADE,
    accion VARCHAR(50) NOT NULL,
    estado_anterior VARCHAR(20),
    estado_nuevo VARCHAR(20),
    usuario_id UUID REFERENCES auth.users(id) NULL,
    detalles JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);