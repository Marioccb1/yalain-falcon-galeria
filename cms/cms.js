import { supabase } from '../utils/supabase.js';

const $ = (selector, root = document) => root.querySelector(selector);
const loginView = $('#loginView');
const adminView = $('#adminView');
const loginForm = $('#loginForm');
const loginStatus = $('#loginStatus');
const mainStatus = $('#mainStatus');
const recordList = $('#recordList');
const recordForm = $('#recordForm');
const newRecordButton = $('#newRecordButton');
const contentLayout = $('#cmsContent');

let activeSection = 'artworks';
let signedInUser = null;
let activeProfile = null;
let activeRecords = [];

const sectionDetails = {
  artworks: {
    title: 'Obras',
    description: 'Administra las piezas que aparecen en la galería.',
    singular: 'obra',
  },
  profile: {
    title: 'Biografía',
    description: 'Edita la información y los textos de la página del artista.',
    singular: 'perfil',
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
  signedInUser = null;
  loginView.hidden = false;
  adminView.hidden = true;
  loginForm.reset();
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
  loginView.hidden = true;
  adminView.hidden = false;
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
  } = options;
  const classes = `cms-field${wide ? ' cms-field--wide' : ''}`;
  return `<div class="${classes}">
    <label for="field-${name}">${label}</label>
    <input id="field-${name}" name="${name}" type="${type}" value="${escapeHTML(value)}"
      ${required ? 'required' : ''} ${min !== undefined ? `min="${min}"` : ''}
      ${max !== undefined ? `max="${max}"` : ''} ${step !== undefined ? `step="${step}"` : ''}
      ${readOnly ? 'readonly' : ''}
      placeholder="${escapeHTML(placeholder)}">
  </div>`;
}

function textareaField(name, label, value = '', options = {}) {
  const { wide = false, rows = 5, required = false } = options;
  const classes = `cms-field${wide ? ' cms-field--wide' : ''}`;
  return `<div class="${classes}">
    <label for="field-${name}">${label}</label>
    <textarea id="field-${name}" name="${name}" rows="${rows}" ${required ? 'required' : ''}>${escapeHTML(value)}</textarea>
  </div>`;
}

function imageFields(name, label, url) {
  return `<div class="cms-form-grid cms-field--wide cms-image-fields">
    ${inputField(name, `${label} · URL`, url, { wide: true })}
    <div class="cms-field cms-field--wide">
      <label for="field-${name}_file">Subir imagen (JPG, PNG, WebP o AVIF; máximo 5 MB)</label>
      <input id="field-${name}_file" name="${name}_file" type="file" accept="image/jpeg,image/png,image/webp,image/avif">
      <img class="cms-image-preview" src="${escapeHTML(url || '')}" alt="Vista previa de la imagen" ${url ? '' : 'hidden'}>
    </div>
  </div>`;
}

