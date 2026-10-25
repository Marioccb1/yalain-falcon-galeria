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

## Desarrollo y Supabase

Instala las dependencias con `npm install` y ejecuta el sitio con `npm run dev`.
El cliente de Supabase está disponible desde `utils/supabase.js`:

```js
import { supabase } from './utils/supabase.js';
```

La configuración local está en `.env.local` y usa `VITE_SUPABASE_URL` y
`VITE_SUPABASE_PUBLISHABLE_KEY`. Las variables `VITE_` se incluyen en el código
del navegador: usa solo la clave publicable, nunca una clave `service_role` o
secreta. Protege las tablas con RLS y políticas adecuadas. Al ser un sitio
estático, no necesita middleware de Next.js; el cliente de Supabase mantiene la
sesión en el navegador.

Usa `npm run build` para generar la versión de producción y `npm run preview`
para previsualizarla localmente.

## CMS

El panel está en `cms/index.html`. Inicia el sitio con `npm run dev` y abre
`/cms/`. El contenido de portada, el perfil del artista y los datos de contacto
y redes sociales están separados en `/cms/portada/`, `/cms/artista/` y
`/cms/contacto/`. Al iniciar sesión como administrador, el menú público también
ofrece un acceso directo al panel. El panel usa Supabase Auth con correo y
contraseña; no incluye registro público ni credenciales de demostración. La
autorización de administrador también se valida en las políticas RLS, no solo
en la interfaz.

La navegación interna del CMS cambia de sección sin recargar la página. La URL
sigue reflejando cada sección y admite recarga, enlaces directos y los botones
atrás/adelante del navegador. Al abrir el panel, se muestra un estado de carga
mientras se comprueba la sesión, evitando que aparezca brevemente el formulario
de inicio de sesión a administradores que ya están autenticados.

El sitio público incluye un acceso flotante a WhatsApp y un formulario de
contacto en Inicio. El formulario prepara un correo dirigido a la dirección
configurada desde `/cms/contacto/`; el visitante lo revisa y lo envía desde su
aplicación de correo predeterminada.

Antes de usarlo:

1. En el SQL Editor del proyecto Supabase, ejecuta en orden los archivos
   `supabase/migrations/20261016050452_cms_content.sql` y
   `supabase/migrations/20261018023256_add_site_branding_fields.sql` y
   `supabase/migrations/20261018035338_add_contact_social_fields.sql`. El primero
   crea las tablas con RLS, el bucket público de imágenes, las políticas para
   administradores y una copia inicial del contenido actual del sitio. El
   segundo agrega campos editables para la portada y el logo; el tercero permite
   editar teléfonos, WhatsApp, correo e Instagram, Facebook y Threads desde el CMS.
   Si ya aplicaste migraciones anteriores, ejecuta solo las pendientes en ese
   orden. Si utilizas la CLI,
   enlaza el proyecto y aplica las migraciones pendientes con
   `npx supabase db push`.
2. En Supabase Dashboard, crea la cuenta de administrador en
   **Authentication → Users** con tu correo y una contraseña propia. No actives
   el registro público de usuarios para el CMS.
3. Autoriza únicamente esa cuenta ejecutando en SQL Editor, reemplazando el
   correo por el de la cuenta creada:

   ```sql
   insert into public.cms_admins (user_id)
   select id from auth.users where email = 'tu-correo@ejemplo.com'
   on conflict (user_id) do nothing;
   ```

   Comprueba que se insertó una fila antes de iniciar sesión. Si no se insertó,
   confirma primero que el usuario exista en Authentication → Users.
4. Confirma que `.env.local` contiene las variables públicas de Supabase
   (`VITE_SUPABASE_URL` y `VITE_SUPABASE_PUBLISHABLE_KEY`) y ejecuta `npm run dev`.

