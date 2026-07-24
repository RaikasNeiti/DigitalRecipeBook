-- This SQL script initializes the database
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
