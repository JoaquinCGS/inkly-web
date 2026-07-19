export default async function handler(req, res) {
  // CORS Headers for edge cases, though it's on the same domain
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const payload = req.body;
  const recaptchaToken = payload['g-recaptcha-response'];
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;

  // Fail-safe: Si aún no has configurado la variable de entorno en Vercel,
  // permitimos que el formulario pase para NO ROMPER la experiencia en vivo.
  // Una vez que la configures, empezará a bloquear bots automáticamente.
  let isRecaptchaValid = true;

  if (secretKey && recaptchaToken) {
    try {
      const verifyUrl = `https://www.google.com/recaptcha/api/siteverify`;
      const verifyParams = new URLSearchParams({
        secret: secretKey,
        response: recaptchaToken
      });
      
      const verifyRes = await fetch(verifyUrl, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: verifyParams.toString()
      });
      
      const verifyData = await verifyRes.json();
      
      // reCAPTCHA v3 devuelve un score (0.0 a 1.0). 
      // 0.5 es un buen umbral estándar.
      if (!verifyData.success || verifyData.score < 0.5) {
        isRecaptchaValid = false;
        console.warn('reCAPTCHA fallido:', verifyData);
      }
    } catch (err) {
      console.error('Error verificando reCAPTCHA:', err);
    }
  } else if (secretKey && !recaptchaToken) {
    // Si la clave existe pero el bot no envió token, se bloquea.
    isRecaptchaValid = false;
  }

  if (!isRecaptchaValid) {
    return res.status(400).json({ error: 'Validación de seguridad fallida. Posible bot detectado.' });
  }

  // Eliminar el token del payload antes de enviar a Formspree para no ensuciar el correo
  delete payload['g-recaptcha-response'];

  // Enviar la información limpia a Formspree
  try {
    const formspreeUrl = 'https://formspree.io/f/mjgnvdqv';
    const formspreeRes = await fetch(formspreeUrl, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (formspreeRes.ok) {
      return res.status(200).json({ success: true, message: 'Cotización enviada exitosamente' });
    } else {
      const errorData = await formspreeRes.json();
      console.error('Error de Formspree:', errorData);
      return res.status(formspreeRes.status).json({ error: 'Error al procesar el formulario' });
    }
  } catch (error) {
    console.error('Error de conexión a Formspree:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}
