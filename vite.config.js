import { resolve } from 'node:path';
import { defineConfig } from 'vite';

const panelRedirects = {
  '/admin': '/admin/',
  '/admin/portada': '/admin/portada/',
  '/admin/artista': '/admin/artista/',
  '/admin/contacto': '/admin/contacto/',
  '/cms': '/admin/',
  '/cms/': '/admin/',
  '/cms/portada': '/admin/portada/',
  '/cms/portada/': '/admin/portada/',
  '/cms/artista': '/admin/artista/',
  '/cms/artista/': '/admin/artista/',
  '/cms/contacto': '/admin/contacto/',
  '/cms/contacto/': '/admin/contacto/',
};

function attachPanelRedirects(middlewares) {
  middlewares.use((req, res, next) => {
    const pathOnly = (req.url || '').split('?')[0];
    const target = panelRedirects[pathOnly];
    if (!target) {
      next();
      return;
    }
    const query = (req.url || '').includes('?') ? `?${req.url.split('?')[1]}` : '';
    res.statusCode = 302;
    res.setHeader('Location', `${target}${query}`);
    res.end();
  });
}

function cmsAdminRedirectPlugin() {
  return {
    name: 'cms-to-admin-redirect',
    configureServer(server) {
      attachPanelRedirects(server.middlewares);
    },
    configurePreviewServer(server) {
      attachPanelRedirects(server.middlewares);
    },
  };
}

export default defineConfig({
  base: './',
  plugins: [cmsAdminRedirectPlugin()],
  build: {
    rollupOptions: {
      input: {
        home: resolve(import.meta.dirname, 'index.html'),
        artist: resolve(import.meta.dirname, 'artista/index.html'),
        gallery: resolve(import.meta.dirname, 'galeria/index.html'),
        details: resolve(import.meta.dirname, 'detalles/index.html'),
        admin: resolve(import.meta.dirname, 'admin/index.html'),
        adminContact: resolve(import.meta.dirname, 'admin/contacto/index.html'),
        adminCover: resolve(import.meta.dirname, 'admin/portada/index.html'),
        adminArtist: resolve(import.meta.dirname, 'admin/artista/index.html'),
      },
    },
  },
});
