import { supabase } from '../../utils/supabase.js';

const pageBase = document.body.dataset.base || '';
const works = window.works;
const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

function escapeHTML(value = ''){
  return String(value).replace(/[&<>"']/g, character => ({
    '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'
  })[character]);
}
function safeImageURL(value){
  if(!String(value || '').trim()) return '';
  try{
    const url = new URL(String(value || ''), window.location.href);
    return ['http:', 'https:'].includes(url.protocol) ? url.href : '';
  }catch{
    return '';
  }
}

function artworkImgHTML(w){
  return `<div class="artwork-img">
    <img src="${escapeHTML(safeImageURL(w.img))}" alt="${escapeHTML(`${w.titulo} — ${w.tecnica}, ${w.anio}`)}" loading="lazy">
  </div>`;
}

function cardHTML(w){
  const encodedId = encodeURIComponent(w.id);
  return `<article class="card">
    <div class="card-canvas" data-light="${escapeHTML(w.id)}" role="button" tabindex="0" aria-label="Ampliar ${escapeHTML(w.titulo)}">
      ${artworkImgHTML(w)}
    </div>
    <h3 class="card-title">${escapeHTML(w.titulo)}</h3>
    <p class="card-meta">${escapeHTML(w.anio)} · ${escapeHTML(w.medidas)}</p>
    <div class="card-actions">
      <button class="mini" data-desc="${escapeHTML(w.id)}">Descripción</button>
      <a class="mini" href="${pageBase}detalles/index.html?id=${encodedId}">Ver ficha</a>
    </div>
  </article>`;
}

function renderGrid(selector, list){
  const el = $(selector);
  if(el){
    el.innerHTML = list.map(cardHTML).join('');
    el.classList.remove('is-loading');
    el.setAttribute('aria-busy','false');
  }
}

/* ============================================================
   SALA (VER EN PARED) — SVG
   ============================================================ */
function roomSVG(w){
  return `
  <svg class="room-svg" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${escapeHTML(w.titulo)} en una pared">
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
      <image href="${escapeHTML(safeImageURL(w.img))}" x="700" y="148" width="400" height="500"
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
let lastModalTrigger = null;

function openModal(m){
  lastModalTrigger = document.activeElement;
  m.classList.add('is-open');
  m.setAttribute('aria-hidden','false');
  document.body.style.overflow = 'hidden';
  m.querySelector('.modal-close')?.focus();
}
function closeModals(){
  const wasOpen = [modalDesc, modalLight, modalWall].some((modal) => modal.classList.contains('is-open'));
  [modalDesc, modalLight, modalWall].forEach(m => {
    m.classList.remove('is-open');
    m.setAttribute('aria-hidden','true');
  });
  document.body.style.overflow = '';
  if(wasOpen && lastModalTrigger instanceof HTMLElement && lastModalTrigger.isConnected) lastModalTrigger.focus();
}

function openDescription(id){
  const w = works.find(x => x.id === id);
  if(!w) return;
  const encodedId = encodeURIComponent(w.id);
  $('#modalDescBody').innerHTML = `
    <h3>${escapeHTML(w.titulo)}</h3>
    <p class="modal-meta">${escapeHTML(w.anio)} · ${escapeHTML(w.medidas)} · ${escapeHTML(w.tecnica)}</p>
    <p>${escapeHTML(w.desc)}</p>
    <a class="btn" href="${pageBase}detalles/index.html?id=${encodedId}" data-close>Ver ficha completa</a>
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
      <span>${escapeHTML(w.titulo)} · ${escapeHTML(w.anio)}</span>
      <span>${escapeHTML(w.medidas)} · ${escapeHTML(w.tecnica)}</span>
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
  const openDialog = document.querySelector('.modal.is-open');
  if (event.key === 'Escape') { closeModals(); return; }
  if(event.key === 'Tab' && openDialog){
    const focusable = [...openDialog.querySelectorAll('button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])')]
      .filter((element) => element instanceof HTMLElement && element.getClientRects().length);
    if(!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if(event.shiftKey && document.activeElement === first){
      event.preventDefault();
      last.focus();
    }else if(!event.shiftKey && document.activeElement === last){
      event.preventDefault();
      first.focus();
    }
    return;
  }
  const target = event.target;
  if ((event.key === 'Enter' || event.key === ' ') && target instanceof Element && target.classList.contains('card-canvas')) {
    event.preventDefault();
    openLightbox(target.dataset.light);
  }
});

