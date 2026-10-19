// Endpoint para confirmar (commit) la transacción con Transbank y redirigir al voucher
export default async function handler(req, res) {
  try {
    // Procesar cuerpo de la petición (POST form-urlencoded o JSON) o parámetros GET
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {
        const params = new URLSearchParams(body);
        body = Object.fromEntries(params.entries());
      }
    }

    const tokenWs = body?.token_ws || req.query?.token_ws;
    const tbkToken = body?.TBK_TOKEN || req.query?.TBK_TOKEN;

    // Caso 1: El usuario canceló la compra en la pantalla de Webpay
    if (tbkToken && !tokenWs) {
      console.warn('Transacción anulada por el usuario en Webpay');
      res.writeHead(302, { Location: '/voucher.html?status=aborted' });
      return res.end();
    }

    // Caso 2: Petición inválida sin token
    if (!tokenWs) {
      console.error('Petición recibida sin token_ws');
      res.writeHead(302, { Location: '/voucher.html?status=invalid' });
      return res.end();
    }

    // Configuración de credenciales de Transbank
    const isProduction = !!(process.env.TBK_COMMERCE_CODE && process.env.TBK_API_KEY && process.env.TBK_ENV === 'production');

    const COMMERCE_CODE = isProduction 
      ? process.env.TBK_COMMERCE_CODE 
      : '597055555532';

    const API_KEY = isProduction 
      ? process.env.TBK_API_KEY 
      : '579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C';

    const TBK_BASE_URL = isProduction
      ? 'https://webpay3g.transbank.cl'
      : 'https://webpay3gint.transbank.cl';

    // Llamada de confirmación (Commit) a Transbank
    const commitResponse = await fetch(`${TBK_BASE_URL}/rswebpaytransaction/api/webpay/v1.0/transactions/${tokenWs}`, {
      method: 'PUT',
      headers: {
        'Tbk-Api-Key-Id': COMMERCE_CODE,
        'Tbk-Api-Key-Secret': API_KEY,
        'Content-Type': 'application/json'
      }
    });

    const commitData = await commitResponse.json();

    // Caso 3: Transacción aprobada con éxito
    if (commitResponse.ok && commitData.response_code === 0 && commitData.status === 'AUTHORIZED') {
      const params = new URLSearchParams({
        status: 'success',
        buy_order: commitData.buy_order || '',
        authorization_code: commitData.authorization_code || '',
        amount: commitData.amount || '',
        payment_type: commitData.payment_type_code || '',
        card: commitData.card_detail?.card_number || '',
        date: commitData.transaction_date || '',
        installments: commitData.installments_number || '0'
      });

      res.writeHead(302, { Location: `/voucher.html?${params.toString()}` });
      return res.end();
    }

    // Caso 4: Transacción rechazada por el banco (fondos insuficientes, clave errónea, etc.)
    const rejectParams = new URLSearchParams({
      status: 'rejected',
      buy_order: commitData.buy_order || '',
      code: String(commitData.response_code ?? 'REJ')
    });

    res.writeHead(302, { Location: `/voucher.html?${rejectParams.toString()}` });
    return res.end();

  } catch (error) {
    console.error('Error procesando confirmación de Webpay:', error);
    res.writeHead(302, { Location: '/voucher.html?status=error' });
    return res.end();
  }
}
