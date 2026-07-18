// Forzar al navegador a empezar desde arriba al recargar la página (F5)
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

window.addEventListener('load', () => {
  if (window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/')) {
    if (!window.location.hash || window.location.hash === '#inicio') {
      setTimeout(() => {
        window.scrollTo(0, 0);
      }, 50);
    }
  }
});

document.addEventListener('DOMContentLoaded', () => {
  // ---- Auto-Scroll y Highlight desde Búsqueda ----
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

  // ---- Configuración y Estado del Carrito ----
  const CART_KEY = 'inkly_cart';
  let rawCart = JSON.parse(localStorage.getItem(CART_KEY)) || [];
  let cart = rawCart.map(i => {
    if (typeof i === "string") {
      return {name: i.replace(/\s*\([xX]\d+\)/g, ''), price: 0, quantity: 1};
    } else {
      let cleanName = i.name.replace(/\s*\([xX]\d+\)/g, '');
      return i.quantity ? {...i, name: cleanName} : {...i, name: cleanName, quantity: 1};
    }
  });

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
    link: "#" // O a una página específica si se desea en el futuro
  }));

  // Renderizar historias dinámicamente en el storiesContainer
  const storiesContainer = document.getElementById('storiesContainer');
  if (storiesContainer) {
    // Crear 3 copias para animación infinita perfecta
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
      if (cart.some(item => item.name === productName)) {
        btn.textContent = 'Agregado \u2713';
        btn.classList.add('added');
      } else {
        btn.textContent = 'Agregar a Cotización';
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
    
    let text = '*¡Hola Inkly!* \n\nMe encantaría solicitar una cotización para los siguientes ítems:\n\n';
    if (cart.length > 0) {
      let total = 0;
      cart.forEach(item => {
        const subtotal = item.price * item.quantity;
        text += '- ' + item.quantity + 'x ' + item.name + (item.price > 0 ? ` ($${item.price.toLocaleString('es-CL')} c/u)` : '') + '\n';
        total += subtotal;
      });
      if (total > 0) {
        const abono = Math.round(total / 2);
        
        const dateInput = document.getElementById('deliveryDate');
        if (dateInput && dateInput.value) {
          text += '\n*Fecha de entrega/retiro:* ' + dateInput.value;
        }

        text += '\n\n*Total estimado:* $' + total.toLocaleString('es-CL');
        text += '\n*Abono requerido (50%):* $' + abono.toLocaleString('es-CL') + '\n';
        text += '\n_(Nota: El valor final podría variar según cantidades específicas)_';
      }
    } else {
      text = '¡Hola Inkly!';
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

  // ---- Lógica del Catálogo ----
  function renderProductButtons() {
    if (!btnAddCartList || btnAddCartList.length === 0) return;
    btnAddCartList.forEach(btn => {
      const pName = btn.getAttribute('data-name');
      const itemInCart = cart.find(item => item.name === pName);
      if (itemInCart) {
        btn.classList.add('added');
        btn.innerHTML = `
          <div style="display:flex; justify-content:space-between; align-items:center; width:100%; height:100%;">
            <span class="inline-qty-minus" style="padding: 0 15px; font-weight:bold; font-size:1.6rem; cursor:pointer; user-select:none; line-height: 1; display:flex; align-items:center;">-</span>
            <span style="font-weight: 500; font-size: 1rem; pointer-events:none;">Agregado (${itemInCart.quantity})</span>
            <span class="inline-qty-plus" style="padding: 0 15px; font-weight:bold; font-size:1.4rem; cursor:pointer; user-select:none; line-height: 1; display:flex; align-items:center;">+</span>
          </div>
        `;
      } else {
        btn.classList.remove('added');
        btn.innerHTML = 'Agregar a Cotización';
      }
    });
  }

  if (btnAddCartList.length > 0) {
    btnAddCartList.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const pName = btn.getAttribute('data-name');
        const existing = cart.find(item => item.name === pName);
        
        let price = 0;
        const card = btn.closest('.card');
        if (card) {
          const priceTag = card.querySelector('.price-tag');
          if (priceTag) {
            const clone = priceTag.cloneNode(true);
            const detail = clone.querySelector('.price-detail');
            if (detail) clone.removeChild(detail);
            const match = clone.textContent.replace(/\./g, '').match(/\d+/);
            if (match) price = parseInt(match[0], 10);
          }
        }

        if (e.target.classList.contains('inline-qty-minus')) {
            if (existing && existing.quantity > 1) {
                existing.quantity -= 1;
            } else if (existing && existing.quantity === 1) {
                cart = cart.filter(item => item.name !== pName);
                showToast('\u274C ' + pName + ' quitado del carrito');
            }
        } else if (e.target.classList.contains('inline-qty-plus')) {
            if (existing) {
                existing.quantity += 1;
            }
        } else {
            if (!existing) {
                cart.push({name: pName, price: price, quantity: 1});
                showToast('\uD83D\uDED2 ' + pName + ' agregado al carrito');
            }
        }
        
        saveCart();
        renderProductButtons();
        updateFloatingCart();
        if (typeof updateCartDrawerUI === 'function') updateCartDrawerUI();
      });
    });
    renderProductButtons();
  }

  // ---- Lógica del Formulario de Cotización ----
  function renderCartInForm() {
    if (!cartContainer || !cartItemsList || !inputProductosSeleccionados) return;
    cartItemsList.innerHTML = '';
    if (cart.length > 0) {
      cartContainer.style.display = 'block';
      inputProductosSeleccionados.value = cart.map(i => i.name).join(', ');
      cart.forEach((item, index) => {
        const li = document.createElement('li');
        li.textContent = item.name + (item.price > 0 ? ` ($${item.price.toLocaleString('es-CL')})` : '');
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

  // ---- Envío de Formulario con AJAX (Formspree) ----
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

  // ---- Inicialización ----
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

  // ---- Lightbox (Ampliación de Imágenes) ----
  const productImages = document.querySelectorAll('.card:not(.category-card) img');
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

  // ---- Filtros del Catálogo Principal (catalog.html) ----
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

  // ---- Filtros Dinámicos para Subpáginas de Productos ----
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
    // Índice de búsqueda embebido directamente para funcionar localmente sin servidor
    const searchIndex = [
    {
        "title": "Pack 3 juegos con lápiz",
        "url": "babyshower.html",
        "image": "assets/images/Pack3juegosconlapizfuera.webp"
    },
    {
        "title": "Raspe \"Encuentra a mamá/papá\"",
        "url": "babyshower.html",
        "image": "assets/images/RaspeEncuentraamamapapaafuera.webp"
    },
    {
        "title": "Adivina la medida de la pancita",
        "url": "babyshower.html",
        "image": "assets/images/Adivinalamedidadelapancita.webp"
    },
    {
        "title": "Banderín + 1 nombre",
        "url": "babyshower.html",
        "image": "assets/images/Banderin1nombre.webp"
    },
    {
        "title": "Velita buenos deseos",
        "url": "babyshower.html",
        "image": "assets/images/Velitabuenosdeseosfuera.webp"
    },
    {
        "title": "Más productos en camino",
        "url": "bautizo.html",
        "image": "https://via.placeholder.com/400x300/ffffff/cccccc?text=+"
    },
    {
        "title": "24 topper simple para cupcake",
        "url": "cumpleanos.html",
        "image": "assets/images/24toppersparacupcake.webp"
    },
    {
        "title": "5 topper simple para torta",
        "url": "cumpleanos.html",
        "image": "assets/images/5topperssimples.webp"
    },
    {
        "title": "Banderín de cumpleaños + 1 nombre",
        "url": "cumpleanos.html",
        "image": "assets/images/banderin1nombre.webp"
    },
    {
        "title": "Bolsa piñata",
        "url": "cumpleanos.html",
        "image": "assets/images/bolsapinata.webp"
    },
    {
        "title": "Cajita de jugo",
        "url": "cumpleanos.html",
        "image": "assets/images/jugo.webp"
    },
    {
        "title": "Centro de mesa",
        "url": "cumpleanos.html",
        "image": "assets/images/centrodemesa.webp"
    },
    {
        "title": "Corona",
        "url": "cumpleanos.html",
        "image": "assets/images/corona.webp"
    },
    {
        "title": "Gorro invitados",
        "url": "cumpleanos.html",
        "image": "assets/images/gorroinvitados.webp"
    },
    {
        "title": "Lámina sticker",
        "url": "cumpleanos.html",
        "image": "assets/images/laminastickers.webp"
    },
    {
        "title": "Libro + 2 lápices + bolsita unitaria",
        "url": "cumpleanos.html",
        "image": "assets/images/libro2lápicesbolsitaunitaria.webp"
    },
    {
        "title": "Libro + 2 lápices + masa + chocolate + bolsa",
        "url": "cumpleanos.html",
        "image": "assets/images/libro2lapicesmasa.webp"
    },
    {
        "title": "Libro + masa + barra de chocolate + bolsa",
        "url": "cumpleanos.html",
        "image": "assets/images/Libromasabarradechocolatebolsa.webp"
    },
    {
        "title": "Libro + masa + bolsa unitaria",
        "url": "cumpleanos.html",
        "image": "assets/images/libromasabolsaunitaria.webp"
    },
    {
        "title": "Libro 16 img + sticker",
        "url": "cumpleanos.html",
        "image": "assets/images/Libro16imgstickerfuera.webp"
    },
    {
        "title": "Libro 6 imágenes",
        "url": "cumpleanos.html",
        "image": "assets/images/libros6imagens.webp"
    },
    {
        "title": "Libro para colorear 16 img",
        "url": "cumpleanos.html",
        "image": "assets/images/Libroparacolorear16imgfuera.webp"
    },
    {
        "title": "Palomera 12x7x7cm",
        "url": "cumpleanos.html",
        "image": "assets/images/palomera.webp"
    },
    {
        "title": "Piñata redonda",
        "url": "cumpleanos.html",
        "image": "assets/images/pinataredonda.webp"
    },
    {
        "title": "Topper de torta 3D",
        "url": "cumpleanos.html",
        "image": "assets/images/toppertorta3d.webp"
    },
    {
        "title": "Caja milk 3D",
        "url": "cumpleanos.html",
        "image": "assets/images/Cajamilk3D.webp"
    },
    {
        "title": "Caja play-DOH",
        "url": "cumpleanos.html",
        "image": "assets/images/cajaplaydoh.webp"
    },
    {
        "title": "Caja valija 3D",
        "url": "cumpleanos.html",
        "image": "assets/images/cajavalija3d.webp"
    },
    {
        "title": "Maletín coloreable",
        "url": "cumpleanos.html",
        "image": "assets/images/maletin6lapices8imagenesfuera.webp"
    },
    {
        "title": "Kit 1",
        "url": "cumpleanos.html",
        "image": "assets/images/kit1.webp"
    },
    {
        "title": "Kit 2",
        "url": "cumpleanos.html",
        "image": "assets/images/kit2.webp"
    },
    {
        "title": "Kit 3",
        "url": "cumpleanos.html",
        "image": "assets/images/kit3.webp"
    },
    {
        "title": "Kit 4",
        "url": "cumpleanos.html",
        "image": "assets/images/kit4.webp"
    },
    {
        "title": "Bolsa 1",
        "url": "cumpleanos.html",
        "image": "assets/images/bolsa1.webp"
    },
    {
        "title": "Bolsa 2",
        "url": "cumpleanos.html",
        "image": "assets/images/bolsa2.webp"
    },
    {
        "title": "Bolsa 3",
        "url": "cumpleanos.html",
        "image": "assets/images/bolsa3.webp"
    },
    {
        "title": "Bolsa PVC",
        "url": "cumpleanos.html",
        "image": "assets/images/BolsaPVC.webp"
    },
    {
        "title": "Bolsa solapa",
        "url": "cumpleanos.html",
        "image": "assets/images/Bolsasolapa.webp"
    },
    {
        "title": "Caja milk",
        "url": "cumpleanos.html",
        "image": "assets/images/cajamilk.webp"
    },
    {
        "title": "Cajita estilo cono",
        "url": "cumpleanos.html",
        "image": "assets/images/Cajitaestilocono.webp"
    },
    {
        "title": "Cajita estilo valija",
        "url": "cumpleanos.html",
        "image": "assets/images/Cajitaestilovalija.webp"
    },
    {
        "title": "Pack bolsa 3 + cajita milk",
        "url": "cumpleanos.html",
        "image": "assets/images/Packbolsa3cajitamilk.webp"
    },
    {
        "title": "Bolsa 2 + librito 16 img",
        "url": "cumpleanos.html",
        "image": "assets/images/Bolsa2librito16imgfuera.webp"
    },
    {
        "title": "Bolsa 3 + mini librito 6 img",
        "url": "cumpleanos.html",
        "image": "assets/images/Bolsa3minilibrito6imgfuera.webp"
    },
    {
        "title": "Bolsa solapa + mini librito 6 img",
        "url": "cumpleanos.html",
        "image": "assets/images/Bolsasolapaminilibrito6mgfuera.webp"
    },
    {
        "title": "Caja milk + mini librito 6 img",
        "url": "cumpleanos.html",
        "image": "assets/images/Cajamilkminilibrito6imgfuera.webp"
    },
    {
        "title": "Cajita milk + librito 16 img",
        "url": "cumpleanos.html",
        "image": "assets/images/Cajamilkminilibrito16imgfuera.webp"
    },
    {
        "title": "Mini burbujas",
        "url": "souvenirs.html",
        "image": "assets/images/miniburbujas.webp"
    },
    {
        "title": "Imantados",
        "url": "souvenirs.html",
        "image": "assets/images/imanes8x8.webp"
    },
    {
        "title": "Imán estilo polaroid",
        "url": "souvenirs.html",
        "image": "assets/images/Imanestilopolaroid.webp"
    },
    {
        "title": "Velas pirámide o tarjeta",
        "url": "souvenirs.html",
        "image": "assets/images/Velaspiramideotarjetafuera.webp"
    },
    {
        "title": "Denarios tarjeta normal",
        "url": "souvenirs.html",
        "image": "assets/images/Denariostarjetanormal.webp"
    },
    {
        "title": "Denarios tarjeta imantada",
        "url": "souvenirs.html",
        "image": "assets/images/Denariostarjetaimantada.webp"
    },
    {
        "title": "Notas imantadas",
        "url": "souvenirs.html",
        "image": "assets/images/Notasimantadas.webp"
    },
    {
        "title": "Barra de chocolate",
        "url": "souvenirs.html",
        "image": "assets/images/barradechocolate.webp"
    },
    {
        "title": "Barra de chocolate + tarjeta personalizada",
        "url": "souvenirs.html",
        "image": "assets/images/barradechocolatecontarjeta.webp"
    }
];

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
    let total = 0;
    let totalCount = 0;
    cart.forEach((item, index) => {
      total += (item.price * item.quantity);
      totalCount += item.quantity;
      const subtotal = item.price * item.quantity;
      
      html += `
        <div class="cart-drawer-item" style="display:flex; flex-direction:column; gap:0.5rem; position:relative;">
          <div style="padding-right: 20px;">
            <p style="margin:0; font-weight: 500;">${item.name}</p>
            ${item.price > 0 ? `<p style="margin:0; font-size: 0.85rem; color: var(--color-muted);">$${item.price.toLocaleString('es-CL')} c/u</p>` : ''}
          </div>
          
          <div style="display:flex; justify-content:space-between; align-items:center; margin-top:0.5rem;">
            <div class="qty-controls" style="display:flex; align-items:center; border:1px solid var(--color-border); border-radius:4px; overflow:hidden;">
              <button class="qty-btn qty-minus" data-index="${index}" style="background:var(--color-background-alt); border:none; width:28px; height:28px; cursor:pointer; font-weight:bold;">-</button>
              <span style="width:30px; text-align:center; font-size:0.9rem;">${item.quantity}</span>
              <button class="qty-btn qty-plus" data-index="${index}" style="background:var(--color-background-alt); border:none; width:28px; height:28px; cursor:pointer; font-weight:bold;">+</button>
            </div>
            ${item.price > 0 ? `<span style="font-weight:600; color:var(--color-primary);">$${subtotal.toLocaleString('es-CL')}</span>` : ''}
          </div>
          
          <button class="cart-drawer-item-remove" data-index="${index}" style="position:absolute; top:0; right:0; background:none; border:none; font-size:1.5rem; color:#ff4d4f; cursor:pointer; padding:0; line-height:1;">&times;</button>
        </div>
      `;
    });

    const waLink = generateWhatsappLink();
    html += `
      <div style="margin-top: 1.5rem; border-top: 1px solid var(--color-border); padding-top: 1.5rem; text-align: center;">
        
        <div style="margin-bottom: 1.5rem; text-align: left; background: #fff; padding: 1rem; border-radius: 8px; border: 1px solid var(--color-border);">
          <label for="deliveryDate" style="display:block; font-weight: 600; margin-bottom: 0.5rem; color: var(--color-text);">
            Fecha de entrega o retiro:
          </label>
          <p style="font-size: 0.8rem; color: var(--color-muted); margin-top: 0; margin-bottom: 0.5rem; line-height: 1.3;">
            <em>*Indica para cuándo necesitas tu pedido listo (NO el día de tu evento).</em>
          </p>
          <input type="date" id="deliveryDate" style="width: 100%; padding: 0.5rem; border: 1px solid var(--color-border); border-radius: 4px; font-family: inherit;">
        </div>

        <p style="margin-bottom: 0.5rem; font-weight: 600;">Total estimado: $${total.toLocaleString('es-CL')}</p>
        <p style="margin-bottom: 1rem; font-size: 0.9rem; color: var(--color-muted);">Abono (50%): $${Math.round(total/2).toLocaleString('es-CL')}</p>
        <a id="waBtn" href="${waLink}" target="_blank" class="btn" style="width: 100%; display: block; background: #25D366; color: white; text-decoration: none; font-weight: 600;">
          Solicitar Cotización por WhatsApp
        </a>
      </div>
    `;

    cartDrawerBody.innerHTML = html;

    const removeBtns = cartDrawerBody.querySelectorAll('.cart-drawer-item-remove');
    removeBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.target.getAttribute('data-index'));
        const pName = cart[index].name;
        cart.splice(index, 1);
        
        if (typeof renderProductButtons === 'function') renderProductButtons();
        
        saveCart();
        updateCartDrawerUI();
        updateFloatingCart();
        renderCartInForm();
      });
    });
    
    // Listeners for quantity +/-
    const minusBtns = cartDrawerBody.querySelectorAll('.qty-minus');
    minusBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.target.getAttribute('data-index'));
        if (cart[index].quantity > 1) {
          cart[index].quantity -= 1;
        } else {
          cart.splice(index, 1); // Remove if drops below 1
        }
        saveCart();
        updateCartDrawerUI();
        updateFloatingCart();
        renderCartInForm();
        if (typeof renderProductButtons === 'function') renderProductButtons();
      });
    });

    const plusBtns = cartDrawerBody.querySelectorAll('.qty-plus');
    plusBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.target.getAttribute('data-index'));
        cart[index].quantity += 1;
        saveCart();
        updateCartDrawerUI();
        updateFloatingCart();
        renderCartInForm();
        if (typeof renderProductButtons === 'function') renderProductButtons();
      });
    });

    // Date picker listener
    const dateInput = document.getElementById('deliveryDate');
    const waBtn = document.getElementById('waBtn');
    if (dateInput && waBtn) {
      dateInput.addEventListener('change', () => {
        waBtn.href = generateWhatsappLink();
      });
    }
  }



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
        <span class="label">Catálogo</span>
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

  // ---- Acordeón de Preguntas Frecuentes (FAQ) ----
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

  // ---- Botón Mágico Volver Arriba ----
  const scrollTopBtn = document.createElement('button');
  scrollTopBtn.className = 'scroll-top-btn';
  scrollTopBtn.innerHTML = '↑';
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
        <span class="cookie-icon">🍪</span>
        <div>
          <h4>Uso de Cookies</h4>
          <p>Utilizamos cookies para mejorar tu experiencia en nuestra web y ofrecerte productos personalizados. Al continuar, aceptas nuestra política.</p>
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
      // Timeline automático en lugar de ScrollTrigger
      let tl = gsap.timeline({
        delay: 0.3 // Pequeña pausa antes de empezar
      });

      // Expande la máscara para revelar la imagen
      tl.to(parallaxMask, {
        maskSize: "2000vw", // Un tamaño más manejable para evitar límites del navegador
        WebkitMaskSize: "2000vw",
        duration: 2.2,
        ease: "power4.inOut",
        onComplete: () => {
          // Ocultar por completo la capa de máscara
          parallaxMask.style.display = 'none';
        }
      });

      // Transición perfecta: Fade in de la imagen completa MUCHO ANTES para que la K desaparezca rápido
      if (parallaxFullImage) {
        tl.to(parallaxFullImage, {
          opacity: 1,
          duration: 1.0,
          ease: "none"
        }, "-=1.2"); // Ocurre mucho antes de que la K se atasque
      }

      // Hace aparecer el texto sutilmente al final
      if (parallaxContent) {
        // Estado inicial del texto
        gsap.set(parallaxContent, { opacity: 0, y: 20, filter: 'blur(4px)' });
        
        tl.to(parallaxContent, {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 1.0,
          ease: "power3.out",
          onStart: () => {
            parallaxContent.style.pointerEvents = 'auto';
          },
          onReverseComplete: () => {
            parallaxContent.style.pointerEvents = 'none';
          }
        }, "-=0.6");
      }
    }
  }

});