function artworkForm(artwork = {}) {
  const isNew = !artwork.id;
  recordForm.innerHTML = `
    <h2>${isNew ? 'Añadir obra' : 'Editar obra'}</h2>
    <input type="hidden" name="original_id" value="${escapeHTML(artwork.id || '')}">
    <div class="cms-form-grid">
      ${inputField('id', 'Identificador del enlace', artwork.id || `obra-${crypto.randomUUID()}`, { required: true, placeholder: 'inf-41', readOnly: !isNew })}
      ${inputField('title', 'Título', artwork.title, { required: true })}
      ${inputField('number', 'Número', artwork.number, { required: true })}
      ${inputField('year', 'Año', artwork.year, { type: 'number', min: 1000, max: 9999, required: true })}
      ${inputField('dimensions', 'Medidas', artwork.dimensions)}
      ${inputField('technique', 'Técnica', artwork.technique)}
      ${inputField('color', 'Color principal', artwork.color || '#A6482A', { type: 'color' })}
      ${inputField('color2', 'Color secundario', artwork.color2 || '#7C3018', { type: 'color' })}
      ${inputField('foreground_color', 'Color de texto', artwork.foreground_color || '#F6EFE6', { type: 'color' })}
      ${inputField('phrase', 'Frase de la obra', artwork.phrase, { wide: true })}
      ${imageFields('image_url', 'Imagen', artwork.image_url)}
      ${textareaField('description', 'Descripción', artwork.description, { wide: true })}
      ${inputField('sort_order', 'Orden', artwork.sort_order ?? 0, { type: 'number', min: 0 })}
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
  const isNew = !exhibition.id;
  recordForm.innerHTML = `
    <h2>${isNew ? 'Añadir exposición' : 'Editar exposición'}</h2>
    <input type="hidden" name="original_id" value="${escapeHTML(exhibition.id || '')}">
    <div class="cms-form-grid">
      ${inputField('year', 'Año', exhibition.year, { type: 'number', min: 1000, max: 9999, required: true })}
      ${inputField('title', 'Nombre', exhibition.title, { required: true, wide: true })}
      ${inputField('place', 'Lugar', exhibition.place, { wide: true })}
      ${inputField('sort_order', 'Orden', exhibition.sort_order ?? 0, { type: 'number', min: 0 })}
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

function profileForm(profile = {}) {
  recordForm.innerHTML = `
    <h2>Biografía del artista</h2>
    <div class="cms-form-grid">
      ${inputField('birth_place', 'Lugar de nacimiento', profile.birth_place, { required: true })}
      ${inputField('birth_year', 'Año de nacimiento', profile.birth_year, { type: 'number', min: 1000, max: 9999 })}
      ${textareaField('summary', 'Resumen', profile.summary, { wide: true, rows: 3 })}
      ${textareaField('quote', 'Cita', profile.quote, { wide: true, rows: 3 })}
      ${inputField('quote_attribution', 'Atribución de la cita', profile.quote_attribution, { wide: true })}
      ${imageFields('portrait_url', 'Retrato', profile.portrait_url)}
      ${textareaField('biography', 'Inicios y formación', profile.biography, { wide: true })}
      ${textareaField('artistic_vision', 'Visión personal', profile.artistic_vision, { wide: true })}
      ${textareaField('series_description', 'Descripción de la serie Infinito', profile.series_description, { wide: true })}
    </div>
    <div class="cms-form-actions">
      <button class="cms-primary" type="submit">Guardar biografía</button>
    </div>
    <p class="cms-form-message" role="status" aria-live="polite"></p>`;
  bindImagePreview('portrait_url');
}

function bindImagePreview(name) {
  const urlInput = $(`#field-${name}`, recordForm);
  const fileInput = $(`#field-${name}_file`, recordForm);
  const preview = $('.cms-image-preview', recordForm);
  const update = (src) => {
    preview.src = src;
    preview.hidden = !src;
  };
  urlInput.addEventListener('input', () => update(urlInput.value.trim()));
  fileInput.addEventListener('change', () => {
    const [file] = fileInput.files;
    if (file) update(URL.createObjectURL(file));
  });
}

function renderRecords(records) {
  if (!records.length) {
    recordList.innerHTML = '<p class="cms-empty">Todavía no hay registros. Añade uno para empezar.</p>';
    return;
  }

  const isArtwork = activeSection === 'artworks';
  recordList.innerHTML = records.map((record) => {
    const title = isArtwork ? record.title : record.title;
    const detail = isArtwork
      ? `${record.year} · ${record.dimensions || 'Sin medidas'}`
      : `${record.year} · ${record.place || 'Sin lugar'}`;
    return `<article class="cms-record-row">
      <div>
        <span class="cms-record-title">${escapeHTML(title)}</span>
        ${record.published ? '' : '<span class="cms-record-state">Borrador</span>'}
        <p>${escapeHTML(detail)}</p>
      </div>
      <div class="cms-record-button-group">
        <button type="button" class="cms-row-button" data-edit="${escapeHTML(record.id)}">Editar</button>
      </div>
    </article>`;
  }).join('');
}

async function fetchRecords(section) {
  if (section === 'profile') {
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

async function loadSection(section) {
  activeSection = section;
  const details = sectionDetails[section];
  $('#sectionTitle').textContent = details.title;
  $('#sectionDescription').textContent = details.description;
  $('#newRecordButton').hidden = section === 'profile';
  contentLayout.classList.toggle('is-profile', section === 'profile');
  document.querySelectorAll('.cms-navigation button').forEach((button) => {
    button.setAttribute('aria-current', String(button.dataset.section === section));
  });
  recordList.innerHTML = '<p class="cms-empty">Cargando contenido…</p>';
  recordForm.replaceChildren();
  setMainMessage('');

  try {
    await fetchRecords(section);
    if (section === 'profile') {
      profileForm(activeProfile);
    } else {
      renderRecords(activeRecords);
      section === 'artworks' ? artworkForm() : exhibitionForm();
    }
  } catch (error) {
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

async function submitArtwork(formData) {
  const currentId = formData.get('original_id');
  const record = {
    id: currentId || formValue(formData, 'id'),
    title: formValue(formData, 'title'),
    number: formValue(formData, 'number'),
    year: Number(formData.get('year')),
    dimensions: formValue(formData, 'dimensions'),
    technique: formValue(formData, 'technique'),
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
  const [file] = recordForm.elements.image_url_file.files;
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

async function submitProfile(formData) {
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
  const [file] = recordForm.elements.portrait_url_file.files;
  if (file) record.portrait_url = await uploadImage(file);
  const { error } = await supabase.from('cms_artist_profile').upsert(record);
  if (error) throw error;
}

async function removeRecord(id) {
  const table = activeSection === 'artworks' ? 'cms_artworks' : 'cms_exhibitions';
  const { error } = await supabase.from(table).delete().eq('id', id);
  if (error) throw error;
  await loadSection(activeSection);
  setMainMessage('Registro eliminado.', false);
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

document.querySelectorAll('.cms-navigation button').forEach((button) => {
  button.addEventListener('click', () => loadSection(button.dataset.section));
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
  const button = $('button[type="submit"]', recordForm);
  const formMessage = $('.cms-form-message', recordForm);
  button.disabled = true;
  formMessage.textContent = 'Guardando…';
  try {
    const formData = new FormData(recordForm);
    let id;
    if (activeSection === 'artworks') id = await submitArtwork(formData);
    else if (activeSection === 'exhibitions') id = await submitExhibition(formData);
    else await submitProfile(formData);

    await loadSection(activeSection);
    if (id && activeSection !== 'profile') {
      const record = activeRecords.find((item) => item.id === id);
      activeSection === 'artworks' ? artworkForm(record) : exhibitionForm(record);
    }
    setMainMessage('Cambios guardados.', false);
  } catch (error) {
    formMessage.textContent = `No se pudo guardar: ${error.message}`;
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
  if (!id || !window.confirm('¿Eliminar este registro? Esta acción no se puede deshacer.')) return;
  button.disabled = true;
  try {
    await removeRecord(id);
  } catch (error) {
    setMainMessage(`No se pudo eliminar: ${error.message}`);
  } finally {
    button.disabled = false;
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
