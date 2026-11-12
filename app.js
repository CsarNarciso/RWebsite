const base = 'assets/Secciones de Productos/';
const $ = s => document.querySelector(s);
$('.menu').addEventListener('click', () => { const open = $('#nav').classList.toggle('open'); $('.menu').setAttribute('aria-expanded', open) }); document.querySelectorAll('#nav a').forEach(a => a.addEventListener('click', () => { $('#nav').classList.remove('open'); $('.menu').setAttribute('aria-expanded', 'false') }));

const galleries = { panels: { title: 'Panel hospitalario PNL-1000', images: ['Paneles/PNL-1000 1.webp', 'Paneles/PNL-1000 2.webp', 'Paneles/Paneles Portada.webp'] }, columns: { title: 'Columna cielítica retráctil', images: ['Columnas cieliticas/Columna Cielitica Rectatil 2.webp',  'Columnas cieliticas/Columna Cielitica Rectatil 1.webp', 'Columnas cieliticas/Columnas Cieliticas Portada.webp'] }, catalog: { title: 'Catálogo arquitectónico — Portada', images: ['assets/Catalogo Arquitectonico.webp'] } };
let gallery, index = 0; function showImage() { const g = galleries[gallery]; $('#gallery-image').src = gallery === 'catalog' ? g.images[index] : base + g.images[index]; $('#gallery-image').alt = g.title + ' — Imagen ' + (index + 1); $('#gallery-count').textContent = `${index + 1} / ${g.images.length}`; $('#prev').hidden = $('#next').hidden = g.images.length === 1 }
document.querySelectorAll('[data-gallery]').forEach(b => b.addEventListener('click', () => { gallery = b.dataset.gallery; index = 0; $('#gallery-title').textContent = galleries[gallery].title; showImage(); $('#gallery').showModal() })); function move(n) { index = (index + n + galleries[gallery].images.length) % galleries[gallery].images.length; showImage() } $('#prev').addEventListener('click', () => move(-1)); $('#next').addEventListener('click', () => move(1)); $('#close-gallery').addEventListener('click', () => $('#gallery').close()); $('#gallery').addEventListener('click', e => { if (e.target === $('#gallery')) { const r = e.target.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) e.target.close() } }); $('#gallery').addEventListener('keydown', e => { if (e.key === 'ArrowRight') move(1); if (e.key === 'ArrowLeft') move(-1) });

const rotatorTrack = document.getElementById('rotatorTrack');
const rotatorCards = rotatorTrack ? Array.from(rotatorTrack.querySelectorAll('.rotator-card')) : [];
const rotatorDots = document.getElementById('rotatorDots');
let rotIndex = 0, rotTimer = null, rotOver = false; const ROT_DELAY = 4500;
const rotReduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function rotUpdate() { const n = rotatorCards.length; rotatorCards.forEach((c, i) => { let off = i - rotIndex; if (off > n / 2) off -= n; if (off < -n / 2) off += n; const abs = Math.abs(off); c.style.setProperty('--rot-offset', off); c.style.setProperty('--rot-abs', abs); c.classList.toggle('is-active', off === 0); c.setAttribute('aria-hidden', off === 0 ? 'false' : 'true'); c.style.zIndex = String(10 - abs); }); if (rotatorDots) rotatorDots.querySelectorAll('button').forEach((b, i) => b.setAttribute('aria-current', i === rotIndex ? 'true' : 'false')); }
function rotGo(i) { const n = rotatorCards.length; rotIndex = (i + n) % n; rotUpdate(); }
function rotNext() { rotGo(rotIndex + 1); } function rotPrev() { rotGo(rotIndex - 1); }
function rotStart() { rotStop(); if (!rotReduce) rotTimer = setInterval(rotNext, ROT_DELAY); }
function rotStop() { if (rotTimer) { clearInterval(rotTimer); rotTimer = null; } }

/* Arrastre horizontal (ratón y táctil): el carrusel GIRA sobre su eje,
   sin desplazarse de su lugar. Las tarjetas se mueven por el arco del
   coverflow según la fracción de tarjeta arrastrada. */
