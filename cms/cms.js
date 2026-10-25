import { supabase } from '../utils/supabase.js';
import { displayImageURL } from '../utils/images.js';

const $ = (selector, root = document) => root.querySelector(selector);
const authLoading = $('#authLoading');
const loginView = $('#loginView');
const adminView = $('#adminView');
const loginForm = $('#loginForm');
const loginStatus = $('#loginStatus');
const mainStatus = $('#mainStatus');
const recordList = $('#recordList');
const recordForm = $('#recordForm');
const newRecordButton = $('#newRecordButton');
const contentLayout = $('#cmsContent');
const confirmDialog = $('#confirmDialog');

const validSections = ['artworks', 'cover', 'artist', 'exhibitions', 'contact'];
let activeSection = sectionFromLocation();
let signedInUser = null;
let activeProfile = null;
let activeRecords = [];
let sectionLoadToken = 0;
const previewObjectUrls = new Map();

const sectionDetails = {
  artworks: {
    title: 'Obras',
    description: 'Administra las piezas que aparecen en la galería.',
    singular: 'obra',
  },
  cover: {
    title: 'Portada',
    description: 'Edita el contenido principal y la identidad visual del encabezado.',
    singular: 'portada',
  },
  artist: {
    title: 'Artista',
    description: 'Edita la biografía, el retrato y la información artística.',
    singular: 'perfil del artista',
  },
  contact: {
    title: 'Contacto y redes',
    description: 'Administra los teléfonos, el correo y los perfiles sociales que aparecen en el sitio.',
    singular: 'contacto',
  },
  exhibitions: {
    title: 'Exposiciones',
    description: 'Administra las exposiciones que aparecen en la trayectoria.',
    singular: 'exposición',
  },
};

function escapeHTML(value = '') {
  return String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[character]);
}

function setLoginMessage(message, isError = true) {
  loginStatus.textContent = message;
  loginStatus.classList.toggle('is-error', isError);
}

function setMainMessage(message, isError = true) {
  mainStatus.textContent = message;
  mainStatus.classList.toggle('is-error', isError);
}

function sectionFromLocation() {
  const pathname = window.location.pathname
    .replace(/\/index\.html$/i, '')
    .replace(/\/+$/, '');
  if (pathname.endsWith('/cms/portada')) return 'cover';
  if (pathname.endsWith('/cms/artista')) return 'artist';
  if (pathname.endsWith('/cms/contacto')) return 'contact';

  const section = new URLSearchParams(window.location.search).get('section');
  if (section === 'profile') return 'cover';
  if (validSections.includes(section)) return section;
  return document.body.dataset.cmsSection
    || (validSections.includes(section) ? section : 'artworks');
}

function finishAuthLoading() {
  document.body.classList.remove('cms-auth-checking');
  authLoading.hidden = true;
}

async function isCmsAdmin(user) {
  const { data, error } = await supabase
    .from('cms_admins')
    .select('user_id')
    .eq('user_id', user.id)
    .maybeSingle();
  if (error) throw error;
  return Boolean(data);
}

function showLogin(message = '') {
  sectionLoadToken += 1;
  signedInUser = null;
  $('.skip-link').href = '#loginView';
  loginView.hidden = false;
  adminView.hidden = true;
  loginForm.reset();
  finishAuthLoading();
  setLoginMessage(message, Boolean(message));
}

async function enterAdmin(user) {
  let authorized;
  try {
    authorized = await isCmsAdmin(user);
  } catch (error) {
    await supabase.auth.signOut({ scope: 'local' });
    showLogin(`No se pudo verificar el acceso: ${error.message}`);
    return;
  }

  if (!authorized) {
    await supabase.auth.signOut({ scope: 'local' });
    showLogin('Esta cuenta no tiene permiso para administrar el contenido.');
    return;
  }

  signedInUser = user;
  $('.skip-link').href = '#adminMain';
  loginView.hidden = true;
  adminView.hidden = false;
  finishAuthLoading();
  $('#signedInEmail').textContent = user.email || '';
  await loadSection(activeSection);
}

function inputField(name, label, value = '', options = {}) {
  const {
    type = 'text',
    required = false,
    wide = false,
    min,
    max,
    step,
    placeholder = '',
    readOnly = false,
    hint = '',
  } = options;
  const classes = `cms-field${wide ? ' cms-field--wide' : ''}`;
  const hintId = hint ? `hint-${name}` : '';
  return `<div class="${classes}">
    <label for="field-${name}">${label}${required ? ' <span class="cms-required" aria-hidden="true">*</span>' : ''}</label>
    <input id="field-${name}" name="${name}" type="${type}" value="${escapeHTML(value)}"
      ${required ? 'required' : ''} ${min !== undefined ? `min="${min}"` : ''}
      ${max !== undefined ? `max="${max}"` : ''} ${step !== undefined ? `step="${step}"` : ''}
      ${readOnly ? 'readonly' : ''}
      ${hintId ? `aria-describedby="${hintId}"` : ''}
      placeholder="${escapeHTML(placeholder)}">
    ${hintId ? `<span class="cms-field-hint" id="${hintId}">${escapeHTML(hint)}</span>` : ''}
  </div>`;
}

