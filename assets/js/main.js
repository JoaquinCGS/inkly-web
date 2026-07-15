document.addEventListener('DOMContentLoaded', () => {
  // ---- Toast Notification ----
  function showToast(message) {
    let toast = document.getElementById('inkly-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'inkly-toast';
      toast.className = 'toast';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    
    // Si hay un timeout previo, limpiarlo para que no se oculte antes de tiempo
    if (toast.hideTimeout) clearTimeout(toast.hideTimeout);
    toast.hideTimeout = setTimeout(() => { toast.classList.remove('show'); }, 3000);
  }

  // ---- Product Carousel Logic ----
  function initCarousels() {
    const carousels = document.querySelectorAll('.product-carousel');
    carousels.forEach(carousel => {
      // Evitar reinicializar
      if (carousel.dataset.initialized) return;
      carousel.dataset.initialized = 'true';

      const track = carousel.querySelector('.carousel-track');
      const prevBtn = carousel.querySelector('.carousel-btn.prev');
      const nextBtn = carousel.querySelector('.carousel-btn.next');
      const dots = carousel.querySelectorAll('.carousel-dot');

      if (!track || !prevBtn || !nextBtn) return;

      const updateDots = () => {
        const index = Math.round(track.scrollLeft / track.clientWidth);
        dots.forEach((dot, i) => {
          dot.classList.toggle('active', i === index);
        });
      };

      track.addEventListener('scroll', () => {
        requestAnimationFrame(updateDots);
      });

      prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        track.scrollBy({ left: -track.clientWidth, behavior: 'smooth' });
      });

      nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        track.scrollBy({ left: track.clientWidth, behavior: 'smooth' });
      });
    });
  }
  
  // Initialize immediately
  initCarousels();

  // ---- Configuracion y Estado del Carrito ----
  const CART_KEY = 'inkly_cart';
  let cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];

  // Elementos UI del Catalogo
  const btnAddCartList = document.querySelectorAll('.btn-add-cart');
  const floatingCart = document.getElementById('floatingCart');
  const cartCountEl = document.getElementById('cartCount');

  // Elementos UI del Formulario de Cotizacion
  const cartContainer = document.getElementById('cartContainer');
  const cartItemsList = document.getElementById('cartItemsList');
  const inputProductosSeleccionados = document.getElementById('productosSeleccionados');

  // ---- Hamburger Menu ----
  const navToggle = document.querySelector('.nav-toggle');
  const navLinksEl = document.querySelector('.nav-links');

  if (navToggle && navLinksEl) {
    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      navToggle.classList.toggle('open');
      navLinksEl.classList.toggle('open');
    });

    // Close on link click
    navLinksEl.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        navToggle.classList.remove('open');
        navLinksEl.classList.remove('open');
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!navLinksEl.contains(e.target) && !navToggle.contains(e.target)) {
        navToggle.classList.remove('open');
        navLinksEl.classList.remove('open');
      }
    });
  }

  // ---- Navbar Sliding Indicator ----
  const navLinks = document.querySelector('.nav-links');
  const navIndicator = document.querySelector('.nav-indicator');
  const navAnchors = document.querySelectorAll('.nav-links a.nav-item');

  function updateIndicator(el) {
    if (!navIndicator || !el || !navLinks) return;
    const linkRect = el.getBoundingClientRect();
    const navRect = navLinks.getBoundingClientRect();
    navIndicator.style.left = (linkRect.left - navRect.left) + 'px';
    navIndicator.style.width = linkRect.width + 'px';
  }

  // Detect active page
  const currentFile = window.location.pathname.split('/').pop() || 'index.html';
  let activeLink = null;
  navAnchors.forEach(a => {
    const href = a.getAttribute('href').split('#')[0] || 'index.html';
    if (href === currentFile) activeLink = a;
    // Sub-pages: highlight Catalogo
    if (currentFile !== 'index.html' && currentFile !== '' && href === 'catalog.html') activeLink = a;
  });
  if (!activeLink && navAnchors.length > 0) activeLink = navAnchors[0];
  if (activeLink) {
    activeLink.classList.add('active');
    setTimeout(() => updateIndicator(activeLink), 100);
  }

  navAnchors.forEach(a => {
    a.addEventListener('mouseenter', () => updateIndicator(a));
    a.addEventListener('mouseleave', () => { if (activeLink) updateIndicator(activeLink); });
    a.addEventListener('click', () => {
      navAnchors.forEach(x => x.classList.remove('active'));
      a.classList.add('active');
      activeLink = a;
      updateIndicator(a);
    });
  });


  // ---- Funciones Generales ----

  function saveCart() {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateWhatsappLink();
  }

  function updateWhatsappLink() {
    const waBtn = document.getElementById('floatingWhatsapp');
    if (!waBtn) return;

    // Número de teléfono (se limpian los espacios y signos + automáticamente)
    let phone = "56 9 6693 2414";
    phone = phone.replace(/[^0-9]/g, '');

    let text = "Hola Inkly!";
    if (cart.length > 0) {
      text += " Me gustaría cotizar estos productos: " + cart.join(", ") + ".";
    }

    waBtn.href = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
  }

  function updateFloatingCart() {
    if (!floatingCart || !cartCountEl) return;
    if (cart.length > 0) {
      floatingCart.style.display = 'flex';
      cartCountEl.textContent = cart.length;
    } else {
      floatingCart.style.display = 'none';
    }
  }

  // ---- Logica del Catalogo ----

  if (btnAddCartList.length > 0) {
    btnAddCartList.forEach(btn => {
      const productName = btn.getAttribute('data-name');
      if (cart.includes(productName)) {
        btn.textContent = 'Agregado \u2713';
        btn.classList.add('added');
      }

      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const pName = btn.getAttribute('data-name');
        if (cart.includes(pName)) {
          cart = cart.filter(item => item !== pName);
          btn.textContent = 'Agregar a Cotización';
          btn.classList.remove('added');
          showToast("❌ " + pName + " quitado del carrito");
        } else {
          cart.push(pName);
          btn.textContent = 'Agregado ✓';
          btn.classList.add('added');
          showToast("🛒 " + pName + " agregado al carrito");
        }
        saveCart();
        updateFloatingCart();
      });
    });
  }

  // ---- Logica del Formulario de Cotizacion ----

  function renderCartInForm() {
    if (!cartContainer || !cartItemsList || !inputProductosSeleccionados) return;
    cartItemsList.innerHTML = '';
    if (cart.length > 0) {
      cartContainer.style.display = 'block';
      inputProductosSeleccionados.value = cart.join(', ');
      cart.forEach((item, index) => {
        const li = document.createElement('li');
        li.textContent = item;
        const removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.className = 'btn-remove-item';
        removeBtn.innerHTML = '&times;';
        removeBtn.title = 'Quitar';
        removeBtn.onclick = () => { removeFromCart(index); };
        li.appendChild(removeBtn);
        cartItemsList.appendChild(li);
      });
    } else {
      cartContainer.style.display = 'none';
      inputProductosSeleccionados.value = '';
    }
  }

  function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
    renderCartInForm();
    updateFloatingCart();
  }

  // ---- Modal Personalizado (Reemplaza a alert) ----
  function showCustomAlert(title, message, isSuccess = true) {
    const overlay = document.createElement('div');
    overlay.className = 'custom-modal-overlay';
    
    const icon = isSuccess ? '&#10004;' : '&#10006;';
    const iconClass = isSuccess ? 'success' : 'error';
    
    overlay.innerHTML = `
      <div class="custom-modal-box">
        <div class="custom-modal-icon ${iconClass}">${icon}</div>
        <h3 class="custom-modal-title">${title}</h3>
        <p class="custom-modal-msg">${message}</p>
        <button class="custom-modal-btn">Aceptar</button>
      </div>
    `;
    
    document.body.appendChild(overlay);
    
    // Forzar reflow para que la animación funcione
    requestAnimationFrame(() => {
      overlay.classList.add('active');
    });
    
    // Cerrar modal
    const closeBtn = overlay.querySelector('.custom-modal-btn');
    const close = () => {
      overlay.classList.remove('active');
      setTimeout(() => overlay.remove(), 300);
    };
    closeBtn.addEventListener('click', close);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) close();
    });
  }

  // ---- Envio de Formulario con AJAX (Formspree) ----
  const quoteForm = document.getElementById('quote-form');
  if (quoteForm) {
    quoteForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = quoteForm.querySelector('.submit-btn');
      const originalText = submitBtn.textContent;
      
      submitBtn.textContent = 'Enviando...';
      submitBtn.disabled = true;
      
      const formData = new FormData(quoteForm);
      
      try {
        const response = await fetch(quoteForm.action, {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
        });
        
        if (response.ok) {
          showCustomAlert('¡Gracias!', 'Tu solicitud ha sido enviada con éxito. Te contactaremos pronto.', true);
          quoteForm.reset();
          cart = [];
          saveCart();
          renderCartInForm();
          updateFloatingCart();
        } else {
          showCustomAlert('Ups...', 'Hubo un problema al enviar la solicitud. Por favor intenta de nuevo.', false);
        }
      } catch (error) {
        showCustomAlert('Error de conexión', 'Revisa tu internet e intenta nuevamente.', false);
      }
      
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    });
  }

  // ---- Inicializacion ----
  updateFloatingCart();
  renderCartInForm();
  updateWhatsappLink();

  // ---- Animaciones al hacer Scroll (Fade In) ----
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };
  const cardObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in-visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  document.querySelectorAll('.card, .cat-card, .category-card').forEach(card => {
    cardObserver.observe(card);
  });

  // ---- Lightbox (Ampliación de Imágenes) ----
  const productImages = document.querySelectorAll('.card:not(.category-card) img, .cat-card img');
  productImages.forEach(img => {
    img.addEventListener('click', (e) => {
      // Evitar que el clic en la imagen active otros enlaces
      e.preventDefault();
      
      let imageArray = [img];
      let currentIndex = 0;
      
      const track = img.closest('.carousel-track');
      if (track) {
        imageArray = Array.from(track.querySelectorAll('img'));
        currentIndex = imageArray.indexOf(img);
      }

      const overlay = document.createElement('div');
      overlay.className = 'lightbox-overlay';
      
      let navButtons = '';
      if (imageArray.length > 1) {
        navButtons = `
          <button class="lightbox-btn prev">&lt;</button>
          <button class="lightbox-btn next">&gt;</button>
        `;
      }
      
      overlay.innerHTML = `
        <button class="lightbox-close" aria-label="Cerrar">&times;</button>
        ${navButtons}
        <img src="${img.src}" alt="${img.alt}" class="lightbox-img" />
      `;
      
      document.body.appendChild(overlay);
      
      const lightboxImg = overlay.querySelector('.lightbox-img');
      
      // Funciones de navegación
      if (imageArray.length > 1) {
        const updateImage = () => {
          lightboxImg.src = imageArray[currentIndex].src;
          lightboxImg.alt = imageArray[currentIndex].alt;
        };
        
        overlay.querySelector('.lightbox-btn.prev').addEventListener('click', (ev) => {
          ev.stopPropagation();
          currentIndex = (currentIndex > 0) ? currentIndex - 1 : imageArray.length - 1;
          updateImage();
        });
        
        overlay.querySelector('.lightbox-btn.next').addEventListener('click', (ev) => {
          ev.stopPropagation();
          currentIndex = (currentIndex < imageArray.length - 1) ? currentIndex + 1 : 0;
          updateImage();
        });
      }

      // Animar entrada
      requestAnimationFrame(() => {
        overlay.classList.add('active');
      });
      
      // Cerrar
      const closeLightbox = () => {
        overlay.classList.remove('active');
        setTimeout(() => overlay.remove(), 300);
      };
      
      overlay.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
      overlay.addEventListener('click', (ev) => {
        if (ev.target === overlay) closeLightbox();
      });
    });
  });

  // ---- Filtros del Catálogo Principal (catalog.html) ----
  const catalogFilterBtns = document.querySelectorAll('.filter-btn');
  const catalogSections = document.querySelectorAll('.catalog-section');
  
  if (catalogFilterBtns.length > 0) {
    catalogFilterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        catalogFilterBtns.forEach(b => {
          b.classList.remove('active');
          b.style.background = 'transparent';
          b.style.color = 'var(--color-text)';
        });
        btn.classList.add('active');
        btn.style.background = 'var(--color-primary)';
        btn.style.color = '#fff';
        
        const filterValue = btn.getAttribute('data-filter');
        catalogSections.forEach(section => {
          if (filterValue === 'all' || section.id === filterValue) {
            section.style.display = 'block';
            setTimeout(() => section.style.opacity = '1', 50);
          } else {
            section.style.opacity = '0';
            setTimeout(() => section.style.display = 'none', 300);
          }
        });
      });
    });
  }

  // ---- Filtros Dinámicos para Subpáginas de Productos ----
  // Buscamos si hay múltiples grillas de productos en esta página (ej: cumpleaños.html)
  const productGrids = document.querySelectorAll('.product-grid');
  if (productGrids.length > 1) { 
    const productsContainer = productGrids[0].parentElement;
    
    // Crear contenedor de filtros
    const filtersDiv = document.createElement('div');
    filtersDiv.className = 'catalog-filters';
    filtersDiv.style.display = 'flex';
    filtersDiv.style.justifyContent = 'center';
    filtersDiv.style.flexWrap = 'wrap';
    filtersDiv.style.gap = '10px';
    filtersDiv.style.marginBottom = '3rem';
    
    // Botón "Todos"
    const btnAll = document.createElement('button');
    btnAll.className = 'filter-btn active';
    btnAll.innerText = 'Todos';
    btnAll.style = 'padding: 0.6rem 1.2rem; border-radius: 30px; border: 2px solid var(--color-primary); background: var(--color-primary); color: #fff; font-weight: 600; cursor: pointer; transition: 0.3s;';
    filtersDiv.appendChild(btnAll);
    
    const filterButtons = [btnAll];
    const sections = [];
    
    // Iterar sobre cada grilla para obtener su título superior
    productGrids.forEach((grid, index) => {
      const title = grid.previousElementSibling;
      if (title && title.tagName === 'H2') {
        const titleText = title.innerText;
        sections.push({ title, grid });
        
        const btn = document.createElement('button');
        btn.className = 'filter-btn';
        btn.innerText = titleText;
        btn.style = 'padding: 0.6rem 1.2rem; border-radius: 30px; border: 2px solid var(--color-primary); background: transparent; color: var(--color-text); font-weight: 600; cursor: pointer; transition: 0.3s;';
        filtersDiv.appendChild(btn);
        filterButtons.push(btn);
        
        // Lógica de clic
        btn.addEventListener('click', () => {
          filterButtons.forEach(b => {
            b.classList.remove('active');
            b.style.background = 'transparent';
            b.style.color = 'var(--color-text)';
          });
          btn.classList.add('active');
          btn.style.background = 'var(--color-primary)';
          btn.style.color = '#fff';
          
          sections.forEach(sec => {
            if (sec.title === title) {
              sec.title.style.display = 'block';
              sec.grid.style.display = 'grid';
              setTimeout(() => { sec.title.style.opacity = '1'; sec.grid.style.opacity = '1'; }, 50);
            } else {
              sec.title.style.opacity = '0';
              sec.grid.style.opacity = '0';
              setTimeout(() => { sec.title.style.display = 'none'; sec.grid.style.display = 'none'; }, 300);
            }
          });
        });
      }
    });
    
    // Lógica para botón "Todos"
    btnAll.addEventListener('click', () => {
      filterButtons.forEach(b => {
        b.classList.remove('active');
        b.style.background = 'transparent';
        b.style.color = 'var(--color-text)';
      });
      btnAll.classList.add('active');
      btnAll.style.background = 'var(--color-primary)';
      btnAll.style.color = '#fff';
      
      sections.forEach(sec => {
        sec.title.style.display = 'block';
        sec.grid.style.display = 'grid'; 
        setTimeout(() => { sec.title.style.opacity = '1'; sec.grid.style.opacity = '1'; }, 50);
      });
    });
    
    // Insertar los filtros justo antes del primer título
    productsContainer.insertBefore(filtersDiv, sections[0].title);
    
    // Asegurar transiciones
    sections.forEach(sec => {
      sec.title.style.transition = 'opacity 0.3s ease';
      sec.grid.style.transition = 'opacity 0.3s ease';
    });
  }

  // Scroll reveal
  const reveals = document.querySelectorAll('[data-reveal]');
  const revealOnScroll = () => {
    for (let i = 0; i < reveals.length; i++) {
      const windowHeight = window.innerHeight;
      const elementTop = reveals[i].getBoundingClientRect().top;
      if (elementTop < windowHeight - 100) {
        reveals[i].classList.add('revealed');
      }
    }
  };
  window.addEventListener('scroll', revealOnScroll);
  revealOnScroll();
  // =========================================
  // FUNCIONALIDADES AVANZADAS (Drawer, Theme, Search)
  // =========================================

  // ---- Modo Oscuro ----
  const themeToggle = document.getElementById('themeToggle');
  const currentTheme = localStorage.getItem('theme');
  
  if (currentTheme === 'dark') {
    document.body.setAttribute('data-theme', 'dark');
    if (themeToggle) themeToggle.innerText = '☀️';
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      let theme = document.body.getAttribute('data-theme');
      if (theme === 'dark') {
        document.body.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
        themeToggle.innerText = '🌙';
      } else {
        document.body.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        themeToggle.innerText = '☀️';
      }
    });
  }

  // ---- Buscador Global con Autocompletado ----
  const globalSearchIndex = [
    {"title":"Pack 3 juegos con lápiz","url":"babyshower.html","image":"assets/images/Pack3juegosconlapizfuera.jpeg"},
    {"title":"Raspe \"Encuentra a mamá/papá\"","url":"babyshower.html","image":"assets/images/RaspeEncuentraamamapapaafuera.jpeg"},
    {"title":"Adivina la medida de la pancita","url":"babyshower.html","image":"assets/images/Adivinalamedidadelapancita.jpeg"},
    {"title":"Banderín + 1 nombre","url":"babyshower.html","image":"assets/images/Banderin1nombre.jpg"},
    {"title":"Velita buenos deseos","url":"babyshower.html","image":"assets/images/Velitabuenosdeseosfuera.jpg"},
    {"title":"Burbujas Personalizadas","url":"bautizo.html","image":"assets/images/burbujas1.jpg"},
    {"title":"Denarios tarjeta normal","url":"bautizo.html","image":"assets/images/Denariostarjetanormal.jpeg"},
    {"title":"Denarios tarjeta imantada","url":"bautizo.html","image":"assets/images/Denariostarjetaimantada.jpeg"},
    {"title":"Llavero angelito perlas","url":"bautizo.html","image":"assets/images/llaveroangelitoperlas.jpeg"},
    {"title":"Llavero osito acrílico","url":"bautizo.html","image":"assets/images/Llaveroositoacrilico.jpeg"},
    {"title":"Llavero osito metal","url":"bautizo.html","image":"assets/images/llaveroositometal.jpg"},
    {"title":"Bolsa 1 + minilibrito 6 img","url":"combos.html","image":"assets/images/Bolsa1minilibrito6imgfuera.jpeg"},
    {"title":"Bolsa 2 + librito 16 img","url":"combos.html","image":"assets/images/bolsa2librito16imgfuera.jpeg"},
    {"title":"Bolsa 3 + mini librito 6 img","url":"combos.html","image":"assets/images/Bolsa3minilibrito6imgfuera.jpeg"},
    {"title":"Bolsa solapa + mini librito 6 img","url":"combos.html","image":"assets/images/bolsasolapaminilibrito6imgfuera.jpeg"},
    {"title":"Caja milk + mini librito 6 img","url":"combos.html","image":"assets/images/cajamilkminilibrito6imgfuera.jpeg"},
    {"title":"Cajita milk + librito 16 img","url":"combos.html","image":"assets/images/cajitamilklibrito16imgfuera.jpeg"},
    {"title":"Caja dulcera grande","url":"cumpleanos.html","image":"assets/images/cajadulceragrande.jpeg"},
    {"title":"Caja dulcera mediana","url":"cumpleanos.html","image":"assets/images/cajadulceramediana.jpeg"},
    {"title":"Caja milk box","url":"cumpleanos.html","image":"assets/images/cajamilkbox.jpeg"},
    {"title":"Caja tipo almohada","url":"cumpleanos.html","image":"assets/images/cajatipoalmohada.jpeg"},
    {"title":"Caja maleta","url":"cumpleanos.html","image":"assets/images/cajamaleta.jpeg"},
    {"title":"Bolsa dulcera","url":"cumpleanos.html","image":"assets/images/bolsadulcera.jpeg"},
    {"title":"Bolsa tipo craft","url":"cumpleanos.html","image":"assets/images/bolsatipocraft.jpeg"},
    {"title":"Caja milk box visor pequeña","url":"cumpleanos.html","image":"assets/images/cajamilkboxvisorpequena.jpeg"},
    {"title":"Caja milk box visor grande","url":"cumpleanos.html","image":"assets/images/cajamilkboxvisorgrande.jpeg"},
    {"title":"Letra 3D","url":"cumpleanos.html","image":"assets/images/Letra3D.jpeg"},
    {"title":"Letra shaker","url":"cumpleanos.html","image":"assets/images/lettrashaker.jpg"},
    {"title":"Banderín tradicional","url":"cumpleanos.html","image":"assets/images/banderintradicional.jpeg"},
    {"title":"Topper grande simple","url":"cumpleanos.html","image":"assets/images/toppergrandesimple.jpeg"},
    {"title":"Topper shaker mediano","url":"cumpleanos.html","image":"assets/images/toppershakermediano.jpeg"},
    {"title":"Topper shaker grande","url":"cumpleanos.html","image":"assets/images/toppershakergrande.jpeg"},
    {"title":"Llaverito burbuja","url":"cumpleanos.html","image":"assets/images/llaveritoburbuja.jpeg"},
    {"title":"Llavero acrílico con shaker","url":"cumpleanos.html","image":"assets/images/llaveroacrilicoconshaker.jpeg"},
    {"title":"Etiquetas de botellas","url":"cumpleanos.html","image":"assets/images/etiquetasdebotellas.jpeg"},
    {"title":"Stickers monedas de chocolate","url":"cumpleanos.html","image":"assets/images/stickersmonedasdechocolate.jpeg"},
    {"title":"Cierra bolsa","url":"cumpleanos.html","image":"assets/images/cierrabolsa.jpeg"},
    {"title":"Invitaciones Normales","url":"invitaciones.html","image":"assets/images/Invitacionesnormales.jpeg"},
    {"title":"Invitaciones Digitales","url":"invitaciones.html","image":"assets/images/Invitacionesdigitales.jpeg"},
    {"title":"Invitaciones tipo Ticket","url":"invitaciones.html","image":"assets/images/invitacionestipoticket.jpeg"},
    {"title":"Invitaciones Pasaporte","url":"invitaciones.html","image":"assets/images/invitacionespasaporte.jpeg"},
    {"title":"Marcapáginas simples","url":"marcapaginas.html","image":"assets/images/Marcapaginassimples.jpeg"},
    {"title":"Marcapáginas plastificados","url":"marcapaginas.html","image":"assets/images/Marcapaginasplastificados.jpeg"},
    {"title":"Marcapáginas magnéticos","url":"marcapaginas.html","image":"assets/images/Marcapaginasmagneticos.jpeg"},
    {"title":"Mini burbujas","url":"souvenirs.html","image":"assets/images/Miniburbujas.jpeg"},
    {"title":"Imantados","url":"souvenirs.html","image":"assets/images/Imantados.jpeg"},
    {"title":"Imán estilo polaroid","url":"souvenirs.html","image":"assets/images/Imanestilopolaroid.jpeg"},
    {"title":"Velas pirámide o tarjeta","url":"souvenirs.html","image":"assets/images/velaspiramideotarjeta.jpeg"},
    {"title":"Denarios tarjeta normal","url":"souvenirs.html","image":"assets/images/Denariostarjetanormal.jpeg"},
    {"title":"Denarios tarjeta imantada","url":"souvenirs.html","image":"assets/images/Denariostarjetaimantada.jpeg"},
    {"title":"Notas imantadas","url":"souvenirs.html","image":"assets/images/Notasimantadas.jpeg"},
    {"title":"Barra de chocolate","url":"souvenirs.html","image":"assets/images/barradechocolate.png"},
    {"title":"Barra de chocolate + tarjeta personalizada","url":"souvenirs.html","image":"assets/images/barradechocolatecontarjeta.png"}
  ];

  const globalSearch = document.getElementById('globalSearch');
  if (globalSearch) {
    // Crear el contenedor de resultados si no existe
    let searchResultsContainer = document.querySelector('.search-results-dropdown');
    if (!searchResultsContainer) {
      searchResultsContainer = document.createElement('div');
      searchResultsContainer.className = 'search-results-dropdown';
      // Posicionarlo relativo al input de búsqueda
      globalSearch.parentNode.style.position = 'relative';
      globalSearch.parentNode.appendChild(searchResultsContainer);
    }

    globalSearch.addEventListener('input', (e) => {
      const searchTerm = e.target.value.toLowerCase().trim();
      searchResultsContainer.innerHTML = ''; // Limpiar resultados
      
      if (searchTerm.length === 0) {
        searchResultsContainer.style.display = 'none';
        return;
      }

      // Filtrar el índice global
      const matches = globalSearchIndex.filter(product => 
        product.title.toLowerCase().includes(searchTerm)
      );

      if (matches.length > 0) {
        searchResultsContainer.style.display = 'block';
        matches.forEach(match => {
          const resultItem = document.createElement('a');
          resultItem.className = 'search-result-item';
          resultItem.href = match.url;
          resultItem.innerHTML = `
            <img src="${match.image}" alt="${match.title}" class="search-result-img" />
            <span class="search-result-title">${match.title}</span>
          `;
          searchResultsContainer.appendChild(resultItem);
        });
      } else {
        searchResultsContainer.style.display = 'block';
        searchResultsContainer.innerHTML = '<div class="search-result-empty">No se encontraron productos.</div>';
      }
    });

    // Ocultar resultados al hacer click fuera
    document.addEventListener('click', (e) => {
      if (!globalSearch.contains(e.target) && !searchResultsContainer.contains(e.target)) {
        searchResultsContainer.style.display = 'none';
      }
    });
    
    // Mostrar resultados al hacer focus si hay texto
    globalSearch.addEventListener('focus', () => {
      if (globalSearch.value.trim().length > 0) {
        searchResultsContainer.style.display = 'block';
      }
    });
  }

  // ---- Panel Lateral del Carrito (Drawer) ----
  const cartDrawer = document.getElementById('cartDrawer');
  const cartDrawerOverlay = document.getElementById('cartDrawerOverlay');
  const closeDrawerBtn = document.getElementById('closeDrawer');
  const cartDrawerBody = document.getElementById('cartDrawerBody');

  // Las variables floatingCart y cartCountEl ya están declaradas arriba.
  // Abrir Drawer al clickear el contador de carrito (si existe en esta página)
  if (floatingCart) {
    // Reemplazamos el comportamiento original del carrito flotante
    floatingCart.addEventListener('click', (e) => {
      e.preventDefault();
      openCartDrawer();
    });
  }

  function openCartDrawer() {
    if (cartDrawer && cartDrawerOverlay) {
      updateCartDrawerUI();
      cartDrawer.classList.add('open');
      cartDrawerOverlay.classList.add('open');
    }
  }

  function closeCartDrawer() {
    if (cartDrawer && cartDrawerOverlay) {
      cartDrawer.classList.remove('open');
      cartDrawerOverlay.classList.remove('open');
    }
  }

  if (closeDrawerBtn) closeDrawerBtn.addEventListener('click', closeCartDrawer);
  if (cartDrawerOverlay) cartDrawerOverlay.addEventListener('click', closeCartDrawer);

  // Sobrescribimos el updateCartUI original (que está más arriba) o lo complementamos
  // Esta función se llamará para actualizar el Drawer
  function updateCartDrawerUI() {
    if (!cartDrawerBody) return;
    
    if (cart.length === 0) {
      cartDrawerBody.innerHTML = '<p style="text-align: center; color: var(--color-muted); margin-top:2rem;">No has agregado productos.</p>';
      return;
    }

    let html = '';
    cart.forEach((item, index) => {
      html += `
        <div class="cart-drawer-item">
          <div>
            <p>${item}</p>
          </div>
          <button class="cart-drawer-item-remove" data-index="${index}">&times;</button>
        </div>
      `;
    });

    // Añadir botón de WhatsApp
    let phone = "56 9 6693 2414";
    phone = phone.replace(/[^0-9]/g, '');
    let text = "Hola Inkly! Me gustaría cotizar estos productos: " + cart.join(", ") + ".";
    let waLink = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;

    html += `
      <div class="cart-drawer-footer" style="margin-top: 2rem; border-top: 1px solid var(--color-border); padding-top: 1.5rem; text-align: center;">
        <p style="margin-bottom: 1rem; font-weight: 600;">Total de productos: ${cart.length}</p>
        <a href="${waLink}" target="_blank" class="btn" style="width: 100%; display: block; background: #25D366; border-color: #25D366; color: white; text-decoration: none;">Solicitar Cotización por WhatsApp</a>
      </div>
    `;

    cartDrawerBody.innerHTML = html;

    // Asignar eventos de eliminar
    const removeBtns = cartDrawerBody.querySelectorAll('.cart-drawer-item-remove');
    removeBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.target.getAttribute('data-index'));
        // Eliminar del carrito global
        cart.splice(index, 1);
        localStorage.setItem('inklyCart', JSON.stringify(cart));
        
        // Actualizar UI en todos lados
        updateCartDrawerUI();
        if (typeof window.updateCartUI === 'function') window.updateCartUI(); // Si existe
        
        // Actualizar contador
        if (floatingCart) {
          if (cart.length > 0) {
            floatingCart.style.display = 'flex';
            if (cartCountEl) cartCountEl.innerText = cart.length;
          } else {
            floatingCart.style.display = 'none';
          }
        }
      });
    });
  }

  // Interceptar el añadir al carrito para abrir el Drawer
  const addButtons = document.querySelectorAll('.btn-add-cart');
  addButtons.forEach(btn => {
    // Al hacer click (ya se añade por el evento anterior), le damos un pequeñísimo delay y abrimos el drawer
    btn.addEventListener('click', () => {
      setTimeout(openCartDrawer, 100);
    });
  });

  // ---- Bottom Nav (Mobile) ----
  function createBottomNav() {
    if (document.querySelector('.bottom-nav')) return; // Evitar duplicados
    
    const bottomNav = document.createElement('nav');
    bottomNav.className = 'bottom-nav';
    bottomNav.innerHTML = `
      <a href="index.html" class="bottom-nav-item">
        <span class="icon">🏠</span>
        <span class="label">Inicio</span>
      </a>
      <a href="catalog.html" class="bottom-nav-item">
        <span class="icon">🛍️</span>
        <span class="label">Catálogo</span>
      </a>
      <a href="#" class="bottom-nav-item" id="mobileSearchBtn">
        <span class="icon">🔍</span>
        <span class="label">Buscar</span>
      </a>
      <a href="#" class="bottom-nav-item" id="mobileThemeToggleNav">
        <span class="icon">🌓</span>
        <span class="label">Modo</span>
      </a>
    `;
    document.body.appendChild(bottomNav);

    // Bind theme toggle
    const mobileThemeToggle = document.getElementById('mobileThemeToggleNav');
    if (mobileThemeToggle) {
      mobileThemeToggle.addEventListener('click', (e) => {
        e.preventDefault();
        const themeBtn = document.getElementById('themeToggle');
        if(themeBtn) themeBtn.click();
      });
    }

    // Bind search toggle
    const mobileSearchBtn = document.getElementById('mobileSearchBtn');
    if (mobileSearchBtn) {
      mobileSearchBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const searchContainer = document.querySelector('.search-container');
        if (searchContainer) {
          searchContainer.classList.toggle('active-mobile');
          if (searchContainer.classList.contains('active-mobile')) {
            const input = document.getElementById('globalSearch');
            if (input) input.focus();
          }
        }
      });
    }
  }

  // Initialize Bottom Nav
  createBottomNav();

});
