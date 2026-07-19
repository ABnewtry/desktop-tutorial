/* ══════════════════════════════════════════════════════════
   AB® — DARK EDITION · main.js
   Systems: ENV / PRELOADER / SCROLL / CURSOR / MAGNETIC /
   SCRAMBLE / NAV / HERO / TICKER / DROP / MANIFESTO /
   SOCIAL / NEWSLETTER / FOOTER / CLOCK / REVEALS
   ══════════════════════════════════════════════════════════ */
'use strict';

/* ── ENV ─────────────────────────────────────────────────── */
const FINE    = matchMedia('(hover:hover) and (pointer:fine)').matches;
const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
const LERP_ON = FINE && !REDUCED;
document.documentElement.classList.add(FINE ? 'fine' : 'touch');
if (FINE) document.documentElement.classList.add('fine-pointer');
const $  = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const lerp  = (a, b, t) => a + (b - a) * t;
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

/* ── SCROLL (lerp wrapper: fixed viewport + translated content + spacer) ── */
const content = $('#content'), spacer = $('#scrollSpacer');
let scrollCur = 0, scrollTgt = 0, scrollVel = 0;
function measureScroll() {
  if (!LERP_ON) return;
  spacer.style.height = content.getBoundingClientRect().height + 'px';
}
if (LERP_ON) {
  document.body.classList.add('lerp-scroll');
  measureScroll();
  addEventListener('resize', measureScroll);
  /* re-measure after fonts/images settle */
  setTimeout(measureScroll, 600); setTimeout(measureScroll, 2000);
}
function getScroll() { return LERP_ON ? scrollCur : scrollY; }
function scrollLoop() {
  if (LERP_ON) {
    scrollTgt = scrollY;
    const prev = scrollCur;
    scrollCur = lerp(scrollCur, scrollTgt, 0.08);
    if (Math.abs(scrollCur - scrollTgt) < 0.05) scrollCur = scrollTgt;
    scrollVel = scrollCur - prev;
    content.style.transform = `translateY(${-scrollCur}px)`;
  } else {
    const y = scrollY;
    scrollVel = lerp(scrollVel, y - (scrollLoop._ly || 0), 0.4);
    scrollLoop._ly = y;
  }
}

/* ── CURSOR (6px dot instant + 40px ring lerped, states over targets) ── */
const dot = $('#cursorDot'), ring = $('#cursorRing'), ringLabel = $('#cursorLabel');
let mx = -100, my = -100, rx = -100, ry = -100;
if (FINE) {
  addEventListener('pointermove', e => { mx = e.clientX; my = e.clientY; });
  document.addEventListener('mouseover', e => {
    const view = e.target.closest('[data-cursor="view"]');
    const link = !view && e.target.closest('a,button');
    ring.classList.toggle('is-view', !!view);
    ring.classList.toggle('is-link', !!link);
    ringLabel.textContent = view ? 'VIEW' : (link ? '→' : '');
  });
}
function cursorLoop() {
  if (!FINE) return;
  dot.style.transform = `translate(${mx}px,${my}px)`;
  rx = lerp(rx, mx, 0.18); ry = lerp(ry, my, 0.18);
  ring.style.transform = `translate(${rx}px,${ry}px)`;
}

/* ── MAGNETIC (pull toward cursor within 110px radius) ── */
const magnets = $$('[data-magnetic]').map(el => ({ el, x: 0, y: 0, tx: 0, ty: 0 }));
function magneticLoop() {
  if (!FINE) return;
  for (const m of magnets) {
    const r = m.el.getBoundingClientRect();
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    const dx = mx - cx, dy = my - cy;
    const d = Math.hypot(dx, dy);
    if (d < 110) { m.tx = dx * 0.4; m.ty = dy * 0.4; }
    else { m.tx = 0; m.ty = 0; }
    m.x = lerp(m.x, m.tx, 0.14); m.y = lerp(m.y, m.ty, 0.14);
    if (Math.abs(m.x) > 0.05 || Math.abs(m.y) > 0.05)
      m.el.style.transform = `translate(${m.x}px,${m.y}px)`;
    else if (m.el.style.transform) m.el.style.transform = '';
  }
}

