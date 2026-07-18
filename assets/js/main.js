// Forzar al navegador a empezar desde arriba al recargar la pÃ¡gina (F5)
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

document.addEventListener('DOMContentLoaded', () => {
  // ---- Auto-Scroll y Highlight desde BÃºsqueda ----
  const urlParams = new URLSearchParams(window.location.search);
  const highlightTarget = urlParams.get('highlight');
  if (highlightTarget) {
    const cards = document.querySelectorAll('.card');
    for (let card of cards) {
      const titleEl = card.querySelector('h3');
      if (titleEl && titleEl.textContent.trim().toLowerCase() === highlightTarget.toLowerCase()) {
        setTimeout(() => {
          card.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
    if (toast.hideTimeout) clearTimeout(toast.hideTimeout);
    toast.hideTimeout = setTimeout(() => { toast.classList.remove('show'); }, 3000);
  }

  // ---- Product Carousel Logic ----
  function initCarousels() {
    const carousels = document.querySelectorAll('.product-carousel');
    carousels.forEach(carousel => {
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
  
  initCarousels();

  // ---- ConfiguraciÃ³n y Estado del Carrito ----
  const CART_KEY = 'inkly_cart';
  let cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];

  const btnAddCartList = document.querySelectorAll('.btn-add-cart');
  const floatingCart = document.getElementById('floatingCart');
  const cartCountEl = document.getElementById('cartCount');

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

    navLinksEl.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        navToggle.classList.remove('open');
        navLinksEl.classList.remove('open');
      });
    });

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

  const currentFile = window.location.pathname.split('/').pop() || 'index.html';
  const currentHash = window.location.hash;
  let activeLink = null;
  
  navAnchors.forEach(a => {
    const hrefAttr = a.getAttribute('href');
    const hrefBase = hrefAttr.split('#')[0] || 'index.html';
    const hrefHash = hrefAttr.includes('#') ? '#' + hrefAttr.split('#')[1] : '';

    if (currentFile === 'index.html' || currentFile === '') {
      if (hrefBase === 'index.html') {
        if (currentHash === '' && hrefHash === '#inicio') {
          activeLink = a;
        } else if (currentHash === hrefHash) {
          activeLink = a;
        }
      }
    } else {
      if (hrefBase === currentFile) activeLink = a;
      if (currentFile !== 'catalog.html' && hrefBase === 'catalog.html' && !activeLink) activeLink = a;
    }
  });

  if (!activeLink && navAnchors.length > 0) activeLink = navAnchors[0];
  if (activeLink) {
    activeLink.classList.add('active');
    setTimeout(() => updateIndicator(activeLink), 100);
  }

  // --- Opcional: Actualizar al hacer scroll (ScrollSpy simple) ---
  if (currentFile === 'index.html' || currentFile === '') {
    window.addEventListener('scroll', () => {
      let scrollY = window.pageYOffset;
      let currentSection = null;
      document.querySelectorAll('section[id]').forEach(sec => {
        if (scrollY >= sec.offsetTop - 200) currentSection = sec.getAttribute('id');
      });
      if (currentSection) {
        navAnchors.forEach(a => {
          if (a.getAttribute('href') === 'index.html#' + currentSection || a.getAttribute('href') === '#' + currentSection) {
            navAnchors.forEach(x => x.classList.remove('active'));
            a.classList.add('active');
            activeLink = a;
            updateIndicator(a);
          }
        });
      }
    });
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

  // ---- Efecto Parallax 3D en Tarjetas ----
  const parallaxCards = document.querySelectorAll('.card, .category-card');
  parallaxCards.forEach(card => {
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
        const rotateX = ((y - centerY) / centerY) * -8;
        const rotateY = ((x - centerX) / centerX) * 8;
        
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
  const stories = Array.from({ length: 15 }, (_, i) => ({
    title: "Cliente Feliz", 
    image: `assets/images/C${i + 1}.png`,
    link: "#" // O a una pÃ¡gina especÃ­fica si se desea en el futuro
  }));

  // Renderizar historias dinÃ¡micamente en el storiesContainer
  const storiesContainer = document.getElementById('storiesContainer');
  if (storiesContainer) {
    // Crear 3 copias para animaciÃ³n infinita perfecta
    const copies = 3;
    for (let c = 0; c < copies; c++) {
      stories.forEach((story, idx) => {
        const circle = document.createElement('div');
        circle.className = 'story-circle';
        circle.setAttribute('data-story', idx);
        circle.innerHTML = `
          <div class="story-ring">
            <img src="${story.image}" alt="${story.title}" loading="lazy">
          </div>
        `;
        storiesContainer.appendChild(circle);
      });
    }

    // Bind click events a los stories generados
    storiesContainer.addEventListener('click', (e) => {
      const circle = e.target.closest('.story-circle');
      if (circle) {
        currentStoryIndex = parseInt(circle.getAttribute('data-story'));
        openStory();
      }
    });
  }

  let currentStoryIndex = 0;
  let storyProgress = 0;
  let progressInterval;

  const storyViewer = document.getElementById('storyViewer');
  const storyImage = document.getElementById('storyImage');
  const progressBar = document.getElementById('storyProgress');
  const storyCloseBtn = document.getElementById('storyClose');

  if (storyViewer) {
    document.getElementById('storyPrev').addEventListener('click', () => {
      if (currentStoryIndex > 0) { currentStoryIndex--; openStory(); }
      else { closeStory(); }
    });

    document.getElementById('storyNext').addEventListener('click', () => {
      if (currentStoryIndex < stories.length - 1) { currentStoryIndex++; openStory(); }
      else { closeStory(); }
    });

    storyCloseBtn.addEventListener('click', closeStory);

    // Cerrar con Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && storyViewer.classList.contains('active')) closeStory();
    });
  }

  function openStory() {
    if (!storyViewer) return;
    storyViewer.classList.add('active');
    storyImage.src = stories[currentStoryIndex].image;
    
    resetStoryProgress();
  }

  function closeStory() {
    if (!storyViewer) return;
    storyViewer.classList.remove('active');
    clearInterval(progressInterval);
  }

  function resetStoryProgress() {
    clearInterval(progressInterval);
    storyProgress = 0;
    if (progressBar) progressBar.style.width = '0%';
    
    progressInterval = setInterval(() => {
      storyProgress += 2;
      if (progressBar) progressBar.style.width = storyProgress + '%';
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
        btn.textContent = 'Agregado âœ“';
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
    const phone = '56966932414';
    let text = 'âœ¨ *Â¡Hola Inkly!* âœ¨\n\nMe encantarÃ­a solicitar una cotizaciÃ³n para los siguientes Ã­tems:\n\n';
    if (cart.length > 0) {
      cart.forEach(item => {
        text += 'ðŸ›ï¸ ' + item + '\n';
      });
    } else {
      text = 'Â¡Hola Inkly!';
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

  // ---- LÃ³gica del CatÃ¡logo ----
  if (btnAddCartList.length > 0) {
    btnAddCartList.forEach(btn => {
      const productName = btn.getAttribute('data-name');
      if (cart.includes(productName)) {
        btn.textContent = 'Agregado âœ“';
        btn.classList.add('added');
      }

      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const pName = btn.getAttribute('data-name');
        if (cart.includes(pName)) {
          cart = cart.filter(item => item !== pName);
          btn.textContent = 'Agregar a CotizaciÃ³n';
          btn.classList.remove('added');
          showToast('âŒ ' + pName + ' quitado del carrito');
        } else {
          cart.push(pName);
          btn.textContent = 'Agregado âœ“';
          btn.classList.add('added');
          showToast('ðŸ›’ ' + pName + ' agregado al carrito');
        }
        saveCart();
        updateFloatingCart();
      });
    });
  }

  // ---- LÃ³gica del Formulario de CotizaciÃ³n ----
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
    
    requestAnimationFrame(() => {
      overlay.classList.add('active');
    });
    
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

  // ---- EnvÃ­o de Formulario con AJAX (Formspree) ----
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

  // ---- InicializaciÃ³n ----
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

      requestAnimationFrame(() => {
        overlay.classList.add('active');
      });
      
      const closeLightbox = () => {
        overlay.classList.remove('active');
        setTimeout(() => overlay.remove(), 300);
      };
      
      overlay.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
      overlay.addEventListener('click', (ev) => {
        if (ev.target === overlay) closeLightbox();
      });

      document.addEventListener('keydown', function escHandler(e) {
        if (e.key === 'Escape') { closeLightbox(); document.removeEventListener('keydown', escHandler); }
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
  const productGrids = document.querySelectorAll('.product-grid');
  if (productGrids.length > 1) { 
    const productsContainer = productGrids[0].parentElement;
    
    const filtersDiv = document.createElement('div');
    filtersDiv.className = 'catalog-filters';
    filtersDiv.style.cssText = 'display:flex;justify-content:center;flex-wrap:wrap;gap:10px;margin-bottom:3rem;';
    
    const btnAll = document.createElement('button');
    btnAll.className = 'filter-btn active';
    btnAll.innerText = 'Todos';
    btnAll.style.cssText = 'padding:0.6rem 1.2rem;border-radius:30px;border:2px solid var(--color-primary);background:var(--color-primary);color:#fff;font-weight:600;cursor:pointer;transition:0.3s;';
    filtersDiv.appendChild(btnAll);
    
    const filterButtons = [btnAll];
    const sections = [];
    
    productGrids.forEach((grid) => {
      const title = grid.previousElementSibling;
      if (title && title.tagName === 'H2') {
        const titleText = title.innerText;
        sections.push({ title, grid });
        
        const btn = document.createElement('button');
        btn.className = 'filter-btn';
        btn.innerText = titleText;
        btn.style.cssText = 'padding:0.6rem 1.2rem;border-radius:30px;border:2px solid var(--color-primary);background:transparent;color:var(--color-text);font-weight:600;cursor:pointer;transition:0.3s;';
        filtersDiv.appendChild(btn);
        filterButtons.push(btn);
        
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
    
    if (sections.length > 0) {
      productsContainer.insertBefore(filtersDiv, sections[0].title);
      sections.forEach(sec => {
        sec.title.style.transition = 'opacity 0.3s ease';
        sec.grid.style.transition = 'opacity 0.3s ease';
      });
    }
  }

  // ---- Scroll reveal ----
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

  // ---- Buscador Global con Autocompletado (desde products.json) ----
  const globalSearch = document.getElementById('globalSearch');
  const searchDropdown = document.getElementById('searchDropdown');

  if (globalSearch && searchDropdown) {
    // Cargar el Ã­ndice de bÃºsqueda desde products.json
    let searchIndex = [];
    fetch('products.json')
      .then(r => r.json())
      .then(data => { searchIndex = data; })
      .catch(() => {
        // Fallback: Ã­ndice bÃ¡sico inline si fetch falla
        searchIndex = [
          { title: "Kit 1", url: "cumpleanos.html", image: "assets/images/kit1.webp" },
          { title: "Kit 2", url: "cumpleanos.html", image: "assets/images/kit2.webp" },
          { title: "Kit 3", url: "cumpleanos.html", image: "assets/images/kit3.webp" },
          { title: "Kit 4", url: "cumpleanos.html", image: "assets/images/kit4.webp" },
          { title: "Bolsa piÃ±ata", url: "cumpleanos.html", image: "assets/images/bolsapinata.webp" },
          { title: "Centro de mesa", url: "cumpleanos.html", image: "assets/images/centrodemesa.webp" },
          { title: "Topper de torta 3D", url: "cumpleanos.html", image: "assets/images/toppertorta3d.webp" },
          { title: "Mini burbujas", url: "souvenirs.html", image: "assets/images/miniburbujas.webp" },
          { title: "Barra de chocolate", url: "souvenirs.html", image: "assets/images/barradechocolate.webp" }
        ];
      });

    globalSearch.addEventListener('input', (e) => {
      const searchTerm = e.target.value.toLowerCase().trim();
      searchDropdown.innerHTML = '';

      if (searchTerm.length === 0) {
        searchDropdown.classList.remove('active');
        return;
      }

      const matches = searchIndex.filter(product =>
        product.title.toLowerCase().includes(searchTerm)
      );

      if (matches.length > 0) {
        searchDropdown.classList.add('active');
        matches.slice(0, 8).forEach(match => {
          const item = document.createElement('a');
          item.className = 'search-dropdown-item';
          item.href = match.url + '?highlight=' + encodeURIComponent(match.title);
          item.innerHTML = `
            <img src="${match.image}" alt="${match.title}" loading="lazy" />
            <span>${match.title}</span>
          `;
          searchDropdown.appendChild(item);
        });
      } else {
        searchDropdown.classList.add('active');
        searchDropdown.innerHTML = '<div style="padding:1rem;text-align:center;color:var(--color-muted);font-size:0.9rem;">No se encontraron productos.</div>';
      }
    });

    document.addEventListener('click', (e) => {
      if (!globalSearch.contains(e.target) && !searchDropdown.contains(e.target)) {
        searchDropdown.classList.remove('active');
        const searchContainer = document.querySelector('.search-container');
        const mobileSearchBtn = document.getElementById('mobileSearchBtn');
        if (searchContainer && searchContainer.classList.contains('active-mobile')) {
          if (!searchContainer.contains(e.target) && (!mobileSearchBtn || !mobileSearchBtn.contains(e.target))) {
            searchContainer.classList.remove('active-mobile');
          }
        }
      }
    });
    
    globalSearch.addEventListener('focus', () => {
      if (globalSearch.value.trim().length > 0) {
        searchDropdown.classList.add('active');
      }
    });

    let lastScrollY = window.scrollY;
    window.addEventListener('scroll', () => {
      if (Math.abs(window.scrollY - lastScrollY) > 50) {
        const searchContainer = document.querySelector('.search-container');
        if (searchContainer && searchContainer.classList.contains('active-mobile')) {
          searchContainer.classList.remove('active-mobile');
          globalSearch.blur();
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

  if (floatingCart) {
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

    const waLink = generateWhatsappLink();
    html += `
      <div style="margin-top: 2rem; border-top: 1px solid var(--color-border); padding-top: 1.5rem; text-align: center;">
        <p style="margin-bottom: 1rem; font-weight: 600;">Total de productos: ${cart.length}</p>
        <a href="${waLink}" target="_blank" class="btn" style="width: 100%; display: block; background: #25D366; color: white; text-decoration: none;">
          ðŸ’¬ Solicitar CotizaciÃ³n por WhatsApp
        </a>
      </div>
    `;

    cartDrawerBody.innerHTML = html;

    const removeBtns = cartDrawerBody.querySelectorAll('.cart-drawer-item-remove');
    removeBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.target.getAttribute('data-index'));
        cart.splice(index, 1);
        saveCart();
        updateCartDrawerUI();
        updateFloatingCart();
        renderCartInForm();
      });
    });
  }

  // Abrir drawer al agregar al carrito
  const addButtons = document.querySelectorAll('.btn-add-cart');
  addButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      setTimeout(openCartDrawer, 150);
    });
  });

  // ---- Bottom Nav (Mobile) ----
  function createBottomNav() {
    if (document.querySelector('.bottom-nav')) return;
    
    const bottomNav = document.createElement('nav');
    bottomNav.className = 'bottom-nav';
    bottomNav.innerHTML = `
      <a href="index.html" class="bottom-nav-item">
        <span class="icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg></span>
        <span class="label">Inicio</span>
      </a>
      <a href="catalog.html" class="bottom-nav-item">
        <span class="icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path><path d="M3 6h18"></path><path d="M16 10a4 4 0 0 1-8 0"></path></svg></span>
        <span class="label">CatÃ¡logo</span>
      </a>
      <a href="#" class="bottom-nav-item" id="mobileSearchBtn">
        <span class="icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg></span>
        <span class="label">Buscar</span>
      </a>
      <a href="#" class="bottom-nav-item" id="mobileThemeToggleNav">
        <span class="icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6.364 6.364 0 0 0 9 9 9 9 0 1 1-9-9Z"></path></svg></span>
        <span class="label">Modo</span>
      </a>
    `;
    document.body.appendChild(bottomNav);

    const mobileThemeToggle = document.getElementById('mobileThemeToggleNav');
    if (mobileThemeToggle) {
      mobileThemeToggle.addEventListener('click', (e) => {
        e.preventDefault();
        const themeBtn = document.getElementById('themeToggle');
        if (themeBtn) themeBtn.click();
      });
    }

    const mobileSearchBtn = document.getElementById('mobileSearchBtn');
    if (mobileSearchBtn) {
      mobileSearchBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const searchContainer = document.querySelector('.search-container');
        if (searchContainer) {
          const isScrolledDown = window.scrollY > 50;
          const isActive = searchContainer.classList.contains('active-mobile');

          if (isActive && !isScrolledDown) {
            searchContainer.classList.remove('active-mobile');
          } else {
            searchContainer.classList.add('active-mobile');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            const input = document.getElementById('globalSearch');
            if (input) {
              input.focus();
              setTimeout(() => input.focus(), 300);
            }
          }
        }
      });
    }
  }

  createBottomNav();

  // ---- AcordeÃ³n de Preguntas Frecuentes (FAQ) ----
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (questionBtn) {
      questionBtn.addEventListener('click', () => {
        // Solo una abierta a la vez
        faqItems.forEach(i => { if (i !== item) i.classList.remove('active'); });
        item.classList.toggle('active');
      });
    }
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

    setTimeout(() => cookieBanner.classList.add('show'), 500);

    document.getElementById('btnAcceptCookies').addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'accepted');
      cookieBanner.classList.remove('show');
      setTimeout(() => cookieBanner.remove(), 400);
    });

    document.getElementById('btnRejectCookies').addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'rejected');
      cookieBanner.classList.remove('show');
      setTimeout(() => cookieBanner.remove(), 400);
    });
  }

  // ---- GSAP Parallax Hero ----
  if (typeof gsap !== 'undefined') {
    const parallaxMask = document.getElementById('parallaxMask');
    const parallaxFullImage = document.getElementById('parallaxFullImage');
    const parallaxContent = document.getElementById('parallaxContent');

    if (parallaxMask) {
      // Timeline automÃ¡tico en lugar de ScrollTrigger
      let tl = gsap.timeline({
        delay: 0.5 // PequeÃ±a pausa antes de empezar
      });

      // Expande la mÃ¡scara para revelar la imagen
      tl.to(parallaxMask, {
        maskSize: "2000vw", // Un tamaÃ±o mÃ¡s manejable para evitar lÃ­mites del navegador
        WebkitMaskSize: "2000vw",
        duration: 2.5,
        ease: "power3.in",
        onComplete: () => {
          // Ocultar por completo la capa de mÃ¡scara
          parallaxMask.style.display = 'none';
        }
      });

      // TransiciÃ³n perfecta: Fade in de la imagen completa MUCHO ANTES para que la K desaparezca rÃ¡pido
      if (parallaxFullImage) {
        tl.to(parallaxFullImage, {
          opacity: 1,
          duration: 0.8,
          ease: "none"
        }, "-=1.2"); // Ocurre mucho antes de que la K se atasque
      }

      // Hace aparecer el texto sutilmente al final
      if (parallaxContent) {
        tl.to(parallaxContent, {
          opacity: 1,
          duration: 1.2,
          onStart: () => {
            parallaxContent.style.pointerEvents = 'auto';
          },
          onReverseComplete: () => {
            parallaxContent.style.pointerEvents = 'none';
          }
        }, "-=0.5");
      }
    }
  }

});
