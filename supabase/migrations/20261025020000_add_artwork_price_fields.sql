alter table public.cms_artworks
  add column if not exists price numeric(12,2),
  add column if not exists price_currency text not null default 'USD';

alter table public.cms_artworks
  drop constraint if exists cms_artworks_price_nonnegative;

alter table public.cms_artworks
  add constraint cms_artworks_price_nonnegative
  check (price is null or price >= 0);

alter table public.cms_artworks
  drop constraint if exists cms_artworks_price_currency_format;

alter table public.cms_artworks
  add constraint cms_artworks_price_currency_format
  check (price_currency ~ '^[A-Z]{3}$');

comment on column public.cms_artworks.price is 'Precio opcional de la obra; null = no mostrar en el sitio.';
comment on column public.cms_artworks.price_currency is 'Código ISO 4217 de la moneda del precio (USD, EUR, CUP…).';
