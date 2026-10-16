const pageBase = document.body.dataset.base || '';
const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

function artworkImgHTML(w){
  return `<div class="artwork-img">
    <img src="${w.img}" alt="${w.titulo} — ${w.tecnica}, ${w.anio}" loading="lazy">
  </div>`;
}

function cardHTML(w){
  return `<article class="card">
    <div class="card-canvas" data-light="${w.id}" role="button" tabindex="0" aria-label="Ampliar ${w.titulo}">
      ${artworkImgHTML(w)}
    </div>
    <h3 class="card-title">${w.titulo}</h3>
    <p class="card-meta">${w.anio} · ${w.medidas}</p>
    <div class="card-actions">
      <button class="mini" data-desc="${w.id}">Descripción</button>
      <a class="mini" href="${pageBase}detalles/index.html?id=${w.id}">Ver ficha</a>
    </div>
  </article>`;
}

function renderGrid(selector, list){
  const el = $(selector);
  if(el) el.innerHTML = list.map(cardHTML).join('');
}

/* ============================================================
   SALA (VER EN PARED) — SVG
   ============================================================ */
function roomSVG(w){
  return `
  <svg class="room-svg" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${w.titulo} en una pared">
    <defs>
      <linearGradient id="wallG" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#F7F2E9"/><stop offset="1" stop-color="#E8E0D2"/>
      </linearGradient>
      <linearGradient id="floorG" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#C9AC83"/><stop offset="1" stop-color="#A3855F"/>
      </linearGradient>
      <linearGradient id="gloss" x1="0" y1="0" x2="0.6" y2="1">
        <stop offset="0" stop-color="#ffffff" stop-opacity=".22"/>
        <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
      </linearGradient>
      <clipPath id="artClip"><rect x="700" y="148" width="400" height="500"/></clipPath>
    </defs>

    <!-- pared -->
    <rect width="1600" height="720" fill="url(#wallG)"/>
    <!-- suelo -->
    <rect y="720" width="1600" height="280" fill="url(#floorG)"/>
    <g stroke="rgba(90,68,42,.16)" stroke-width="2">
      <line x1="0" y1="782" x2="1600" y2="782"/>
      <line x1="0" y1="862" x2="1600" y2="862"/>
      <line x1="0" y1="944" x2="1600" y2="944"/>
      <line x1="250" y1="720" x2="110" y2="1000"/>
      <line x1="690" y1="720" x2="630" y2="1000"/>
      <line x1="1130" y1="720" x2="1190" y2="1000"/>
    </g>
    <!-- zócalo -->
    <rect y="698" width="1600" height="24" fill="#E3D9C8"/>
    <rect y="696" width="1600" height="3" fill="rgba(0,0,0,.10)"/>

    <!-- sofá -->
    <g>
      <rect x="140" y="556" width="430" height="150" fill="#8C8377"/>
      <rect x="120" y="690" width="470" height="90" fill="#9D9486"/>
      <rect x="120" y="770" width="470" height="16" fill="#7A7267"/>
      <rect x="160" y="786" width="26" height="44" fill="#5E574D"/>
      <rect x="524" y="786" width="26" height="44" fill="#5E574D"/>
      <rect x="300" y="640" width="130" height="70" fill="#A79E90"/>
    </g>

    <!-- lámpara de pie -->
    <g>
      <rect x="1512" y="520" width="7" height="330" fill="#3A362F"/>
      <path d="M1458 520 L1573 520 L1552 448 L1479 448 Z" fill="#E3D9C6" stroke="#3A362F" stroke-width="3"/>
      <rect x="1470" y="846" width="90" height="10" fill="#3A362F"/>
    </g>

    <!-- planta -->
    <g transform="translate(1330,600)">
      <path d="M0 128 C -96 62 -84 -34 -12 -66 C 2 -2 -8 62 0 128 Z" fill="#5F6E4E"/>
      <path d="M0 128 C 96 62 84 -34 12 -66 C -2 -2 8 62 0 128 Z" fill="#6E7E59"/>
      <path d="M0 128 C -34 42 -22 -46 0 -100 C 22 -46 34 42 0 128 Z" fill="#546345"/>
      <path d="M-58 128 L58 128 L44 236 L-44 236 Z" fill="#B9A88E"/>
      <rect x="-62" y="120" width="124" height="16" fill="#A8977D"/>
    </g>

    <!-- sombra del cuadro -->
    <rect x="712" y="160" width="400" height="500" fill="rgba(20,16,10,.18)"/>

    <!-- cuadro real (imagen) -->
    <g clip-path="url(#artClip)">
      <image href="${w.img}" x="700" y="148" width="400" height="500"
             preserveAspectRatio="xMidYMid slice" crossorigin="anonymous"/>
    </g>
    <rect x="700" y="148" width="400" height="500" fill="url(#gloss)"/>
    <rect x="700" y="148" width="400" height="500" fill="none" stroke="rgba(0,0,0,.20)" stroke-width="2"/>
  </svg>`;
}

/* ============================================================
   MODALES
   ============================================================ */
const modalDesc  = $('#modalDesc');
const modalLight = $('#modalLight');
const modalWall  = $('#modalWall');

function openModal(m){
  m.classList.add('is-open');
  m.setAttribute('aria-hidden','false');
  document.body.style.overflow = 'hidden';
}
function closeModals(){
  [modalDesc, modalLight, modalWall].forEach(m => {
    m.classList.remove('is-open');
    m.setAttribute('aria-hidden','true');
  });
  document.body.style.overflow = '';
}

function openDescription(id){
  const w = works.find(x => x.id === id);
  if(!w) return;
  $('#modalDescBody').innerHTML = `
    <h3>${w.titulo}</h3>
    <p class="modal-meta">${w.anio} · ${w.medidas} · ${w.tecnica}</p>
    <p>${w.desc}</p>
    <a class="btn" href="${pageBase}detalles/index.html?id=${w.id}" data-close>Ver ficha completa</a>
  `;
  openModal(modalDesc);
}

function openLightbox(id){
  const w = works.find(x => x.id === id);
  if(!w) return;
  $('#lightboxBody').innerHTML = artworkImgHTML(w);
  openModal(modalLight);
}

function openWall(id){
  const w = works.find(x => x.id === id);
  if(!w) return;
  $('#wallBody').innerHTML = `
    ${roomSVG(w)}
    <div class="wall-caption">
      <span>${w.titulo} · ${w.anio}</span>
      <span>${w.medidas} · ${w.tecnica}</span>
    </div>
  `;
  openModal(modalWall);
}



document.addEventListener('click', (event) => {
  const target = event.target;
  if (!(target instanceof Element)) return;
  if (target.closest('[data-close]')) { closeModals(); return; }
  const light = target.closest('[data-light]');
  if (light) { openLightbox(light.dataset.light); return; }
  const description = target.closest('[data-desc]');
  if (description) { openDescription(description.dataset.desc); return; }
  const wall = target.closest('[data-wall]');
  if (wall) openWall(wall.dataset.wall);
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') { closeModals(); return; }
  const target = event.target;
  if ((event.key === 'Enter' || event.key === ' ') && target instanceof Element && target.classList.contains('card-canvas')) {
    event.preventDefault();
    openLightbox(target.dataset.light);
  }
});

const menuToggle = $('#menuToggle');
menuToggle.addEventListener('click', () => {
  const nav = $('#mainNav');
  const isOpen = nav.classList.toggle('is-open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.textContent = isOpen ? 'Cerrar' : 'Menú';
});

$('#year').textContent = new Date().getFullYear();
