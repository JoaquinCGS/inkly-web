import { supabase } from './lib/supabase.js';

// Endpoint para crear la transacción en Transbank Webpay Plus
export default async function handler(req, res) {
  // Configuración CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-CSRF-Token');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido. Solo POST.' });
  }

  try {
    const payload = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    const { cart, paymentType = 'total', deliveryDate = '' } = payload;

    if (!Array.isArray(cart) || cart.length === 0) {
      return res.status(400).json({ error: 'El carrito está vacío.' });
    }

    // Calcular y validar el total en el servidor para evitar manipulaciones
    let totalCalculado = 0;
    for (const item of cart) {
      const price = Number(item.price) || 0;
      const quantity = Number(item.quantity) || 1;
      if (price > 0 && quantity > 0) {
        totalCalculado += (price * quantity);
      }
    }

    if (totalCalculado <= 0) {
      return res.status(400).json({ error: 'El monto total no es válido.' });
    }

    // Determinar si se cobra el 100% o el 50% de abono
    const isAbono = paymentType === 'abono';
    const amount = isAbono ? Math.round(totalCalculado / 2) : totalCalculado;

    if (amount < 50) {
      return res.status(400).json({ error: 'El monto mínimo de pago es $50 CLP.' });
    }

    // Configuración de Transbank (Producción si existen variables, de lo contrario Integración/Pruebas)
    const isProduction = !!(process.env.TBK_COMMERCE_CODE && process.env.TBK_API_KEY && process.env.TBK_ENV === 'production');

    const COMMERCE_CODE = isProduction 
      ? process.env.TBK_COMMERCE_CODE 
      : '597055555532'; // Código oficial de pruebas Transbank

    const API_KEY = isProduction 
      ? process.env.TBK_API_KEY 
      : '579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C'; // API Key oficial de pruebas Transbank

    const TBK_BASE_URL = isProduction
      ? 'https://webpay3g.transbank.cl'
      : 'https://webpay3gint.transbank.cl';

    // Construir la URL de retorno dinámica según el dominio actual
    const protocol = req.headers['x-forwarded-proto'] || 'https';
    const host = req.headers['x-forwarded-host'] || req.headers.host || 'inkly.cl';
    const returnUrl = `${protocol}://${host}/api/webpay-confirmar`;

    // Generar Orden de Compra y Sesión únicas (máximo 26 y 61 caracteres)
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.floor(1000 + Math.random() * 9000);
    const buyOrder = `INK-${timestamp}-${random}`;
    const sessionId = `SES-${timestamp}-${random}`;

    // Llamada a Transbank para crear la transacción
    const tbkResponse = await fetch(`${TBK_BASE_URL}/rswebpaytransaction/api/webpay/v1.0/transactions`, {
      method: 'POST',
      headers: {
        'Tbk-Api-Key-Id': COMMERCE_CODE,
        'Tbk-Api-Key-Secret': API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        buy_order: buyOrder,
        session_id: sessionId,
        amount: amount,
        return_url: returnUrl
      })
    });

    const tbkData = await tbkResponse.json();

    if (!tbkResponse.ok || !tbkData.token || !tbkData.url) {
      console.error('Error al iniciar Webpay con Transbank:', tbkData);
      return res.status(502).json({ 
        error: 'No se pudo iniciar la transacción con Webpay.', 
        details: tbkData 
      });
    }

    // Registrar pedido pendiente en la base de datos Supabase
    if (supabase) {
      try {
        const { error: dbError } = await supabase.from('pedidos').insert({
          buy_order: buyOrder,
          session_id: sessionId,
          cliente_nombre: payload.nombre || payload.customer?.name || 'Cliente Web',
          cliente_email: payload.email || payload.customer?.email || '',
          cliente_telefono: payload.telefono || payload.customer?.phone || '',
          cliente_direccion: payload.direccion || payload.customer?.address || '',
          fecha_entrega: deliveryDate || '',
          items: cart,
          monto_total: totalCalculado,
          tipo_pago: isAbono ? 'abono' : 'total',
          monto_pagado: amount,
          saldo_pendiente: isAbono ? (totalCalculado - amount) : 0,
          estado: 'PENDIENTE',
          tbk_token: tbkData.token
        });

        if (dbError) {
          console.error('Error registrando pedido en Supabase:', dbError);
        } else {
          console.log(`Pedido ${buyOrder} guardado en Supabase como PENDIENTE.`);
        }
      } catch (dbErr) {
        console.error('Excepción al conectar con Supabase en webpay-crear:', dbErr);
      }
    }

    // Responder con los datos necesarios para redirigir al cliente
    return res.status(200).json({
      success: true,
      url: tbkData.url,
      token: tbkData.token,
      buyOrder: buyOrder,
      amount: amount,
      paymentType: isAbono ? 'Abono 50%' : 'Total 100%',
      deliveryDate: deliveryDate
    });

  } catch (error) {
    console.error('Error interno en webpay-crear:', error);
    return res.status(500).json({ error: 'Error interno del servidor procesando el pago.' });
  }
}
