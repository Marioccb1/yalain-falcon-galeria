import { $, artworkImgHTML, getContactHref, renderGrid } from './assets/js/common.js';

const { works, IMG } = window;
renderGrid('#homeGrid', works.slice(0, 3));
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
$('#heroEyebrow').textContent = profile.hero_eyebrow || 'Pintura contemporánea · Cuba';
$('#heroIntro').textContent = profile.hero_intro || profile.summary;
const heroImage = document.createElement('img');
heroImage.src = profile.hero_image_url || heroWork?.img || IMG.inf31;
heroImage.alt = profile.hero_image_alt || heroWork?.titulo || 'Obra de la serie Infinito';
heroImage.fetchPriority = 'high';
heroImage.decoding = 'async';
const heroImageFrame = document.createElement('div');
heroImageFrame.className = 'artwork-img';
heroImageFrame.append(heroImage);
$('#heroCanvas').replaceChildren(heroImageFrame);
if (heroWork) {
  $('#heroCaption').textContent = `${heroWork.titulo} · ${heroWork.anio} · ${heroWork.medidas}`;
}

$('#homeBioSummary').textContent = profile.summary;
$('#homeQuote').textContent = `«${profile.quote}»`;

const artistPreview = document.createElement('img');
artistPreview.src = profile.portrait_url || IMG.artistPreview;
artistPreview.alt = 'Retrato de Yalain Falcón Yanes en su taller';
artistPreview.loading = 'lazy';
$('#artistPreview').replaceChildren(artistPreview);

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
