alter table public.cms_artist_profile
  add column if not exists hero_eyebrow text not null default 'Pintura contemporánea · Cuba',
  add column if not exists hero_title text not null default E'Yalain\nFalcón\nYanes',
  add column if not exists hero_intro text not null default 'La Habana, 1972. Una pintura construida por capas, donde el proceso importa tanto como el resultado. Serie Infinito, 2016 – presente.',
  add column if not exists hero_image_url text not null default '',
  add column if not exists hero_image_alt text not null default 'Obra de la serie Infinito',
  add column if not exists header_logo_url text not null default '',
  add column if not exists header_brand_mode text not null default 'text'
    check (header_brand_mode in ('text', 'logo', 'both'));

update public.cms_artist_profile
set hero_image_url = coalesce(
  nullif(hero_image_url, ''),
  (select image_url from public.cms_artworks where id = 'inf-31'),
  ''
)
where id = 1;