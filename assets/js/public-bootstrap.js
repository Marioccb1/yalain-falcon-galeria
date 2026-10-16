import './data.js';
import { supabase } from '../../utils/supabase.js';

const page = document.querySelector('script[data-page]')?.dataset.page;
const pageLoaders = {
  home: () => import('../../script.js'),
  artist: () => import('../../artista/script.js'),
  gallery: () => import('../../galeria/script.js'),
  details: () => import('../../detalles/script.js'),
};

if (!page || !pageLoaders[page]) {
  throw new Error('The page module was not configured.');
}

try {
  const [artworksResult, profileResult, exhibitionsResult] = await Promise.all([
    supabase
      .from('cms_artworks')
      .select('*')
      .eq('published', true)
      .order('sort_order', { ascending: true }),
    supabase.from('cms_artist_profile').select('*').eq('id', 1).maybeSingle(),
    supabase
      .from('cms_exhibitions')
      .select('*')
      .eq('published', true)
      .order('sort_order', { ascending: true }),
  ]);

  const queryError = artworksResult.error || profileResult.error || exhibitionsResult.error;
  if (queryError) throw queryError;
  if (!profileResult.data) throw new Error('The artist profile has not been configured.');

  window.works = artworksResult.data.map((artwork) => ({
    id: artwork.id,
    titulo: artwork.title,
    numero: artwork.number,
    anio: artwork.year,
    medidas: artwork.dimensions,
    tecnica: artwork.technique,
    color: artwork.color,
    color2: artwork.color2,
    fg: artwork.foreground_color,
    frase: artwork.phrase,
    img: artwork.image_url,
    desc: artwork.description,
  }));
  window.artistProfile = profileResult.data;
  window.exhibitions = exhibitionsResult.data;
} catch (error) {
  console.error('No se pudo cargar el contenido del CMS; se muestran los datos locales.', error);
  const notice = document.createElement('p');
  notice.className = 'site-data-warning';
  notice.setAttribute('role', 'status');
  notice.textContent = 'No se pudo actualizar el contenido. Se muestran los datos guardados en el sitio.';
  document.body.prepend(notice);
}

await import('./common.js');
await pageLoaders[page]();
