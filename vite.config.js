import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  build: {
    rollupOptions: {
      input: {
        home: resolve(import.meta.dirname, 'index.html'),
        artist: resolve(import.meta.dirname, 'artista/index.html'),
        gallery: resolve(import.meta.dirname, 'galeria/index.html'),
        details: resolve(import.meta.dirname, 'detalles/index.html'),
        cms: resolve(import.meta.dirname, 'cms/index.html'),
        cmsContact: resolve(import.meta.dirname, 'cms/contacto/index.html'),
        cmsCover: resolve(import.meta.dirname, 'cms/portada/index.html'),
        cmsArtist: resolve(import.meta.dirname, 'cms/artista/index.html'),
      },
    },
  },
});