/* ── SCRAMBLE (random glyphs resolve left→right, ~350ms) ── */
const GLYPHS = '!<>-_\\/[]{}—=+*^?#ABX0123456789';
function scramble(el) {
  if (el._scrambling || REDUCED) return;
  const orig = el.dataset.orig || (el.dataset.orig = el.textContent);
  el._scrambling = true;
  const t0 = performance.now(), DUR = 350;
  (function tick(t) {
    const p = clamp((t - t0) / DUR, 0, 1);
    const solved = Math.floor(orig.length * p);
    let out = '';
    for (let i = 0; i < orig.length; i++) {
      out += i < solved || orig[i] === ' ' ? orig[i]
        : GLYPHS[(Math.random() * GLYPHS.length) | 0];
    }
    el.textContent = out;
    if (p < 1) requestAnimationFrame(tick);
    else { el.textContent = orig; el._scrambling = false; }
  })(t0);
}
$$('[data-scramble]').forEach(el => el.addEventListener('mouseenter', () => scramble(el)));

/* ── NAV (scrolled state + burger overlay) ── */
const nav = $('#nav'), burger = $('#burger'), mobileMenu = $('#mobileMenu');
function navLoop() { nav.classList.toggle('scrolled', getScroll() > 80); }
burger.addEventListener('click', () => {
  const open = !mobileMenu.classList.contains('open');
  mobileMenu.classList.toggle('open', open);
  burger.classList.toggle('open', open);
  burger.setAttribute('aria-expanded', open);
  mobileMenu.setAttribute('aria-hidden', !open);
});
$$('.mm-link').forEach(a => a.addEventListener('click', () => burger.click()));

/* smooth anchor scroll through the lerp system */
$$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
  const target = $(a.getAttribute('href'));
  if (!target) return;
  e.preventDefault();
  const top = target.getBoundingClientRect().top + getScroll() - 76;
  if (LERP_ON) scrollTo(0, Math.max(0, top));
  else scrollTo({ top: Math.max(0, top), behavior: REDUCED ? 'auto' : 'smooth' });
}));

/* ── HERO: split headline into letters ── */
const heroTitle = $('#heroTitle');
const letters = [];
['heroLine1', 'heroLine2'].forEach(id => {
  const line = document.getElementById(id);
  const text = line.textContent;
  line.textContent = '';
  for (const ch of text) {
    const s = document.createElement('span');
    s.className = 'ch' + (ch === ' ' ? ' sp' : '');
    s.textContent = ch === ' ' ? ' ' : ch;
    line.appendChild(s);
    letters.push({ el: s, x: 0, y: 0, r: 0, tx: 0, ty: 0, tr: 0 });
  }
});
/* per-letter repulsion within 180px, neon flash within 60px */
function heroLettersLoop() {
  if (!FINE || REDUCED) return;
  for (const L of letters) {
    const r = L.el.getBoundingClientRect();
    if (r.bottom < -50 || r.top > innerHeight + 50) continue;
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    const dx = cx - mx, dy = cy - my;
    const d = Math.hypot(dx, dy);
    if (d < 180 && d > 0.01) {
      const f = (1 - d / 180) * 40;
      L.tx = (dx / d) * f; L.ty = (dy / d) * f;
      L.tr = (dx / d) * (1 - d / 180) * 8;
      L.el.classList.toggle('hot', d < 60);
    } else { L.tx = 0; L.ty = 0; L.tr = 0; L.el.classList.remove('hot'); }
    L.x = lerp(L.x, L.tx, 0.12); L.y = lerp(L.y, L.ty, 0.12); L.r = lerp(L.r, L.tr, 0.12);
    L.el.style.transform = (Math.abs(L.x) > 0.05 || Math.abs(L.y) > 0.05 || Math.abs(L.r) > 0.05)
      ? `translate(${L.x}px,${L.y}px) rotate(${L.r}deg)` : '';
  }
}

/* hero monogram parallax 0.4x */
const heroMonoEl = $('#heroMono');
function heroMonoLoop() {
  const s = getScroll();
  heroMonoEl.style.transform = `translate(-50%,-50%) translateY(${s * 0.4}px) rotateY(${(performance.now() / 20000 % 1) * 360}deg)`;
}