function textareaField(name, label, value = '', options = {}) {
  const { wide = false, rows = 5, required = false, hint = '' } = options;
  const classes = `cms-field${wide ? ' cms-field--wide' : ''}`;
  const hintId = hint ? `hint-${name}` : '';
  return `<div class="${classes}">
    <label for="field-${name}">${label}${required ? ' <span class="cms-required" aria-hidden="true">*</span>' : ''}</label>
    <textarea id="field-${name}" name="${name}" rows="${rows}" ${required ? 'required' : ''}
      ${hintId ? `aria-describedby="${hintId}"` : ''}>${escapeHTML(value)}</textarea>
    ${hintId ? `<span class="cms-field-hint" id="${hintId}">${escapeHTML(hint)}</span>` : ''}
  </div>`;
}

function imageFields(name, label, url) {
  return `<div class="cms-form-grid cms-field--wide cms-image-fields">
    <input type="hidden" name="${name}" value="${escapeHTML(url || '')}">
    <div class="cms-field cms-field--wide">
      <label for="field-${name}_file">${url ? `Cambiar ${label.toLowerCase()}` : `Subir ${label.toLowerCase()}`}</label>
      <input id="field-${name}_file" name="${name}_file" type="file" accept="image/jpeg,image/png,image/webp,image/avif" aria-describedby="hint-${name}_file">
      <span class="cms-field-hint" id="hint-${name}_file">JPG, PNG, WebP o AVIF; hasta 5 MB. La imagen seleccionada reemplaza la actual al guardar.</span>
      <div class="cms-image-preview-frame${url ? ' image-is-loading' : ''}" data-preview-frame="${name}" ${url ? '' : 'hidden'}>
        <img class="cms-image-preview" data-preview-for="${name}" ${url ? `src="${escapeHTML(displayImageURL(url, 720))}"` : ''} alt="Vista previa de ${escapeHTML(label.toLowerCase())}" ${url ? '' : 'hidden'}>
      </div>
    </div>
  </div>`;
}

function selectField(name, label, value, options, { wide = false, hint = '' } = {}) {
  const choices = options.map(([optionValue, optionLabel]) => `
    <option value="${escapeHTML(optionValue)}" ${value === optionValue ? 'selected' : ''}>${escapeHTML(optionLabel)}</option>
  `).join('');
  const hintId = hint ? `hint-${name}` : '';
  return `<div class="cms-field${wide ? ' cms-field--wide' : ''}">
    <label for="field-${name}">${label}</label>
    <select id="field-${name}" name="${name}" ${hintId ? `aria-describedby="${hintId}"` : ''}>${choices}</select>
    ${hintId ? `<span class="cms-field-hint" id="${hintId}">${escapeHTML(hint)}</span>` : ''}
  </div>`;
}

function releaseImagePreviews() {
  previewObjectUrls.forEach((url) => URL.revokeObjectURL(url));
  previewObjectUrls.clear();
}

