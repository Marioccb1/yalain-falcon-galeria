import { $, artworkImgHTML, renderGrid } from './assets/js/common.js';

const { works, IMG } = window;
renderGrid('#homeGrid', works.slice(0, 3));
const heroWork = works[6] || works[0];
if (heroWork) {
  $('#heroCanvas').innerHTML = artworkImgHTML(heroWork);
  $('#heroCaption').textContent = `${heroWork.titulo} · ${heroWork.anio} · ${heroWork.medidas}`;
}

const profile = window.artistProfile;
$('#homeBioSummary').textContent = profile.summary;
$('#homeQuote').textContent = `«${profile.quote}»`;

const artistPreview = document.createElement('img');
artistPreview.src = profile.portrait_url || IMG.artistPreview;
artistPreview.alt = 'Retrato de Yalain Falcón Yanes en su taller';
artistPreview.loading = 'lazy';
$('#artistPreview').replaceChildren(artistPreview);

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