Las imágenes subidas desde el panel se guardan en el bucket `cms-images` y se
publican en el sitio. El perfil del artista también permite editar el texto y
la imagen de portada, cargar un logo y elegir si el encabezado muestra texto,
logo o ambos, además de las vías de contacto y redes sociales del pie de página.
El retrato del artista se reemplaza subiendo una imagen desde el formulario; no
es necesario pegar una URL.
La portada enlaza a consultas por WhatsApp y correo; la galería y las fichas
ofrecen acciones para preguntar por disponibilidad sin depender de un solo canal.
El bucket es público para servir las obras; las políticas RLS
limitan las cargas, cambios y eliminaciones a las cuentas autorizadas. No uses
claves `service_role` o secretas en el cliente.

# Arquitectura visual — Earthy Luxe Gallery

## 1. Dirección de diseño

La Galería de Yalain Falcón Yanes utiliza el sistema visual **Earthy Luxe Gallery**, inspirado en galerías privadas de arte contemporáneo, espacios museográficos y publicaciones editoriales de arte.

La interfaz debe ser elegante, minimalista, cálida, sofisticada y atemporal.

**Principio principal:** las obras de arte son las protagonistas. Ningún componente, fondo, animación o elemento decorativo debe competir visualmente con las pinturas.

El sitio no debe parecer una tienda convencional ni utilizar patrones visuales agresivos de comercio electrónico.

### Características fundamentales

- Composiciones limpias y equilibradas.
- Espacios generosos entre elementos.
- Fotografías de gran tamaño.
- Tipografía editorial refinada.
- Contrastes suaves y jerarquía visual clara.
- Navegación intuitiva y discreta.
- Animaciones sutiles y funcionales.
- Diseño responsive desde dispositivos móviles hasta pantallas grandes.
- Coherencia visual entre las páginas públicas y el CMS.

## 2. Sistema de colores

### Paleta principal

| Token | Color | HEX | Aplicación |
|---|---|---|---|
| Espresso Brown | Marrón profundo | #3B2F2F | Encabezados, botones, títulos y footer |
| Sage Green | Verde salvia | #A3B18A | Acentos, detalles y elementos secundarios |
| Beige | Beige natural | #E6D5B8 | Secciones alternas y fondos decorativos |
| Warm Ivory | Marfil cálido | #F8F3E9 | Fondo principal del sitio |
| Pure White | Blanco | #FFFFFF | Tarjetas, superficies y modales |

### Colores complementarios

- Texto principal: `#3B2F2F`
- Texto secundario: `#756A62`
- Bordes: `#DED8CF`
- Superficie suave: `#F1EAE0`
- Fondo oscuro: `#3B2F2F`
- Texto sobre fondo oscuro: `#FFFFFF`
- Verde oscuro de interacción: `#43543C`

### Proporción cromática

- 80% superficies neutras: marfil y blanco.
- 15% tonos estructurales: espresso y beige.
- 5% acentos: verde salvia.

Las fotografías y pinturas aportarán el color predominante de cada composición.

### Variables CSS compartidas

Definir en `assets/css/site.css`:

```css
:root {
  --color-primary: #3B2F2F;
  --color-accent: #A3B18A;
  --color-accent-dark: #43543C;
  --color-beige: #E6D5B8;
  --color-background: #F8F3E9;
  --color-surface: #FFFFFF;
  --color-surface-alt: #F1EAE0;
  --color-text: #3B2F2F;
  --color-text-muted: #756A62;
  --color-border: #DED8CF;

  --font-heading: "Cormorant Garamond", Georgia, serif;
  --font-body: "DM Sans", Arial, sans-serif;

  --container-max: 1320px;
  --container-reading: 760px;

  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;

  --transition-fast: 180ms ease;
  --transition-normal: 280ms ease;
}
```

Las variables globales serán la fuente única del sistema cromático. Evitar valores HEX repetidos en estilos locales cuando exista un token apropiado.

## 3. Tipografía

### Títulos

**Cormorant Garamond**

Uso:
- Título principal de portada.
- Encabezados de secciones.
- Nombres de obras.
- Títulos de la biografía.
- Frases editoriales destacadas.

Estilo:
- Elegante y artístico.
- Peso preferentemente regular o semibold.
- Tamaños grandes y espaciado generoso.
- Evitar títulos completos en mayúsculas cuando ocupen varias líneas.

