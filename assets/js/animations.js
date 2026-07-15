/**
 * Inkly – Animaciones con Motion One (motor de Framer Motion)
 * Compatible con HTML puro sin React
 */

import { animate, inView, stagger } from 'https://cdn.jsdelivr.net/npm/motion@10.16.4/+esm';

/* ================================================
   RESPETA prefers-reduced-motion
   ================================================ */
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (prefersReduced) {
  // Si el usuario prefiere sin animaciones, salir inmediatamente
  // (el CSS ya muestra todo sin opacidad 0)
  document.documentElement.classList.add('no-motion');
}

/* ================================================
   NAVBAR – shrink on scroll
   ================================================ */
const navbar = document.querySelector('.navbar');
if (navbar) {
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY > 60) {
      navbar.style.padding = '0.1rem 0';
      navbar.style.boxShadow = '0 4px 16px rgba(0,0,0,0.12)';
    } else {
      navbar.style.padding = '0.5rem 0';
      navbar.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
    }
    lastScroll = scrollY;
  }, { passive: true });
}

/* ================================================
   HERO – entrada en secuencia
   ================================================ */
if (!prefersReduced) {
  const heroH1 = document.querySelector('.hero h1');
  const heroSub = document.querySelector('.hero .subtitle, .hero p');
  const heroBtn = document.querySelector('.hero .btn, .hero a.btn-cta');
  const heroImg = document.querySelector('.hero-image img');

  const heroElements = [heroH1, heroSub, heroBtn, heroImg].filter(Boolean);
  if (heroElements.length > 0) {
    // Estado inicial
    heroElements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(28px)';
    });

    heroElements.forEach((el, i) => {
      animate(
        el,
        { opacity: [0, 1], transform: ['translateY(28px)', 'translateY(0px)'] },
        { duration: 0.65, delay: i * 0.14, easing: [0.25, 1, 0.5, 1] }
      );
    });
  }
}

/* ================================================
   CARDS – fade + slide al entrar en viewport
   ================================================ */
if (!prefersReduced) {
  // Cards de categorías (index y catalog)
  const categoryCards = document.querySelectorAll('.category-card, .cat-card');
  if (categoryCards.length > 0) {
    categoryCards.forEach(card => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(32px)';
    });

    inView('.category-card, .cat-card', ({ target }) => {
      const siblings = target.parentElement?.querySelectorAll('.category-card, .cat-card');
      const idx = siblings ? Array.from(siblings).indexOf(target) : 0;
      animate(
        target,
        { opacity: [0, 1], transform: ['translateY(32px)', 'translateY(0)'] },
        { duration: 0.55, delay: idx * 0.1, easing: [0.25, 1, 0.5, 1] }
      );
    }, { margin: '-60px' });
  }

  // Cards de productos
  const productCards = document.querySelectorAll('.card');
  if (productCards.length > 0) {
    productCards.forEach(card => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(24px)';
    });

    inView('.card', ({ target }) => {
      const siblings = target.parentElement?.querySelectorAll('.card');
      const idx = siblings ? Array.from(siblings).indexOf(target) : 0;
      animate(
        target,
        { opacity: [0, 1], transform: ['translateY(24px)', 'translateY(0)'] },
        { duration: 0.5, delay: (idx % 4) * 0.08, easing: [0.25, 1, 0.5, 1] }
      );
    }, { margin: '-40px' });
  }
}

/* ================================================
   SECTION TITLES – fade + slide up
   ================================================ */
if (!prefersReduced) {
  const titles = document.querySelectorAll('.section-title, .catalog-section-title');
  titles.forEach(t => {
    t.style.opacity = '0';
    t.style.transform = 'translateY(20px)';
  });

  inView('.section-title, .catalog-section-title', ({ target }) => {
    animate(
      target,
      { opacity: [0, 1], transform: ['translateY(20px)', 'translateY(0)'] },
      { duration: 0.5, easing: [0.25, 1, 0.5, 1] }
    );
  }, { margin: '-40px' });
}

/* ================================================
   STEPS – stagger desde abajo
   ================================================ */
if (!prefersReduced) {
  const steps = document.querySelectorAll('.step');
  if (steps.length > 0) {
    steps.forEach(s => {
      s.style.opacity = '0';
      s.style.transform = 'translateY(30px)';
    });

    inView('.steps', ({ target }) => {
      const items = target.querySelectorAll('.step');
      animate(
        items,
        { opacity: [0, 1], transform: ['translateY(30px)', 'translateY(0)'] },
        { duration: 0.55, delay: stagger(0.12), easing: [0.25, 1, 0.5, 1] }
      );
    }, { margin: '-60px' });
  }
}

/* ================================================
   FLOATING CART – spring bounce al aparecer
   ================================================ */
const floatingCartEl = document.getElementById('floatingCart');
if (floatingCartEl && !prefersReduced) {
  const observer = new MutationObserver(() => {
    if (floatingCartEl.style.display !== 'none') {
      animate(
        floatingCartEl,
        { transform: ['scale(0.5)', 'scale(1.08)', 'scale(1)'], opacity: [0, 1, 1] },
        { duration: 0.45, easing: 'ease-out' }
      );
    }
  });
  observer.observe(floatingCartEl, { attributes: true, attributeFilter: ['style'] });
}

/* ================================================
   FOOTER – fade in
   ================================================ */
if (!prefersReduced) {
  const footer = document.querySelector('.footer');
  if (footer) {
    footer.style.opacity = '0';
    inView('.footer', ({ target }) => {
      animate(target, { opacity: [0, 1] }, { duration: 0.6, easing: 'ease-out' });
    }, { margin: '-20px' });
  }
}

/* ================================================
   HERO IMAGE BANNER (index.html)
   ================================================ */
if (!prefersReduced) {
  const heroBanner = document.querySelector('.hero-image');
  if (heroBanner) {
    heroBanner.style.opacity = '0';
    heroBanner.style.transform = 'scale(0.96) translateY(16px)';
    setTimeout(() => {
      animate(
        heroBanner,
        { opacity: [0, 1], transform: ['scale(0.96) translateY(16px)', 'scale(1) translateY(0)'] },
        { duration: 0.7, delay: 0.3, easing: [0.25, 1, 0.5, 1] }
      );
    }, 50);
  }
}
