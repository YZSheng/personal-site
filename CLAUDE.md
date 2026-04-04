# CLAUDE.md

## Stack

- **Framework**: Remix v2 (classic compiler, not Vite-based)
- **React**: 18
- **TypeScript**: 5
- **Database**: PostgreSQL via Prisma v7 + `@prisma/adapter-pg` (PgBouncer-compatible)
- **Styling**: Tailwind CSS v4 — CSS-first config in `styles/app.css`, no `tailwind.config.js`
- **Testing**: Vitest + happy-dom
- **Deploy**: Fly.io (`npm run deploy`)

## Commands

```bash
npm run dev          # start dev server (Remix + Tailwind watch in parallel)
npm run build        # build CSS then Remix
npm run typecheck    # tsc --noEmit
npm run lint         # ESLint
npm run test         # Vitest
npm run deploy       # flyctl deploy --remote-only
```

Always run `npm run test` and `npm run lint` before committing. Fix any failures before creating the commit.

## Architecture

Flat file routing (Remix v2):

```
app/routes/
  _index.tsx                        # home
  blog._index.tsx                   # public blog list
  blog.$slug.tsx                    # public blog post (published only)
  contact.tsx
  learning.typing.tsx
  admin.login.tsx                   # public login
  admin.logout.tsx                  # action-only logout
  admin._protected.tsx              # pathless layout — requires auth
  admin._protected._index.tsx       # dashboard (list/publish/delete)
  admin._protected.new.tsx          # create post
  admin._protected.$id.edit.tsx     # edit post
  admin._protected.preview.tsx      # POST resource: markdown → HTML
```

Data layer:
- `app/repository/blogs.server.ts` — raw Prisma queries
- `app/services/blogs.server.ts` — business logic (parsing, auth checks)
- `app/db.server.ts` — `PrismaClient` singleton with `@prisma/adapter-pg`
- `app/session.server.ts` — cookie session storage (`__admin_session`)

## Key Conventions

- `meta` returns an array: `[{ title: "..." }]`
- Use `useLoaderData<typeof loader>()` for type inference
- Admin routes set `Cache-Control: no-store`; public blog routes set `public, max-age=3600`
- Tailwind dark mode via `@variant dark (&:where(.dark, .dark *))` in `styles/app.css`
- Markdown rendered server-side via `marked` + `marked-highlight` + `highlight.js`

## Prisma

Schema: `prisma/schema.prisma`  
Config (CLI): `prisma.config.ts` — reads `DATABASE_URL` from env  
Client: `app/db.server.ts` — uses `PrismaPg` adapter for PgBouncer compatibility

After schema changes:
```bash
DATABASE_URL="..." npx prisma db push   # use port 5432 (session mode), not 6543 (pgbouncer)
DATABASE_URL="..." npx prisma generate
```

> Note: `prisma migrate dev` hangs on the pgbouncer URL (port 6543). Always use port 5432 for schema operations.

## Environment Variables

```
DATABASE_URL      # Supabase pgbouncer URL (port 6543) — runtime only
ADMIN_PASSWORD    # plain-text password for /admin/login
SESSION_SECRET    # 64-char hex secret for cookie signing (openssl rand -hex 32)
```

Production secrets: `flyctl secrets set KEY=value`

## Blog `published` Field

All posts default to `published = false`. Public routes (`blog._index`, `blog.$slug`) filter to `published: true` only. Use the admin dashboard to publish/unpublish posts.