const menuToggle = $('#menuToggle');
const nav = $('#mainNav');
function closeMenu(){
  nav.classList.remove('is-open');
  menuToggle.setAttribute('aria-expanded','false');
  menuToggle.setAttribute('aria-label','Abrir menú de navegación');
  menuToggle.textContent = 'Menú';
}
menuToggle.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('is-open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación');
  menuToggle.textContent = isOpen ? 'Cerrar' : 'Menú';
});
nav.addEventListener('click', (event) => {
  if(event.target instanceof Element && event.target.closest('a')) closeMenu();
});
document.addEventListener('keydown', (event) => {
  if(event.key === 'Escape') closeMenu();
});

function currentPageLink() {
  const page = document.body.dataset.page;
  if(page === 'home') return nav.querySelector('a[href$="index.html"]:not([href*="#"])');
  const suffix = page === 'artist' ? '/artista/index.html'
    : page === 'gallery' || page === 'details' ? '/galeria/index.html'
      : '';
  return suffix ? [...nav.querySelectorAll('a')].find((link) => {
    const path = new URL(link.href).pathname.replace(/\/index\.html$/i, '/');
    return path.endsWith(suffix.replace(/index\.html$/i, ''));
  }) : null;
}

function normalizePath(path) {
  return path.replace(/\/index\.html$/i, '/').replace(/\/+$/, '/') || '/';
}

function setActiveNavigation(link) {
  nav.querySelectorAll('a[aria-current]').forEach((active) => active.removeAttribute('aria-current'));
  if(link) link.setAttribute('aria-current', link.hash ? 'location' : 'page');
}

function navigationLinkForHash(hash) {
  return [...nav.querySelectorAll('a')].find((link) => {
    const target = new URL(link.href);
    return target.hash === hash && normalizePath(target.pathname) === normalizePath(window.location.pathname);
  });
}

const initialLink = window.location.hash
  ? navigationLinkForHash(window.location.hash)
  : currentPageLink();
setActiveNavigation(initialLink);
window.addEventListener('hashchange', () => {
  if(window.location.hash) setActiveNavigation(navigationLinkForHash(window.location.hash) || currentPageLink());
});

if(document.body.dataset.page === 'home' && 'IntersectionObserver' in window) {
  const sectionLinks = new Map(
    ['artista','galeria','exposiciones','contacto']
      .map((id) => [document.getElementById(id), navigationLinkForHash(`#${id}`)])
      .filter(([section, link]) => section && link),
  );
  const observer = new IntersectionObserver((entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if(visible) setActiveNavigation(sectionLinks.get(visible.target));
  }, { rootMargin: '-18% 0px -62% 0px', threshold: [0, .15, .35, .6] });
  sectionLinks.forEach((_, section) => observer.observe(section));
}

function renderBrand(profile) {
  if(!profile) return;
  const requestedMode = profile.header_brand_mode;
  const mode = ['text','logo','both'].includes(requestedMode) ? requestedMode : 'text';
  const logoUrl = safeImageURL(profile.header_logo_url);
  const showLogo = mode !== 'text' && Boolean(logoUrl);
  const showText = mode !== 'logo' || !showLogo;
  document.querySelectorAll('.brand').forEach((brand) => {
    const createCopy = () => {
      const copy = document.createElement('span');
      copy.className = 'brand-copy';
      copy.append(document.createTextNode('Yalain Falcón'));
      const separator = document.createElement('span');
      separator.setAttribute('aria-hidden','true');
      separator.textContent = '·';
      copy.append(separator,document.createTextNode('Yanes'));
      return copy;
    };
    const contents = [];
    if(showLogo){
      const logo = document.createElement('img');
      logo.className = 'brand-logo';
      logo.src = logoUrl;
      logo.alt = '';
      logo.loading = 'eager';
      logo.addEventListener('error', () => {
        if(!brand.contains(logo)) return;
        logo.remove();
        if(mode === 'logo' && !brand.querySelector('.brand-copy')) brand.append(createCopy());
      });
      contents.push(logo);
    }
    if(showText) contents.push(createCopy());
    brand.replaceChildren(...contents);
    brand.setAttribute('aria-label','Yalain Falcón Yanes');
  });
}

