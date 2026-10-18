alter table public.cms_artist_profile
  add column if not exists contact_phone text not null default '+53 52932396',
  add column if not exists contact_phone_secondary text not null default '',
  add column if not exists contact_email text not null default 'yalainfalcon@gmail.com',
  add column if not exists whatsapp_number text not null default '5352932396',
  add column if not exists instagram_url text not null default 'https://instagram.com/infinitecubanartist',
  add column if not exists facebook_url text not null default 'https://www.facebook.com/search/top?q=Yalain%20Falc%C3%B3n',
  add column if not exists threads_url text not null default 'https://www.threads.com/@infinitecubanartist';