function artworkForm(artwork = {}) {
  releaseImagePreviews();
  const isNew = !artwork.id;
  recordForm.innerHTML = `
    <h2>${isNew ? 'Añadir obra' : 'Editar obra'}</h2>
    <p class="cms-form-intro">Los campos con <span class="cms-required" aria-hidden="true">*</span> son obligatorios. La ficha reúne los datos, la imagen y la publicación de la obra.</p>
    <input type="hidden" name="original_id" value="${escapeHTML(artwork.id || '')}">
    <div class="cms-form-grid">
      <h3 class="cms-form-section">Datos de la obra</h3>
      ${inputField('title', 'Título', artwork.title, { required: true })}
      ${inputField('number', 'Número de la serie', artwork.number, { required: true })}
      ${inputField('year', 'Año', artwork.year, { type: 'number', min: 1000, max: 9999, required: true })}
      ${inputField('dimensions', 'Medidas', artwork.dimensions, { placeholder: '100 × 80 cm' })}
      ${inputField('technique', 'Técnica o materiales', artwork.technique)}
      ${inputField('price', 'Precio', artwork.price ?? '', {
        type: 'number',
        min: 0,
        step: '0.01',
        placeholder: '1800',
        hint: 'Opcional. Déjalo vacío si no quieres mostrar el precio en el sitio.',
      })}
      ${inputField('price_currency', 'Moneda', artwork.price_currency || 'USD', {
        placeholder: 'USD',
        hint: 'Código ISO de 3 letras: USD, EUR, CUP…',
      })}
      ${inputField('id', 'Identificador del enlace', artwork.id || `obra-${crypto.randomUUID()}`, {
        required: true,
        placeholder: 'inf-41',
        readOnly: !isNew,
        hint: 'Forma parte del enlace de la ficha. Elige un identificador breve y fácil de reconocer.',
      })}
      <h3 class="cms-form-section">Imagen y descripción</h3>
      ${imageFields('image_url', 'Imagen', artwork.image_url)}
      ${inputField('phrase', 'Frase de la obra', artwork.phrase, { wide: true })}
      ${textareaField('description', 'Descripción', artwork.description, { wide: true, hint: 'Este texto aparece en la descripción ampliada de la obra.' })}
      <h3 class="cms-form-section">Colores complementarios</h3>
      ${inputField('color', 'Color principal', artwork.color || '#A6482A', { type: 'color' })}
      ${inputField('color2', 'Color secundario', artwork.color2 || '#7C3018', { type: 'color' })}
      ${inputField('foreground_color', 'Color de texto', artwork.foreground_color || '#F6EFE6', { type: 'color' })}
      <h3 class="cms-form-section">Publicación</h3>
      ${inputField('sort_order', 'Orden en la galería', artwork.sort_order ?? 0, {
        type: 'number',
        min: 0,
        hint: 'Las obras con un número menor aparecen primero.',
      })}
      <div class="cms-field cms-field--check">
        <input id="field-published" name="published" type="checkbox" ${artwork.published ? 'checked' : ''}>
        <label for="field-published">Publicar en el sitio</label>
      </div>
    </div>
    <div class="cms-form-actions">
      <button class="cms-primary" type="submit">${isNew ? 'Guardar obra' : 'Guardar cambios'}</button>
      ${isNew ? '' : '<button class="cms-danger" type="button" data-delete>Eliminar obra</button>'}
    </div>
    <p class="cms-form-message" role="status" aria-live="polite"></p>`;
  bindImagePreview('image_url');
}

function exhibitionForm(exhibition = {}) {
  releaseImagePreviews();
  const isNew = !exhibition.id;
  recordForm.innerHTML = `
    <h2>${isNew ? 'Añadir exposición' : 'Editar exposición'}</h2>
    <p class="cms-form-intro">Añade los datos de la exposición y elige si debe aparecer en la página pública.</p>
    <input type="hidden" name="original_id" value="${escapeHTML(exhibition.id || '')}">
    <div class="cms-form-grid">
      <h3 class="cms-form-section">Datos de la exposición</h3>
      ${inputField('year', 'Año', exhibition.year, { type: 'number', min: 1000, max: 9999, required: true })}
      ${inputField('title', 'Nombre', exhibition.title, { required: true, wide: true })}
      ${inputField('place', 'Lugar', exhibition.place, { wide: true })}
      ${inputField('sort_order', 'Orden de aparición', exhibition.sort_order ?? 0, {
        type: 'number',
        min: 0,
        hint: 'Posición en la trayectoria: las exposiciones con un número menor aparecen primero.',
      })}
      <h3 class="cms-form-section">Publicación</h3>
      <div class="cms-field cms-field--check">
        <input id="field-published" name="published" type="checkbox" ${exhibition.published ? 'checked' : ''}>
        <label for="field-published">Publicar en el sitio</label>
      </div>
    </div>
    <div class="cms-form-actions">
      <button class="cms-primary" type="submit">${isNew ? 'Guardar exposición' : 'Guardar cambios'}</button>
      ${isNew ? '' : '<button class="cms-danger" type="button" data-delete>Eliminar exposición</button>'}
    </div>
    <p class="cms-form-message" role="status" aria-live="polite"></p>`;
}

