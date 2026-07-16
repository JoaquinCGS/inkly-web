document.addEventListener('DOMContentLoaded', () => {
  // ---- Auto-Scroll y Highlight desde BÃºsqueda ----
  const urlParams = new URLSearchParams(window.location.search);
  const highlightTarget = urlParams.get('highlight');
  if (highlightTarget) {
    // Buscar la tarjeta que contiene este tÃ­tulo
    const cards = document.querySelectorAll('.card');
    for (let card of cards) {
      const titleEl = card.querySelector('h3');
      if (titleEl && titleEl.textContent.trim().toLowerCase() === highlightTarget.toLowerCase()) {
        // Encontrado! Hacemos scroll con un ligero delay para asegurar render
        setTimeout(() => {
          card.scrollIntoView({ behavior: 'smooth', block: 'center' });
          // Highlight visual temporal
          card.style.transition = 'box-shadow 0.5s, transform 0.5s';
          card.style.boxShadow = '0 0 20px var(--color-primary)';
          card.style.transform = 'scale(1.03)';
          setTimeout(() => {
            card.style.boxShadow = '';
            card.style.transform = '';
          }, 2500);
        }, 500);
        break;
      }
    }
  }

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

  // ---- Efecto Parallax 3D en Tarjetas ----
  const parallaxCards = document.querySelectorAll('.card, .category-card');
  parallaxCards.forEach(card => {
    // Only apply on non-touch devices (coarse pointer = touch)
    if (window.matchMedia("(any-hover: hover)").matches) {
      card.addEventListener('mouseenter', () => {
        card.style.transition = 'transform 0.1s ease-out, box-shadow 0.1s ease-out';
      });
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -10;
        const rotateY = ((x - centerX) / centerX) * 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        card.style.boxShadow = `${-rotateY}px ${rotateX}px 20px rgba(0,0,0,0.15)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transition = 'all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)';
        card.style.transform = '';
        card.style.boxShadow = '';
      });
    }
  });

  // ---- Historias Estilo Instagram ----
  const stories = [
    { title: "Kits CumpleaÃ±eros", image: "assets/images/kit1.webp", link: "catalog.html" },
    { title: "Bolsas y PiÃ±atas", image: "assets/images/bolsapinata.webp", link: "catalog.html" },
    { title: "Libritos para Colorear", image: "assets/images/libros6imagens.webp", link: "catalog.html" },
    { title: "Centros de Mesa", image: "assets/images/centrodemesa.webp", link: "catalog.html" },
    { title: "Toppers de Torta 3D", image: "assets/images/toppertorta3d.webp", link: "catalog.html" }
  ];

  let currentStoryIndex = 0;
  let storyTimer;
  let storyProgress = 0;
  let progressInterval;

  const storyViewer = document.getElementById('storyViewer');
  const storyImage = document.getElementById('storyImage');
  const storyTitle = document.getElementById('storyTitle');
  const progressBar = document.getElementById('storyProgress');
  const storyCloseBtn = document.getElementById('storyClose');

  if (storyViewer) {
    document.querySelectorAll('.story-circle').forEach(circle => {
      circle.addEventListener('click', () => {
        currentStoryIndex = parseInt(circle.getAttribute('data-story'));
        openStory();
      });
    });

    document.getElementById('storyPrev').addEventListener('click', () => {
      if (currentStoryIndex > 0) { currentStoryIndex--; openStory(); }
      else { closeStory(); }
    });

    document.getElementById('storyNext').addEventListener('click', () => {
      if (currentStoryIndex < stories.length - 1) { currentStoryIndex++; openStory(); }
      else { closeStory(); }
    });

    storyCloseBtn.addEventListener('click', closeStory);
  }

  function openStory() {
    storyViewer.classList.add('active');
    storyImage.src = stories[currentStoryIndex].image;
    storyTitle.textContent = stories[currentStoryIndex].title;
    resetStoryProgress();
  }

  function closeStory() {
    storyViewer.classList.remove('active');
    clearInterval(progressInterval);
  }

  function resetStoryProgress() {
    clearInterval(progressInterval);
    storyProgress = 0;
    progressBar.style.width = '0%';
    
    // Animate progress bar over 5 seconds
    progressInterval = setInterval(() => {
      storyProgress += 2; // 2% every 100ms
      progressBar.style.width = storyProgress + '%';
      if (storyProgress >= 100) {
        clearInterval(progressInterval);
        if (currentStoryIndex < stories.length - 1) {
          currentStoryIndex++;
          openStory();
        } else {
          closeStory();
        }
      }
    }, 100);
  }

  function syncCartButtons() {
      const btns = document.querySelectorAll('.btn-add-cart');
      btns.forEach(btn => {
        const productName = btn.getAttribute('data-name');
        if (cart.includes(productName)) {
          btn.textContent = 'Agregado \u2713';
          btn.classList.add('added');
        } else {
          btn.textContent = 'Agregar a CotizaciÃ³n';
          btn.classList.remove('added');
        }
      });
    }

    function saveCart() {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
      updateWhatsappLink();
      syncCartButtons();
    }

    function generateWhatsappLink() {
      let phone = "56 9 6693 2414";
      phone = phone.replace(/[^0-9]/g, '');

      let text = "âœ¨ *Â¡Hola Inkly!* âœ¨\n\nMe encantarÃ­a solicitar una cotizaciÃ³n para los siguientes Ã­tems:\n\n";
      if (cart.length > 0) {
        cart.forEach(item => {
          text += "ðŸ›ï¸ " + item + "\n";
        });
      } else {
        text = "Â¡Hola Inkly!";
      }

      return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
    }

    function updateWhatsappLink() {
      const waBtn = document.getElementById('floatingWhatsapp');
      if (!waBtn) return;
      waBtn.href = generateWhatsappLink();
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
          btn.textContent = 'Agregar a CotizaciÃ³n';
          btn.classList.remove('added');
          showToast("âŒ " + pName + " quitado del carrito");
        } else {
          cart.push(pName);
          btn.textContent = 'Agregado âœ“';
          btn.classList.add('added');
          showToast("ðŸ›’ " + pName + " agregado al carrito");
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
      if (typeof updateCartDrawerUI === 'function') updateCartDrawerUI();
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
    
    // Forzar reflow para que la animaciÃ³n funcione
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
          showCustomAlert('Â¡Gracias!', 'Tu solicitud ha sido enviada con Ã©xito. Te contactaremos pronto.', true);
          quoteForm.reset();
          cart = [];
          saveCart();
          renderCartInForm();
          updateFloatingCart();
        } else {
          showCustomAlert('Ups...', 'Hubo un problema al enviar la solicitud. Por favor intenta de nuevo.', false);
        }
      } catch (error) {
        showCustomAlert('Error de conexiÃ³n', 'Revisa tu internet e intenta nuevamente.', false);
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
    let delay = 0;
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('fade-in-visible');
        }, delay);
        delay += 100;
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  document.querySelectorAll('.card, .cat-card, .category-card').forEach(card => {
    cardObserver.observe(card);
  });

  // ---- Lightbox (AmpliaciÃ³n de ImÃ¡genes) ----
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
      
      // Funciones de navegaciÃ³n
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

  // ---- Filtros del CatÃ¡logo Principal (catalog.html) ----
  const catalogFilterBtns = document.querySelectorAll('.filter-btn');
  const catalogSections = document.querySelectorAll('.catalog-section');
  
  if (catalogFilterBtns.length > 0) {
    catalogFilterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        catalogFilterBtns.forEach(b => {
          b.classList.remove('active');
          b.style.background = 'transparent';
          b.style.color = '#fff';
        });
        btn.classList.add('active');
        btn.style.background = '#fff';
        btn.style.color = 'var(--color-primary)';
        
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

  // ---- Filtros DinÃ¡micos para SubpÃ¡ginas de Productos ----
  // Buscamos si hay mÃºltiples grillas de productos en esta pÃ¡gina (ej: cumpleaÃ±os.html)
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
    
    // BotÃ³n "Todos"
    const btnAll = document.createElement('button');
    btnAll.className = 'filter-btn active';
    btnAll.innerText = 'Todos';
    btnAll.style = 'padding: 0.6rem 1.2rem; border-radius: 30px; border: 2px solid var(--color-primary); background: var(--color-primary); color: #fff; font-weight: 600; cursor: pointer; transition: 0.3s;';
    filtersDiv.appendChild(btnAll);
    
    const filterButtons = [btnAll];
    const sections = [];
    
    // Iterar sobre cada grilla para obtener su tÃ­tulo superior
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
        
        // LÃ³gica de clic
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
    
    // LÃ³gica para botÃ³n "Todos"
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
    
    // Insertar los filtros justo antes del primer tÃ­tulo
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
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      let theme = document.body.getAttribute('data-theme');
      if (theme === 'dark') {
        document.body.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
      } else {
        document.body.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
      }
    });
  }

  // ---- Buscador Global con Autocompletado ----
  const globalSearchIndex = [
    {"title":"Pack 3 juegos con lÃ¡piz","url":"babyshower.html","image":"assets/images/Pack3juegosconlapizfuera.webp"},
    {"title":"Raspe \"Encuentra a mamÃ¡/papÃ¡\"","url":"babyshower.html","image":"assets/images/RaspeEncuentraamamapapaafuera.webp"},
    {"title":"Adivina la medida de la pancita","url":"babyshower.html","image":"assets/images/Adivinalamedidadelapancita.webp"},
    {"title":"BanderÃ­n + 1 nombre","url":"babyshower.html","image":"assets/images/Banderin1nombre.webp"},
    {"title":"Velita buenos deseos","url":"babyshower.html","image":"assets/images/Velitabuenosdeseosfuera.webp"},
    {"title":"24 topper simple para cupcake","url":"cumpleanos.html","image":"assets/images/24toppersparacupcake.webp"},
    {"title":"5 topper simple para torta","url":"cumpleanos.html","image":"assets/images/5topperssimples.webp"},
    {"title":"BanderÃ­n de cumpleaÃ±os + 1 nombre","url":"cumpleanos.html","image":"assets/images/banderin1nombre.webp"},
    {"title":"Bolsa piÃ±ata","url":"cumpleanos.html","image":"assets/images/bolsapinata.webp"},
    {"title":"Cajita de jugo","url":"cumpleanos.html","image":"assets/images/jugo.webp"},
    {"title":"Centro de mesa","url":"cumpleanos.html","image":"assets/images/centrodemesa.webp"},
    {"title":"Corona","url":"cumpleanos.html","image":"assets/images/corona.webp"},
    {"title":"Gorro invitados","url":"cumpleanos.html","image":"assets/images/gorroinvitados.webp"},
    {"title":"LÃ¡mina sticker","url":"cumpleanos.html","image":"assets/images/laminastickers.webp"},
    {"title":"Libro + 2 lÃ¡pices + bolsita unitaria","url":"cumpleanos.html","image":"assets/images/libro2lÃ¡picesbolsitaunitaria.webp"},
    {"title":"Libro + 2 lÃ¡pices + masa + chocolate + bolsa","url":"cumpleanos.html","image":"assets/images/libro2lapicesmasa.webp"},
    {"title":"Libro + masa + barra de chocolate + bolsa","url":"cumpleanos.html","image":"assets/images/Libromasabarradechocolatebolsa.webp"},
    {"title":"Libro + masa + bolsa unitaria","url":"cumpleanos.html","image":"assets/images/libromasabolsaunitaria.webp"},
    {"title":"Libro 16 img + sticker","url":"cumpleanos.html","image":"assets/images/Libro16imgstickerfuera.webp"},
    {"title":"Libro 6 imÃ¡genes","url":"cumpleanos.html","image":"assets/images/libros6imagens.webp"},
    {"title":"Libro para colorear 16 img","url":"cumpleanos.html","image":"assets/images/Libroparacolorear16imgfuera.webp"},
    {"title":"Palomera 12x7x7cm","url":"cumpleanos.html","image":"assets/images/palomera.webp"},
    {"title":"PiÃ±ata redonda","url":"cumpleanos.html","image":"assets/images/pinataredonda.webp"},
    {"title":"Topper de torta 3D","url":"cumpleanos.html","image":"assets/images/toppertorta3d.webp"},
    {"title":"Caja milk 3D","url":"cumpleanos.html","image":"assets/images/Cajamilk3D.webp"},
    {"title":"Caja play-DOH","url":"cumpleanos.html","image":"assets/images/cajaplaydoh.webp"},
    {"title":"Caja valija 3D","url":"cumpleanos.html","image":"assets/images/cajavalija3d.webp"},
    {"title":"MaletÃ­n coloreable","url":"cumpleanos.html","image":"assets/images/maletin6lapices8imagenesfuera.webp"},
    {"title":"Kit 1","url":"cumpleanos.html","image":"assets/images/kit1.webp"},
    {"title":"Kit 2","url":"cumpleanos.html","image":"assets/images/kit2.webp"},
    {"title":"Kit 3","url":"cumpleanos.html","image":"assets/images/kit3.webp"},
    {"title":"Kit 4","url":"cumpleanos.html","image":"assets/images/kit4.webp"},
    {"title":"Bolsa 1","url":"cumpleanos.html","image":"assets/images/bolsa1.webp"},
    {"title":"Bolsa 2","url":"cumpleanos.html","image":"assets/images/bolsa2.webp"},
    {"title":"Bolsa 3","url":"cumpleanos.html","image":"assets/images/bolsa3.webp"},
    {"title":"Bolsa PVC","url":"cumpleanos.html","image":"assets/images/BolsaPVC.webp"},
    {"title":"Bolsa solapa","url":"cumpleanos.html","image":"assets/images/Bolsasolapa.webp"},
    {"title":"Caja milk","url":"cumpleanos.html","image":"assets/images/cajamilk.webp"},
    {"title":"Cajita estilo cono","url":"cumpleanos.html","image":"assets/images/Cajitaestilocono.webp"},
    {"title":"Cajita estilo valija","url":"cumpleanos.html","image":"assets/images/Cajitaestilovalija.webp"},
    {"title":"Pack bolsa 3 + cajita milk","url":"cumpleanos.html","image":"assets/images/Packbolsa3cajitamilk.webp"},
    {"title":"Bolsa 2 + librito 16 img","url":"cumpleanos.html","image":"assets/images/Bolsa2librito16imgfuera.webp"},
    {"title":"Bolsa 3 + mini librito 6 img","url":"cumpleanos.html","image":"assets/images/Bolsa3minilibrito6imgfuera.webp"},
    {"title":"Bolsa solapa + mini librito 6 img","url":"cumpleanos.html","image":"assets/images/Bolsasolapaminilibrito6mgfuera.webp"},
    {"title":"Caja milk + mini librito 6 img","url":"cumpleanos.html","image":"assets/images/Cajamilkminilibrito6imgfuera.webp"},
    {"title":"Cajita milk + librito 16 img","url":"cumpleanos.html","image":"assets/images/Cajamilkminilibrito16imgfuera.webp"},
    {"title":"Mini burbujas","url":"souvenirs.html","image":"assets/images/miniburbujas.webp"},
    {"title":"Imantados","url":"souvenirs.html","image":"assets/images/imanes8x8.webp"},
    {"title":"ImÃ¡n estilo polaroid","url":"souvenirs.html","image":"assets/images/Imanestilopolaroid.webp"},
    {"title":"Velas pirÃ¡mide o tarjeta","url":"souvenirs.html","image":"assets/images/Velaspiramideotarjetafuera.webp"},
    {"title":"Denarios tarjeta normal","url":"souvenirs.html","image":"assets/images/Denariostarjetanormal.webp"},
    {"title":"Denarios tarjeta imantada","url":"souvenirs.html","image":"assets/images/Denariostarjetaimantada.webp"},
    {"title":"Notas imantadas","url":"souvenirs.html","image":"assets/images/Notasimantadas.webp"},
    {"title":"Barra de chocolate","url":"souvenirs.html","image":"assets/images/barradechocolate.webp"},
    {"title":"Barra de chocolate + tarjeta personalizada","url":"souvenirs.html","image":"assets/images/barradechocolatecontarjeta.webp"}
  ];

  const globalSearch = document.getElementById('globalSearch');
  if (globalSearch) {
    // Crear el contenedor de resultados si no existe
    let searchResultsContainer = document.getElementById('searchResultsContainer');
    if (!searchResultsContainer) {
      searchResultsContainer = document.createElement('div');
      searchResultsContainer.id = 'searchResultsContainer';
      searchResultsContainer.className = 'search-results-dropdown';
      // Posicionarlo relativo al input de bÃºsqueda (ya manejado por CSS)
      globalSearch.parentNode.appendChild(searchResultsContainer);
    }

    globalSearch.addEventListener('input', (e) => {
      const searchTerm = e.target.value.toLowerCase().trim();
      searchResultsContainer.innerHTML = ''; // Limpiar resultados
      
      if (searchTerm.length === 0) {
        searchResultsContainer.style.display = 'none';
        return;
      }

      // Filtrar el Ã­ndice global
      const matches = globalSearchIndex.filter(product => 
        product.title.toLowerCase().includes(searchTerm)
      );

      if (matches.length > 0) {
        searchResultsContainer.style.display = 'block';
        matches.forEach(match => {
          const resultItem = document.createElement('a');
          resultItem.className = 'search-result-item';
          resultItem.href = match.url + '?highlight=' + encodeURIComponent(match.title);
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

    // Ocultar resultados y barra movil al hacer click fuera
    document.addEventListener('click', (e) => {
      if (!globalSearch.contains(e.target) && !searchResultsContainer.contains(e.target)) {
        searchResultsContainer.style.display = 'none';
        
        // Ocultar tambiÃ©n el contenedor principal en mÃ³vil si se hace clic fuera
        const searchContainer = document.querySelector('.search-container');
        const mobileSearchBtn = document.getElementById('mobileSearchBtn');
        if (searchContainer && searchContainer.classList.contains('active-mobile')) {
          if (!searchContainer.contains(e.target) && (!mobileSearchBtn || !mobileSearchBtn.contains(e.target))) {
            searchContainer.classList.remove('active-mobile');
          }
        }
      }
    });
    
    // Mostrar resultados al hacer focus si hay texto
    globalSearch.addEventListener('focus', () => {
      if (globalSearch.value.trim().length > 0) {
        searchResultsContainer.style.display = 'block';
      }
    });

    // Ocultar barra mÃ³vil al hacer scroll (para que no 'persiga' al usuario)
    let lastScrollY = window.scrollY;
    window.addEventListener('scroll', () => {
      if (Math.abs(window.scrollY - lastScrollY) > 50) {
        const searchContainer = document.querySelector('.search-container');
        if (searchContainer && searchContainer.classList.contains('active-mobile')) {
          searchContainer.classList.remove('active-mobile');
          globalSearch.blur(); // Ocultar el teclado en mÃ³viles
        }
        lastScrollY = window.scrollY;
      }
    }, { passive: true });
  }

  // ---- Panel Lateral del Carrito (Drawer) ----
  const cartDrawer = document.getElementById('cartDrawer');
  const cartDrawerOverlay = document.getElementById('cartDrawerOverlay');
  const closeDrawerBtn = document.getElementById('closeDrawer');
  const cartDrawerBody = document.getElementById('cartDrawerBody');

  // Las variables floatingCart y cartCountEl ya estÃ¡n declaradas arriba.
  // Abrir Drawer al clickear el contador de carrito (si existe en esta pÃ¡gina)
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

  // Sobrescribimos el updateCartUI original (que estÃ¡ mÃ¡s arriba) o lo complementamos
  // Esta funciÃ³n se llamarÃ¡ para actualizar el Drawer
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

    // AÃ±adir botÃ³n de WhatsApp
    let waLink = generateWhatsappLink();

    html += `
      <div class="cart-drawer-footer" style="margin-top: 2rem; border-top: 1px solid var(--color-border); padding-top: 1.5rem; text-align: center;">
        <p style="margin-bottom: 1rem; font-weight: 600;">Total de productos: ${cart.length}</p>
        <a href="${waLink}" target="_blank" class="btn" style="width: 100%; display: block; background: #25D366; border-color: #25D366; color: white; text-decoration: none;">Solicitar CotizaciÃ³n por WhatsApp</a>
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
        saveCart();
        
        // Actualizar UI en todos lados
        updateCartDrawerUI();
        updateFloatingCart();
        renderCartInForm();
      });
    });
  }

  // Interceptar el aÃ±adir al carrito para abrir el Drawer
  const addButtons = document.querySelectorAll('.btn-add-cart');
  addButtons.forEach(btn => {
    // Al hacer click (ya se aÃ±ade por el evento anterior), le damos un pequeÃ±Ã­simo delay y abrimos el drawer
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
        <span class="icon">ðŸ </span>
        <span class="label">Inicio</span>
      </a>
      <a href="catalog.html" class="bottom-nav-item">
        <span class="icon">ðŸ›ï¸</span>
        <span class="label">CatÃ¡logo</span>
      </a>
      <a href="#" class="bottom-nav-item" id="mobileSearchBtn">
        <span class="icon">ðŸ”</span>
        <span class="label">Buscar</span>
      </a>
      <a href="#" class="bottom-nav-item" id="mobileThemeToggleNav">
        <span class="icon">ðŸŒ“</span>
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
          const isScrolledDown = window.scrollY > 50;
          const isActive = searchContainer.classList.contains('active-mobile');

          if (isActive && !isScrolledDown) {
            // Si estÃ¡ abierto y arriba -> cerrarlo
            searchContainer.classList.remove('active-mobile');
          } else {
            // Si estÃ¡ cerrado o el usuario bajÃ³ -> abrir y subir
            searchContainer.classList.add('active-mobile');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            const input = document.getElementById('globalSearch');
            if (input) {
              input.focus(); // SÃ­ncrono para iOS
              setTimeout(() => input.focus(), 300);
            }
          }
        }
      });
    }
  }

  // Initialize Bottom Nav
  createBottomNav();

  // ---- AcordeÃ³n de Preguntas Frecuentes (FAQ) ----
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    questionBtn.addEventListener('click', () => {
      // Si quieres que solo se abra una a la vez, descomenta esto:
      // faqItems.forEach(i => { if (i !== item) i.classList.remove('active'); });
      item.classList.toggle('active');
    });
  });

  // ---- BotÃ³n MÃ¡gico Volver Arriba ----
  const scrollTopBtn = document.createElement('button');
  scrollTopBtn.className = 'scroll-top-btn';
  scrollTopBtn.innerHTML = 'â†‘';
  scrollTopBtn.setAttribute('aria-label', 'Volver arriba');
  document.body.appendChild(scrollTopBtn);

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      scrollTopBtn.classList.add('show');
    } else {
      scrollTopBtn.classList.remove('show');
    }
  });

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // ---- Aviso de Cookies (Cookie Consent) ----
  if (!localStorage.getItem('cookieConsent')) {
    const cookieBanner = document.createElement('div');
    cookieBanner.className = 'cookie-banner';
    cookieBanner.innerHTML = `
      <div class="cookie-content">
        <span class="cookie-icon">ðŸª</span>
        <div>
          <h4>Uso de Cookies</h4>
          <p>Utilizamos cookies para mejorar tu experiencia en nuestra web y ofrecerte productos personalizados. Al continuar, aceptas nuestra polÃ­tica.</p>
        </div>
      </div>
      <div class="cookie-buttons">
        <button class="btn btn-outline" id="btnRejectCookies">Rechazar</button>
        <button class="btn btn-primary" id="btnAcceptCookies">Aceptar</button>
      </div>
    `;
    document.body.appendChild(cookieBanner);

    // PequeÃ±o retraso para que la animaciÃ³n de entrada funcione suavemente
    setTimeout(() => cookieBanner.classList.add('show'), 500);

    document.getElementById('btnAcceptCookies').addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'accepted');
      cookieBanner.classList.remove('show');
      setTimeout(() => cookieBanner.remove(), 400); // Esperar a que termine la animaciÃ³n
    });

    document.getElementById('btnRejectCookies').addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'rejected');
      cookieBanner.classList.remove('show');
      setTimeout(() => cookieBanner.remove(), 400);
    });
  }

});

