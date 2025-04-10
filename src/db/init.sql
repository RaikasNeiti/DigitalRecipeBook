-- This SQL script initializes the database
USE recipedb;

CREATE TABLE servings (
    id INT AUTO_INCREMENT,
    amount DECIMAL(10, 2),
    unit VARCHAR(50),
    PRIMARY KEY(id)
);

CREATE TABLE recipes (
    id INT AUTO_INCREMENT,
    name VARCHAR(100),
    instructions TEXT,
    cookingtime INT,
    servings_id INT,
    PRIMARY KEY(id),
    FOREIGN KEY (servings_id) REFERENCES servings(id)
);

CREATE TABLE ingredients (
    id INT AUTO_INCREMENT,
    name VARCHAR(100),
    PRIMARY KEY(id)
);

CREATE TABLE recipe_ingredients (
    id INT AUTO_INCREMENT,
    recipe_id INT,
    ingredient_id INT,
    quantity DECIMAL(10, 2),
    unit VARCHAR(20),
    PRIMARY KEY(id),
    FOREIGN KEY (recipe_id) REFERENCES recipes(id),
    FOREIGN KEY (ingredient_id) REFERENCES ingredients(id)
);

CREATE TABLE tags (
    id INT AUTO_INCREMENT,
    name VARCHAR(50),
    PRIMARY KEY(id)
);

CREATE TABLE recipe_tags (
    recipe_id INT,
    tag_id INT,
    PRIMARY KEY (recipe_id, tag_id),
    FOREIGN KEY (recipe_id) REFERENCES recipes(id),
    FOREIGN KEY (tag_id) REFERENCES tags(id)
);

CREATE TABLE unit_conversions (
    id INT AUTO_INCREMENT,
    ingredient_id INT,
    from_unit VARCHAR(20),
    to_unit VARCHAR(20),
    factor DECIMAL(10, 4),
    PRIMARY KEY(id),
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