/* ===================================================
   TAMIL VIZHA EVENTS — JAVASCRIPT
   3D Animations, Carousels, Particles, Scroll FX
=================================================== */

'use strict';

// ---- Utility ----
const $ = id => document.getElementById(id);
const $$ = sel => document.querySelectorAll(sel);

// =====================================================
// 1. PARTICLE CANVAS
// =====================================================
(function initParticles() {
  const canvas = $('particleCanvas');
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  const SYMBOLS = ['✦', '🪔', '✿', '◆', '❋', '⊕'];

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function randomBetween(a, b) { return a + Math.random() * (b - a); }

  function Particle() {
    this.reset();
  }
  Particle.prototype.reset = function () {
    this.x = randomBetween(0, W);
    this.y = randomBetween(H, H * 2);
    this.size = randomBetween(4, 14);
    this.speed = randomBetween(0.3, 1.1);
    this.drift = randomBetween(-0.3, 0.3);
    this.alpha = randomBetween(0.1, 0.55);
    this.sym = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
    this.hue = Math.random() < 0.6 ? '#D4AF37' : '#9B59B6';
    this.spin = randomBetween(-0.02, 0.02);
    this.angle = randomBetween(0, Math.PI * 2);
  };
  Particle.prototype.update = function () {
    this.y -= this.speed;
    this.x += this.drift;
    this.alpha += randomBetween(-0.005, 0.005);
    this.alpha = Math.max(0.05, Math.min(0.6, this.alpha));
    this.angle += this.spin;
    if (this.y < -50) this.reset();
  };
  Particle.prototype.draw = function () {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = this.hue;
    ctx.font = `${this.size}px serif`;
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.fillText(this.sym, 0, 0);
    ctx.restore();
  };

  function initParticleArray() {
    particles = [];
    for (let i = 0; i < 60; i++) {
      const p = new Particle();
      p.y = randomBetween(0, H);  // scatter on load
      particles.push(p);
    }
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  }

  resize();
  initParticleArray();
  loop();
  window.addEventListener('resize', () => { resize(); initParticleArray(); });
})();

// =====================================================
// 2. FLOATING CULTURAL SYMBOLS
// =====================================================
(function initFloatingSymbols() {
  const container = $('floatingSymbols');
  const syms = ['🪔', '🌸', '🌺', '🎊', '🎵', '✨', '🌟', '💫', '🏛️', '🌼'];
  for (let i = 0; i < 15; i++) {
    const el = document.createElement('span');
    el.className = 'float-sym';
    el.textContent = syms[Math.floor(Math.random() * syms.length)];
    el.style.left = `${Math.random() * 100}%`;
    el.style.animationDelay = `${Math.random() * 8}s`;
    el.style.animationDuration = `${6 + Math.random() * 8}s`;
    el.style.fontSize = `${1 + Math.random() * 1.5}rem`;
    container.appendChild(el);
  }
})();

// =====================================================
// 3. NAVBAR SCROLL BEHAVIOR
// =====================================================
(function initNavbar() {
  const navbar = $('navbar');
  const hamburger = $('hamburger');
  const navLinks = $('navLinks');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  });

  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    hamburger.textContent = navLinks.classList.contains('open') ? '✕' : '☰';
  });

  // Close menu on link click
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.textContent = '☰';
    });
  });

  // Nav CTA → packages
  $('navCta').addEventListener('click', () => {
    document.getElementById('packages').scrollIntoView({ behavior: 'smooth' });
  });
})();

// =====================================================
// 4. INTERSECTION OBSERVER — REVEAL ANIMATIONS
// =====================================================
(function initRevealObserver() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const delay = el.dataset.delay ? parseInt(el.dataset.delay) : 0;
      setTimeout(() => el.classList.add('visible'), delay);
      observer.unobserve(el);
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  $$('.reveal-up, .reveal-card').forEach(el => observer.observe(el));
})();

// =====================================================
// 5. GALLERY CAROUSEL
// =====================================================
(function initGalleryCarousel() {
  const track = $('carouselTrack');
  const slides = track.querySelectorAll('.carousel-slide');
  const dotsEl = $('carouselDots');
  let current = 0;
  let autoTimer;

  // Build dots
  slides.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => goTo(i));
    dotsEl.appendChild(dot);
  });

  function goTo(idx) {
    current = (idx + slides.length) % slides.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    $$('.dot').forEach((d, i) => d.classList.toggle('active', i === current));
    resetAuto();
  }

  function resetAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => goTo(current + 1), 4500);
  }

  $('carouselPrev').addEventListener('click', () => goTo(current - 1));
  $('carouselNext').addEventListener('click', () => goTo(current + 1));

  // Touch support
  let touchStart = 0;
  track.parentElement.addEventListener('touchstart', e => { touchStart = e.touches[0].clientX; }, { passive: true });
  track.parentElement.addEventListener('touchend', e => {
    const diff = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) goTo(diff > 0 ? current + 1 : current - 1);
  });

  // Keyboard navigation
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') goTo(current - 1);
    if (e.key === 'ArrowRight') goTo(current + 1);
  });

  resetAuto();
})();

