import os

pages = [
    {
        "file": "babyshower.html",
        "title": "Baby Shower",
        "subtitle": "Kits delicados con juegos, decoración y accesorios en tonos pastel.",
        "products": [
            {"name": "Kit de Juegos", "desc": "Juegos impresos listos para la diversión."},
            {"name": "Banderín Baby", "desc": "Banderines con el nombre del bebé."},
            {"name": "Cajas de Recuerdo", "desc": "Cajitas decoradas para los invitados."},
            {"name": "Marco de Fotos", "desc": "Marco gigante para fotos divertidas."}
        ]
    },
    {
        "file": "adultos.html",
        "title": "Fiestas de 15 y Adultos",
        "subtitle": "Marcos para fotos, Props divertidos y decoración elegante.",
        "products": [
            {"name": "Props Divertidos", "desc": "Letreros y accesorios para fotos."},
            {"name": "Marco Gigante", "desc": "Marco de fotos personalizado."},
            {"name": "Centros de Mesa", "desc": "Centros de mesa elegantes."},
            {"name": "Letras 3D", "desc": "Letras gigantes decorativas."}
        ]
    },
    {
        "file": "invitaciones.html",
        "title": "Invitaciones de Boda",
        "subtitle": "Sobres forrados, papel texturizado y diseños románticos y minimalistas.",
        "products": [
            {"name": "Invitación Clásica", "desc": "Diseño elegante con sobre forrado."},
            {"name": "Invitación Rústica", "desc": "Estilo campestre con papel kraft."},
            {"name": "Invitación Minimalista", "desc": "Líneas limpias y diseño moderno."},
            {"name": "Sellos de Lacre", "desc": "Sellos personalizados para sobres."}
        ]
    },
    {
        "file": "marcapaginas.html",
        "title": "Marcapáginas",
        "subtitle": "Ideal como recuerdo de Bautizos o Primeras Comuniones.",
        "products": [
            {"name": "Marcapáginas Floral", "desc": "Diseño con motivos florales."},
            {"name": "Marcapáginas Minimalista", "desc": "Estilo sobrio y elegante."},
            {"name": "Marcapáginas Infantil", "desc": "Diseños coloridos y divertidos."},
            {"name": "Marcapáginas Clásico", "desc": "Diseño tradicional y atemporal."}
        ]
    },
    {
        "file": "tarjetas.html",
        "title": "Tarjetas de Agradecimiento",
        "subtitle": "Notas con diseño exclusivo para enviar a los asistentes a tu evento.",
        "products": [
            {"name": "Tarjeta Elegante", "desc": "Letra cursiva y diseño formal."},
            {"name": "Tarjeta Acuarela", "desc": "Fondo con manchas de acuarela."},
            {"name": "Tarjeta Fotográfica", "desc": "Con una foto del evento."},
            {"name": "Tarjeta Simple", "desc": "Mensaje directo y diseño limpio."}
        ]
    },
    {
        "file": "bautizo.html",
        "title": "Bautizo y Primera Comunión",
        "subtitle": "Velas personalizadas, llaveros y frasquitos temáticos.",
        "products": [
            {"name": "Velas Decoradas", "desc": "Velas con nombre y fecha."},
            {"name": "Llaveros de Ángel", "desc": "Llaveros metálicos de recuerdo."},
            {"name": "Frasquitos Agua Bendita", "desc": "Frascos de vidrio personalizados."},
            {"name": "Rosarios Pequeños", "desc": "Minirrosarios de obsequio."}
        ]
    },
    {
        "file": "souvenirs.html",
        "title": "Souvenirs de Boda",
        "subtitle": "Detalles útiles y elegantes para agradecer a tus invitados.",
        "products": [
            {"name": "Suculentas", "desc": "Pequeñas plantas en maceta decorada."},
            {"name": "Jabones Artesanales", "desc": "Jabones perfumados personalizados."},
            {"name": "Miel Orgánica", "desc": "Frasquitos de miel con etiqueta."},
            {"name": "Abrebotellas", "desc": "Abrebotellas metálico grabado."}
        ]
    },
    {
        "file": "corporativo.html",
        "title": "Regalos Corporativos",
        "subtitle": "Kits con branding para celebraciones de fin de año o aniversarios.",
        "products": [
            {"name": "Mug Personalizado", "desc": "Taza con logo de la empresa."},
            {"name": "Libreta Ejecutiva", "desc": "Libreta de cuero con grabado."},
            {"name": "Bolígrafo Metálico", "desc": "Lápiz de alta calidad con logo."},
            {"name": "Kit de Bienvenida", "desc": "Caja sorpresa para nuevos empleados."}
        ]
    }
]

