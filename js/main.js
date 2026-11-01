// ===== Cabeçalho: fundo sólido ao rolar + menu mobile =====
const header = document.getElementById('header');
const nav = document.getElementById('nav');
const burger = document.getElementById('burger');

const onScroll = () => header.classList.toggle('is-solid', window.scrollY > 60);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

burger.addEventListener('click', () => {
  const open = nav.classList.toggle('is-open');
  burger.classList.toggle('is-open', open);
  burger.setAttribute('aria-expanded', open);
  document.body.style.overflow = open ? 'hidden' : '';
});
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  nav.classList.remove('is-open');
  burger.classList.remove('is-open');
  burger.setAttribute('aria-expanded', false);
  document.body.style.overflow = '';
}));

// Destaca o item do menu da seção visível
const links = [...nav.querySelectorAll('a')];
const spy = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    links.forEach(l => l.classList.toggle('is-active', l.getAttribute('href') === '#' + e.target.id));
  });
}, { rootMargin: '-45% 0px -50% 0px' });
document.querySelectorAll('section[id]').forEach(s => spy.observe(s));

// ===== Slider =====
const slides = [...document.querySelectorAll('.slide')];
const dotsBox = document.getElementById('dots');
const progress = document.getElementById('progress');
const current = document.getElementById('current');
const DURATION = 6500;
let index = 0, start = performance.now(), paused = false, elapsed = 0;

document.getElementById('total').textContent = String(slides.length).padStart(2, '0');
slides.forEach((_, i) => {
  const b = document.createElement('button');
  b.setAttribute('aria-label', `Ir para o slide ${i + 1}`);
  b.addEventListener('click', () => go(i));
  dotsBox.appendChild(b);
});
const dots = [...dotsBox.children];

function go(i) {
  slides[index].classList.remove('is-active');
  dots[index].classList.remove('is-active');
  index = (i + slides.length) % slides.length;
  slides[index].classList.add('is-active');
  dots[index].classList.add('is-active');
  current.textContent = String(index + 1).padStart(2, '0');
  start = performance.now();
  elapsed = 0;
}
go(0);

function tick(now) {
  if (!paused) {
    elapsed = now - start;
    progress.style.width = Math.min(elapsed / DURATION * 100, 100) + '%';
    if (elapsed >= DURATION) go(index + 1);
  } else {
    start = now - elapsed;
  }
  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);

document.getElementById('next').addEventListener('click', () => go(index + 1));
document.getElementById('prev').addEventListener('click', () => go(index - 1));
const hero = document.querySelector('.hero');
hero.addEventListener('mouseenter', () => paused = true);
hero.addEventListener('mouseleave', () => paused = false);
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight') go(index + 1);
  if (e.key === 'ArrowLeft') go(index - 1);
});

// Arrastar com o dedo no celular
let touchX = null;
hero.addEventListener('touchstart', e => touchX = e.touches[0].clientX, { passive: true });
hero.addEventListener('touchend', e => {
  if (touchX === null) return;
  const dx = e.changedTouches[0].clientX - touchX;
  if (Math.abs(dx) > 50) go(index + (dx < 0 ? 1 : -1));
  touchX = null;
});

// ===== Contadores =====
function countUp(el) {
  const to = parseFloat(el.dataset.to);
  const dec = parseInt(el.dataset.decimals || 0);
  const t0 = performance.now();
  const step = now => {
    const p = Math.min((now - t0) / 1800, 1);
    const v = to * (1 - Math.pow(1 - p, 3));
    el.textContent = v.toLocaleString('pt-BR', { minimumFractionDigits: dec, maximumFractionDigits: dec });
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

// ===== Animação de entrada no scroll (para baixo e para cima) =====
// Ao sair da tela o elemento é "resetado"; ao voltar, ele entra pelo lado de onde veio.
const animated = document.querySelectorAll('.reveal, .journey, .pillar, .funnel, .chart');
const revealer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    const el = e.target;
    if (e.isIntersecting) {
      el.classList.add('is-in');
      el.querySelectorAll('.count').forEach(countUp);
    } else {
      el.classList.remove('is-in');
      el.classList.toggle('from-top', e.boundingClientRect.top < 0);
    }
  });
}, { threshold: 0.15 });
animated.forEach(el => revealer.observe(el));

// ===== Busca do Google digitando =====
const typed = document.getElementById('typed');
const fullText = typed.dataset.text;
let typingTimer;
new IntersectionObserver(([e]) => {
  clearInterval(typingTimer);
  if (!e.isIntersecting) { typed.textContent = ''; return; }
  let i = 0;
  typingTimer = setInterval(() => {
    typed.textContent = fullText.slice(0, ++i);
    if (i >= fullText.length) clearInterval(typingTimer);
  }, 70);
}, { threshold: 0.4 }).observe(typed.closest('.serp'));

// ===== Formulário (demonstração, sem envio real) =====
const form = document.getElementById('form');
form.addEventListener('submit', e => {
  e.preventDefault();
  let ok = true;
  form.querySelectorAll('[required]').forEach(f => {
    const bad = !f.value.trim();
    f.classList.toggle('is-error', bad);
    if (bad) ok = false;
  });
  if (!ok) return;
  document.getElementById('formOk').hidden = false;
  form.reset();
});