// =====================================================
// 6. TESTIMONIALS CAROUSEL
// =====================================================
(function initTestimonialsCarousel() {
  const track = $('testiTrack');
  const cards = track.querySelectorAll('.testi-card');
  let current = 0;
  let autoTimer;

  function goTo(idx) {
    current = (idx + cards.length) % cards.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    resetAuto();
  }

  function resetAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => goTo(current + 1), 5000);
  }

  $('testPrev').addEventListener('click', () => goTo(current - 1));
  $('testNext').addEventListener('click', () => goTo(current + 1));

  // Touch
  let touchStart = 0;
  track.addEventListener('touchstart', e => { touchStart = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) goTo(diff > 0 ? current + 1 : current - 1);
  });

  resetAuto();
})();

// =====================================================
// 7. STATS COUNTER ANIMATION
// =====================================================
(function initStatsCounter() {
  const statNums = $$('.stat-num');
  let animated = false;

  function animateCounters() {
    if (animated) return;
    statNums.forEach(el => {
      const target = parseInt(el.dataset.target);
      const duration = 2000;
      const start = performance.now();

      function step(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease-out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target);
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target;
      }
      requestAnimationFrame(step);
    });
    animated = true;
  }

  const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) animateCounters();
  }, { threshold: 0.3 });

  const statsSection = document.querySelector('.stats-section');
  if (statsSection) observer.observe(statsSection);
})();

// =====================================================
// 8. PACKAGE CARDS — 3D TILT EFFECT
// =====================================================
(function initTiltEffect() {
  $$('.pkg-card, .event-card, .expert-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rotX = ((y - cy) / cy) * -8;
      const rotY = ((x - cx) / cx) * 8;
      card.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.03) translateY(-8px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

// =====================================================
// 9. SCROLL-TRIGGERED PARALLAX ON HERO
// =====================================================
(function initHeroParallax() {
  const heroImg = document.querySelector('.hero-img');
  if (!heroImg) return;

  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    heroImg.style.transform = `scale(1.08) translateY(${scrolled * 0.25}px)`;
  }, { passive: true });
})();

// =====================================================
// 10. CUSTOM CURSOR TRAIL
// =====================================================
(function initCursorTrail() {
  const trailCount = 8;
  const trails = [];

  for (let i = 0; i < trailCount; i++) {
    const dot = document.createElement('div');
    dot.style.cssText = `
      position: fixed;
      width: ${6 + i * 2}px;
      height: ${6 + i * 2}px;
      border-radius: 50%;
      background: radial-gradient(circle, hsl(${43 - i * 3}, 80%, ${70 - i * 5}%), transparent);
      pointer-events: none;
      z-index: 9999;
      opacity: ${0.8 - i * 0.08};
      transition: left 0.${i + 1}s ease, top 0.${i + 1}s ease;
      transform: translate(-50%, -50%);
    `;
    document.body.appendChild(dot);
    trails.push(dot);
  }

  window.addEventListener('mousemove', e => {
    trails.forEach(dot => {
      dot.style.left = e.clientX + 'px';
      dot.style.top = e.clientY + 'px';
    });
  });
})();

// =====================================================
// 11. BOOKING MODAL TRIGGERS
// =====================================================
(function initModal() {
  const modal = $('bookingModal');
  const closeBtn = $('modalClose');

  function openModal(pkgName) {
    $('modalSub').textContent = `You've selected the ${pkgName} package! Just make quick call to confirm your booking`;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  $('luxuryBookBtn').addEventListener('click', () => openModal('Luxury 👑'));
  $('premiumBookBtn').addEventListener('click', () => openModal('Premium 💎'));
  $('budgetBookBtn').addEventListener('click', () => openModal('WhatWorksForU 🌟'));
  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
})();

// =====================================================
// 12. CONTACT FORM SUBMISSION
// =====================================================
(function initContactForm() {
  const form = $('contactForm');
  if (!form) return;
  const success = $('formSuccess');
  const btn = $('submitBtn');

  form.addEventListener('submit', e => {
    e.preventDefault();
    btn.disabled = true;
    btn.querySelector('span:first-child').textContent = 'Sending...';
    btn.style.opacity = '0.7';

    // Simulate async send
    setTimeout(() => {
      form.reset();
      success.classList.add('show');
      btn.disabled = false;
      btn.querySelector('span:first-child').textContent = 'Send Enquiry';
      btn.style.opacity = '1';

      setTimeout(() => success.classList.remove('show'), 6000);
    }, 1800);
  });
})();

// =====================================================
// 13. MARQUEE PAUSE ON HOVER
// =====================================================
(function initMarquee() {
  const track = document.querySelector('.marquee-track');
  if (!track) return;
  track.addEventListener('mouseenter', () => { track.style.animationPlayState = 'paused'; });
  track.addEventListener('mouseleave', () => { track.style.animationPlayState = 'running'; });
})();

// =====================================================
// 14. SCROLL PROGRESS LINE
// =====================================================
(function initScrollProgress() {
  const line = document.createElement('div');
  line.style.cssText = `
    position: fixed;
    top: 0; left: 0;
    height: 3px;
    background: linear-gradient(90deg, #6B2FA0, #D4AF37, #F5D76E);
    z-index: 2000;
    width: 0%;
    transition: width 0.1s linear;
    box-shadow: 0 0 8px rgba(212,175,55,0.7);
  `;
  document.body.appendChild(line);

  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const total = document.body.scrollHeight - window.innerHeight;
    line.style.width = (scrolled / total * 100) + '%';
  }, { passive: true });
})();

