/* ============================================================
   UNIVERSAL CAFÉ — script.js
   Smooth interactions, animations, carousel & validation
   ============================================================ */

'use strict';

// ── Loader ──────────────────────────────────────────────────
const loader = document.getElementById('loader');

window.addEventListener('load', () => {
  setTimeout(() => {
    loader.classList.add('hidden');
    document.body.style.overflow = '';
    triggerHeroAnimations();
  }, 1200);
});

document.body.style.overflow = 'hidden';

function triggerHeroAnimations() {
  const heroElements = document.querySelectorAll('.hero .reveal-up');
  heroElements.forEach((el, i) => {
    setTimeout(() => el.classList.add('visible'), i * 120);
  });
}

// ── Navbar scroll behaviour ──────────────────────────────────
const navbar = document.getElementById('navbar');
let lastScroll = 0;
let ticking = false;

window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(updateNavbar);
    ticking = true;
  }
}, { passive: true });

function updateNavbar() {
  const scrollY = window.scrollY;
  navbar.classList.toggle('scrolled', scrollY > 60);
  lastScroll = scrollY;
  ticking = false;
}

// ── Mobile Menu ──────────────────────────────────────────────
const navToggle   = document.getElementById('navToggle');
const mobileMenu  = document.getElementById('mobileMenu');
const mobileClose = document.getElementById('mobileClose');
const mobileOverlay = document.getElementById('mobileOverlay');
const mobileLinks = document.querySelectorAll('.mobile-link');

function openMobileMenu() {
  mobileMenu.classList.add('open');
  mobileOverlay.classList.add('active');
  navToggle.classList.add('active');
  navToggle.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
}

function closeMobileMenu() {
  mobileMenu.classList.remove('open');
  mobileOverlay.classList.remove('active');
  navToggle.classList.remove('active');
  navToggle.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

navToggle.addEventListener('click', () => {
  mobileMenu.classList.contains('open') ? closeMobileMenu() : openMobileMenu();
});

mobileClose.addEventListener('click', closeMobileMenu);
mobileOverlay.addEventListener('click', closeMobileMenu);
mobileLinks.forEach(link => link.addEventListener('click', closeMobileMenu));

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { closeMobileMenu(); closeLightbox(); }
});

// ── Particle System ──────────────────────────────────────────
const particlesContainer = document.getElementById('heroParticles');