function coverForm(profile = {}) {
  releaseImagePreviews();
  recordForm.innerHTML = `
    <h2>Contenido de portada</h2>
    <p class="cms-form-intro">Edita el título, la presentación y las imágenes que se muestran al entrar al sitio.</p>
    <div class="cms-form-grid">
      <h3 class="cms-form-section">Texto de portada</h3>
      ${inputField('hero_eyebrow', 'Texto superior', profile.hero_eyebrow, { wide: true })}
      ${textareaField('hero_title', 'Título principal · una línea por renglón', profile.hero_title, { wide: true, rows: 3, required: true })}
      ${textareaField('hero_intro', 'Texto de presentación', profile.hero_intro, { wide: true, rows: 3 })}
      ${imageFields('hero_image_url', 'Imagen de portada', profile.hero_image_url)}
      ${inputField('hero_image_alt', 'Descripción de la imagen para lectores de pantalla', profile.hero_image_alt, {
        wide: true,
        hint: 'Describe lo que se ve en la imagen. Si es solo decorativa, deja este campo vacío.',
      })}
      <h3 class="cms-form-section">Identidad del encabezado</h3>
      ${selectField('header_brand_mode', 'Elementos visibles', profile.header_brand_mode || 'text', [
        ['text', 'Solo texto'],
        ['logo', 'Solo logo'],
        ['both', 'Texto y logo'],
      ], { hint: 'Elige si el encabezado muestra el nombre, el logo o ambos.' })}
      ${imageFields('header_logo_url', 'Logo del sitio', profile.header_logo_url)}
    </div>
    <div class="cms-form-actions">
      <button class="cms-primary" type="submit">Guardar portada</button>
    </div>
    <p class="cms-form-message" role="status" aria-live="polite"></p>`;
  bindImagePreview('hero_image_url');
  bindImagePreview('header_logo_url');
}

function artistForm(profile = {}) {
  releaseImagePreviews();
  recordForm.innerHTML = `
    <h2>Perfil del artista</h2>
    <p class="cms-form-intro">Estos datos forman la página «Artista». El lugar de nacimiento es obligatorio; los demás campos son opcionales.</p>
    <div class="cms-form-grid">
      <h3 class="cms-form-section">Información personal</h3>
      ${inputField('birth_place', 'Lugar de nacimiento', profile.birth_place, { required: true })}
      ${inputField('birth_year', 'Año de nacimiento', profile.birth_year, { type: 'number', min: 1000, max: 9999 })}
      ${textareaField('summary', 'Resumen', profile.summary, { wide: true, rows: 3, hint: 'Texto breve que presenta al artista en la página.' })}
      ${textareaField('quote', 'Cita', profile.quote, { wide: true, rows: 3, hint: 'Una frase que se mostrará destacada junto al perfil.' })}
      ${inputField('quote_attribution', 'Atribución de la cita', profile.quote_attribution, { wide: true })}
      ${imageFields('portrait_url', 'Retrato', profile.portrait_url)}
      <h3 class="cms-form-section">Biografía y visión artística</h3>
      ${textareaField('biography', 'Inicios y formación', profile.biography, { wide: true })}
      ${textareaField('artistic_vision', 'Visión personal', profile.artistic_vision, { wide: true })}
      ${textareaField('series_description', 'Descripción de la serie Infinito', profile.series_description, { wide: true })}
    </div>
    <div class="cms-form-actions">
      <button class="cms-primary" type="submit">Guardar perfil del artista</button>
    </div>
    <p class="cms-form-message" role="status" aria-live="polite"></p>`;
  bindImagePreview('portrait_url');
}

function contactForm(profile = {}) {
  recordForm.innerHTML = `
    <h2>Datos de contacto</h2>
    <p class="cms-form-intro">Actualiza los canales que aparecen en el sitio. Deja en blanco cualquier dato que no quieras mostrar.</p>
    <div class="cms-form-grid">
      <h3 class="cms-form-section">Teléfonos y correo</h3>
      ${inputField('contact_phone', 'Teléfono principal', profile.contact_phone, { type: 'tel', placeholder: '+53 52932396' })}
      ${inputField('contact_phone_secondary', 'Teléfono alternativo', profile.contact_phone_secondary, { type: 'tel', placeholder: 'Opcional' })}
      ${inputField('contact_email', 'Correo electrónico', profile.contact_email, { type: 'email', placeholder: 'nombre@ejemplo.com' })}
      ${inputField('whatsapp_number', 'Número de WhatsApp · código de país', profile.whatsapp_number, { type: 'tel', placeholder: '5352932396' })}
      <p class="cms-field-hint cms-field--wide">Usa el prefijo internacional, por ejemplo +53. Para WhatsApp, incluye el código de país sin espacios ni signos.</p>
      <h3 class="cms-form-section">Redes sociales</h3>
      ${inputField('instagram_url', 'Instagram · URL del perfil', profile.instagram_url, { type: 'url', placeholder: 'https://instagram.com/usuario' })}
      ${inputField('facebook_url', 'Facebook · URL del perfil', profile.facebook_url, { type: 'url', placeholder: 'https://facebook.com/usuario' })}
      ${inputField('threads_url', 'Threads · URL del perfil', profile.threads_url, { type: 'url', placeholder: 'https://www.threads.com/@usuario' })}
    </div>
    <div class="cms-form-actions">
      <button class="cms-primary" type="submit">Guardar contacto y redes</button>
    </div>
    <p class="cms-form-message" role="status" aria-live="polite"></p>`;
}

