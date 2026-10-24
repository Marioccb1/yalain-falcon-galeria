export function safeImageURL(value) {
  if (!String(value || '').trim()) return '';
  try {
    const url = new URL(String(value || ''), window.location.href);
    return ['http:', 'https:'].includes(url.protocol) ? url.href : '';
  } catch {
    return '';
  }
}

export function displayImageURL(value, width) {
  const safeURL = safeImageURL(value);
  if (!safeURL) return '';

  const url = new URL(safeURL);
  const publicObjectPath = '/storage/v1/object/public/';
  const renderedImagePath = '/storage/v1/render/image/public/';
  if (url.pathname.includes(publicObjectPath)) {
    url.pathname = url.pathname.replace(publicObjectPath, renderedImagePath);
  } else if (!url.pathname.includes(renderedImagePath)) {
    return url.href;
  }

  url.searchParams.set('width', String(width));
  url.searchParams.set('quality', '75');
  return url.href;
}
