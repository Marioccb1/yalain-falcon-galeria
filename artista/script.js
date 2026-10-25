import { $, bindImageLoading, formatArtworkPrice, pageBase } from '../assets/js/common.js';
import { displayImageURL } from '../utils/images.js';

const { works, IMG } = window;
const profile = window.artistProfile;
const ordered = Array.isArray(works) ? works.filter((work) => work && work.img) : [];

function renderParagraphs(selector, content, { lead = false } = {}) {
  const container = $(selector);
  if (!container) return false;
  const paragraphs = String(content || '')
    .split(/\n\s*\n/)
    .map((text) => text.trim())
    .filter(Boolean);
  container.replaceChildren(...paragraphs.map((text, index) => {
    const paragraph = document.createElement('p');
    if (lead && index === 0) paragraph.className = 'is-lead';
    paragraph.textContent = text;
    return paragraph;
  }));
  return paragraphs.length > 0;
}

function nameLines(title) {
  const lines = String(title || '')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  if (lines.length > 1) return lines;
  const single = lines[0] || 'Yalain Falcón Yanes';
  const parts = single.split(/\s+/).filter(Boolean);
  if (parts.length >= 3) return [parts[0], parts.slice(1).join(' ')];
  return [single];
}

function renderName(title) {
  const heading = $('#artistName');
  if (!heading) return;
  heading.replaceChildren(...nameLines(title).map((line) => {
    const span = document.createElement('span');
    span.textContent = line;
    return span;
  }));
}

function workMeta(work) {
  return [work.anio, work.medidas].filter(Boolean).join(' · ');
}

function setPiecePrice(container, work) {
  if (!container) return;
  let price = container.querySelector('.artwork-price');
  const label = formatArtworkPrice(work);
  if (!label) {
    price?.remove();
    return;
  }
  if (!price) {
    price = document.createElement('p');
    price.className = 'artwork-price artwork-price--piece';
    container.append(price);
  }
  price.textContent = label;
}

function workAlt(work) {
  return [work.titulo, work.tecnica, work.anio].filter(Boolean).join(' — ');
}

function refreshFrame(frame) {
  const image = frame?.querySelector('img');
  if (!frame || !image) return;
  delete image.dataset.imageStateBound;
  frame.classList.remove('image-has-error', 'image-is-loading');
  bindImageLoading(frame);
}

function bindPiece(anchor, work, { width = 1000, caption = false } = {}) {
  if (!anchor) return;
  const figure = anchor.closest('figure') || anchor;
  if (!work) {
    figure.hidden = true;
    return;
  }
  figure.hidden = false;
  anchor.href = `${pageBase}detalles/index.html?id=${encodeURIComponent(work.id)}`;
  anchor.setAttribute('aria-label', `Abrir ficha de ${work.titulo}`);
  const image = anchor.querySelector('img');
  if (image) {
    image.src = displayImageURL(work.img, width);
    image.alt = workAlt(work);
    image.decoding = 'async';
  }
  if (caption) {
    const title = anchor.querySelector('.artist-piece__title');
    const meta = anchor.querySelector('.artist-piece__meta');
    const captionNode = anchor.querySelector('figcaption') || meta?.parentElement || anchor;
    if (title) title.textContent = work.titulo || '';
    if (meta) meta.textContent = workMeta(work);
    setPiecePrice(captionNode, work);
  }
  refreshFrame(anchor.querySelector('.artist-portrait, .artwork-img'));
}

function pieceLink(work, width) {
  const link = document.createElement('a');
  link.className = 'artist-piece';
  link.href = `${pageBase}detalles/index.html?id=${encodeURIComponent(work.id)}`;
  const figure = document.createElement('figure');
  const media = document.createElement('div');
  media.className = 'artwork-img artist-piece__media image-is-loading';
  const image = document.createElement('img');
  image.src = displayImageURL(work.img, width);
  image.alt = workAlt(work);
  image.loading = 'lazy';
  image.decoding = 'async';
  media.append(image);
  const caption = document.createElement('figcaption');
  const title = document.createElement('p');
  title.className = 'artist-piece__title';
  title.textContent = work.titulo || '';
  const meta = document.createElement('p');
  meta.className = 'artist-piece__meta';
  meta.textContent = workMeta(work);
  caption.append(title, meta);
  setPiecePrice(caption, work);
  figure.append(media, caption);
  link.append(figure);
  return link;
}