// =====================================================
// 15. GOLD SPARKLE ON CLICK
// =====================================================
(function initClickSparkle() {
  document.addEventListener('click', e => {
    const count = 8;
    for (let i = 0; i < count; i++) {
      const spark = document.createElement('div');
      const angle = (360 / count) * i;
      const dist = 30 + Math.random() * 50;
      spark.style.cssText = `
        position: fixed;
        left: ${e.clientX}px;
        top: ${e.clientY}px;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: ${Math.random() > 0.5 ? '#D4AF37' : '#9B59B6'};
        pointer-events: none;
        z-index: 9998;
        box-shadow: 0 0 6px #D4AF37;
        transform: translate(-50%, -50%);
        animation: spark 0.7s ease-out forwards;
      `;
      document.body.appendChild(spark);

      const rad = (angle * Math.PI) / 180;
      spark.animate([
        { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 },
        { transform: `translate(calc(-50% + ${Math.cos(rad) * dist}px), calc(-50% + ${Math.sin(rad) * dist}px)) scale(0)`, opacity: 0 }
      ], { duration: 700, easing: 'ease-out', fill: 'forwards' })
        .onfinish = () => spark.remove();
    }
  });
})();

// =====================================================
// 16. SECTION ENTRANCE GLOW AURA
// =====================================================
(function initSectionAura() {
  const sections = $$('section');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      entry.target.style.transition = 'box-shadow 1s ease';
      if (entry.isIntersecting) {
        entry.target.style.boxShadow = 'inset 0 0 80px rgba(107,47,160,0.08)';
      } else {
        entry.target.style.boxShadow = 'none';
      }
    });
  }, { threshold: 0.2 });
  sections.forEach(s => observer.observe(s));
})();

// =====================================================
// 17. ANIMATED GOLD BORDER ON PACKAGE CARDS
// =====================================================
(function initAnimatedBorders() {
  $$('.pkg-card').forEach((card, i) => {
    card.addEventListener('mouseenter', () => {
      card.style.setProperty('--border-offset', '0%');
    });
    card.addEventListener('mouseleave', () => {
      card.style.setProperty('--border-offset', '100%');
    });
  });
})();

// =====================================================
// 18. HERO ICON CLICK BURST
// =====================================================
(function initHeroIconBurst() {
  $$('.h-icon').forEach(icon => {
    icon.addEventListener('click', () => {
      icon.style.animation = 'none';
      icon.style.transform = 'scale(2) rotate(360deg)';
      icon.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
      setTimeout(() => {
        icon.style.transform = '';
        icon.style.transition = '';
        icon.style.animation = '';
      }, 600);
    });
  });
})();

console.log('%c🪔 Tamil Vizha Events — Loaded', 'color:#D4AF37; font-size:16px; font-family:serif; background:#0A0608; padding:8px 16px; border-radius:8px; border:1px solid #D4AF37;');
