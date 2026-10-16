# Galería de Yalain Falcón Yanes

El sitio está dividido por páginas. Cada carpeta de página contiene su HTML,
CSS y JavaScript; los estilos y datos compartidos viven en `assets/`.

## Estructura

- `index.html`, `style.css`, `script.js`: inicio.
- `galeria/`: catálogo de pinturas.
- `detalles/`: ficha reutilizable de una pintura, seleccionada con `?id=`.
- `artista/`: biografía, trayectoria y serie Infinito.
- `assets/css/site.css`: estilos compartidos.
- `assets/js/data.js`: datos e imágenes de las pinturas.
- `assets/js/common.js`: tarjetas, menú y ventanas modales.

Las fichas se abren como `detalles/index.html?id=inf-01`; las tarjetas de la
galería generan esos enlaces automáticamente. El archivo HTML anterior se
conserva como enlace de compatibilidad hacia el nuevo inicio.
