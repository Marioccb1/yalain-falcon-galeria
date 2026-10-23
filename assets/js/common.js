import { supabase } from '../../utils/supabase.js';
import salaSceneUrl from '../img/sala.webp';
import cuartoSceneUrl from '../img/cuarto.webp';
import comedorSceneUrl from '../img/comedor.webp';

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

const wallScenes = [
  { id:'sala', label:'Sala', src:salaSceneUrl },
  { id:'cuarto', label:'Habitación', src:cuartoSceneUrl },
  { id:'comedor', label:'Comedor', src:comedorSceneUrl },
];

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
    <div class="wall-preview">
      <img class="wall-scene-image" src="${wallScenes[0].src}" alt="" aria-hidden="true">
      <div class="wall-frame">${artworkImgHTML(w)}</div>
    </div>
    <div class="wall-scene-picker" role="group" aria-label="Elige el espacio donde ver la pintura">
      <p class="wall-scene-heading">Elige un espacio</p>
      <div class="wall-scene-options">
        ${wallScenes.map((scene, index) => `
          <button class="wall-scene-option" type="button" data-wall-scene="${scene.id}" aria-pressed="${index === 0}">
            <img src="${scene.src}" alt="" loading="lazy">
            <span>${scene.label}</span>
          </button>
        `).join('')}
      </div>
    </div>
    <div class="wall-caption">
      <span>${escapeHTML(w.titulo)} · ${escapeHTML(w.anio)}</span>
      <span data-wall-scene-announcement aria-live="polite">Vista seleccionada: ${wallScenes[0].label}</span>
      <span>${escapeHTML(w.medidas)} · ${escapeHTML(w.tecnica)}</span>
    </div>
  `;
  openModal(modalWall);
}

function selectWallScene(id){
  const scene = wallScenes.find((option) => option.id === id);
  if(!scene) return;
  $('.wall-scene-image', modalWall).src = scene.src;
  $$('[data-wall-scene]', modalWall).forEach((button) => {
    button.setAttribute('aria-pressed', String(button.dataset.wallScene === scene.id));
  });
  $('[data-wall-scene-announcement]', modalWall).textContent = `Vista seleccionada: ${scene.label}`;
}

document.addEventListener('click', (event) => {
  const target = event.target;
  if (!(target instanceof Element)) return;
  if (target.closest('[data-close]')) { closeModals(); return; }
  const wallScene = target.closest('[data-wall-scene]');
  if (wallScene) { selectWallScene(wallScene.dataset.wallScene); return; }
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
  const header = $('.header-inner');
  const navigation = $('#mainNav', header);
  const link = document.querySelector('.whatsapp-shortcut') || document.createElement('a');
  link.className = 'whatsapp-shortcut';
  link.dataset.contactCta = 'whatsapp';
  link.dataset.contactMessage = 'Hola, me interesa conocer más sobre las obras de Yalain Falcón Yanes.';
  link.setAttribute('aria-label', 'Contactar por WhatsApp');
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  if (!link.querySelector('.whatsapp-shortcut-icon')) {
    link.innerHTML = `<span class="whatsapp-shortcut-icon" aria-hidden="true">${footerIcons.whatsapp}</span><span>WhatsApp</span>`;
  }
  const mobileNavigation = window.matchMedia('(max-width: 899px)');
  const placeShortcut = () => {
    if (mobileNavigation.matches) navigation.append(link);
    else header.insertBefore(link, $('.menu-toggle', header));
  };
  placeShortcut();
  mobileNavigation.addEventListener('change', placeShortcut);
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
