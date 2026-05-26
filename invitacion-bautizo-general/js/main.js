/* ============================================================
   CONFIGURACIÓN
   ============================================================ */
const BAUTIZO = {
  name:      'Mateo Rodríguez',
  phone:     '573128622945',
  eventDate: new Date('2026-12-06T11:00:00'),
};

document.title = `Bautizo · ${BAUTIZO.name}`;
document.querySelectorAll('[data-b="name"]').forEach(el => (el.textContent = BAUTIZO.name));

/* ============================================================
   CANVAS BURBUJAS
   ============================================================ */
let bubbleStroke = '93, 173, 226';

(function () {
  const canvas = document.getElementById('bubbles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  class Bubble {
    constructor(randomY = false) { this.init(randomY); }
    init(randomY) {
      this.x      = Math.random() * canvas.width;
      this.y      = randomY ? Math.random() * canvas.height : canvas.height + 20;
      this.r      = Math.random() * 22 + 5;           // radio 5–27px
      this.vy     = -(Math.random() * 0.45 + 0.15);   // sube lento
      this.vx     = (Math.random() - 0.5) * 0.22;
      this.wobble = Math.random() * Math.PI * 2;
      this.wSpeed = Math.random() * 0.018 + 0.005;
      this.alpha  = Math.random() * 0.18 + 0.04;
      this.dAlpha = (Math.random() * 0.006 + 0.002) * (Math.random() > 0.5 ? 1 : -1);
    }
    update() {
      this.wobble += this.wSpeed;
      this.x      += Math.sin(this.wobble) * 0.5 + this.vx;
      this.y      += this.vy;
      this.alpha  += this.dAlpha;
      if (this.alpha > 0.22 || this.alpha < 0.03) this.dAlpha *= -1;
      if (this.y < -this.r * 2 || this.x < -this.r * 2 || this.x > canvas.width + this.r * 2) {
        this.init(false);
      }
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      /* relleno muy sutil */
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.fill();
      /* borde semitransparente azul */
      ctx.strokeStyle = `rgba(${bubbleStroke}, 0.4)`;
      ctx.lineWidth   = 1.2;
      ctx.stroke();
      /* brillo interno pequeño */
      ctx.globalAlpha = this.alpha * 0.6;
      ctx.beginPath();
      ctx.arc(
        this.x - this.r * 0.28,
        this.y - this.r * 0.28,
        this.r * 0.22,
        0,
        Math.PI * 2
      );
      ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
      ctx.fill();
      ctx.restore();
    }
  }

  const bubbles = Array.from({ length: 45 }, () => new Bubble(true));

  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    bubbles.forEach(b => { b.update(); b.draw(); });
    requestAnimationFrame(loop);
  }
  loop();
})();

/* ============================================================
   MÚSICA
   ============================================================ */
const musicBtn = document.getElementById('music-btn');
const bgMusic  = document.getElementById('bg-music');

window.addEventListener('load', () => {
  if (!bgMusic) return;
  bgMusic.volume = 0.6;
  bgMusic.muted  = true;

  bgMusic.play().then(() => {
    musicBtn.classList.add('playing');
    const unmute = () => { bgMusic.muted = false; };
    ['click', 'touchstart', 'scroll', 'keydown'].forEach(ev =>
      document.addEventListener(ev, unmute, { once: true, passive: true })
    );
  }).catch(() => {
    const startOnClick = () => {
      bgMusic.muted = false;
      bgMusic.play()
        .then(() => musicBtn.classList.add('playing'))
        .catch(() => {});
    };
    document.addEventListener('click', startOnClick, { once: true });
    document.addEventListener('touchstart', startOnClick, { once: true });
  });
});

if (musicBtn) {
  musicBtn.addEventListener('click', () => {
    if (!bgMusic) return;
    if (bgMusic.paused) {
      bgMusic.play();
      musicBtn.classList.remove('paused');
      musicBtn.classList.add('playing');
    } else {
      bgMusic.pause();
      musicBtn.classList.remove('playing');
      musicBtn.classList.add('paused');
    }
  });
}

/* ============================================================
   NAVBAR
   ============================================================ */
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('nav-hamburger');
const drawer    = document.getElementById('nav-drawer');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  drawer.classList.toggle('open');
  document.body.style.overflow = drawer.classList.contains('open') ? 'hidden' : '';
});

drawer.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    hamburger.classList.remove('open');
    drawer.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ============================================================
   COUNTDOWN
   ============================================================ */
