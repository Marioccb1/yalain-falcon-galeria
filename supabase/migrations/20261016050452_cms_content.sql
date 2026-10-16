create table public.cms_admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create table public.cms_artworks (
  id text primary key,
  title text not null,
  number text not null,
  year smallint not null check (year between 1000 and 9999),
  dimensions text not null default '',
  technique text not null default '',
  color text not null default '#A6482A',
  color2 text not null default '#7C3018',
  foreground_color text not null default '#F6EFE6',
  phrase text not null default '',
  image_url text not null default '',
  description text not null default '',
  published boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index cms_artworks_public_order_idx
  on public.cms_artworks (sort_order, year, id)
  where published;

create table public.cms_artist_profile (
  id smallint primary key default 1 check (id = 1),
  birth_place text not null default '',
  birth_year smallint check (birth_year is null or birth_year between 1000 and 9999),
  summary text not null default '',
  quote text not null default '',
  quote_attribution text not null default '',
  portrait_url text not null default '',
  biography text not null default '',
  artistic_vision text not null default '',
  series_description text not null default '',
  updated_at timestamptz not null default now()
);

create table public.cms_exhibitions (
  id uuid primary key default gen_random_uuid(),
  year smallint not null check (year between 1000 and 9999),
  title text not null,
  place text not null default '',
  published boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index cms_exhibitions_public_order_idx
  on public.cms_exhibitions (sort_order, year desc)
  where published;

alter table public.cms_admins enable row level security;
alter table public.cms_artworks enable row level security;
alter table public.cms_artist_profile enable row level security;
alter table public.cms_exhibitions enable row level security;

revoke all on table public.cms_admins from anon, authenticated;
revoke all on table public.cms_artworks from anon, authenticated;
revoke all on table public.cms_artist_profile from anon, authenticated;
revoke all on table public.cms_exhibitions from anon, authenticated;

grant select on table public.cms_admins to authenticated;
grant select on table public.cms_artworks to anon, authenticated;
grant insert, update, delete on table public.cms_artworks to authenticated;
grant select on table public.cms_artist_profile to anon, authenticated;
grant insert, update, delete on table public.cms_artist_profile to authenticated;
grant select on table public.cms_exhibitions to anon, authenticated;
grant insert, update, delete on table public.cms_exhibitions to authenticated;

create policy "CMS admins can read their own access row"
  on public.cms_admins for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "Anyone can read published artwork"
  on public.cms_artworks for select to anon, authenticated
  using (published);

create policy "CMS admins can read all artwork"
  on public.cms_artworks for select to authenticated
  using (exists (
    select 1 from public.cms_admins
    where user_id = (select auth.uid())
  ));

create policy "CMS admins can insert artwork"
  on public.cms_artworks for insert to authenticated
  with check (exists (
    select 1 from public.cms_admins
    where user_id = (select auth.uid())
  ));

create policy "CMS admins can update artwork"
  on public.cms_artworks for update to authenticated
  using (exists (
    select 1 from public.cms_admins
    where user_id = (select auth.uid())
  ))
  with check (exists (
    select 1 from public.cms_admins
    where user_id = (select auth.uid())
  ));

create policy "CMS admins can delete artwork"
  on public.cms_artworks for delete to authenticated
  using (exists (
    select 1 from public.cms_admins
    where user_id = (select auth.uid())
  ));

create policy "Anyone can read the artist profile"
  on public.cms_artist_profile for select to anon, authenticated
  using (id = 1);

create policy "CMS admins can manage the artist profile"
  on public.cms_artist_profile for all to authenticated
  using (exists (
    select 1 from public.cms_admins
    where user_id = (select auth.uid())
  ))
  with check (exists (
    select 1 from public.cms_admins
    where user_id = (select auth.uid())
  ));

create policy "Anyone can read published exhibitions"
  on public.cms_exhibitions for select to anon, authenticated
  using (published);

create policy "CMS admins can read all exhibitions"
  on public.cms_exhibitions for select to authenticated
  using (exists (
    select 1 from public.cms_admins
    where user_id = (select auth.uid())
  ));

create policy "CMS admins can insert exhibitions"
  on public.cms_exhibitions for insert to authenticated
  with check (exists (
    select 1 from public.cms_admins
    where user_id = (select auth.uid())
  ));

create policy "CMS admins can update exhibitions"
  on public.cms_exhibitions for update to authenticated
  using (exists (
    select 1 from public.cms_admins
    where user_id = (select auth.uid())
  ))
  with check (exists (
    select 1 from public.cms_admins
    where user_id = (select auth.uid())
  ));

create policy "CMS admins can delete exhibitions"
  on public.cms_exhibitions for delete to authenticated
  using (exists (
    select 1 from public.cms_admins
    where user_id = (select auth.uid())
  ));

insert into public.cms_artworks (
  id, title, number, year, dimensions, technique, color, color2,
  foreground_color, phrase, image_url, description, published, sort_order
)
values
  ('inf-01', 'Infinito I', '01', 2016, '100 × 80 cm', 'Óleo sobre lienzo', '#A6482A', '#7C3018', '#F6EFE6', 'Todo comienza en uno', 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&q=80', 'La primera pieza de la serie. Un número que abre el relato y establece su lógica: contar para no perderse. La superficie, trabajada por capas sucesivas, deja ver el paso del tiempo sobre el color y convierte el gesto de numerar en una forma de memoria.', true, 1),
  ('inf-03', 'Infinito III', '03', 2017, '90 × 70 cm', 'Óleo sobre lienzo', '#2C3E5C', '#182742', '#EDF0F5', 'El tiempo también pinta', 'https://images.unsplash.com/photo-1549490349-8643362247b5?w=800&q=80', 'Sobre un azul profundo, el número aparece como una señal mínima en medio de la materia. El artista interviene la superficie en distintas sesiones, permitiendo que las capas inferiores asomen y dialoguen con las superiores.', true, 2),
  ('inf-07', 'Infinito VII', '07', 2018, '120 × 90 cm', 'Óleo y acrílico sobre lienzo', '#C08A2E', '#8F6416', '#FFF8EC', 'Capas de lo que fui', 'https://images.unsplash.com/photo-1550859492-d5da9d8e45f3?w=800&q=80', 'El ocre domina la composición y aporta una temperatura cálida, casi mineral. La cifra funciona como un ancla: en medio de la acumulación de materia, el número ordena y da sentido al caos del proceso.', true, 3),
  ('inf-12', 'Infinito XII', '12', 2019, '100 × 100 cm', 'Óleo sobre lienzo', '#E6DFD1', '#CCC1AC', '#17140F', 'Repetir para avanzar', 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=800&q=80', 'Una de las piezas de fondo claro de la serie. Aquí el color se retira y deja que la superficie respire: el número se dibuja con una economía extrema, casi como una nota escrita al margen de un cuaderno de trabajo.', true, 4),
  ('inf-18', 'Infinito XVIII', '18', 2020, '130 × 97 cm', 'Óleo sobre lienzo', '#5C6B4A', '#3C4832', '#F0F3E9', 'Crecer es cambiar de forma', 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&q=80', 'El verde oliva, trabajado en veladuras, genera una profundidad que parece orgánica. La obra pertenece al momento en que la serie empieza a pensar el crecimiento no como suma, sino como transformación de la forma.', true, 5),
  ('inf-24', 'Infinito XXIV', '24', 2021, '80 × 60 cm', 'Técnica mixta sobre lienzo', '#C0938C', '#966A64', '#FFF4F1', 'Lo que permanece', 'https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?w=800&q=80', 'Formato íntimo y paleta suave para una reflexión sobre la permanencia. Los materiales se alternan sin jerarquía, dejando que la superficie conserve las huellas del trabajo y del tiempo.', true, 6),
  ('inf-31', 'Infinito XXXI', '31', 2023, '150 × 110 cm', 'Óleo sobre lienzo', '#2F5D5B', '#1B3E3D', '#E9F2F0', 'Contar hasta el infinito', 'https://images.unsplash.com/photo-1579965342575-16428a7c8881?w=800&q=80', 'Una de las piezas de mayor formato de la serie. El verde azulado profundo envuelve la cifra y la convierte en presencia. El espectador se enfrenta a un número que ya no cuenta objetos, sino estados.', true, 7),
  ('inf-40', 'Infinito XL', '40', 2024, '100 × 80 cm', 'Óleo sobre lienzo', '#2A2723', '#141210', '#F1EDE6', 'Cada número, un día', 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&q=80', 'Casi monocroma, esta obra cierra por ahora la serie con una sobriedad absoluta. La cifra emerge apenas de la penumbra y propone una lectura serena: el proceso continúa, y con él, la cuenta.', true, 8);

insert into public.cms_artist_profile (
  id, birth_place, birth_year, summary, quote, quote_attribution,
  portrait_url, biography, artistic_vision, series_description
)
values (
  1,
  'La Habana, Cuba',
  1972,
  'Diseñador industrial de formación, pintor por necesidad de expresión. Su obra se construye por capas: una superficie que habla de proceso, cambio y permanencia.',
  'Trabajo por capas. Dejo que la pintura decida cuándo está terminada: a veces tarda meses, a veces años.',
  'Yalain Falcón Yanes · La Habana',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=80',
  'Nacido en La Habana, Cuba, en 1972, Yalain Falcón Yanes se formó como diseñador industrial en el Instituto Superior Politécnico de Diseño Industrial (1995). Su formación técnica marcó una base estructural que más adelante evolucionó hacia la pintura, donde encontró un medio más directo de expresión y comunicación. La práctica artística de Yalain se basa en la experimentación por capas. Utiliza diversos materiales y técnicas, permitiendo que cada pieza evolucione con el tiempo. El resultado es una superficie que habla de proceso, cambio y permanencia.',
  'En la década de los noventa, el arte abstracto cubano vivió una revitalización significativa. Nuevas generaciones retomaron esta tradición aportando perspectivas contemporáneas. La obra de Yalain se inserta en ese diálogo: respeta la raíz abstracta, pero la adapta a una mirada actual, donde el mensaje y la experiencia emocional del espectador son fundamentales.',
  '«Infinito» nace como resultado de una investigación sobre las actitudes y las relaciones humanas. En esta serie, el artista pinta números consecutivos sobre fondos de color —y ocasionalmente blancos— acompañados de frases motivacionales. Cada obra representa un momento del proceso personal del artista, convirtiéndose en un testimonio visual de crecimiento y transformación.'
)
on conflict (id) do nothing;

insert into public.cms_exhibitions (year, title, place, published, sort_order)
values
  (2016, 'Inicio de la serie «Infinito»', 'La Habana, Cuba', true, 1),
  (2019, 'Exposición colectiva de arte abstracto', 'La Habana, Cuba', true, 2),
  (2021, 'Selección de arte cubano contemporáneo', 'Miami, EE. UU.', true, 3),
  (2022, 'Feria internacional de arte', 'Madrid, España', true, 4),
  (2024, '«Infinito», exposición individual', 'Ciudad de México, México', true, 5),
  (2025, 'Obra en colecciones privadas', 'EE. UU. · España · México', true, 6);

insert into storage.buckets (
  id, name, public, file_size_limit, allowed_mime_types
)
values (
  'cms-images', 'cms-images', true, 5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

create policy "CMS admins can upload CMS images"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'cms-images'
    and exists (
      select 1 from public.cms_admins
      where user_id = (select auth.uid())
    )
  );

create policy "CMS admins can update CMS images"
  on storage.objects for update to authenticated
  using (
    bucket_id = 'cms-images'
    and exists (
      select 1 from public.cms_admins
      where user_id = (select auth.uid())
    )
  )
  with check (
    bucket_id = 'cms-images'
    and exists (
      select 1 from public.cms_admins
      where user_id = (select auth.uid())
    )
  );

create policy "CMS admins can delete CMS images"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'cms-images'
    and exists (
      select 1 from public.cms_admins
      where user_id = (select auth.uid())
    )
  );