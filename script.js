import { $, artworkImgHTML, artworkPriceHTML, artworkRatio, bindImageLoading, escapeHTML, getContactHref, renderHang } from './assets/js/common.js';
import { displayImageURL } from './utils/images.js';

const { works, IMG } = window;
const featuredWorks = works.slice(0, 5);
renderHang('#homeGrid', featuredWorks, { mode: 'salon' });
$('#homeWorkCount').textContent = works.length;
const salaDecorFragment = $('#salaDecorFragment');
const decorWork = featuredWorks[2] || featuredWorks[0];
if (salaDecorFragment && decorWork?.img) {
  salaDecorFragment.src = displayImageURL(decorWork.img, 900);
}
const profile = window.artistProfile;
const heroWork = works[6] || works[0];
const heroTitle = $('#heroTitle');
const titleLines = String(profile.hero_title || 'Yalain\nFalcón\nYanes').split(/\r?\n/);
let accentLine = -1;
titleLines.forEach((line, index) => {
  if(line.trim()) accentLine = index;
});
heroTitle.replaceChildren();
titleLines.forEach((line, index) => {
  if(index) heroTitle.append(document.createElement('br'));
  if(index === accentLine && line.trim()){
    const emphasis = document.createElement('em');
    emphasis.textContent = line;
    heroTitle.append(emphasis);
  }else{
    heroTitle.append(document.createTextNode(line));
  }
});
const heroEyebrow = $('#heroEyebrow');
if (heroEyebrow) {
  heroEyebrow.textContent = profile.hero_eyebrow || 'Pintura contemporánea · Cuba';
}
$('#heroIntro').textContent = profile.hero_intro || profile.summary;
const heroImage = document.createElement('img');
heroImage.src = displayImageURL(profile.hero_image_url || heroWork?.img || IMG.inf31, 1000);
heroImage.alt = profile.hero_image_alt || heroWork?.titulo || 'Obra de la serie Infinito';
heroImage.fetchPriority = 'high';
heroImage.decoding = 'async';
const heroImageFrame = document.createElement('div');
heroImageFrame.className = 'artwork-img image-is-loading';
heroImageFrame.append(heroImage);
$('#heroCanvas')?.replaceChildren(heroImageFrame);
bindImageLoading(heroImageFrame);
if (heroWork) {
  const heroCaption = $('#heroCaption');
  if (heroCaption) {
    const price = artworkPriceHTML(heroWork, { tag: 'span', className: 'artwork-price artwork-price--inline' });
    heroCaption.innerHTML = `${escapeHTML(heroWork.titulo)} · ${escapeHTML(heroWork.anio)} · ${escapeHTML(heroWork.medidas)}${price ? ` · ${price}` : ''}`;
  }
  const wallFeatureButton = $('#wallFeatureButton');
  if (wallFeatureButton) wallFeatureButton.dataset.wall = heroWork.id;
  const wallFeatureArtwork = $('#wallFeatureArtwork');
  if (wallFeatureArtwork) {
    wallFeatureArtwork.style.setProperty('--wall-art-ar', artworkRatio(heroWork));
    wallFeatureArtwork.innerHTML = artworkImgHTML(heroWork, 800);
    const wallImg = wallFeatureArtwork.querySelector('img');
    if (wallImg) {
      wallImg.loading = 'eager';
      wallImg.decoding = 'async';
    }
    bindImageLoading(wallFeatureArtwork);
  }
}

const homeBioSummary = $('#homeBioSummary');
if (homeBioSummary) homeBioSummary.textContent = profile.summary;
const homeQuote = $('#homeQuote');
if (homeQuote) homeQuote.textContent = `«${profile.quote}»`;

const artistPreviewFrame = $('#artistPreview');
if (artistPreviewFrame) {
  const artistPreview = document.createElement('img');
  artistPreview.src = displayImageURL(profile.portrait_url || IMG.artistPreview, 1000);
  artistPreview.alt = 'Retrato de Yalain Falcón Yanes en su taller';
  artistPreview.loading = 'lazy';
  artistPreview.decoding = 'async';
  artistPreviewFrame.classList.add('image-is-loading');
  artistPreviewFrame.replaceChildren(artistPreview);
  bindImageLoading(artistPreviewFrame);
}

const contactForm = $('#artistContactForm');
contactForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const status = $('#contactFormStatus');
  const formData = new FormData(contactForm);
  const name = String(formData.get('name') || '').trim();
  const email = String(formData.get('email') || '').trim();
  const message = String(formData.get('message') || '').trim();
  const subject = `Mensaje desde el sitio · ${name}`;
  const mailto = getContactHref('email', subject);

  if (!mailto) {
    status.textContent = 'El artista aún no ha configurado un correo de contacto.';
    status.classList.add('is-error');
    return;
  }

  const body = `Nombre: ${name}\nCorreo de respuesta: ${email}\n\nMensaje:\n${message}`;
  status.textContent = 'Se abrirá tu aplicación de correo para que revises y envíes el mensaje.';
  status.classList.remove('is-error');
  window.location.href = `${mailto}&body=${encodeURIComponent(body)}`;
});

const contactEmail = String(profile.contact_email || '').trim();
const contactHelp = $('#contactFormHelp');
if (contactEmail && contactHelp) {
  contactHelp.textContent = `El mensaje se preparará para ${contactEmail} en tu aplicación de correo.`;
}

const exhibitionsList = $('#homeExhibitionsList');
exhibitionsList.replaceChildren(...window.exhibitions.map((exhibition) => {
  const row = document.createElement('div');
  row.className = 'exp-row';
  for (const [className, value] of [
    ['exp-year', exhibition.year],
    ['exp-name', exhibition.title],
    ['exp-place', exhibition.place],
  ]) {
    const cell = document.createElement('div');
    cell.className = className;
    cell.textContent = value;
    row.append(cell);
  }
  return row;
}));

if(window.location.hash){
  requestAnimationFrame(() => {
    document.getElementById(window.location.hash.slice(1))
      ?.scrollIntoView({ block: 'start', behavior: 'auto' });
  });
}
