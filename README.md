# Digital Recipe Book

A self-hosted recipe manager: browse, search, and filter recipes, add your own
with photos and tags, spin the **Recipe Roulette** when you can't decide what
to cook, and keep a list of favorites. Editing requires a user account;
browsing is open to anyone.

## Features

- **Browse & search** — search by name, filter by tag, and advanced filters
  for cooking time and ingredient contents.
- **Favorites** — star recipes, persisted in the browser's `localStorage`.
- **Recipe Roulette** — a CS:GO case-opening-style spinner that picks a random
  recipe from your book, optionally scoped to one or more tags.
- **Add / Edit / Delete recipes** — name, instructions, cooking time,
  servings, an image upload, multiple ingredients, and tags.
- **Bulk ingredient import** — paste a block of text (one ingredient per
  line, e.g. `2 tbsp olive oil`) and it's parsed into quantity/unit/name rows
  automatically.
- **Accounts** — invite-only user accounts with server-side sessions gate
  add/edit/delete; reading recipes never requires logging in.

## Tech Stack

- **Frontend**: Next.js (App Router), React 19, TypeScript, Tailwind CSS v4
- **Backend**: Express, PostgreSQL (via `pg`), Multer for image uploads,
  bcrypt + express-session (sessions stored in Postgres via
  connect-pg-simple) for auth
- **Infra**: Docker Compose (Postgres + backend + frontend containers)

## Project Structure

```
src/
  app/                     Next.js app (frontend)
    components/            Shared UI components (modals, cards, etc.)
    components/home/       Home page layout (sidebar, top nav, hero, grid)
    hooks/                 useRecipeBookData, useRecipeForms, useAuth, ...
    types/                 Shared TypeScript types (Recipe, Ingredient, ...)
    utils/                 Helpers (e.g. ingredient text parsing)
    page.tsx               Main page, composes everything above
  server/
    index.js               Express API (routes, sessions, auth middleware)
    uploads/                 Uploaded recipe images (gitignored)
  db/
    init.sql                 Postgres schema, run automatically by the db container
migrations/
  001_accounts.sql           Adds the account/session tables to an existing database
scripts/
  create-admin.js            CLI to create an admin user
```

## Database Schema

The schema lives in [`src/db/init.sql`](src/db/init.sql) and is applied
automatically the first time the Postgres container starts. Summary:

```sql
CREATE TABLE recipes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    instructions TEXT,
    cookingtime INT,
    servings_id INT,
    image_path VARCHAR(255),
    FOREIGN KEY (servings_id) REFERENCES servings(id)
);

CREATE TABLE servings (
    id SERIAL PRIMARY KEY,
    amount DECIMAL(10, 2),
    unit VARCHAR(50)
);

CREATE TABLE ingredients (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100)
);

CREATE TABLE recipe_ingredients (
    id SERIAL PRIMARY KEY,
    recipe_id INT,
    ingredient_id INT,
    quantity DECIMAL(10, 2),
    unit VARCHAR(20),
    FOREIGN KEY (recipe_id) REFERENCES recipes(id),
    FOREIGN KEY (ingredient_id) REFERENCES ingredients(id)
);

CREATE TABLE tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50)
);

CREATE TABLE recipe_tags (
    recipe_id INT,
    tag_id INT,
    PRIMARY KEY (recipe_id, tag_id),
    FOREIGN KEY (recipe_id) REFERENCES recipes(id),
    FOREIGN KEY (tag_id) REFERENCES tags(id)
);
```

`unit_conversions` also exists in `init.sql` (ingredient/from-unit/to-unit/factor)
but isn't read or written by any route yet — it's reserved for a future unit
conversion feature.

Accounts live in `users` (usernames are unique case-insensitively, role is
`admin` or `member`), `invites` and `password_resets` (both store only the
SHA-256 hash of their token), plus the `session` table used by
connect-pg-simple. `recipes.created_by` optionally points at the user who
created the recipe.

### Migrations

`init.sql` only runs when the Postgres volume is empty. To add the account
tables to an existing database, run the migration once:

```bash
docker compose exec -T db sh -c 'psql -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" -d "$POSTGRES_DB"' < migrations/001_accounts.sql
```

