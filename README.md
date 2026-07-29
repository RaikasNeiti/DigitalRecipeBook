# Digital Recipe Book

A self-hosted recipe manager: browse, search, and filter recipes, add your own
with photos and tags, spin the **Recipe Roulette** when you can't decide what
to cook, and keep a list of favorites. Editing is gated behind a single shared
password; browsing is open to anyone.

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
- **Authentication** — a single shared password gates add/edit/delete;
  reading recipes never requires logging in.

## Tech Stack

- **Frontend**: Next.js (App Router), React 19, TypeScript, Tailwind CSS v4
- **Backend**: Express, PostgreSQL (via `pg`), Multer for image uploads,
  bcrypt + JSON Web Tokens for auth
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
    index.js               Express API (routes, auth middleware)
    config/secret.js        Reads JWT_SECRET from the environment
    uploads/                 Uploaded recipe images (gitignored)
  db/
    init.sql                 Postgres schema, run automatically by the db container
scripts/
  generate-password-hash.js  CLI to bcrypt-hash a password for APP_PASSWORD_HASH
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
| `JWT_SECRET`           | backend  | Signing secret for login tokens (any long random string)   |
| `APP_PASSWORD_HASH`    | backend  | bcrypt hash of the shared editing password (see below)     |

## Getting Started

### Option A: Docker Compose (recommended)

With `.env` filled in at the repo root:

```bash
docker compose up --build
```

This starts three containers: Postgres (`5432`), the Express API (`5000`),
and the Next.js dev server (`3000`). Open
[http://localhost:3000](http://localhost:3000).

### Option B: Run without Docker

1. Start a Postgres instance and run `src/db/init.sql` against it.
2. Install dependencies at the repo root: `npm install`.
3. Run the frontend: `npm run dev` (serves on port 3000).
4. Run the backend: `cd src/server && node index.js` (serves on port 5000).

## Authentication

Add/edit/delete requires a single shared password. Browsing (all `GET`
routes) stays public and never needs a login.

1. Generate a bcrypt hash of the password you want to use:

   ```bash
   npm run hash-password -- "your-password-here"
   ```

2. Copy the printed `APP_PASSWORD_HASH=...` line into your root `.env` file.
3. Make sure `.env` also has a `JWT_SECRET` set (any long random string).
   Restart the backend after changing either value.
4. On the site, click **Log In** in the top nav and enter the password. The
   frontend stores the returned JWT in `localStorage` and sends it as
   `Authorization: Bearer <token>` on add/edit/delete requests. Tokens expire
   after 7 days.

## API Endpoints

| Method | Path                          | Auth required | Description                              |
| ------ | ----------------------------- | -------------- | ------------------------------------------ |
| GET    | `/api/recipes-with-ingredients` | no           | List all recipes with ingredients & tags   |
| GET    | `/api/tags`                     | no           | List all distinct tags                    |
| POST   | `/api/login`                    | no           | Exchange the shared password for a JWT     |
| POST   | `/api/recipes`                  | yes          | Create a recipe (multipart form, `image` optional) |
| PUT    | `/api/recipes`                  | yes          | Update a recipe (multipart form, `id` required) |
| DELETE | `/api/recipes/:id`              | yes          | Delete a recipe                           |

Authenticated requests need an `Authorization: Bearer <token>` header
obtained from `POST /api/login`.

---

Built with [Next.js](https://nextjs.org) (bootstrapped from
[`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app))
and [Tailwind CSS](https://tailwindcss.com).
