/**
 * Zor Fitness — main.js
 * Production-ready JavaScript. Zero inline handlers.
 */

'use strict';

/* ═══════════════════════════════════════════
   PAGE NAVIGATION (SPA)
═══════════════════════════════════════════ */

/**
 * Show a page by name and hide all others.
 * @param {string} name - Page identifier (e.g. 'home', 'about')
 */
function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));

  const target = document.getElementById('page-' + name);
  if (target) {
    target.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Re-init scroll reveal for newly active page
  setTimeout(initReveal, 100);
}

/**
 * Bind all [data-page] links to showPage().
 */
function bindNavLinks() {
  document.querySelectorAll('[data-page]').forEach(el => {
    el.addEventListener('click', e => {
      e.preventDefault();
      const page = el.getAttribute('data-page');
      showPage(page);

      // Close mobile menu if open
      closeMobileMenu();
    });
  });
}

/* ═══════════════════════════════════════════
   NAVBAR SCROLL BEHAVIOUR
═══════════════════════════════════════════ */

function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
}

/* ═══════════════════════════════════════════
   MOBILE MENU
═══════════════════════════════════════════ */

function openMobileMenu() {
  const menu = document.getElementById('mobileMenu');
  const btn = document.getElementById('hamburger-btn');
  if (!menu || !btn) return;

  menu.removeAttribute('hidden');
  // Delay to allow display before animation
  requestAnimationFrame(() => menu.classList.add('open'));
  btn.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
}

function closeMobileMenu() {
  const menu = document.getElementById('mobileMenu');
  const btn = document.getElementById('hamburger-btn');
  if (!menu || !btn) return;

  menu.classList.remove('open');
  btn.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';

  // Hide after transition
  menu.addEventListener('transitionend', () => {
    if (!menu.classList.contains('open')) {
      menu.setAttribute('hidden', '');
    }
  }, { once: true });
}

function toggleMobileMenu() {
  const menu = document.getElementById('mobileMenu');
  if (!menu) return;
  menu.classList.contains('open') ? closeMobileMenu() : openMobileMenu();
}

function initMobileMenu() {
  const hamburger = document.getElementById('hamburger-btn');
  const closeBtn = document.getElementById('mobile-close-btn');

  if (hamburger) hamburger.addEventListener('click', toggleMobileMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMobileMenu);

  // Close on Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMobileMenu();
  });
}

/* ═══════════════════════════════════════════
   COUNTER ANIMATION
═══════════════════════════════════════════ */

let countersAnimated = false;

function animateCounters() {
  if (countersAnimated) return;
  countersAnimated = true;

  document.querySelectorAll('[data-count]').forEach(el => {
    const target = parseInt(el.getAttribute('data-count'), 10);
    let current = 0;
    const duration = 1800;
    const increment = target / (duration / 16);

    const timer = setInterval(() => {
      current = Math.min(current + increment, target);
      const rounded = Math.round(current);
      el.textContent = (rounded >= 1000 ? rounded.toLocaleString() : rounded) + '+';
      if (current >= target) clearInterval(timer);
    }, 16);
  });
}

/* ═══════════════════════════════════════════
   SCROLL REVEAL
═══════════════════════════════════════════ */

let revealObserver = null;

function initReveal() {
  // Disconnect previous observer to avoid stacking observers on page change
  if (revealObserver) revealObserver.disconnect();

  revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');

      // Trigger counters when stats section is visible
      if (
        entry.target.querySelector('[data-count]') ||
        entry.target.hasAttribute('data-count')
      ) {
        setTimeout(animateCounters, 200);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
}

/* ═══════════════════════════════════════════
   PRICING TOGGLE
═══════════════════════════════════════════ */

const PRICING_DATA = {
  monthly: {
    basic: 'Rs 4,999',
    std: 'Rs 7,999',
    prem: 'Rs 12,999',
    period: '/mo',
    subB: 'Billed monthly',
    subS: 'Billed monthly',
    subP: 'Best value for total transformation'
  },
  quarterly: {
    basic: 'Rs 12,999',
    std: 'Rs 20,999',
    prem: 'Rs 33,999',
    period: '/qtr',
    subB: 'Save Rs 1,998 vs monthly',
    subS: 'Save Rs 2,998 vs monthly',
    subP: 'Save Rs 5,000 vs monthly'
  },
  annual: {
    basic: 'Rs 44,999',
    std: 'Rs 74,999',
    prem: 'Rs 119,999',
    period: '/yr',
    subB: 'Save Rs 14,989 vs monthly',
    subS: 'Save Rs 20,989 vs monthly',
    subP: 'Most savings — save Rs 35,989'
  }
};

function applyPricing(period) {
  const d = PRICING_DATA[period];
  if (!d) return;

  const amounts = document.querySelectorAll('.price-amount');
  const periods = document.querySelectorAll('.price-period');

  if (amounts[0]) amounts[0].textContent = d.basic;
  if (amounts[1]) amounts[1].textContent = d.std;
  if (amounts[2]) amounts[2].textContent = d.prem;

  periods.forEach(p => { p.textContent = d.period; });

  const subB = document.getElementById('basic-sub');
  const subS = document.getElementById('std-sub');
  const subP = document.getElementById('prem-sub');

  if (subB) subB.textContent = d.subB;
  if (subS) subS.textContent = d.subS;
  if (subP) subP.textContent = d.subP;
}

function initPricingToggle() {
  const toggle = document.querySelector('.pricing-toggle');
  if (!toggle) return;

  toggle.addEventListener('click', e => {
    const btn = e.target.closest('[data-period]');
    if (!btn) return;

    // Update active state + aria-pressed
    toggle.querySelectorAll('button').forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-pressed', 'false');
    });
    btn.classList.add('active');
    btn.setAttribute('aria-pressed', 'true');

    applyPricing(btn.getAttribute('data-period'));
  });
}