function bindImagePreview(name) {
  const fileInput = $(`#field-${name}_file`, recordForm);
  const preview = $(`.cms-image-preview[data-preview-for="${name}"]`, recordForm);
  const previewFrame = $(`.cms-image-preview-frame[data-preview-frame="${name}"]`, recordForm);
  const update = (src) => {
    previewFrame.hidden = !src;
    preview.hidden = !src;
    previewFrame.classList.toggle('image-is-loading', Boolean(src));
    previewFrame.classList.remove('image-has-error');
    preview.removeAttribute('data-image-state-bound');
    if(src) preview.src = src.startsWith('blob:') ? src : displayImageURL(src, 720);
    else preview.removeAttribute('src');
    if(src) bindCmsImageLoading(preview);
  };
  const releaseObjectUrl = () => {
    const objectUrl = previewObjectUrls.get(name);
    if(objectUrl) URL.revokeObjectURL(objectUrl);
    previewObjectUrls.delete(name);
  };
  if(!preview.hidden) bindCmsImageLoading(preview);
  fileInput.addEventListener('change', () => {
    const [file] = fileInput.files;
    if(file){
      releaseObjectUrl();
      const objectUrl = URL.createObjectURL(file);
      previewObjectUrls.set(name, objectUrl);
      update(objectUrl);
    }
  });
}

function bindCmsImageLoading(root = recordList) {
  const images = root instanceof HTMLImageElement ? [root] : root.querySelectorAll('img');
  images.forEach((image) => {
    const frame = image.closest('.cms-image-preview-frame, .cms-record-thumb');
    if(!frame || image.dataset.imageStateBound) return;
    image.dataset.imageStateBound = 'true';
    frame.classList.add('image-is-loading');
    const finish = (hasError = false) => {
      frame.classList.remove('image-is-loading');
      frame.classList.toggle('image-has-error', hasError);
    };
    image.addEventListener('load', () => finish(), { once: true });
    image.addEventListener('error', () => finish(true), { once: true });
    if(image.complete) finish(image.naturalWidth === 0);
  });
}

function renderRecords(records) {
  if (!records.length) {
    recordList.innerHTML = '<p class="cms-empty">Todavía no hay registros. Añade uno para empezar.</p>';
    return;
  }

  const isArtwork = activeSection === 'artworks';
  recordList.innerHTML = records.map((record) => {
    const priceLabel = isArtwork && record.price != null && record.price !== ''
      ? ` · ${Number(record.price).toLocaleString('es', { maximumFractionDigits: 2 })} ${record.price_currency || 'USD'}`
      : '';
    const detail = isArtwork
      ? `${record.year} · ${record.dimensions || 'Sin medidas'}${priceLabel}`
      : `${record.year} · ${record.place || 'Sin lugar'}`;
    let imageURL = '';
    if(isArtwork && record.image_url){
      try{
        const url = new URL(record.image_url, window.location.href);
        if(['http:','https:'].includes(url.protocol)) imageURL = url.href;
      }catch{
        imageURL = '';
      }
    }
    return `<article class="cms-record-row${isArtwork ? ' has-image' : ''}">
      ${isArtwork ? `<div class="cms-record-thumb${imageURL ? ' image-is-loading' : ''}">${imageURL
        ? `<img src="${escapeHTML(displayImageURL(imageURL, 160))}" alt="" loading="lazy" decoding="async">`
        : '<span>Sin imagen</span>'}</div>` : ''}
      <div>
        <span class="cms-record-title">${escapeHTML(record.title)}</span>
        ${record.published ? '' : '<span class="cms-record-state">Borrador</span>'}
        <p>${escapeHTML(detail)}</p>
      </div>
      <div class="cms-record-button-group">
        <button type="button" class="cms-row-button" data-edit="${escapeHTML(record.id)}">Editar</button>
      </div>
    </article>`;
  }).join('');
  bindCmsImageLoading(recordList);
}

async function fetchRecords(section) {
  if (section === 'cover' || section === 'artist' || section === 'contact') {
    const { data, error } = await supabase
      .from('cms_artist_profile')
      .select('*')
      .eq('id', 1)
      .maybeSingle();
    if (error) throw error;
    activeProfile = data || { id: 1 };
    return;
  }

  const table = section === 'artworks' ? 'cms_artworks' : 'cms_exhibitions';
  const { data, error } = await supabase
    .from(table)
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) throw error;
  activeRecords = data;
}

