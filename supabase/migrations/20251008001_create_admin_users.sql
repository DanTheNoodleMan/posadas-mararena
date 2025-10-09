-- Migration: Crear usuarios admin para Mararena Posadas
-- Archivo: supabase/migrations/20241008001_create_admin_users.sql

-- Esta migration crea 1 usuario admin

-- Usuario Admin 1
INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    role,
    aud
) VALUES (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000000',
    'mararenaposadas@gmail.com',
    crypt('MararenaAdmin2025!', gen_salt('bf')), -- Cambiar en producción
    NOW(),
    '{"provider":"email","providers":["email"],"role":"admin"}',
    '{"name":"Admin","role":"admin"}',
    NOW(),
    NOW(),
    'authenticated',
    'authenticated'
);

-- Opcional: Tabla para permisos adicionales (futuro)
CREATE TABLE IF NOT EXISTS admin_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    permission VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, permission)
);

-- Índice para búsquedas rápidas
CREATE INDEX idx_admin_permissions_user ON admin_permissions(user_id);

-- Comentario para documentación
COMMENT ON TABLE admin_permissions IS 'Tabla para gestionar permisos granulares de usuarios admin (futuro)';