template = """<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Inkly – {title}</title>
  <meta name="description" content="{subtitle}" />
  <meta property="og:title" content="Inkly – {title}" />
  <meta property="og:description" content="{subtitle}" />
  <meta property="og:image" content="assets/images/logo.webp" />
  <meta property="og:type" content="website" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Playfair+Display:wght@600;700&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="assets/css/style.css" />
  <link rel="icon" type="image/png" href="assets/images/logob.png" />
  <!-- Google tag (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-V15F1C2BH5"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){{dataLayer.push(arguments);}}
    gtag('js', new Date());
    gtag('config', 'G-V15F1C2BH5');
  </script>

  <!-- Vercel Web Analytics -->
  <script>
    window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };
  </script>
  <script defer src="/_vercel/insights/script.js"></script>
</head>
<body>
  <header class="navbar">
    <div class="container nav-inner">
      <a href="javascript:history.back()" class="back-btn" title="Volver">&#8592;</a>
      <a href="/" class="logo">
        <span class="logo-text">Inkly</span>
      </a>
      <button class="nav-toggle" id="navToggle" aria-label="Menú"><span></span><span></span><span></span></button>
      <nav class="nav-links">
        <div class="nav-indicator"></div>
        <a href="/#inicio" class="nav-item">Inicio</a>
        <a href="catalog.html" class="nav-item">Catálogo</a>
        <a href="/#como-funciona" class="nav-item">Cómo Funciona</a>
        <a href="/#contacto" class="nav-item">Contacto</a>
        <div class="search-container">
          <input type="text" class="search-input" id="globalSearch" placeholder="Buscar..." autocomplete="off" />
          <div class="search-dropdown" id="searchDropdown"></div>
        </div>
        <button class="theme-toggle" id="themeToggle" aria-label="Cambiar tema"><span class="icon-sun">☀️</span><span class="icon-moon">🌙</span></button>
      </nav>
      <a href="/#cotizacion" class="btn btn-primary">Cotizar Proyecto</a>
    </div>
  </header>

  <!-- Hero -->
  <section class="hero" style="padding: 3rem 0;">
    <div class="container" style="text-align:center;">
      <h1>{title}</h1>
      <p class="subtitle" style="margin: 1rem 0;">Selecciona los productos que quieres incluir en tu cotización.</p>
      <a href="catalog.html" class="btn btn-cta">Volver al Catálogo</a>
    </div>
  </section>

  <!-- Productos -->
  <section class="catalog-section">
    <div class="container">
      <h2 class="section-title catalog-section-title">{title}</h2>
      <div class="product-grid">
{products_html}
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer id="contacto" class="footer">
    <div class="container footer-inner">
      <div class="footer-links">
        <a href="/#inicio">Inicio</a>
        <a href="catalog.html">Catálogo</a>
        <a href="/#como-funciona">Cómo Funciona</a>
        <a href="/#cotizacion">Cotizar</a>
      </div>
      <div class="social">
        <a href="https://www.instagram.com/inkly_cotillon" target="_blank"><img src="https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg" alt="Instagram" class="social-icon" /></a>
        <a href="https://www.facebook.com/inkly.cotillon" target="_blank"><img src="https://upload.wikimedia.org/wikipedia/commons/b/b8/2021_Facebook_icon.svg" alt="Facebook" class="social-icon" /></a>
      </div>
      <p class="credit">© 2026 Inkly – Temuco, Chile. Envíos a todo Chile.</p>
    </div>
  </footer>

  <!-- Floating Cart -->
  <a href="/#cotizacion" class="floating-cart" id="floatingCart" style="display: none;">
    <span class="cart-icon">🛍️</span><span class="cart-count" id="cartCount">0</span><span class="cart-text">Ver Cotización</span>
  </a>
  <!-- Cart Drawer -->
  <div class="cart-drawer-overlay" id="cartDrawerOverlay"></div>
  <div class="cart-drawer" id="cartDrawer">
    <div class="cart-drawer-header">
      <h3>Tu Cotización</h3>
      <button class="close-drawer" id="closeDrawer">&times;</button>
    </div>
    <div class="cart-drawer-body" id="cartDrawerBody">
      <p style="text-align: center; color: var(--color-muted); margin-top:2rem;">No has agregado productos.</p>
    </div>
    <div class="cart-drawer-footer">
      <a href="/#cotizacion" class="btn btn-primary" style="width:100%; text-align:center;">Ir al Formulario</a>
    </div>
  </div>
  <script type="module" src="assets/js/animations.js"></script>
  <a href="https://wa.me/56966932414?text=Hola%20Inkly!" class="floating-whatsapp" id="floatingWhatsapp" target="_blank" aria-label="WhatsApp"><svg viewBox="0 0 24 24" width="30" height="30" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg></a>
  <script src="assets/js/main.js"></script>
</body>
</html>"""

def get_product_html(prod):
    return f"""        <div class="card">
          <h3>{prod['name']}</h3>
          <p>{prod['desc']}</p>
          <button class="btn btn-add-cart" data-name="{prod['name']}">Agregar a Cotización</button>
        </div>"""

for page in pages:
    products_html = "\n".join([get_product_html(p) for p in page["products"]])
    content = template.format(title=page["title"], subtitle=page["subtitle"], products_html=products_html)
    with open(f"C:\\Users\\juako\\.gemini\\antigravity\\scratch\\inkly-website\\{page['file']}", "w", encoding="utf-8") as f:
        f.write(content)
