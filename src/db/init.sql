-- This SQL script initializes the database
-- Keep the accounts tables in sync with migrations/001_accounts.sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(32) NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    password_hash VARCHAR(100) NOT NULL,
    role VARCHAR(10) NOT NULL CHECK (role IN ('admin', 'member')),
    disabled BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Usernames are unique case-insensitively ("Alice" and "alice" collide)
CREATE UNIQUE INDEX users_username_lower_idx ON users (LOWER(username));

CREATE TABLE invites (
    id SERIAL PRIMARY KEY,
    token_hash CHAR(64) NOT NULL UNIQUE, -- hex SHA-256 of the invite token
    role VARCHAR(10) NOT NULL CHECK (role IN ('admin', 'member')),
    created_by INT REFERENCES users(id) ON DELETE SET NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    used_at TIMESTAMPTZ,
    used_by INT REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE password_resets (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash CHAR(64) NOT NULL UNIQUE, -- hex SHA-256 of the reset token
    expires_at TIMESTAMPTZ NOT NULL,
    used_at TIMESTAMPTZ
);

-- Session store for connect-pg-simple
CREATE TABLE "session" (
    "sid" VARCHAR NOT NULL COLLATE "default" PRIMARY KEY,
    "sess" JSON NOT NULL,
    "expire" TIMESTAMP(6) NOT NULL
);

CREATE INDEX "IDX_session_expire" ON "session" ("expire");

CREATE TABLE servings (
    id SERIAL PRIMARY KEY,
    amount DECIMAL(10, 2),
    unit VARCHAR(50)
);

CREATE TABLE recipes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    instructions TEXT,
    cookingtime INT,
    servings_id INT,
    image_path VARCHAR(255),
    created_by INT REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (servings_id) REFERENCES servings(id)
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

CREATE TABLE unit_conversions (
    id SERIAL PRIMARY KEY,
    ingredient_id INT,
    from_unit VARCHAR(20),
    to_unit VARCHAR(20),
    factor DECIMAL(10, 4),
    FOREIGN KEY (ingredient_id) REFERENCES ingredients(id)
);

INSERT INTO tags (name)
VALUES
    ('Vegetarian'),
    ('Vegan'),
    ('Lunch'),
    ('Dinner'),
    ('Appetizers'),
    ('Dessert'),
    ('Seafood');