/* ── HERO CANVAS: neon particle trail (additive, ~0.8s life) ── */
const trail = $('#trail'), tctx = trail.getContext('2d');
let tps = [];
function trailSize() {
  const hero = $('.hero');
  trail.width = hero.clientWidth; trail.height = hero.clientHeight;
}
trailSize(); addEventListener('resize', trailSize);
let lastSpawn = 0, idleT = 0;
function trailLoop(now) {
  if (REDUCED) return;
  const heroR = $('.hero').getBoundingClientRect();
  const inHero = my > heroR.top && my < heroR.bottom;
  if (FINE && inHero && now - lastSpawn > 16) {
    lastSpawn = now;
    tps.push({ x: mx - heroR.left, y: my - heroR.top,
      vx: (Math.random() - 0.5) * 0.7, vy: (Math.random() - 0.5) * 0.7 - 0.2,
      life: 1, r: Math.random() * 2.2 + 0.8 });
  }
  /* ambient drift when idle */
  idleT += 16;
  if (idleT > 300 && Math.random() < 0.15) {
    tps.push({ x: Math.random() * trail.width, y: Math.random() * trail.height,
      vx: (Math.random() - 0.5) * 0.25, vy: -Math.random() * 0.3 - 0.05,
      life: 0.6, r: Math.random() * 1.4 + 0.5 });
  }
  tctx.clearRect(0, 0, trail.width, trail.height);
  tctx.globalCompositeOperation = 'lighter';
  tps = tps.filter(p => p.life > 0);
  if (tps.length > 220) tps.splice(0, tps.length - 220);
  for (const p of tps) {
    p.x += p.vx; p.y += p.vy; p.life -= 0.021; /* ≈0.8s */
    tctx.globalAlpha = Math.max(0, p.life) * 0.55;
    tctx.fillStyle = '#C8F000';
    tctx.beginPath(); tctx.arc(p.x, p.y, p.r, 0, 6.283); tctx.fill();
  }
  tctx.globalAlpha = 1;
}
addEventListener('pointermove', () => { idleT = 0; });

/* ── TICKER (speed reacts to scroll velocity) ── */
const TICKER_TEXT = 'HEAVYWEIGHT 320GSM · MELTED-IN PRINTS · NO RESTOCKS · NUMBERED RUNS · ';
[$('#ticker1'), $('#ticker2')].forEach(track => {
  let html = '';
  for (let i = 0; i < 6; i++) html += `<span>${TICKER_TEXT}</span>`;
  track.innerHTML = html;
});
let tick1 = 0, tick2 = 0, tickW = 0;
function tickerMeasure() { tickW = $('#ticker1').scrollWidth / 2 || 0; }
setTimeout(tickerMeasure, 400); addEventListener('resize', tickerMeasure);
const wrap = (v, w) => w ? ((v % w) + w) % w - w : v; /* keep value in (-w, 0] */
function tickerLoop() {
  if (REDUCED) return;
  const boost = clamp(scrollVel * 0.08, -6, 6);
  tick1 = wrap(tick1 - (1.2 + boost), tickW);
  tick2 = wrap(tick2 + (1.2 + boost), tickW);
  $('#ticker1').style.transform = `translateX(${tick1}px)`;
  $('#ticker2').style.transform = `translateX(${tick2}px)`;
}

/* ── DROP: product cards (CSS/SVG tees, front + back print) ── */
const PRODUCTS = [
  { code: 'AB/001', name: 'TRAVEL TEE',  run: '18/200', price: '119 SAR' },
  { code: 'AB/002', name: 'ANIME TEE',   run: '44/200', price: '119 SAR' },
  { code: 'AB/003', name: 'COUPLES TEE', run: '07/150', price: '119 SAR' },
  { code: 'AB/004', name: 'NOISE TEE',   run: '91/200', price: '119 SAR' },
];
function teeSVG(back) {
  /* heavyweight tee silhouette; back variant carries the AB print */
  return `<svg viewBox="0 0 200 220" xmlns="http://www.w3.org/2000/svg">
    <path d="M62 18 L84 8 Q100 20 116 8 L138 18 L178 44 L162 82 L140 70 L140 204 Q100 214 60 204 L60 70 L38 82 L22 44 Z"
      fill="#1b1b1b" stroke="#2e2e2e" stroke-width="1.5"/>
    <path d="M84 8 Q100 20 116 8 Q112 26 100 26 Q88 26 84 8 Z" fill="#111"/>
    ${back
      ? `<text x="100" y="118" text-anchor="middle" font-family="Archivo Black,sans-serif" font-size="44"
           fill="none" stroke="#C8F000" stroke-width="1.2">AB</text>
         <text x="100" y="140" text-anchor="middle" font-family="IBM Plex Mono,monospace" font-size="8"
           fill="#8A867C" letter-spacing="3">MADE OF NOISE</text>`
      : `<text x="100" y="126" text-anchor="middle" font-family="Archivo Black,sans-serif" font-size="30"
           fill="#F5F1E6" opacity="0.9">AB</text>`}
  </svg>`;
}
const dropGrid = $('#dropGrid');
PRODUCTS.forEach(p => {
  const card = document.createElement('a');
  card.className = 'card';
  card.href = 'https://7is8hb-km.myshopify.com/en';
  card.target = '_blank'; card.rel = 'noopener';
  card.dataset.cursor = 'view';
  card.innerHTML = `
    <div class="card-img front">${teeSVG(false)}</div>
    <div class="card-img back">${teeSVG(true)}</div>
    <span class="card-stamp">${p.code}</span>
    <span class="card-run">${p.run}</span>
    <svg class="card-border" preserveAspectRatio="none" viewBox="0 0 300 400"><rect x="1" y="1" width="298" height="398"/></svg>
    <div class="card-bar">
      <div><div class="card-name">${p.name}</div><div class="card-price">${p.price}</div></div>
      <button class="card-add" aria-label="Quick add ${p.name}">QUICK ADD +</button>
    </div>`;
  card.querySelector('.card-add').addEventListener('click', e => {
    e.preventDefault(); e.stopPropagation();
    const n = $('#cartN');
    n.textContent = +n.textContent + 1;
    n.parentElement.style.transform = 'rotateX(360deg)';
    setTimeout(() => { n.parentElement.style.transition = 'none'; n.parentElement.style.transform = '';
      requestAnimationFrame(() => n.parentElement.style.transition = ''); }, 450);
  });
  dropGrid.appendChild(card);
});
/* grid skew with scroll velocity */
function dropSkewLoop() {
  if (REDUCED) return;
  const sk = clamp(scrollVel * 0.1, -6, 6);
  dropGrid.style.transform = `skewY(${sk * 0.35}deg) skewX(${sk}deg)`;
}

