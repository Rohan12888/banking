/* ==========================================================================
   NovaBank — Interactivity
   ========================================================================== */

// ---- Mobile menu toggle ----
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-menu');
const navCta  = document.querySelector('.nav-cta');
if (menuToggle) {
  menuToggle.addEventListener('click', () => {
    const open = navMenu.classList.toggle('open');
    navCta.classList.toggle('open', open);
    menuToggle.innerHTML = open ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
  });
}

// ---- Sticky navbar shadow on scroll ----
const navbar = document.querySelector('.navbar');
const totop = document.querySelector('.totop');
window.addEventListener('scroll', () => {
  if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 10);
  if (totop) totop.classList.toggle('show', window.scrollY > 600);
});
if (totop) totop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ---- Language dropdown ----
const langBtn = document.querySelector('.lang');
const langMenu = document.querySelector('.lang-menu');
if (langBtn && langMenu) {
  langBtn.addEventListener('click', (e) => { e.stopPropagation(); langMenu.classList.toggle('open'); });
  document.addEventListener('click', () => langMenu.classList.remove('open'));
  langMenu.querySelectorAll('button').forEach(b => b.addEventListener('click', () => {
    langBtn.querySelector('span').textContent = b.dataset.code;
    langMenu.classList.remove('open');
  }));
}

// ---- Reveal on scroll ----
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
}, { threshold: 0.12 });
revealEls.forEach(el => io.observe(el));

// ---- Animated counters ----
const counters = document.querySelectorAll('[data-counter]');
const counterObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    const target = +el.dataset.counter;
    const dur = 1600; const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.floor(target * eased).toLocaleString();
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = target.toLocaleString();
    };
    requestAnimationFrame(tick);
    counterObs.unobserve(el);
  });
}, { threshold: 0.5 });
counters.forEach(c => counterObs.observe(c));

// ---- FAQ ----
document.querySelectorAll('.faq-q').forEach(q => {
  q.addEventListener('click', () => {
    const item = q.parentElement;
    const wasOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!wasOpen) item.classList.add('open');
  });
});

// ---- Testimonials slider ----
const slides = document.querySelector('.t-slides');
if (slides) {
  const total = slides.children.length;
  let idx = 0;
  const dotsWrap = document.querySelector('.t-controls');
  for (let i = 0; i < total; i++) {
    const d = document.createElement('button');
    d.className = 't-dot' + (i === 0 ? ' active' : '');
    d.addEventListener('click', () => go(i));
    dotsWrap.appendChild(d);
  }
  const dots = dotsWrap.querySelectorAll('.t-dot');
  function go(i) {
    idx = (i + total) % total;
    slides.style.transform = `translateX(-${idx * 100}%)`;
    dots.forEach((d, k) => d.classList.toggle('active', k === idx));
  }
  document.querySelector('.t-prev')?.addEventListener('click', () => go(idx - 1));
  document.querySelector('.t-next')?.addEventListener('click', () => go(idx + 1));
  setInterval(() => go(idx + 1), 6000);
}

// ---- EMI Calculator ----
const amountEl = document.getElementById('calc-amount');
const rateEl   = document.getElementById('calc-rate');
const tenureEl = document.getElementById('calc-tenure');
const emiOut   = document.getElementById('calc-emi');
const totalOut = document.getElementById('calc-total');
const intOut   = document.getElementById('calc-interest');
const aLbl = document.getElementById('lbl-amount');
const rLbl = document.getElementById('lbl-rate');
const tLbl = document.getElementById('lbl-tenure');

function fmt(n) { return '$' + Math.round(n).toLocaleString(); }
function setRangeFill(el) {
  const min = +el.min, max = +el.max, val = +el.value;
  el.style.setProperty('--p', ((val - min) / (max - min) * 100) + '%');
}
function calcEMI() {
  if (!amountEl) return;
  const P = +amountEl.value;
  const r = (+rateEl.value) / 12 / 100;
  const n = (+tenureEl.value) * 12;
  const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  const total = emi * n;
  emiOut.textContent   = fmt(emi);
  totalOut.textContent = fmt(total);
  intOut.textContent   = fmt(total - P);
  aLbl.textContent = '$' + (+amountEl.value).toLocaleString();
  rLbl.textContent = (+rateEl.value).toFixed(1) + '%';
  tLbl.textContent = tenureEl.value + ' yrs';
  [amountEl, rateEl, tenureEl].forEach(setRangeFill);
}
[amountEl, rateEl, tenureEl].forEach(el => el && el.addEventListener('input', calcEMI));
calcEMI();

// ---- Contact form (UI only) ----
const cForm = document.getElementById('contact-form');
if (cForm) {
  cForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = cForm.querySelector('button[type=submit]');
    const orig = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-check"></i> Message sent!';
    btn.disabled = true;
    setTimeout(() => { btn.innerHTML = orig; btn.disabled = false; cForm.reset(); }, 2400);
  });
}

// ---- Newsletter ----
const nForm = document.getElementById('newsletter');
if (nForm) {
  nForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = nForm.querySelector('button');
    btn.innerHTML = '<i class="fa-solid fa-check"></i> Subscribed';
    setTimeout(() => { btn.innerHTML = 'Subscribe'; nForm.reset(); }, 2200);
  });
}

// ---- Year ----
document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());