function selectPlacement(list) {
  const series = list[1] || list[0] || null;
  const pool = list.filter((work) => work !== series);
  const featured = pool.length >= 4 ? pool.slice(0, 4) : list.slice(0, 4);
  const used = new Set([series, ...featured].filter(Boolean).map((work) => work.id));
  const biography = list.find((work) => !used.has(work.id)) || list[0] || null;
  const textures = [...list].reverse().filter((work) => work !== series).slice(0, 2);
  return { series, featured, biography, textures: textures.length ? textures : list.slice(0, 2) };
}

const placement = selectPlacement(ordered);

renderName(profile.hero_title || 'Yalain\nFalcón\nYanes');
const origin = $('#artistOrigin');
if (origin) {
  const place = String(profile.birth_place || '').trim();
  const year = profile.birth_year ? String(profile.birth_year) : '';
  origin.textContent = [place, year].filter(Boolean).join(' · ');
}
const summary = $('#artistSummary');
if (summary) summary.textContent = String(profile.summary || '').trim();

const portraitFrame = $('#artistPortraitMain');
const portrait = portraitFrame?.querySelector('img');
if (portrait) {
  portrait.src = displayImageURL(profile.portrait_url || IMG.artistWide, 1400);
  portrait.alt = 'Retrato de Yalain Falcón Yanes';
  portrait.decoding = 'async';
  portrait.fetchPriority = 'high';
}
if (portraitFrame) refreshFrame(portraitFrame);

renderParagraphs('#artistBiographyContent', profile.biography, { lead: true });
const hasVision = renderParagraphs('#artistVisionContent', profile.artistic_vision);
const visionBlock = $('#artistVision');
if (visionBlock) visionBlock.hidden = !hasVision;

const quote = String(profile.quote || '').trim();
const quotation = $('#artistQuotation');
const quoteEl = $('#artistQuote');
const quoteSign = $('#artistQuoteAttribution');
if (quote && quoteEl) {
  quoteEl.textContent = quote;
  if (quoteSign) {
    const attribution = String(profile.quote_attribution || '').trim();
    quoteSign.textContent = attribution;
    quoteSign.hidden = !attribution;
  }
} else if (quotation) {
  quotation.hidden = true;
}

bindPiece($('#biographyLink'), placement.biography, { width: 1400 });
bindPiece($('#seriesLink'), placement.series, { width: 1400, caption: true });
renderParagraphs('#seriesDescription', profile.series_description);

const fragmentHost = $('#heroFragments');
if (fragmentHost) {
  fragmentHost.replaceChildren(...placement.textures.map((work, index) => {
    const image = document.createElement('img');
    image.className = `artist-hero__fragment artist-hero__fragment--${index === 0 ? 'deep' : 'warm'}`;
    image.src = displayImageURL(work.img, 1400);
    image.alt = '';
    image.decoding = 'async';
    return image;
  }));
}

const featuredColumns = [
  [$('#featuredPrimary'), placement.featured[0] ? [placement.featured[0]] : [], 1400],
  [$('#featuredStack'), placement.featured.slice(1, 3), 1000],
  [$('#featuredClosing'), placement.featured[3] ? [placement.featured[3]] : [], 1400],
];
const featuredGrid = $('#featuredGrid');
if (featuredGrid && !placement.featured.length) {
  featuredGrid.replaceChildren();
  const empty = document.createElement('p');
  empty.className = 'artist-featured__empty';
  empty.textContent = 'Todavía no hay obras publicadas en esta selección.';
  featuredGrid.append(empty);
} else {
  featuredColumns.forEach(([column, columnWorks, width]) => {
    if (!column) return;
    column.hidden = !columnWorks.length;
    column.replaceChildren(...columnWorks.map((work) => pieceLink(work, width)));
  });
  if (featuredGrid) bindImageLoading(featuredGrid);
}
