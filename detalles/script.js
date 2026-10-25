import { $, artworkImgHTML, artworkPriceHTML, bindImageLoading, escapeHTML, formatArtworkPrice, getContactHref, pageBase } from '../assets/js/common.js';
import { displayImageURL } from '../utils/images.js';

const { works } = window;
const artworkId = new URLSearchParams(window.location.search).get('id');
const artworkIndex = works.findIndex((work) => work.id === artworkId);
const artworkContent = $('#artworkContent');

function thumbHTML(work, direction) {
  const encodedId = encodeURIComponent(work.id);
  const label = direction === 'prev' ? 'Anterior' : 'Siguiente';
  return `<a class="pager-thumb ${direction === 'next' ? 'is-next' : ''}" href="${pageBase}detalles/index.html?id=${encodedId}">
    <div class="artwork-img">
      <img src="${escapeHTML(displayImageURL(work.img, 240))}" alt="" loading="lazy" decoding="async">
    </div>
    <span>
      <span class="pager-thumb-label">${label}</span>
      <span class="pager-thumb-title">${escapeHTML(work.titulo)}</span>
    </span>
  </a>`;
}

if (artworkIndex === -1) {
  artworkContent.innerHTML = `<div class="details-plaque"><h1 class="artwork-title">Obra no encontrada</h1><p class="artwork-desc">La pintura solicitada no está disponible.</p><a class="btn" href="${pageBase}galeria/index.html">Volver a la galería</a></div>`;
} else {
  const work = works[artworkIndex];
  const previous = works[(artworkIndex - 1 + works.length) % works.length];
  const next = works[(artworkIndex + 1) % works.length];
  const priceLabel = formatArtworkPrice(work);
  const message = priceLabel
    ? `Hola Yalain, me interesa la obra "${work.titulo}" (${work.anio}) · ${priceLabel}.`
    : `Hola Yalain, me interesa la obra "${work.titulo}" (${work.anio}).`;
  artworkContent.innerHTML = `
    <div class="details-stage">
      <div>
        <div class="artwork-canvas">${artworkImgHTML(work)}</div>
        <div class="artwork-tools">
          <button class="mini" data-light="${work.id}">Ampliar imagen</button>
          <button class="mini" data-wall="${work.id}">Ver en pared</button>
        </div>
      </div>
      <div class="details-plaque">
        <h1 class="artwork-title">${escapeHTML(work.titulo)}</h1>
        ${artworkPriceHTML(work, { className: 'artwork-price artwork-price--featured' })}
        <dl class="spec">
          <dt>Año</dt><dd>${escapeHTML(work.anio)}</dd>
          <dt>Medidas</dt><dd>${escapeHTML(work.medidas)}</dd>
          <dt>Material</dt><dd>${escapeHTML(work.tecnica)}</dd>
          <dt>Serie</dt><dd>Infinito · 2016 – presente</dd>
        </dl>
        <p class="artwork-desc">${escapeHTML(work.desc)}</p>
        <div class="contact-actions">
          <a class="btn btn--accent" target="_blank" rel="noopener" href="${getContactHref('whatsapp', message)}">Consultar esta obra por WhatsApp</a>
          <a class="btn btn--ghost" href="${getContactHref('email', `Consulta sobre ${work.titulo}`)}">Consultar por correo</a>
        </div>
      </div>
      <nav class="pager pager--thumbs" aria-label="Otras pinturas">
        ${thumbHTML(previous, 'prev')}
        ${thumbHTML(next, 'next')}
      </nav>
    </div>`;
  document.title = `${work.titulo} — Yalain Falcón Yanes`;
  bindImageLoading(artworkContent);
}
