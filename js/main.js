/* ── FORM ───────────────────────────────────── */
function handleSubmit(e) {
  e.preventDefault();
  const btn = e.target.querySelector('.btn-submit');
  btn.textContent = 'Заявка отправлена ✓';
  btn.style.background = '#2DC982';
  btn.style.color = '#fff';
  btn.disabled = true;
  e.target.reset();
  setTimeout(() => {
    btn.textContent = 'Отправить заявку';
    btn.style.background = '';
    btn.style.color = '';
    btn.disabled = false;
  }, 4000);
}

document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});

/* ── CUSTOM CURSOR (только на десктопе) ─────── */
const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

if (!isTouchDevice) {
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursor-follower');
  let fx = 0, fy = 0, cx = 0, cy = 0;

  document.addEventListener('mousemove', e => {
    cx = e.clientX; cy = e.clientY;
    cursor.style.left = cx + 'px';
    cursor.style.top  = cy + 'px';
  });

  (function animFollower() {
    fx += (cx - fx) * 0.14;
    fy += (cy - fy) * 0.14;
    follower.style.left = fx + 'px';
    follower.style.top  = fy + 'px';
    requestAnimationFrame(animFollower);
  })();

  document.querySelectorAll('a, button, .btn-primary, .btn-submit, .tilt-card').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
}

/* ── DARK / LIGHT THEME ─────────────────────── */
const toggleBtn = document.getElementById('theme-toggle');
const tiSun  = toggleBtn.querySelector('.ti-sun');
const tiMoon = toggleBtn.querySelector('.ti-moon');

function clearAnims(el) {
  el.classList.remove('anim-out-down','anim-in-top','anim-out-up','anim-in-bot');
}

// Инициализация
const saved = localStorage.getItem('theme');
if (saved === 'dark') {
  document.body.classList.add('dark');
  tiSun.classList.add('ti-hidden');
} else {
  tiMoon.classList.add('ti-hidden');
}

toggleBtn.addEventListener('click', () => {
  const isDark = document.body.classList.contains('dark');

  clearAnims(tiSun); clearAnims(tiMoon);

  if (isDark) {
    // → светлая: луна уходит вниз, солнце входит сверху
    tiMoon.classList.remove('ti-hidden');
    tiSun.classList.remove('ti-hidden');
    tiMoon.classList.add('anim-out-down');
    tiSun.classList.add('anim-in-top');
    setTimeout(() => { tiMoon.classList.add('ti-hidden'); clearAnims(tiMoon); clearAnims(tiSun); }, 340);
  } else {
    // → тёмная: солнце уходит вниз, луна входит сверху
    tiSun.classList.remove('ti-hidden');
    tiMoon.classList.remove('ti-hidden');
    tiSun.classList.add('anim-out-down');
    tiMoon.classList.add('anim-in-top');
    setTimeout(() => { tiSun.classList.add('ti-hidden'); clearAnims(tiSun); clearAnims(tiMoon); }, 340);
  }

  document.body.classList.toggle('dark');
  localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
});


/* ── SCROLL REVEAL (fade + slide) ─────────────── */
const reveals = document.querySelectorAll('.reveal');

// Назначаем каскадные задержки карточкам в сетках
document.querySelectorAll('.why-grid, .services-grid').forEach(grid => {
  grid.querySelectorAll('.reveal').forEach((card, i) => {
    card.style.setProperty('--delay', `${i * 0.08}s`);
  });
});

function showEl(el) {
  el.classList.remove('hiding');
  el.classList.add('visible');
}

function hideEl(el) {
  if (el.closest('.hero')) return;
  if (!el.classList.contains('visible')) return;
  el.classList.add('hiding');
  setTimeout(() => {
    el.classList.remove('visible', 'hiding');
  }, 450);
}

// IntersectionObserver — только для появления при скролле вниз
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) showEl(entry.target);
  });
}, { threshold: 0.12 });

reveals.forEach(el => observer.observe(el));

// Scroll event — затухание при скролле вверх (пока элемент ещё виден)
let lastY = window.scrollY;
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  if (y < lastY) {
    reveals.forEach(el => {
      const rect = el.getBoundingClientRect();
      // Элемент виден и находится в нижней части экрана — затухаем
      if (rect.top > window.innerHeight * 0.5 && rect.top < window.innerHeight) {
        hideEl(el);
      }
    });
  }
  lastY = y;
}, { passive: true });

// Hero элементы видны сразу
document.querySelectorAll('.hero .reveal').forEach(el => {
  setTimeout(() => showEl(el), parseFloat(getComputedStyle(el).getPropertyValue('--delay') || '0') * 1000 + 100);
});

/* ── PARALLAX ───────────────────────────────── */
const heroContent = document.querySelector('.hero-content');
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  if (heroContent) heroContent.style.transform = `translateY(${y * 0.28}px)`;
});

/* ── 3D TILT (только на десктопе) ──────────── */
if (!isTouchDevice) {
  document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rotY = ((x - cx) / cx) * 10;
      const rotX = -((y - cy) / cy) * 10;
      card.style.transform = `perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(8px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}