const ROT_DRAG_SPAN = 400;   /* px que equivalen a una tarjeta */
const ROT_DRAG_MIN = .3;     /* fracción de tarjeta para cambiar */
function rotBindDrag(vp) {
  let dragging = false, startX = 0, startY = 0, dx = 0, axis = null, pid = null;
  let moved = false;

  const paint = t => {
    const n = rotatorCards.length;
    rotatorCards.forEach((c, i) => {
      let off = i - rotIndex + t;
      if (off > n / 2) off -= n;
      if (off < -n / 2) off += n;
      c.style.setProperty('--rot-offset', off.toFixed(3));
      c.style.setProperty('--rot-abs', Math.abs(off).toFixed(3));
      c.style.zIndex = String(10 - Math.round(Math.abs(off)));
      c.setAttribute('aria-hidden', Math.abs(off) < .5 ? 'false' : 'true');
    });
  };

  /* Cancela el arrastre nativo de la imagen/enlace: si no, el navegador
     "roba" el gesto (fantasma con la ruta) y el carrusel no se mueve. */
  vp.addEventListener('dragstart', e => e.preventDefault());

  vp.addEventListener('pointerdown', e => {
    if (e.button > 0) return;
    dragging = true; axis = null; dx = 0; pid = e.pointerId;
    startX = e.clientX; startY = e.clientY;
    rotStop();
  });

  vp.addEventListener('pointermove', e => {
    if (!dragging) return;
    const mx = e.clientX - startX, my = e.clientY - startY;
    if (!axis) {
      if (Math.abs(mx) < 6 && Math.abs(my) < 6) return;
      axis = Math.abs(mx) > Math.abs(my) ? 'x' : 'y';
      if (axis === 'x') {
        vp.classList.add('is-dragging');
        rotatorCards.forEach(c => c.classList.remove('is-active'));
        /* La captura solo cuando ya es un arrastre horizontal: si se captura
           en pointerdown, el click se despacha al viewport y la tarjeta
           deja de navegar. */
        try { vp.setPointerCapture(pid); } catch (err) {}
      }
    }
    if (axis !== 'x') return;
    e.preventDefault();
    dx = mx;
    if (Math.abs(dx) > 8) moved = true;
    paint(Math.max(-1, Math.min(1, dx / ROT_DRAG_SPAN)));
  });

  const end = () => {
    if (!dragging) return;
    dragging = false;
    if (axis === 'x') {
      const t = Math.max(-1, Math.min(1, dx / ROT_DRAG_SPAN));
      if (Math.abs(t) > ROT_DRAG_MIN) { if (t < 0) rotNext(); else rotPrev(); }
      else rotUpdate();
    }
    vp.classList.remove('is-dragging');
    try { if (pid !== null) vp.releasePointerCapture(pid); } catch (err) {}
    axis = null; dx = 0; pid = null;
    /* La bandera vive un instante: justo lo que tarda en llegar el click
       de este mismo gesto. Si no hay click, se limpia sola. */
    setTimeout(() => { moved = false; }, 0);
    if (!rotOver) rotStart();
  };
  vp.addEventListener('pointerup', end);
  vp.addEventListener('pointercancel', end);
  vp.addEventListener('lostpointercapture', end);
  /* Un arrastre no debe activar el enlace de la tarjeta. */
  vp.addEventListener('click', e => { if (moved) { e.preventDefault(); e.stopPropagation(); } }, true);
}
if (rotatorCards.length) { if (rotatorDots) { rotatorCards.forEach((_, i) => { const b = document.createElement('button'); b.type = 'button'; b.setAttribute('aria-label', 'Seccion ' + (i + 1)); b.addEventListener('click', () => { rotGo(i); rotStart(); }); rotatorDots.appendChild(b); }); } rotUpdate(); rotStart(); const vp = document.getElementById('rotatorViewport'); if (vp) { vp.addEventListener('mouseenter', () => { rotOver = true; rotStop(); }); vp.addEventListener('mouseleave', () => { rotOver = false; rotStart(); }); rotBindDrag(vp); } }