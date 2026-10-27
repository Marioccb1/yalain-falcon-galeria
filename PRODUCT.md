# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- Public visitors exploring the paintings and the artist's background.
- The site administrator, who signs in with an email and password to maintain
  artwork, biography, exhibition content, and contact details.

## Product Purpose

Present Yalain Falcón Yanes's painting portfolio and provide an authenticated
content-management area so the administrator can maintain the public gallery,
artist biography, exhibition history, and contact channels.

## Operating Context

Visitors use the public site to browse paintings, read artwork details, learn
about the artist, and find contact links. The administrator uses the CMS at a
separate route to sign in and create, edit, publish, or remove the site's
managed content.

## Capabilities and Constraints

- The CMS manages artworks, the artist biography, exhibitions, hero content,
  the site's text/logo brand presentation, and public contact/social links.
- Cover content, artist biography, and contact/social links have dedicated CMS
  routes at `/admin/portada/`, `/admin/artista/`, and `/admin/contacto/`.
  Legacy `/cms/` paths redirect to `/admin/`.
- Public visitors can use a persistent WhatsApp shortcut or prepare a message
  for the artist through a contact form addressed to the CMS-configured email.
- CMS access uses Supabase Auth email-and-password sign-in; public self-service
  account creation is not part of the requested CMS.
- Only explicitly authorized CMS administrators may change managed content.
- The project is a static multi-page JavaScript website built with Vite and
  Supabase JS. It does not have a server-side session middleware.
- Initial administrator credentials must be created in the Supabase project;
  demo credentials are not embedded in the application.
- Existing portfolio text and image references are project content, not
  independently verified biographical or exhibition evidence.

## Brand Commitments

- Product name: Yalain Falcón Yanes.
- Preserve the existing Spanish-language portfolio content, contact links,
  artwork identity, and shared visual system unless the owner changes them.

## Identidad visual del producto

### Sistema de diseño

El producto utiliza la identidad visual **Earthy Luxe Gallery**.

Es una experiencia de galería de arte contemporáneo minimalista, editorial y
de autor, pensada para enfatizar las pinturas y la identidad artística de
Yalain Falcón Yanes.

El diseño visual debe sentirse:
- Sofisticado.
- Artístico.
- Cálido.
- Atemporal.
- Premium.
- Calmado y equilibrado.

La interfaz debe recordar una exposición de arte contemporáneo, no un escaparate
de comercio electrónico convencional.

### Sistema de color

La paleta visual oficial consiste en:

- Espresso Brown: `#3B2F2F`
- Sage Green: `#A3B18A`
- Beige: `#E6D5B8`
- Warm Ivory: `#F8F3E9`
- Pure White: `#FFFFFF`

El sitio usa predominantemente superficies neutras, Espresso Brown para
tipografía y controles principales, y Sage Green para acentos visuales
contenidos.

### Tipografía

- Títulos editoriales: Cormorant Garamond.
- Tipografía de interfaz y cuerpo: DM Sans.
- Deben proporcionarse tipografías de respaldo locales adecuadas.

La tipografía debe establecer una jerarquía clara y priorizar la legibilidad.

### Presentación de las obras

La presentación de las pinturas es la máxima prioridad visual.

- Conservar la composición y las proporciones originales de cada pintura.
- Usar imágenes de obras a gran tamaño.
- Evitar decoración excesiva alrededor de las obras.
- Preferir fondos neutros y espacio en blanco generoso.
- Mantener los metadatos claros pero secundarios respecto a la imagen.
- No crear detalles de obra ni afirmaciones comerciales ausentes de los datos.

### Experiencia por página

**Inicio:** Una introducción editorial curada al artista y a obras seleccionadas.

**Galería:** Un catálogo limpio y adaptable que enfatiza la imagen de las
pinturas y su descubrimiento.

**Detalles de obra:** Una presentación contemplativa centrada en la imagen, con
la información disponible, acciones de contacto y la función existente
«Ver en pared».

**Artista:** Una presentación editorial de la biografía, la identidad artística,
la serie Infinito y el contenido expositivo disponible.

**CMS:** Una interfaz administrativa funcional con el mismo lenguaje visual,
priorizando usabilidad sobre ornamento.

### Principios de interacción

- Usar transiciones sutiles y animación con propósito.
- Mantener una respuesta interactiva clara.
- Evitar movimiento visualmente agresivo.
- Respetar las preferencias de reducción de movimiento.
- Garantizar acceso por teclado y diseños responsive.
- Mantener contraste de texto accesible y estados de foco visibles.

### Compromisos técnicos de diseño

- Los tokens de diseño compartidos pertenecen a `assets/css/site.css`.
- Los estilos específicos de cada página permanecen en su hoja de estilos.
- Los componentes compartidos deben permanecer visualmente consistentes.
- El rediseño debe preservar la arquitectura estática multipágina.
- La integración existente con Supabase, el CMS, el enrutado, los
  identificadores de obras y el contacto deben seguir funcionando.
- El contenido publicado administrado desde el CMS sigue siendo la fuente de
  verdad.
- Los cambios de diseño no deben introducir datos inventados de obras,
  biografía, exposiciones, precios o disponibilidad.

### Objetivo de diseño del producto

Crear un portafolio de arte de autor distintivo que genere reconocimiento,
presente las pinturas con dignidad, comunique autenticidad artística y anime a
explorar la colección y contactar al artista.

La experiencia visual debe sostener la obra, no competir con ella.

## Evidence on Hand

- Public site pages: `index.html`, `artista/index.html`, `galeria/index.html`,
  and `detalles/index.html`.
- Current artwork records and image references: `assets/js/data.js`.
- Current biography and exhibition copy: `artista/index.html` and `index.html`.
- The repository does not establish that the existing image references,
  biography, or exhibition claims have been independently verified.

## Product Principles

- Keep public browsing available without requiring sign-in.
- Protect all content changes with Supabase Auth and database-enforced access
  policies.
- Make the CMS's published content the source of truth for the public site.
- Do not invent artwork, biography, or exhibition facts.