function createParticles() {
  const count = window.innerWidth < 768 ? 20 : 40;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.style.cssText = `
      position: absolute;
      width: ${Math.random() * 3 + 1}px;
      height: ${Math.random() * 3 + 1}px;
      border-radius: 50%;
      background: rgba(201, 168, 76, ${Math.random() * 0.4 + 0.05});
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      animation: particleFloat ${Math.random() * 12 + 8}s ease-in-out infinite;
      animation-delay: ${Math.random() * -15}s;
    `;
    particlesContainer.appendChild(p);
  }

  const styleId = 'particle-keyframes';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      @keyframes particleFloat {
        0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0.3; }
        25% { transform: translateY(-${Math.random() * 30 + 10}px) translateX(${Math.random() * 20 - 10}px); opacity: 0.7; }
        50% { transform: translateY(-${Math.random() * 60 + 20}px) translateX(${Math.random() * 30 - 15}px); opacity: 0.1; }
        75% { transform: translateY(-${Math.random() * 20 + 5}px) translateX(${Math.random() * 20 - 10}px); opacity: 0.5; }
      }
    `;
    document.head.appendChild(style);
  }
}
createParticles();

// ── Scroll Reveal ────────────────────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach(el => {
  // Skip hero elements — those are handled separately
  if (!el.closest('.hero')) {
    revealObserver.observe(el);
  }
});

// ── Smooth Scroll ─────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ── Menu Tabs ─────────────────────────────────────────────────
const tabBtns  = document.querySelectorAll('.tab-btn');
const panels   = document.querySelectorAll('.menu-panel');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const tab = btn.dataset.tab;

    tabBtns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
    panels.forEach(p => p.classList.remove('active'));

    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');
    const panel = document.querySelector(`[data-panel="${tab}"]`);
    if (panel) panel.classList.add('active');
  });
});

// ── Gallery Lightbox ──────────────────────────────────────────
const galleryItems  = document.querySelectorAll('.gallery-item');
const lightbox      = document.getElementById('lightbox');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxContent = document.getElementById('lightboxContent');

galleryItems.forEach(item => {
  item.addEventListener('click', () => {
    const imgEl = item.querySelector('.gallery-img');
    if (!imgEl) return;
    const clone = imgEl.cloneNode(true);
    clone.style.cssText = 'width:100%;height:100%;min-height:unset;';
    lightboxContent.innerHTML = '';
    lightboxContent.appendChild(clone);
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
});

lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

// ── Reviews Carousel ──────────────────────────────────────────
const carousel     = document.getElementById('reviewsCarousel');
const prevBtn      = document.getElementById('prevBtn');
const nextBtn      = document.getElementById('nextBtn');
const dotsContainer = document.getElementById('carouselDots');
const cards        = carousel.querySelectorAll('.review-card');
const totalCards   = cards.length;
let currentIndex   = 0;
let autoPlayTimer  = null;
let isDragging     = false;
let startX         = 0;
let startScrollLeft = 0;
let visibleCount   = getVisibleCount();

function getVisibleCount() {
  if (window.innerWidth >= 1024) return 3;
  if (window.innerWidth >= 640)  return 2;
  return 1;
}

function buildCarouselLayout() {
  visibleCount = getVisibleCount();
  const percent = 100 / visibleCount;
  const gap = 24;
  cards.forEach(card => {
    card.style.minWidth = `calc(${percent}% - ${gap * (visibleCount - 1) / visibleCount}px)`;
  });

  carousel.style.display = 'flex';
  carousel.style.gap = gap + 'px';
  carousel.style.transition = 'transform 0.5s cubic-bezier(0.4,0,0.2,1)';
}

function buildDots() {
  dotsContainer.innerHTML = '';
  const dotCount = totalCards - visibleCount + 1;
  for (let i = 0; i < Math.max(dotCount, 1); i++) {
    const dot = document.createElement('button');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Review ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  }
}

function updateDots() {
  dotsContainer.querySelectorAll('.dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === currentIndex);
  });
}

function goTo(index) {
  const maxIndex = Math.max(0, totalCards - visibleCount);
  currentIndex = Math.max(0, Math.min(index, maxIndex));
  const cardWidth = cards[0].offsetWidth + 24;
  carousel.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
  updateDots();
}

function nextSlide() {
  const maxIndex = Math.max(0, totalCards - visibleCount);
  goTo(currentIndex >= maxIndex ? 0 : currentIndex + 1);
}

function prevSlide() {
  const maxIndex = Math.max(0, totalCards - visibleCount);
  goTo(currentIndex <= 0 ? maxIndex : currentIndex - 1);
}

function startAutoPlay() {
  stopAutoPlay();
  autoPlayTimer = setInterval(nextSlide, 4500);
}

function stopAutoPlay() {
  if (autoPlayTimer) { clearInterval(autoPlayTimer); autoPlayTimer = null; }
}

prevBtn.addEventListener('click', () => { prevSlide(); startAutoPlay(); });
nextBtn.addEventListener('click', () => { nextSlide(); startAutoPlay(); });

// Touch / drag support
carousel.addEventListener('mousedown', e => {
  isDragging = true;
  startX = e.pageX;
  startScrollLeft = currentIndex;
  stopAutoPlay();
});

document.addEventListener('mouseup', () => {
  if (!isDragging) return;
  isDragging = false;
  startAutoPlay();
});

document.addEventListener('mousemove', e => {
  if (!isDragging) return;
  const diff = e.pageX - startX;
  if (Math.abs(diff) > 60) {
    isDragging = false;
    diff < 0 ? nextSlide() : prevSlide();
    startAutoPlay();
  }
});

let touchStartX = 0;
carousel.addEventListener('touchstart', e => {
  touchStartX = e.touches[0].clientX;
  stopAutoPlay();
}, { passive: true });

carousel.addEventListener('touchend', e => {
  const diff = touchStartX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 40) diff > 0 ? nextSlide() : prevSlide();
  startAutoPlay();
}, { passive: true });

// Init carousel
function initCarousel() {
  buildCarouselLayout();
  buildDots();
  goTo(0);
  startAutoPlay();
}

initCarousel();
window.addEventListener('resize', () => {
  buildCarouselLayout();
  buildDots();
  goTo(0);
});

// Pause autoplay when page not visible
document.addEventListener('visibilitychange', () => {
  document.hidden ? stopAutoPlay() : startAutoPlay();
});

// ── Contact Form Validation ───────────────────────────────────
const contactForm = document.getElementById('contactForm');
const submitBtn   = document.getElementById('submitBtn');
const formSuccess = document.getElementById('formSuccess');

function showError(fieldId, msg) {
  const group = document.getElementById(fieldId).closest('.form-group');
  const err   = document.getElementById(fieldId + 'Error');
  if (group) group.classList.add('error');
  if (err)   { err.textContent = msg; err.classList.add('visible'); }
}

function clearError(fieldId) {
  const group = document.getElementById(fieldId).closest('.form-group');
  const err   = document.getElementById(fieldId + 'Error');
  if (group) group.classList.remove('error');
  if (err)   { err.textContent = ''; err.classList.remove('visible'); }
}

['name', 'phone', 'email', 'message'].forEach(id => {
  const field = document.getElementById(id);
  if (field) field.addEventListener('input', () => clearError(id));
});

contactForm.addEventListener('submit', e => {
  e.preventDefault();
  let valid = true;

  const name    = document.getElementById('name').value.trim();
  const phone   = document.getElementById('phone').value.trim();
  const email   = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();

  if (!name || name.length < 2) {
    showError('name', 'Please enter your full name.'); valid = false;
  } else clearError('name');

  const phoneRegex = /^[+]?[\d\s\-()]{8,16}$/;
  if (!phone || !phoneRegex.test(phone)) {
    showError('phone', 'Please enter a valid phone number.'); valid = false;
  } else clearError('phone');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    showError('email', 'Please enter a valid email address.'); valid = false;
  } else clearError('email');

  if (!message || message.length < 10) {
    showError('message', 'Please write a message (at least 10 characters).'); valid = false;
  } else clearError('message');

  if (!valid) return;

  // Simulate submission
  submitBtn.disabled = true;
  const btnSpan = submitBtn.querySelector('span');
  const originalText = btnSpan.textContent;
  btnSpan.textContent = 'Sending…';
  submitBtn.style.opacity = '0.7';

  setTimeout(() => {
    submitBtn.disabled = false;
    btnSpan.textContent = originalText;
    submitBtn.style.opacity = '';
    contactForm.reset();
    formSuccess.classList.add('visible');
    setTimeout(() => formSuccess.classList.remove('visible'), 6000);
  }, 1600);
});

// ── Ripple Effect ─────────────────────────────────────────────
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', function (e) {
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.width  = ripple.style.height = size + 'px';
    ripple.style.left   = (e.clientX - rect.left - size / 2) + 'px';
    ripple.style.top    = (e.clientY - rect.top  - size / 2) + 'px';
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 700);
  });
});

// ── Scroll to Top ─────────────────────────────────────────────
const scrollTopBtn = document.getElementById('scrollTop');

window.addEventListener('scroll', () => {
  scrollTopBtn.classList.toggle('visible', window.scrollY > 500);
}, { passive: true });

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ── Active nav link highlight ─────────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navLinks.forEach(link => {
        link.style.color = link.getAttribute('href') === '#' + id
          ? 'var(--gold)'
          : '';
      });
    }
  });
}, { threshold: 0.4, rootMargin: '-80px 0px -40% 0px' });

sections.forEach(s => sectionObserver.observe(s));

// ── Tilt effect on cards (subtle) ────────────────────────────
function addTilt(selector) {
  document.querySelectorAll(selector).forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `
        translateY(-6px)
        perspective(600px)
        rotateY(${x * 6}deg)
        rotateX(${-y * 4}deg)
      `;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.4s cubic-bezier(0.4,0,0.2,1)';
    });
    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.1s linear';
    });
  });
}

if (window.innerWidth > 768) {
  addTilt('.service-card');
  addTilt('.menu-card');
}

// ── Number counter animation ──────────────────────────────────
function animateCounter(el, target, suffix = '', duration = 1200) {
  let start = 0;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start = Math.min(start + step, target);
    const display = Number.isInteger(target) ? Math.floor(start) : start.toFixed(1);
    el.textContent = display + suffix;
    if (start >= target) clearInterval(timer);
  }, 16);
}

const statsObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const nums = entry.target.querySelectorAll('.stat-num');
      nums.forEach(num => {
        const text = num.textContent;
        if (text.includes('4.9'))  animateCounter(num, 4.9, '');
        if (text.includes('500')) animateCounter(num, 500, '+');
        if (text.includes('40'))  animateCounter(num, 40, '+');
      });
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const statsEl = document.querySelector('.hero-stats');
if (statsEl) statsObserver.observe(statsEl);

// ── Console signature ─────────────────────────────────────────
console.log(
  '%c☕ Universal Café %c| Jharoda Kalan, Delhi ',
  'background:#C9A84C;color:#1A0F00;font-weight:700;font-size:14px;padding:6px 12px;border-radius:4px 0 0 4px;',
  'background:#1C1410;color:#C9A84C;font-size:14px;padding:6px 12px;border-radius:0 4px 4px 0;'
);