async function loadSection(section, { focusHeading = false } = {}) {
  const loadToken = ++sectionLoadToken;
  activeSection = section;
  const details = sectionDetails[section];
  $('#sectionTitle').textContent = details.title;
  $('#sectionDescription').textContent = details.description;
  document.title = `${details.title} — Administración — Yalain Falcón Yanes`;
  if (focusHeading) $('#sectionTitle').focus();
  $('#newRecordButton').hidden = !['artworks', 'exhibitions'].includes(section);
  const isProfileSection = ['cover', 'artist', 'contact'].includes(section);
  contentLayout.classList.toggle('is-profile', isProfileSection);
  recordList.hidden = isProfileSection;
  document.querySelectorAll('.cms-navigation [data-section]').forEach((link) => {
    if (link.dataset.section === section) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
  recordList.innerHTML = '<p class="cms-empty">Cargando contenido…</p>';
  releaseImagePreviews();
  recordForm.replaceChildren();
  setMainMessage('');

  try {
    await fetchRecords(section);
    if (loadToken !== sectionLoadToken) return;
    if (section === 'cover') {
      coverForm(activeProfile);
    } else if (section === 'artist') {
      artistForm(activeProfile);
    } else if (section === 'contact') {
      contactForm(activeProfile);
    } else {
      renderRecords(activeRecords);
      section === 'artworks' ? artworkForm() : exhibitionForm();
    }
  } catch (error) {
    if (loadToken !== sectionLoadToken) return;
    setMainMessage(`No se pudo cargar ${details.title.toLowerCase()}: ${error.message}`);
    recordList.replaceChildren();
    recordForm.replaceChildren();
  }
}

async function uploadImage(file) {
  if (!file.type.startsWith('image/')) {
    throw new Error('Selecciona un archivo de imagen válido.');
  }
  if (file.size > 5 * 1024 * 1024) {
    throw new Error('La imagen supera el límite de 5 MB.');
  }

  const extensionByType = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/avif': 'avif',
  };
  const extension = extensionByType[file.type];
  if (!extension) throw new Error('El formato debe ser JPG, PNG, WebP o AVIF.');

  const path = `${signedInUser.id}/${crypto.randomUUID()}.${extension}`;
  const { error } = await supabase.storage
    .from('cms-images')
    .upload(path, file, { contentType: file.type, cacheControl: '3600', upsert: false });
  if (error) throw error;
  return supabase.storage.from('cms-images').getPublicUrl(path).data.publicUrl;
}

function formValue(formData, name) {
  return String(formData.get(name) || '').trim();
}

function formFile(formData, name) {
  const file = formData.get(name);
  return file instanceof File && file.size > 0 ? file : null;
}

function parseArtworkPrice(formData) {
  const raw = formValue(formData, 'price');
  if (!raw) return null;
  const amount = Number(raw);
  if (!Number.isFinite(amount) || amount < 0) {
    throw new Error('El precio debe ser un número mayor o igual a cero.');
  }
  return amount;
}

function parseArtworkCurrency(formData) {
  const currency = formValue(formData, 'price_currency').toUpperCase() || 'USD';
  if (!/^[A-Z]{3}$/.test(currency)) {
    throw new Error('La moneda debe ser un código de 3 letras (USD, EUR, CUP…).');
  }
  return currency;
}

async function submitArtwork(formData) {
  const currentId = formData.get('original_id');
  const record = {
    id: currentId || formValue(formData, 'id'),
    title: formValue(formData, 'title'),
    number: formValue(formData, 'number'),
    year: Number(formData.get('year')),
    dimensions: formValue(formData, 'dimensions'),
    technique: formValue(formData, 'technique'),
    price: parseArtworkPrice(formData),
    price_currency: parseArtworkCurrency(formData),
    color: formValue(formData, 'color'),
    color2: formValue(formData, 'color2'),
    foreground_color: formValue(formData, 'foreground_color'),
    phrase: formValue(formData, 'phrase'),
    image_url: formValue(formData, 'image_url'),
    description: formValue(formData, 'description'),
    published: formData.has('published'),
    sort_order: Number(formData.get('sort_order')) || 0,
    updated_at: new Date().toISOString(),
  };
  if (!record.id || !record.title || !record.number || !Number.isInteger(record.year)) {
    throw new Error('Completa el identificador, título, número y año.');
  }
  const file = formFile(formData, 'image_url_file');
  if (file) record.image_url = await uploadImage(file);
  if (!record.image_url) throw new Error('Añade una URL o sube una imagen para la obra.');
  const { error } = await supabase.from('cms_artworks').upsert(record);
  if (error) throw error;
  return record.id;
}

async function submitExhibition(formData) {
  const id = formData.get('original_id') || crypto.randomUUID();
  const record = {
    id,
    year: Number(formData.get('year')),
    title: formValue(formData, 'title'),
    place: formValue(formData, 'place'),
    published: formData.has('published'),
    sort_order: Number(formData.get('sort_order')) || 0,
    updated_at: new Date().toISOString(),
  };
  if (!Number.isInteger(record.year) || !record.title) {
    throw new Error('Completa el año y el nombre de la exposición.');
  }
  const { error } = await supabase.from('cms_exhibitions').upsert(record);
  if (error) throw error;
  return record.id;
}

async function submitCover(formData) {
  const record = {
    id: 1,
    hero_eyebrow: formValue(formData, 'hero_eyebrow'),
    hero_title: formValue(formData, 'hero_title'),
    hero_intro: formValue(formData, 'hero_intro'),
    hero_image_url: formValue(formData, 'hero_image_url'),
    hero_image_alt: formValue(formData, 'hero_image_alt'),
    header_logo_url: formValue(formData, 'header_logo_url'),
    header_brand_mode: formValue(formData, 'header_brand_mode'),
    updated_at: new Date().toISOString(),
  };
  const heroFile = formFile(formData, 'hero_image_url_file');
  if (heroFile) record.hero_image_url = await uploadImage(heroFile);
  const logoFile = formFile(formData, 'header_logo_url_file');
  if (logoFile) record.header_logo_url = await uploadImage(logoFile);
  const { error } = await supabase.from('cms_artist_profile').upsert(record);
  if (error) throw error;
}

async function submitArtist(formData) {
  const record = {
    id: 1,
    birth_place: formValue(formData, 'birth_place'),
    birth_year: Number(formData.get('birth_year')) || null,
    summary: formValue(formData, 'summary'),
    quote: formValue(formData, 'quote'),
    quote_attribution: formValue(formData, 'quote_attribution'),
    portrait_url: formValue(formData, 'portrait_url'),
    biography: formValue(formData, 'biography'),
    artistic_vision: formValue(formData, 'artistic_vision'),
    series_description: formValue(formData, 'series_description'),
    updated_at: new Date().toISOString(),
  };
  const file = formFile(formData, 'portrait_url_file');
  if (file) record.portrait_url = await uploadImage(file);
  const { error } = await supabase.from('cms_artist_profile').upsert(record);
  if (error) throw error;
}

async function submitContact(formData) {
  const record = {
    id: 1,
    contact_phone: formValue(formData, 'contact_phone'),
    contact_phone_secondary: formValue(formData, 'contact_phone_secondary'),
    contact_email: formValue(formData, 'contact_email'),
    whatsapp_number: formValue(formData, 'whatsapp_number'),
    instagram_url: formValue(formData, 'instagram_url'),
    facebook_url: formValue(formData, 'facebook_url'),
    threads_url: formValue(formData, 'threads_url'),
    updated_at: new Date().toISOString(),
  };
  const { error } = await supabase.from('cms_artist_profile').upsert(record);
  if (error) throw error;
}

function confirmDeletion(message) {
  $('#confirmMessage').textContent = message;
  confirmDialog.returnValue = '';
  confirmDialog.showModal();
  return new Promise((resolve) => {
    confirmDialog.addEventListener('close', () => {
      resolve(confirmDialog.returnValue === 'confirm');
    }, { once: true });
  });
}

async function removeRecord(id) {
  const { singular } = sectionDetails[activeSection];
  const table = activeSection === 'artworks' ? 'cms_artworks' : 'cms_exhibitions';
  const { error } = await supabase.from(table).delete().eq('id', id);
  if (error) throw error;
  await loadSection(activeSection);
  setMainMessage(`${singular} eliminada.`, false);
}

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const button = $('button[type="submit"]', loginForm);
  button.disabled = true;
  setLoginMessage('');
  try {
    const formData = new FormData(loginForm);
    const { data, error } = await supabase.auth.signInWithPassword({
      email: formValue(formData, 'email'),
      password: String(formData.get('password') || ''),
    });
    if (error) throw error;
    await enterAdmin(data.user);
  } catch {
    setLoginMessage('No se pudo iniciar sesión. Revisa el correo y la contraseña o confirma que el usuario tenga acceso de administrador.');
  } finally {
    button.disabled = false;
  }
});

