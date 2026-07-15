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
  <title>Inkly – Productos para {title}</title>
  <meta name="description" content="Catálogo de productos de {title}." />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Playfair+Display:wght@600;700&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="assets/css/style.css" />
  <style>
    .catalog-section {{
      padding: 4rem 0;
      background: var(--color-bg);
    }}
    .catalog-section-title {{
      text-align: center;
      margin-bottom: 2.5rem;
      color: var(--color-primary);
    }}
    .product-grid {{
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
    }}
  </style>
</head>
<body>
  <!-- Header / Navbar -->
  <header class="navbar">
    <div class="container nav-inner">
      <a href="index.html" class="logo">
        <img src="assets/images/logo.jpg" alt="Inkly" style="height: 50px; border-radius: 8px; object-fit: contain;" />
      </a>
      <nav class="nav-links">
        <a href="index.html#inicio">Inicio</a>
        <a href="catalog.html">Catálogo</a>
        <a href="index.html#como-funciona">Cómo Funciona</a>
        <a href="index.html#contacto">Contacto</a>
      </nav>
      <a href="index.html#cotizacion" class="btn btn-primary">Cotizar Proyecto</a>
    </div>
  </header>

  <!-- Hero -->
  <section class="hero" style="background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%); color:#fff; padding: 3rem 0;">
    <div class="container hero-inner" style="flex-direction:column; text-align:center;">
      <h1 style="font-size: 2.5rem;">{title}</h1>
      <p class="subtitle" style="margin-bottom:1rem; font-size: 1.1rem;">Selecciona los productos que quieres incluir en tu cotización.</p>
      <a href="catalog.html" class="btn btn-primary">Volver al Catálogo</a>
    </div>
  </section>

  <!-- SECCIÓN: Productos -->
  <section class="catalog-section">
    <div class="container">
      <div class="product-grid">
{products_html}
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="footer">
    <div class="container footer-inner">
      <div class="footer-links">
        <a href="index.html#inicio">Inicio</a>
        <a href="catalog.html">Catálogo</a>
        <a href="index.html#como-funciona">Cómo Funciona</a>
        <a href="index.html#cotizacion">Cotizar</a>
      </div>
      <div class="social">
        <a href="https://www.instagram.com/inkly_cotillon" target="_blank" aria-label="Instagram">
          <img src="https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg" alt="Instagram" class="social-icon" />
        </a>
        <a href="https://www.facebook.com/inkly.cotillon" target="_blank" aria-label="Facebook">
          <img src="https://upload.wikimedia.org/wikipedia/commons/b/b8/2021_Facebook_icon.svg" alt="Facebook" class="social-icon" />
        </a>
      </div>
      <p class="credit">© 2026 Inkly – Temuco, Chile. Envíos a todo Chile.</p>
    </div>
  </footer>

  <!-- Floating Cart Button -->
  <a href="index.html#cotizacion" class="floating-cart" id="floatingCart" style="display: none;">
    <span class="cart-icon">🛍️</span>
    <span class="cart-count" id="cartCount">0</span>
    <span class="cart-text">Ver Cotización</span>
  </a>

  <script src="assets/js/main.js"></script>
</body>
</html>"""

def get_product_html(prod):
    return f"""        <div class="card">
          <!-- Cuadrado blanco como solicitó el usuario -->
          <img src="https://via.placeholder.com/400x300/ffffff/cccccc?text=+" alt="{prod['name']}" loading="lazy" style="border: 1px solid #eee;" />
          <h3>{prod['name']}</h3>
          <p>{prod['desc']}</p>
          <button class="btn btn-add-cart" data-name="{prod['name']}">Agregar a Cotización</button>
        </div>"""

for page in pages:
    products_html = "\\n".join([get_product_html(p) for p in page["products"]])
    content = template.format(title=page["title"], products_html=products_html)
    with open(f"C:\\Users\\juako\\.gemini\\antigravity\\scratch\\inkly-website\\{page['file']}", "w", encoding="utf-8") as f:
        f.write(content)
