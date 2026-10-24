-- =======================================================
-- ESQUEMA DE BASE DE DATOS INKLY (SUPABASE / POSTGRESQL)
-- =======================================================

-- 1. Crear la tabla de pedidos
CREATE TABLE IF NOT EXISTS pedidos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    buy_order VARCHAR(50) UNIQUE NOT NULL,
    session_id VARCHAR(100),
    
    -- Datos del cliente
    cliente_nombre TEXT,
    cliente_email TEXT,
    cliente_telefono TEXT,
    cliente_direccion TEXT,
    cliente_comuna TEXT DEFAULT 'Temuco',
    fecha_entrega TEXT,
    
    -- Carrito y Detalles de la compra
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    monto_total INTEGER NOT NULL DEFAULT 0,
    tipo_pago VARCHAR(20) NOT NULL DEFAULT 'total', -- 'abono' (50%) o 'total' (100%)
    monto_pagado INTEGER NOT NULL DEFAULT 0,
    saldo_pendiente INTEGER NOT NULL DEFAULT 0,
    
    -- Estado del pedido
    estado VARCHAR(30) NOT NULL DEFAULT 'PENDIENTE', -- 'PENDIENTE', 'PAGADO', 'RECHAZADO', 'ANULADO', 'EN_PREPARACION', 'ENTREGADO'
    
    -- Datos bancarios Transbank Webpay
    tbk_token TEXT,
    codigo_autorizacion VARCHAR(50),
    tipo_tarjeta VARCHAR(20),      -- 'VD' (Débito), 'VN' (Crédito), etc.
    numero_tarjeta VARCHAR(10),    -- Últimos 4 dígitos (ej: 6623)
    cuotas INTEGER DEFAULT 0,
    fecha_pago TIMESTAMPTZ,
    
    -- Auditoría
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Índices para búsqueda rápida
CREATE INDEX IF NOT EXISTS idx_pedidos_buy_order ON pedidos(buy_order);
CREATE INDEX IF NOT EXISTS idx_pedidos_estado ON pedidos(estado);
CREATE INDEX IF NOT EXISTS idx_pedidos_cliente_email ON pedidos(cliente_email);
CREATE INDEX IF NOT EXISTS idx_pedidos_created_at ON pedidos(created_at DESC);

-- 3. Habilitar Row Level Security (RLS)
ALTER TABLE pedidos ENABLE ROW LEVEL SECURITY;

-- Política de lectura y escritura para el backend (Service Role)
CREATE POLICY "Permitir acceso total al service role"
ON pedidos
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Política para que el cliente pueda consultar su pedido por buy_order (para el voucher)
CREATE POLICY "Permitir lectura publica por buy_order"
ON pedidos
FOR SELECT
TO anon
USING (true);
