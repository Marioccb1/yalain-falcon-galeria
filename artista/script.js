import { $, renderGrid } from '../assets/js/common.js';

const { works, IMG } = window;
renderGrid('#seriesGrid', works.slice(0, 6));

const profile = window.artistProfile;
$('#artistOrigin').textContent = `${profile.birth_place} · ${profile.birth_year}`;
$('#artistSummary').textContent = profile.summary;
$('#artistQuote').textContent = `«${profile.quote}»`;
$('#artistQuoteAttribution').textContent = profile.quote_attribution;

function renderParagraphs(selector, content) {
  const container = $(selector);
  const paragraphs = content
    .split(/\n\s*\n/)
    .map((text) => text.trim())
    .filter(Boolean)
    .map((text) => {
      const paragraph = document.createElement('p');
      paragraph.textContent = text;
      return paragraph;
    });
  container.replaceChildren(...paragraphs);
}

renderParagraphs('#artistBiographyContent', profile.biography);
renderParagraphs('#artistVisionContent', profile.artistic_vision);
renderParagraphs('#seriesDescription', profile.series_description);

const artistPortrait = document.createElement('img');
artistPortrait.src = profile.portrait_url || IMG.artistWide;
artistPortrait.alt = 'Yalain Falcón Yanes trabajando en el taller';
artistPortrait.loading = 'lazy';
$('#artistPortraitMain').replaceChildren(artistPortrait);
