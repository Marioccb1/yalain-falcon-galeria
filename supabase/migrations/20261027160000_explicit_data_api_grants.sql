-- Explicit Data API privileges for public tables.
-- From 2026-10-30, Supabase no longer auto-grants new public tables to
-- anon/authenticated/service_role. Existing tables keep prior grants, but
-- preview branches, db reset, and new tables need these statements in the
-- same migration that creates each table. This migration re-asserts grants
-- for the current CMS schema so resets stay API-accessible.

-- Admin allowlist: authenticated can check membership; never expose to anon.
revoke all on table public.cms_admins from anon, authenticated, service_role;
grant select on table public.cms_admins to authenticated, service_role;

-- Public content: visitors read published rows (RLS); admins write (RLS).
revoke all on table public.cms_artworks from anon, authenticated, service_role;
grant select on table public.cms_artworks to anon, authenticated, service_role;
grant insert, update, delete on table public.cms_artworks to authenticated, service_role;

revoke all on table public.cms_artist_profile from anon, authenticated, service_role;
grant select on table public.cms_artist_profile to anon, authenticated, service_role;
grant insert, update, delete on table public.cms_artist_profile to authenticated, service_role;

revoke all on table public.cms_exhibitions from anon, authenticated, service_role;
grant select on table public.cms_exhibitions to anon, authenticated, service_role;
grant insert, update, delete on table public.cms_exhibitions to authenticated, service_role;