const EVENT_DATE = BAUTIZO.eventDate;

const cdDays    = document.getElementById('cd-days');
const cdHours   = document.getElementById('cd-hours');
const cdMinutes = document.getElementById('cd-minutes');
const cdSeconds = document.getElementById('cd-seconds');

const crDays    = document.getElementById('cr-days');
const crHours   = document.getElementById('cr-hours');
const crMinutes = document.getElementById('cr-minutes');
const crSeconds = document.getElementById('cr-seconds');

function pad(n) { return String(n).padStart(2, '0'); }

function animateFlip(el, newVal) {
  if (!el || el.textContent === newVal) return;
  el.classList.add('flip-out');
  setTimeout(() => {
    el.textContent = newVal;
    el.classList.remove('flip-out');
    el.classList.add('flip-in');
    requestAnimationFrame(() => requestAnimationFrame(() => el.classList.remove('flip-in')));
  }, 130);
}

function tick() {
  const diff = EVENT_DATE - Date.now();
  if (diff <= 0) {
    const cw = document.querySelector('.countdown-wrapper');
    if (cw) cw.innerHTML =
      '<p style="font-family:var(--ff-script);font-size:1.8rem;color:#fff;letter-spacing:.1em;text-shadow:0 2px 10px rgba(0,0,0,.2)">¡Hoy es el gran día! 💙</p>';
    return;
  }
  const days    = pad(Math.floor(diff / 86400000));
  const hours   = pad(Math.floor((diff % 86400000) / 3600000));
  const minutes = pad(Math.floor((diff % 3600000) / 60000));
  const seconds = pad(Math.floor((diff % 60000) / 1000));

  animateFlip(cdDays,    days);
  animateFlip(cdHours,   hours);
  animateFlip(cdMinutes, minutes);
  animateFlip(cdSeconds, seconds);

  if (crDays)    crDays.textContent    = days;
  if (crHours)   crHours.textContent   = hours;
  if (crMinutes) crMinutes.textContent = minutes;
  if (crSeconds) crSeconds.textContent = seconds;
}
tick();
setInterval(tick, 1000);

/* ============================================================
   SCROLL REVEAL
   ============================================================ */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.14 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ============================================================
   GALLERY LIGHTBOX
   ============================================================ */
const GALLERY_SRCS = [
  'Fotos/img (1).png',
  'Fotos/img (2).png',
  'Fotos/img (3).png',
  'Fotos/img (4).png',
];

let lbIndex    = 0;
const lightbox = document.getElementById('lightbox');
const lbImg    = document.getElementById('lb-img');

function openLightbox(idx) {
  lbIndex = ((idx % GALLERY_SRCS.length) + GALLERY_SRCS.length) % GALLERY_SRCS.length;
  lbImg.src = GALLERY_SRCS[lbIndex];
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeLightbox() {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
}

document.querySelectorAll('.gallery-item').forEach((item, i) => {
  item.addEventListener('click', () => openLightbox(i));
});
document.getElementById('lb-close').addEventListener('click', closeLightbox);
document.getElementById('lb-prev').addEventListener('click', () => openLightbox(lbIndex - 1));
document.getElementById('lb-next').addEventListener('click', () => openLightbox(lbIndex + 1));
lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('active')) return;
  if (e.key === 'Escape')     closeLightbox();
  if (e.key === 'ArrowLeft')  openLightbox(lbIndex - 1);
  if (e.key === 'ArrowRight') openLightbox(lbIndex + 1);
});

/* ============================================================
   SMOOTH SCROLL
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    window.scrollTo({
      top: target.getBoundingClientRect().top + window.scrollY - 70,
      behavior: 'smooth',
    });
  });
});

/* ============================================================
   GENDER TOGGLE
   ============================================================ */
(function initGenderToggle() {
  const toggle = document.querySelector('.gender-toggle');
  if (!toggle) return;

  toggle.querySelectorAll('.gender-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const gender = btn.dataset.gender;
      document.body.dataset.gender = gender;

      toggle.querySelectorAll('.gender-btn').forEach(b => {
        const active = b === btn;
        b.classList.toggle('gender-btn--active', active);
        b.setAttribute('aria-pressed', active ? 'true' : 'false');
      });

      bubbleStroke = getComputedStyle(document.documentElement)
        .getPropertyValue('--clr-blue-rgb').trim() || '93, 173, 226';
    });
  });
})();
