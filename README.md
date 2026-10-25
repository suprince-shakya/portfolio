# Portfolio

Personal portfolio for **Suprince Shakya** — a Next.js 15 (App Router) site with a small admin area for managing projects and contact messages.

## Tech stack

- Next.js 15, React 19, TypeScript
- Tailwind CSS + shadcn/ui (Radix)
- MongoDB + Mongoose
- JWT auth (httpOnly cookie) with bcrypt password hashing
- Docker

## Getting started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create `.env.local` from the example and fill in the values:

   ```bash
   cp .env.example .env.local
   ```

   | Variable | Description |
   | --- | --- |
   | `NEXT_PUBLIC_APP_URL` | Public URL of the site (used for metadata) |
   | `NEXT_PUBLIC_APP_NAME` | Display name |
   | `MONGODB_URI` | MongoDB connection string (server only) |
   | `JWT_SECRET` | Long random string used to sign JWTs (server only) |
   | `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Credentials used by the seed script only |

   > `MONGODB_URI` and `JWT_SECRET` must **not** use the `NEXT_PUBLIC_` prefix.

3. Seed (or rotate) the admin user:

   ```bash
   npm run seed:admin
   ```

   The script creates the user if it does not exist, or updates its password.

4. Seed the initial site content (profile, about, experience, and stacks):

   ```bash
   npm run seed:content
   ```

   Existing content is left unchanged. Everything can then be edited from `/admin`.

5. Start the dev server:

   ```bash
   npm run dev
   ```

   - Site: http://localhost:3000
   - Admin: http://localhost:3000/admin

## Admin area

- `/admin/login` — email/password login (JWT stored in an httpOnly cookie; rate limited)
- `/admin` — dashboard with counts and recent messages
- `/admin/projects` — create and delete projects, upload a cover image and gallery
- `/admin/messages` — read, reply to, and delete contact messages

Uploads are written to `public/uploads/` and validated (JPEG/PNG/WebP/GIF/AVIF, max 5MB each, max 10 gallery images). This requires a persistent/writable `public` directory in production (the provided Docker setup mounts it as a volume).

## API

| Method | Route | Auth | Description |
| --- | --- | --- | --- |
| `POST` | `/api/auth/login` | Public | Rate limited, sets auth cookie |
| `POST` | `/api/auth/logout` | Public | Clears auth cookie |
| `GET` | `/api/projects` | Public | List projects |
| `POST` | `/api/projects` | Required | Create a project (multipart/form-data) |
| `DELETE` | `/api/projects/[id]` | Required | Delete a project and its images |
| `GET` | `/api/message` | Required | List contact messages |
| `POST` | `/api/message` | Public | Submit a contact message (rate limited) |
| `DELETE` | `/api/message/[id]` | Required | Delete a message |

Authenticated requests can use the `portfolio_auth` cookie or an `Authorization: Bearer <token>` header.

## Scripts

```bash
npm run dev        # development server
npm run build      # production build
npm run start      # production server
npm run lint       # eslint
npm run typecheck  # tsc --noEmit
npm run seed:admin # create/update admin user
npm run seed:content # seed initial site content without overwriting existing content
```

## Deployment

`docker-compose.yml` expects the image `ghcr.io/suprince-shakya/portfolio-ghcr:latest`, exposes the app on port `3004`, mounts `./public` as a volume so uploaded images persist, and loads runtime secrets from `.env.local`.

Set `MONGODB_URI`, `JWT_SECRET`, `NEXT_PUBLIC_APP_URL`, and `NEXT_PUBLIC_APP_NAME` in `.env.local` (or the runtime environment). Secrets are intentionally excluded from the Docker image.

The auth cookie is marked `Secure` in production. If you run the production image over plain HTTP (for example locally on `http://localhost:3004`), set `AUTH_COOKIE_SECURE=false` so login still works. Do not copy `.env.local` into the image; provide secrets at runtime.

Rate limiting is in-memory and therefore per instance. If you run multiple replicas, put a shared rate limiter (e.g. Redis) in front of the auth and message endpoints.
