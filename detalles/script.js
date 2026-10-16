import { $, artworkImgHTML, escapeHTML, pageBase } from '../assets/js/common.js';

const { works, WHATSAPP } = window;
const artworkId = new URLSearchParams(window.location.search).get('id');
const artworkIndex = works.findIndex((work) => work.id === artworkId);
const artworkContent = $('#artworkContent');

if (artworkIndex === -1) {
  artworkContent.innerHTML = `<h1 class="section-title">Obra no encontrada</h1><p class="section-sub">La pintura solicitada no esta disponible.</p><a class="btn" href="${pageBase}galeria/index.html">Volver a la galeria</a>`;
} else {
  const work = works[artworkIndex];
  const previous = works[(artworkIndex - 1 + works.length) % works.length];
  const next = works[(artworkIndex + 1) % works.length];
  const message = encodeURIComponent(`Hola Yalain, me interesa la obra "${work.titulo}" (${work.anio}).`);
  const previousId = encodeURIComponent(previous.id);
  const nextId = encodeURIComponent(next.id);
  artworkContent.innerHTML = `
    <div class="artwork-grid">
      <div>
        <div class="artwork-canvas">${artworkImgHTML(work)}</div>
        <div class="artwork-tools">
          <button class="mini" data-light="${work.id}">Ampliar imagen</button>
          <button class="mini" data-wall="${work.id}">Ver en pared</button>
        </div>
      </div>
      <div>
        <p class="eyebrow eyebrow--accent">Serie Infinito</p>
        <h1 class="artwork-title">${escapeHTML(work.titulo)}</h1>
        <dl class="spec">
          <dt>Año</dt><dd>${escapeHTML(work.anio)}</dd>
          <dt>Medidas</dt><dd>${escapeHTML(work.medidas)}</dd>
          <dt>Material</dt><dd>${escapeHTML(work.tecnica)}</dd>
          <dt>Serie</dt><dd>Infinito · 2016 – presente</dd>
        </dl>
        <p class="artwork-desc">${escapeHTML(work.desc)}</p>
        <a class="btn btn--accent" target="_blank" rel="noopener" href="https://wa.me/${WHATSAPP}?text=${message}">Contactar por WhatsApp</a>
      </div>
    </div>
    <nav class="pager" aria-label="Otras pinturas">
      <a class="pager-link" href="${pageBase}detalles/index.html?id=${previousId}">← ${escapeHTML(previous.titulo)}</a>
      <a class="pager-link" href="${pageBase}detalles/index.html?id=${nextId}">${escapeHTML(next.titulo)} →</a>
    </nav>`;
  document.title = `${work.titulo} — Yalain Falcón Yanes`;
}