/* ═══════════════════════════════════════════
   TESTIMONIAL CAROUSEL
═══════════════════════════════════════════ */

let carouselPos = 0;

function moveCarousel(dir) {
  const track = document.getElementById('testimonials-track');
  if (!track) return;

  const cards = track.querySelectorAll('.testimonial-card');
  const cardWidth = 340 + 24; // card min-width + gap
  const visibleCount = window.innerWidth <= 600 ? 1 : 3;
  const maxPos = Math.max(0, cards.length - visibleCount);

  carouselPos = Math.max(0, Math.min(carouselPos + dir, maxPos));
  track.style.transform = `translateX(-${carouselPos * cardWidth}px)`;
}

function initCarousel() {
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');

  if (prevBtn) prevBtn.addEventListener('click', () => moveCarousel(-1));
  if (nextBtn) nextBtn.addEventListener('click', () => moveCarousel(1));

  // Reset position on resize
  window.addEventListener('resize', () => {
    carouselPos = 0;
    const track = document.getElementById('testimonials-track');
    if (track) track.style.transform = 'translateX(0)';
  }, { passive: true });
}

/* ═══════════════════════════════════════════
   GALLERY FILTER
═══════════════════════════════════════════ */

function initGalleryFilter() {
  const filtersEl = document.getElementById('gallery-filters');
  const gallery = document.getElementById('full-gallery');
  if (!filtersEl || !gallery) return;

  filtersEl.addEventListener('click', e => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;

    const cat = btn.getAttribute('data-cat');

    // Update active states + aria-pressed
    filtersEl.querySelectorAll('.filter-btn').forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-pressed', 'false');
    });
    btn.classList.add('active');
    btn.setAttribute('aria-pressed', 'true');

    // Filter items
    gallery.querySelectorAll('.gallery-item').forEach(item => {
      const show = cat === 'all' || item.getAttribute('data-cat') === cat;
      item.style.display = show ? '' : 'none';
    });
  });
}

/* ═══════════════════════════════════════════
   CONTACT FORM
═══════════════════════════════════════════ */

function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();

    const success = document.getElementById('form-success');
    if (success) {
      success.removeAttribute('hidden');
    }

    form.style.opacity = '0.5';
    form.style.pointerEvents = 'none';
  });
}

/* ═══════════════════════════════════════════
   HERO CANVAS — PARTICLE ANIMATION
═══════════════════════════════════════════ */

function initHeroCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  // Respect reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const ctx = canvas.getContext('2d');
  let W, H, particles, rafId;

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function createParticles() {
    particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      size: Math.random() * 2.5 + 0.5,
      opacity: Math.random() * 0.5 + 0.1,
      color: Math.random() > 0.7 ? '#E50914' : '#ffffff'
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    particles.forEach((p, i) => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.opacity;
      ctx.fill();

      // Connect nearby particles
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = 'rgba(229,9,20,0.08)';
          ctx.globalAlpha = (1 - dist / 120) * 0.3;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }

      ctx.globalAlpha = 1;
    });

    rafId = requestAnimationFrame(draw);
  }

  const onResize = () => {
    resize();
    createParticles();
  };

  window.addEventListener('resize', onResize, { passive: true });
  resize();
  createParticles();
  draw();

  // Stop animation when page is not visible (performance)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(rafId);
    } else {
      draw();
    }
  });
}

/* ═══════════════════════════════════════════
   HERO PARALLAX (MOUSE)
═══════════════════════════════════════════ */

function initHeroParallax() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  document.addEventListener('mousemove', e => {
    const hero = document.getElementById('hero');
    if (!hero) return;

    const rect = hero.getBoundingClientRect();
    if (e.clientY >= rect.bottom) return;

    const x = (e.clientX / window.innerWidth - 0.5) * 20;
    const y = (e.clientY / window.innerHeight - 0.5) * 20;
    const content = hero.querySelector('.hero-content');

    if (content) {
      content.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    }
  }, { passive: true });
}

/* ═══════════════════════════════════════════
   3D TILT — PRICING CARDS
═══════════════════════════════════════════ */

function initPricingTilt() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  document.querySelectorAll('.pricing-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(600px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform 0.4s ease';
      card.style.transform = '';
      // Remove inline transition after it fires
      card.addEventListener('transitionend', () => {
        card.style.transition = '';
      }, { once: true });
    });

    card.addEventListener('mouseenter', () => {
      card.style.transition = '';
    });
  });
}

/* ═══════════════════════════════════════════
   INIT
═══════════════════════════════════════════ */

function init() {
  bindNavLinks();
  initNavbarScroll();
  initMobileMenu();
  initReveal();
  initPricingToggle();
  initCarousel();
  initGalleryFilter();
  initContactForm();
  initHeroCanvas();
  initHeroParallax();
  initPricingTilt();

  // Trigger counters after load
  setTimeout(animateCounters, 600);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}