### Textos funcionales

**DM Sans**

Uso:
- Menú de navegación.
- Descripciones.
- Fichas técnicas.
- Formularios.
- Botones.
- Información de contacto.
- CMS.

### Escala tipográfica orientativa

| Elemento | Escritorio | Móvil |
|---|---|---|
| H1 portada | 72–96px | 44–56px |
| H2 secciones | 48–64px | 34–42px |
| H3 | 28–36px | 24–28px |
| Nombre de obra | 24–30px | 22–26px |
| Párrafo | 16–18px | 16px |
| Texto secundario | 14px | 14px |
| Etiquetas | 12–13px | 12–13px |

Usar `clamp()` para establecer tamaños fluidos donde corresponda.

Los textos extensos deben tener una altura de línea aproximada de 1.6 a 1.8.

## 4. Arquitectura general del layout

### Contenedor

- Ancho máximo: 1320px.
- Márgenes laterales centrados automáticamente.
- Padding lateral escritorio: 48–64px.
- Padding tablet: 32px.
- Padding móvil: 20px.

### Espaciado

Utilizar una escala consistente:

`4, 8, 12, 16, 24, 32, 48, 64, 96, 128px`.

Separación entre grandes secciones:
- Escritorio: 96–128px.
- Tablet: 72–96px.
- Móvil: 56–72px.

### Bordes y sombras

Preferir superficies planas, bordes finos y sombras muy discretas.

No utilizar efectos glassmorphism, neón, degradados llamativos ni sombras elevadas de aspecto comercial.

Las fotografías deben destacar por su contenido y composición, no por efectos excesivos.

## 5. Componentes globales

### Header

Encabezado elegante y discreto con:
- Logo o nombre del artista.
- Navegación Inicio, Galería y Artista.
- Acceso a contacto cuando corresponda.
- Acceso al CMS únicamente para administradores autenticados.

Comportamiento:
- Fondo marfil o blanco según la sección.
- Texto espresso.
- Encabezado sticky de altura contenida.
- Separador inferior muy sutil.
- Navegación móvil mediante menú accesible.
- Indicador de página activa discreto.

La presentación del logo y nombre debe respetar la configuración definida en el CMS: texto, logo o ambos.

### Botones

**Primario**
- Fondo espresso.
- Texto blanco.
- Padding amplio.
- Esquinas ligeramente redondeadas.
- Hover con transición cromática sutil.

**Secundario**
- Fondo transparente.
- Borde espresso.
- Texto espresso.
- Hover con fondo suave.

**Terciario**
- Apariencia de enlace editorial.
- Subrayado o flecha discreta.
- Sin contenedor de botón.

### Tarjetas de pinturas

- Imagen protagonista.
- Fondo transparente o blanco según el contexto.
- Nombre de la obra en tipografía editorial.
- Metadatos breves en DM Sans.
- Ningún efecto de zoom agresivo.
- Animación hover muy ligera.
- Tarjeta completa navegable cuando sea posible.
- Enlaces generados automáticamente hacia `detalles/index.html?id=...`.

Respetar proporciones originales de las pinturas. Evitar recortes que alteren su composición.

### Modales

- Fondo blanco o marfil.
- Overlay oscuro translúcido.
- Cierre visible y accesible.
- Navegación por teclado.
- Control de foco.
- Adaptación a pantallas móviles.

### Footer

Fondo espresso con:
- Nombre o logo del artista.
- Navegación secundaria.
- Redes sociales configuradas desde CMS.
- Correo y canales de contacto.
- Información legal o derechos de autor cuando exista.

Usar separadores discretos y tipografía de contraste alto.

## 6. Página de inicio

Archivo: `index.html`

### Hero

Portada editorial con:
- Una obra destacada o imagen administrada desde CMS.
- Nombre del artista.
- Texto de presentación existente.
- Acción principal para explorar la galería.

La obra debe conservar su identidad visual y su proporción.

### Colección destacada

Mostrar pinturas seleccionadas con composición equilibrada y fotografías amplias.