const footerIcons = {
  phone: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M7 3h3l2 5-2 2a15 15 0 0 0 4 4l2-2 5 2v3a2 2 0 0 1-2 2C10 19 5 14 5 5a2 2 0 0 1 2-2Z"/></svg>',
  email: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="3" y="5" width="18" height="14" rx="1"/><path d="m4 7 8 6 8-6"/></svg>',
  whatsapp: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M20 11.5a8 8 0 0 1-12 7l-4 1 1-4a8 8 0 1 1 15-4Z"/><path d="M9 8c.4 2 2 3.6 4 4"/></svg>',
  instagram: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle class="icon-fill" cx="18" cy="6" r="1"/></svg>',
  facebook: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path class="icon-fill" d="M13.4 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.5 1.6-1.5h1.7V4a22 22 0 0 0-2.5-.1c-2.5 0-4.2 1.5-4.2 4.3V10H7.2v3H10v8h3.4Z"/></svg>',
  threads: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 21c-5 0-8-3.4-8-8.7C4 6.9 7 3 12 3c4.6 0 7.5 2.6 8 6.7M12 21c4.3 0 7-2.1 7-5.5 0-3.1-2.2-4.8-6.1-4.8-2.7 0-4.4 1.2-4.4 3.1 0 1.6 1.2 2.6 3 2.6 2.2 0 3.5-1.5 3.5-3.9 0-3.4-1.9-5.5-5-5.5"/></svg>',
};

function contactProfile() {
  return {
    contact_phone: '+53 52932396',
    contact_phone_secondary: '',
    contact_email: 'yalainfalcon@gmail.com',
    whatsapp_number: '5352932396',
    instagram_url: 'https://instagram.com/infinitecubanartist',
    facebook_url: 'https://www.facebook.com/search/top?q=Yalain%20Falc%C3%B3n',
    threads_url: 'https://www.threads.com/@infinitecubanartist',
    ...window.artistProfile,
  };
}

function phoneDigits(value) {
  const digits = String(value || '').replace(/\D/g, '');
  return digits.length >= 7 && digits.length <= 15 ? digits : '';
}

function safeExternalURL(value) {
  try {
    const url = new URL(String(value || '').trim());
    return url.protocol === 'https:' ? url.href : '';
  } catch {
    return '';
  }
}

export function getContactHref(channel, message = '') {
  const profile = contactProfile();
  if (channel === 'whatsapp') {
    const number = phoneDigits(profile.whatsapp_number || profile.contact_phone);
    return number ? `https://wa.me/${number}${message ? `?text=${encodeURIComponent(message)}` : ''}` : '';
  }
  if (channel === 'email') {
    const email = String(profile.contact_email || '').trim();
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
      ? `mailto:${email}${message ? `?subject=${encodeURIComponent(message)}` : ''}`
      : '';
  }
  if (channel === 'phone') {
    const phone = String(message || profile.contact_phone || '').trim();
    const digits = phoneDigits(phone);
    return digits ? `tel:${phone.startsWith('+') ? '+' : ''}${digits}` : '';
  }
  return '';
}

function footerAnchor(href, label, external = false) {
  const link = document.createElement('a');
  link.href = href;
  link.textContent = label;
  if (external) {
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
  }
  return link;
}