/* ── MANIFESTO: word-by-word scrub + 320 parallax ── */
(function splitWords() {
  const st = $('#maniStatement');
  const walk = node => {
    [...node.childNodes].forEach(n => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach(part => {
          if (!part) return;
          if (/^\s+$/.test(part)) frag.appendChild(document.createTextNode(' '));
          else { const w = document.createElement('span'); w.className = 'w'; w.textContent = part; frag.appendChild(w); }
        });
        node.replaceChild(frag, n);
      } else if (n.nodeType === 1) walk(n);
    });
  };
  walk(st);
})();
const maniWords = $$('#maniStatement .w');
const mani = $('#manifesto'), mani320 = $('#mani320');
function maniLoop() {
  const r = mani.getBoundingClientRect();
  const p = clamp((innerHeight * 0.85 - r.top) / (r.height * 0.9), 0, 1);
  const lit = Math.floor(maniWords.length * p);
  maniWords.forEach((w, i) => w.classList.toggle('lit', i < lit));
  mani320.style.transform = `translateY(${(r.top - innerHeight / 2) * -0.2}px)`;
}

/* ── SOCIAL: auto-scrolling UGC rail, pause on hover ── */
const HANDLES = ['@turki.fits', '@lamafit', '@rakan_jed', '@nawaf.gsm', '@dana_drops', '@fahad.noize'];
const rail = $('#socialRail');
const HUES = [72, 210, 330, 24, 160, 268];
for (let k = 0; k < 12; k++) {
  const i = k % HANDLES.length;
  const c = document.createElement('div');
  c.className = 'ugc';
  c.innerHTML = `
    <div class="ugc-ph" style="background:
      radial-gradient(90% 70% at 50% 30%, hsla(${HUES[i]},60%,50%,0.16), transparent 70%),
      linear-gradient(${160 + i * 25}deg, #191919, #0d0d0d)"></div>
    <span class="ugc-ab chrome-text">AB</span>
    <span class="ugc-handle">${HANDLES[i]}</span>`;
  rail.appendChild(c);
}
let railX = 0, railPause = false, railW = 0;
rail.addEventListener('mouseenter', () => railPause = true);
rail.addEventListener('mouseleave', () => railPause = false);
setTimeout(() => railW = rail.scrollWidth / 2 || 1, 500);
function railLoop() {
  if (REDUCED || railPause) return;
  railX -= 0.6;
  if (railW && railX < -railW) railX += railW;
  rail.style.transform = `translateX(${railX}px)`;
}