Preferir una cuadrícula de 2 o 3 columnas en escritorio y 1 columna en móvil.

### Presentación del artista

Bloque editorial con:
- Retrato del artista.
- Introducción breve.
- Enlace hacia la biografía completa.

### Serie Infinito

Sección de presentación artística basada exclusivamente en el contenido existente o publicado desde el CMS.

### Contacto

Sección final cálida y minimalista con:
- Formulario existente de preparación de correo.
- Acceso a WhatsApp.
- Información configurada desde CMS.

Conservar el comportamiento del formulario basado en la aplicación de correo del visitante.

## 7. Página de galería

Ruta: `galeria/`

### Encabezado

Título editorial:
**Galería**

Acompañado de una introducción breve, únicamente cuando exista contenido aprobado.

### Cuadrícula

- Escritorio amplio: 3 columnas.
- Tablet: 2 columnas.
- Móvil: 1 columna.
- Separaciones de 24–40px.
- Imágenes completas sin deformaciones.
- Distribución consistente y adaptable.

No forzar todas las pinturas a una relación de aspecto cuadrada.

### Filtros

Si existen categorías o series en los datos, presentar los filtros como controles discretos.

- Fondo neutro.
- Estado activo identificado claramente.
- Sin barras de colores intensos.
- Navegación accesible.

No inventar categorías que no estén respaldadas por datos del proyecto.

### Fichas

Cada tarjeta puede mostrar:
- Imagen.
- Título.
- Técnica, año o dimensiones, únicamente si existen.
- Acceso a detalles.

No mostrar precios, descuentos o disponibilidad inventados.

## 8. Página de detalles de pintura

Ruta: `detalles/index.html?id=...`

### Composición principal

Escritorio:
- Imagen a la izquierda, ocupando aproximadamente 60% del espacio.
- Información a la derecha, ocupando aproximadamente 40%.

Móvil:
- Imagen en la parte superior.
- Información y acciones debajo.

### Imagen principal

- Mantener relación de aspecto original.
- No recortar la pintura.
- Permitir inspección o ampliación si la funcionalidad existe.
- Fondo neutro.

### Información

- Nombre de la obra.
- Serie.
- Técnica.
- Dimensiones.
- Año.
- Descripción.

Mostrar solamente campos existentes en los datos.

### Acciones

- Consultar disponibilidad.
- Contactar por WhatsApp.
- Consultar por correo.
- Ver en pared.

No presentar una acción de compra o pago si el producto no dispone de esa funcionalidad.

### Ver en pared

Mantener la funcionalidad de visualización contextual.

Los escenarios deben:
- Tener apariencia fotográfica realista.
- Utilizar interiores minimalistas.
- Permitir contemplar la pintura sin competir con ella.
- Conservar el encuadre y la proporción de la obra.
- Permitir ubicar la pintura mediante posicionamiento controlado por CSS o JavaScript.
- No incluir pinturas incrustadas en la imagen de fondo cuando la obra se añade dinámicamente.

La composición contextual es una representación visual y no debe implicar escala física exacta sin datos suficientes.

## 9. Página del artista

Ruta: `artista/`

Diseño de carácter editorial.

### Estructura

1. Presentación del artista.
2. Retrato.
3. Biografía existente.
4. Filosofía o narrativa artística disponible.
5. Serie Infinito.
6. Trayectoria y exposiciones documentadas en el contenido.
7. Contacto.

La fotografía y el texto deben combinarse mediante composiciones asimétricas equilibradas.

Para textos largos, utilizar un ancho de lectura aproximado de 650–760px.

Evitar elementos ornamentales que resten importancia a la historia del artista.

## 10. CMS

Ruta: `cms/`

El panel administrativo comparte las variables cromáticas y tipográficas del sitio, pero prioriza claridad y eficiencia.

### Características

- Fondo marfil muy claro.
- Navegación lateral o superior según espacio.
- Superficies blancas para formularios.
- Títulos espresso.
- Estados activos claramente identificados.
- Campos con bordes neutros.
- Estados de éxito, error y advertencia diferenciados semánticamente.
- Botones de guardar y publicar visualmente consistentes.
- Vista previa de imágenes.
- Mensajes claros durante cargas y operaciones.

