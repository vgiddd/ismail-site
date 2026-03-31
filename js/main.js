/* ── FORM ───────────────────────────────────── */
const TG_TOKEN  = '8674993047:AAEz7h-MMHX8A7cd607qu6McArjl0r1fpHk';
const TG_CHAT   = '1688628335';

async function handleSubmit(e) {
  e.preventDefault();
  const btn  = e.target.querySelector('.btn-submit');
  const data = new FormData(e.target);

  const text = [
    '📩 Новая заявка с сайта',
    '',
    `👤 Имя: ${data.get('name')}`,
    `💬 Telegram / WhatsApp: ${data.get('telegram')}`,
    `📞 Телефон: ${data.get('phone')}`,
    `📝 Задача: ${data.get('message')}`,
  ].join('\n');

  btn.textContent = 'Отправка...';
  btn.disabled = true;

  try {
    const res = await fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: TG_CHAT, text }),
    });

    const json = await res.json();
    if (!res.ok) console.error('TG error:', json);
    if (res.ok) {
      btn.textContent = 'Заявка отправлена ✓';
      btn.style.background = '#2DC982';
      btn.style.color = '#fff';
      e.target.reset();
      setTimeout(() => {
        btn.textContent = 'Отправить заявку';
        btn.style.background = '';
        btn.style.color = '';
        btn.disabled = false;
      }, 4000);
    } else {
      throw new Error();
    }
  } catch {
    btn.textContent = 'Ошибка — попробуй ещё раз';
    btn.style.background = '#F25C5C';
    btn.style.color = '#fff';
    btn.disabled = false;
    setTimeout(() => {
      btn.textContent = 'Отправить заявку';
      btn.style.background = '';
      btn.style.color = '';
    }, 3000);
  }
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


/* ── SCROLL REVEAL ─────────────────────────── */
const reveals = document.querySelectorAll('.reveal');

// Каскадные задержки для карточек в сетках
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
  el.classList.remove('visible');
  el.classList.add('hiding');
  setTimeout(() => el.classList.remove('hiding'), 450);
}

function checkReveals() {
  const vh = window.innerHeight;
  reveals.forEach(el => {
    if (el.closest('.hero')) return;
    const rect = el.getBoundingClientRect();
    const inView = rect.top < vh * 0.75 && rect.bottom > vh * 0.2;

    if (inView && !el.classList.contains('visible')) {
      showEl(el);
    } else if (!inView && el.classList.contains('visible')) {
      hideEl(el);
    }
  });
}

window.addEventListener('scroll', checkReveals, { passive: true });

// Hero — показываем сразу
document.querySelectorAll('.hero .reveal').forEach(el => {
  const delay = parseFloat(getComputedStyle(el).getPropertyValue('--delay') || '0') * 1000;
  setTimeout(() => showEl(el), delay + 100);
});

// Первичная проверка после загрузки
setTimeout(checkReveals, 150);

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
