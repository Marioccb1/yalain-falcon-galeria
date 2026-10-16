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
`/cms/`. El panel usa Supabase Auth con correo y contraseña; no incluye
registro público ni credenciales de demostración. La autorización de
administrador también se valida en las políticas RLS, no solo en la interfaz.

Antes de usarlo:

1. Ejecuta una vez el SQL de
   `supabase/migrations/20261016050452_cms_content.sql` en el SQL Editor del
   proyecto Supabase. Crea las tablas con RLS, el bucket público de imágenes,
   las políticas para administradores y una copia inicial del contenido actual
   del sitio. Si utilizas la CLI, enlaza el proyecto y aplica las migraciones
   con `npx supabase db push`.
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
publican en el sitio. El bucket es público para servir las obras; las políticas
RLS limitan las cargas, cambios y eliminaciones a las cuentas autorizadas. No
uses claves `service_role` o secretas en el cliente.