newRecordButton.addEventListener('click', () => {
  activeSection === 'artworks' ? artworkForm() : exhibitionForm();
  $('.cms-editor', adminView).scrollIntoView({ behavior: 'smooth', block: 'start' });
});

recordList.addEventListener('click', (event) => {
  const button = event.target.closest('[data-edit]');
  if (!button) return;
  const record = activeRecords.find((item) => item.id === button.dataset.edit);
  if (record) {
    activeSection === 'artworks' ? artworkForm(record) : exhibitionForm(record);
    $('.cms-editor', adminView).scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
});

recordForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const submittedSection = activeSection;
  const button = $('button[type="submit"]', recordForm);
  const formMessage = $('.cms-form-message', recordForm);
  button.disabled = true;
  formMessage.textContent = 'Guardando…';
  formMessage.classList.remove('is-error');
  try {
    const formData = new FormData(recordForm);
    const isNew = !formData.get('original_id');
    let id;
    if (submittedSection === 'artworks') id = await submitArtwork(formData);
    else if (submittedSection === 'exhibitions') id = await submitExhibition(formData);
    else if (submittedSection === 'cover') await submitCover(formData);
    else if (submittedSection === 'artist') await submitArtist(formData);
    else await submitContact(formData);

    const messages = {
      artworks: isNew ? 'Obra añadida.' : 'Obra actualizada.',
      exhibitions: isNew ? 'Exposición añadida.' : 'Exposición actualizada.',
      cover: 'Portada actualizada.',
      artist: 'Perfil del artista actualizado.',
      contact: 'Contacto y redes actualizados.',
    };
    const message = messages[submittedSection];
    if (activeSection !== submittedSection) {
      setMainMessage(`Guardado: ${message}`, false);
      return;
    }

    await loadSection(submittedSection);
    if (id) {
      const record = activeRecords.find((item) => item.id === id);
      submittedSection === 'artworks' ? artworkForm(record) : exhibitionForm(record);
    }
    const successMessage = $('.cms-form-message', recordForm);
    if (successMessage) successMessage.textContent = message;
    setMainMessage(message, false);
  } catch (error) {
    const message = `No se pudo guardar: ${error.message}`;
    if (activeSection === submittedSection) {
      formMessage.textContent = message;
      formMessage.classList.add('is-error');
    } else {
      setMainMessage(`${sectionDetails[submittedSection].singular}: ${message}`);
    }
  } finally {
    const currentButton = $('button[type="submit"]', recordForm);
    if (currentButton) currentButton.disabled = false;
  }
});