function renderFooterLinks() {
  const profile = contactProfile();
  const contactColumn = [...document.querySelectorAll('.footer-col')]
    .find((column) => column.querySelector('h4')?.textContent.trim() === 'Contacto');
  const socialColumn = [...document.querySelectorAll('.footer-col')]
    .find((column) => column.querySelector('h4')?.textContent.trim() === 'Redes');
  if (contactColumn) {
    const heading = contactColumn.querySelector('h4');
    const links = [];
    const phone = String(profile.contact_phone || '').trim();
    const phoneHref = getContactHref('phone');
    if (phoneHref && phone) links.push(footerAnchor(phoneHref, phone));
    const secondary = String(profile.contact_phone_secondary || '').trim();
    const secondaryHref = getContactHref('phone', secondary);
    if (secondaryHref && secondary) links.push(footerAnchor(secondaryHref, secondary));
    const emailHref = getContactHref('email');
    if (emailHref) links.push(footerAnchor(emailHref, profile.contact_email));
    const whatsappHref = getContactHref('whatsapp');
    if (whatsappHref) links.push(footerAnchor(whatsappHref, 'WhatsApp directo', true));
    contactColumn.replaceChildren(heading, ...links);
  }
  if (socialColumn) {
    const heading = socialColumn.querySelector('h4');
    const links = [
      ['instagram_url', 'Instagram', 'instagram'],
      ['facebook_url', 'Facebook', 'facebook'],
      ['threads_url', 'Threads', 'threads'],
    ].flatMap(([field, label, icon]) => {
      const href = safeExternalURL(profile[field]);
      if (!href) return [];
      const link = footerAnchor(href, label, true);
      link.dataset.socialIcon = icon;
      return [link];
    });
    socialColumn.replaceChildren(heading, ...links);
  }
}

function decorateContactActions() {
  document.querySelectorAll('[data-contact-cta]').forEach((link) => {
    const href = getContactHref(link.dataset.contactCta, link.dataset.contactMessage || '');
    if (href) link.href = href;
    else link.hidden = true;
  });
}

function createWhatsappShortcut() {
  if (document.querySelector('.whatsapp-float')) return;
  const link = document.createElement('a');
  link.className = 'whatsapp-float';
  link.dataset.contactCta = 'whatsapp';
  link.dataset.contactMessage = 'Hola, me interesa conocer más sobre las obras de Yalain Falcón Yanes.';
  link.setAttribute('aria-label', 'Contactar por WhatsApp');
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.innerHTML = `<span class="whatsapp-float-icon">${footerIcons.whatsapp}</span><span>WhatsApp</span>`;
  document.body.append(link);
}

function decorateFooterLinks() {
  document.querySelectorAll('.footer-col a').forEach((link) => {
    const href = link.getAttribute('href') || '';
    const icon = href.startsWith('tel:') ? footerIcons.phone
      : href.startsWith('mailto:') ? footerIcons.email
        : href.includes('wa.me') ? footerIcons.whatsapp
          : href.includes('instagram.com') ? footerIcons.instagram
            : href.includes('facebook.com') ? footerIcons.facebook
              : link.dataset.socialIcon === 'threads' || href.includes('threads.com') ? footerIcons.threads : '';
    if(icon) link.insertAdjacentHTML('afterbegin', `<span class="footer-link-icon">${icon}</span>`);
  });
}

let adminLinkCheck = 0;
async function addAdminLink() {
  const check = ++adminLinkCheck;
  try {
    const { data, error } = await supabase.auth.getSession();
    if(error) throw error;
    if(check !== adminLinkCheck) return;
    if(!data.session) {
      nav.querySelector('[data-admin-link]')?.remove();
      return;
    }
    const { data: admin, error: accessError } = await supabase
      .from('cms_admins')
      .select('user_id')
      .eq('user_id', data.session.user.id)
      .maybeSingle();
    if(accessError) throw accessError;
    if(check !== adminLinkCheck) return;
    if(!admin) {
      nav.querySelector('[data-admin-link]')?.remove();
      return;
    }
    if(nav.querySelector('[data-admin-link]')) return;
    const link = document.createElement('a');
    link.href = `${pageBase}cms/`;
    link.textContent = 'Administración';
    link.dataset.adminLink = '';
    nav.append(link);
  } catch(error) {
    if(check === adminLinkCheck) {
      console.error('No se pudo comprobar el acceso al panel de administración.', error);
    }
  }
}

document.addEventListener('cms:profile-ready', (event) => renderBrand(event.detail));
renderBrand(window.artistProfile);
renderFooterLinks();
createWhatsappShortcut();
decorateContactActions();
decorateFooterLinks();
addAdminLink();
supabase.auth.onAuthStateChange((_event, session) => {
  window.setTimeout(() => {
    if(!session) nav.querySelector('[data-admin-link]')?.remove();
    else addAdminLink();
  }, 0);
});

$('#year').textContent = new Date().getFullYear();

export { $, $$, artworkImgHTML, cardHTML, escapeHTML, pageBase, renderGrid };