No alterar los mecanismos existentes de autenticación, autorización, navegación ni publicación.

La validación administrativa continúa implementándose mediante Supabase Auth y políticas RLS.

## 11. Movimiento e interacción

Duraciones recomendadas:
- Hover: 180ms.
- Transiciones generales: 280ms.
- Apariciones discretas: 350–500ms.

Movimientos permitidos:
- Desvanecimiento.
- Ligero desplazamiento vertical.
- Cambios sutiles de color.
- Transición suave de imágenes.

Evitar:
- Parallax excesivo.
- Rebotes.
- Rotaciones innecesarias.
- Zoom intenso en pinturas.
- Animaciones continuas sin finalidad.

Respetar `prefers-reduced-motion`.

## 12. Responsive y accesibilidad

### Breakpoints orientativos

- Móvil: hasta 767px.
- Tablet: 768–1023px.
- Escritorio: 1024px en adelante.

### Requisitos

- Controles táctiles cómodos.
- Menús navegables mediante teclado.
- Foco visible.
- Contraste WCAG AA para textos e interfaces aplicables.
- Textos alternativos apropiados para las imágenes.
- Formularios con etiquetas accesibles.
- Imágenes responsivas.
- Carga diferida cuando corresponda.
- Sin desplazamiento horizontal inesperado.

No utilizar el verde salvia claro para texto pequeño sobre blanco si no cumple contraste.

## 13. Arquitectura técnica del diseño

### Estilos globales

`assets/css/site.css`

Responsabilidades:
- Design tokens.
- Reset y estilos base.
- Tipografía.
- Layout.
- Componentes compartidos.
- Header y footer.
- Botones.
- Estados interactivos.
- Reglas globales responsive.

### Estilos locales

Cada página conserva sus archivos CSS específicos para:
- Layout particular.
- Componentes exclusivos.
- Ajustes contextuales.

Evitar duplicación de componentes globales en CSS de páginas.

### JavaScript compartido

`assets/js/common.js`

Conserva responsabilidades sobre:
- Navegación.
- Tarjetas reutilizables.
- Modales.
- Comportamientos compartidos.

### Datos

`assets/js/data.js`

Mantiene los registros e imágenes de las pinturas, respetando la integración existente con el contenido administrado mediante CMS.

### Integración

El rediseño visual no debe alterar:
- Rutas públicas.
- Enlaces `?id=`.
- Integración con Supabase.
- Protección RLS.
- Configuración de contacto.
- Carga de imágenes.
- Funcionamiento del CMS.
- Navegación interna administrativa.
- Consultas por WhatsApp o correo.

## 14. Criterios de aceptación visual

El diseño se considera correctamente aplicado cuando:

- Todas las páginas comparten la misma identidad visual.
- Las pinturas son el elemento de mayor protagonismo.
- La experiencia conserva un carácter artístico y editorial.
- La tipografía es consistente.
- Los botones y controles usan componentes globales.
- Los colores respetan los tokens definidos.
- Las imágenes no se deforman ni recortan indebidamente.
- La experiencia móvil mantiene calidad visual.
- El CMS continúa siendo funcional.
- Las obras y contenidos administrados se siguen mostrando correctamente.
- Las funciones existentes permanecen operativas.
- No se introducen datos biográficos, artísticos o comerciales inventados.

**Objetivo final:** una galería digital de autor que comunique prestigio, sensibilidad artística y confianza, sin sacrificar usabilidad ni funcionalidad.

### Resultado visual esperado

La página debe mantener un equilibrio entre galería de museo contemporáneo, portafolio de artista y catálogo de obras originales.

Se deben evitar secciones hechas solo de tarjetas blancas con bordes redondeados. Preferir composiciones editoriales abiertas, imágenes a gran escala, textos bien alineados y pequeñas secciones de color beige.

El botón flotante de WhatsApp se conserva, adaptado visualmente para no romper la elegancia del sitio y manteniendo su reconocibilidad.
