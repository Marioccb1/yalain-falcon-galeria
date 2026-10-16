# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- Public visitors exploring the paintings and the artist's background.
- The site administrator, who signs in with an email and password to maintain
  artwork, biography, and exhibition content.

## Product Purpose

Present Yalain Falcón Yanes's painting portfolio and provide an authenticated
content-management area so the administrator can maintain the public gallery,
artist biography, and exhibition history.

## Operating Context

Visitors use the public site to browse paintings, read artwork details, learn
about the artist, and find contact links. The administrator uses the CMS at a
separate route to sign in and create, edit, publish, or remove the site's
managed content.

## Capabilities and Constraints

- The CMS manages artworks, the artist biography, and exhibitions.
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