/* ── NEWSLETTER: focus caret + scramble confirm ── */
const newsForm = $('#newsForm'), newsInput = $('#newsInput'), newsField = $('.news-field');
newsInput.addEventListener('focus', () => newsField.classList.add('focus'));
newsInput.addEventListener('blur', () => newsField.classList.remove('focus'));
newsForm.addEventListener('submit', e => {
  e.preventDefault();
  if (newsInput.classList.contains('confirmed')) return;
  const MSG = "YOU'RE IN — 001 CONFIRMED";
  newsInput.classList.add('confirmed');
  newsInput.readOnly = true;
  const t0 = performance.now(), DUR = 700;
  (function tick(t) {
    const p = clamp((t - t0) / DUR, 0, 1);
    const solved = Math.floor(MSG.length * p);
    let out = '';
    for (let i = 0; i < MSG.length; i++)
      out += i < solved || MSG[i] === ' ' ? MSG[i] : GLYPHS[(Math.random() * GLYPHS.length) | 0];
    newsInput.value = out;
    if (p < 1) requestAnimationFrame(tick); else newsInput.value = MSG;
  })(t0);
});

/* ── FOOTER: AB letters lean toward cursor + back-to-top ── */
const footAB = $$('#footerAB span');
const footLean = footAB.map(() => ({ x: 0, y: 0, r: 0 }));
function footerLoop() {
  if (!FINE || REDUCED) return;
  const r = $('#footerAB').getBoundingClientRect();
  if (r.top > innerHeight || r.bottom < 0) return;
  const nx = clamp((mx - (r.left + r.width / 2)) / (r.width / 2), -1, 1);
  const ny = clamp((my - (r.top + r.height / 2)) / (r.height / 2), -1, 1);
  footAB.forEach((s, i) => {
    const dir = i === 0 ? 1 : -1;
    const L = footLean[i];
    L.x = lerp(L.x, nx * 30 * dir, 0.08);
    L.y = lerp(L.y, ny * 14, 0.08);
    L.r = lerp(L.r, nx * 5 * dir, 0.08);
    s.style.transform = `translate(${L.x}px,${L.y}px) rotate(${L.r}deg)`;
  });
}
$('#toTop').addEventListener('click', () => {
  if (LERP_ON) scrollTo(0, 0);
  else scrollTo({ top: 0, behavior: REDUCED ? 'auto' : 'smooth' });
});

/* ── CLOCKS (hero + footer, tick every second) ── */
function clockTick() {
  const t = new Date().toLocaleTimeString('en-GB', { hour12: false });
  $('#heroClock').textContent = t + ' AST';
  $('#footClock').textContent = 'JEDDAH — ' + t;
}
clockTick(); setInterval(clockTick, 1000);

/* ── REVEALS (scroll-position driven — no IO, works inside lerp transform) ── */
const revealables = [
  { el: $('#heroLine1'), off: 0 }, /* hero lines revealed by preloader instead */
];
const dropTitleLine = $('.drop-title .rv');
function revealLoop() {
  const r = dropTitleLine.getBoundingClientRect();
  if (r.top < innerHeight * 0.88) dropTitleLine.classList.add('in');
}

/* ── PRELOADER (counter → monogram flash → curtain → hero stagger) ── */
const pre = $('#preloader'), preCount = $('#preCount'), preFill = $('#preFill'), preMono = $('#preMono');
let pv = 0;
function heroEnter() {
  $('#heroLine1').classList.add('in');
  setTimeout(() => $('#heroLine2').classList.add('in'), 80);
  setTimeout(() => { $('.hero-info').classList.add('in'); $('.hero-meta').classList.add('in'); }, 400);
}
if (REDUCED) {
  pre.remove(); heroEnter();
} else {
  const pt = setInterval(() => {
    pv = Math.min(100, pv + Math.random() * 14 + 2);
    preCount.textContent = String(Math.round(pv)).padStart(3, '0');
    preFill.style.width = pv + '%';
    if (pv >= 100) {
      clearInterval(pt);
      preMono.classList.add('flash');
      setTimeout(() => {
        pre.classList.add('lift');
        heroEnter();
        setTimeout(() => pre.remove(), 1100);
      }, 620);
    }
  }, 70);
  /* failsafe: never trap the page behind the preloader */
  setTimeout(() => { if (document.body.contains(pre)) { pre.remove(); heroEnter(); } }, 6000);
}

/* ── MASTER LOOP ── */
(function master() {
  requestAnimationFrame(master);
  scrollLoop();
  cursorLoop();
  magneticLoop();
  navLoop();
  heroLettersLoop();
  heroMonoLoop();
  trailLoop(performance.now());
  tickerLoop();
  dropSkewLoop();
  maniLoop();
  railLoop();
  footerLoop();
  revealLoop();
})();