The migration runs in a single transaction and uses `IF NOT EXISTS`, so it is
safe to re-run.

## Environment Variables

Set these in a root `.env` file (used by both `docker-compose.yml` and the
apps directly):

| Variable              | Used by  | Description                                             |
| --------------------- | -------- | --------------------------------------------------------- |
| `DB_HOST`              | backend  | Postgres host (`db` when using Docker Compose)             |
| `DB_PORT`              | backend  | Postgres port (`5432`)                                     |
| `DB_USER`              | db, backend | Postgres user                                          |
| `DB_PASSWORD`          | db, backend | Postgres password                                      |
| `DB_NAME`              | db, backend | Postgres database name                                 |
| `NEXT_PUBLIC_API_BASE` | frontend | Base URL the browser uses to reach the backend, e.g. `http://localhost:5000` |
| `ALLOWED_ORIGIN`       | backend  | The one origin CORS accepts requests from, e.g. `http://localhost:3000` (must match where the frontend is actually loaded from) |
| `SESSION_SECRET`       | backend  | **Required** — signs the session cookie; the backend refuses to start without it. Generate with `openssl rand -hex 32` |
| `COOKIE_SECURE`        | backend  | Optional, default `true` — the session cookie is only sent over HTTPS. Set to `false` only to test over plain http on the LAN |

`openssl rand -hex 32` prints only hex characters (no `$`), so the value can go
into `.env` as-is; Docker Compose needs no escaping.

## Getting Started

### Option A: Docker Compose (recommended)

With `.env` filled in at the repo root:

```bash
docker compose up --build
```

This starts three containers: Postgres (internal only — not published to the
host), the Express API (`5000`), and the Next.js dev server (`3000`). Open
[http://localhost:3000](http://localhost:3000).

### Option B: Run without Docker

1. Start a Postgres instance and run `src/db/init.sql` against it.
2. Install dependencies at the repo root: `npm install`.
3. Run the frontend: `npm run dev` (serves on port 3000).
4. Run the backend: `cd src/server && node index.js` (serves on port 5000).

## Accounts

Add/edit/delete requires logging in with a user account. Browsing (all `GET`
recipe routes) stays public and never needs a login.

Logging in creates a server-side session (stored in Postgres) and sets an
`httpOnly`, `SameSite=Lax` cookie that lasts 30 days and is renewed on every
request. Passwords must be at least 10 characters and at most 72 bytes.

### Creating the first admin

There is no sign-up page for the first user; create an admin from the command
line inside the backend container (it prompts for the password without
echoing it):

```bash
docker compose exec backend node /recipe/scripts/create-admin.js
```

After creating the user it offers to assign every existing recipe that has no
owner to the new admin. Without Docker, run `npm run create-admin` from the
repo root instead.

Further users join through invites (`POST /api/auth/register` with an invite
token).

## API Endpoints

| Method | Path                          | Auth required | Description                              |
| ------ | ----------------------------- | -------------- | ------------------------------------------ |
| GET    | `/api/recipes-with-ingredients` | no           | List all recipes with ingredients & tags   |
| GET    | `/api/tags`                     | no           | List all distinct tags                    |
| POST   | `/api/auth/login`               | no           | Log in with `{ username, password }`; starts a session |
| POST   | `/api/auth/logout`              | no           | End the current session                   |
| GET    | `/api/auth/me`                  | yes          | Current user `{ id, username, display_name, role }`, or 401 |
| POST   | `/api/auth/register`            | no           | Create an account with `{ inviteToken, username, displayName, password }` |
| POST   | `/api/auth/change-password`     | yes          | `{ currentPassword, newPassword }`; logs out the user's other sessions |
| POST   | `/api/recipes`                  | yes          | Create a recipe (multipart form, `image` optional) |
| PUT    | `/api/recipes`                  | yes          | Update a recipe (multipart form, `id` required) |
| DELETE | `/api/recipes/:id`              | yes          | Delete a recipe                           |

Authenticated requests rely on the session cookie, so browser requests must
be sent with credentials (`fetch(..., { credentials: "include" })`).

---

Built with [Next.js](https://nextjs.org) (bootstrapped from
[`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app))
and [Tailwind CSS](https://tailwindcss.com).