recordForm.addEventListener('click', async (event) => {
  const button = event.target.closest('[data-delete]');
  if (!button) return;
  const formData = new FormData(recordForm);
  const id = formData.get('original_id');
  if(!id) return;
  const record = activeRecords.find((item) => item.id === id);
  const confirmed = await confirmDeletion(
    `¿Eliminar «${record?.title || 'este registro'}»? Esta acción no se puede deshacer.`,
  );
  if(!confirmed) return;
  button.disabled = true;
  try {
    await removeRecord(id);
  } catch (error) {
    setMainMessage(`No se pudo eliminar: ${error.message}`);
  } finally {
    button.disabled = false;
  }
});

$('.cms-navigation').addEventListener('click', (event) => {
  const link = event.target.closest('a[data-section]');
  if (!link || event.defaultPrevented || event.button !== 0
    || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

  const section = link.dataset.section;
  if (!validSections.includes(section)) return;
  const destination = new URL(link.href, window.location.href);
  if (destination.origin !== window.location.origin) return;
  event.preventDefault();
  if (section === activeSection) return;
  window.history.pushState({ section }, '', destination);
  loadSection(section, { focusHeading: true });
});

window.addEventListener('popstate', () => {
  const section = sectionFromLocation();
  if (validSections.includes(section) && section !== activeSection) {
    loadSection(section, { focusHeading: true });
  }
});

$('#signOutButton').addEventListener('click', async (event) => {
  const button = event.currentTarget;
  button.disabled = true;
  const { error } = await supabase.auth.signOut({ scope: 'local' });
  button.disabled = false;
  if (error) {
    setMainMessage(`No se pudo cerrar la sesión: ${error.message}`);
    return;
  }
  showLogin();
});

supabase.auth.onAuthStateChange((event) => {
  if (event === 'SIGNED_OUT') showLogin();
});

const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
if (sessionError) {
  showLogin(`No se pudo comprobar la sesión: ${sessionError.message}`);
} else if (sessionData.session) {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) showLogin(`No se pudo verificar la cuenta: ${userError.message}`);
  else if (userData.user) await enterAdmin(userData.user);
  else showLogin();
} else {
  showLogin();
}
