require('dotenv').config({ path: '../../.env' }); // Specify the relative path to the .env file
let express = require('express');
let app = express();
let mysql = require('mysql2');
let cors = require('cors');
const util = require('util');
let bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(cors());

// Create MySQL connection using environment variables
let con = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

const sqlquery = util.promisify(con.query).bind(con);

app.use(bodyParser.json())
const {body, query, validationResult} = require('express-validator')

const bcrypt = require('bcrypt');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // for reading JSON

app.use(express.static('public'));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.post("/api/recipes", async (req, res) => {
  const { name, instructions, cookingtime, servings, ingredients, tags } = req.body;

  try {
    // Insert servings into the `servings` table
    const servingsResult = await sqlquery(
      "INSERT INTO servings (amount, unit) VALUES (?, ?)",
      [servings.amount, servings.unit]
    );
    const servingsId = servingsResult.insertId;

    // Insert recipe into the `recipes` table
    const recipeResult = await sqlquery(
      "INSERT INTO recipes (name, instructions, cookingtime, servings_id) VALUES (?, ?, ?, ?)",
      [name, instructions, cookingtime, servingsId]
    );
    const recipeId = recipeResult.insertId;

    // Insert ingredients into the `ingredients` table and link them to the recipe
    for (const ingredient of ingredients) {
      const [ingredientRow] = await sqlquery(
        "SELECT id FROM ingredients WHERE name = ?",
        [ingredient.name]
      );

      let ingredientId;
      if (ingredientRow) {
        ingredientId = ingredientRow.id;
      } else {
        const ingredientResult = await sqlquery(
          "INSERT INTO ingredients (name) VALUES (?)",
          [ingredient.name]
        );
        ingredientId = ingredientResult.insertId;
      }

      await sqlquery(
        "INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES (?, ?, ?, ?)",
        [recipeId, ingredientId, ingredient.quantity, ingredient.unit]
      );
    }

    // Insert tags into the `tags` table and link them to the recipe
    for (const tag of tags) {
      const [tagRow] = await sqlquery("SELECT id FROM tags WHERE name = ?", [tag]);

      let tagId;
      if (tagRow) {
        tagId = tagRow.id;
      } else {
        const tagResult = await sqlquery(
          "INSERT INTO tags (name) VALUES (?)",
          [tag]
        );
        tagId = tagResult.insertId;
      }

      await sqlquery(
        "INSERT INTO recipe_tags (recipe_id, tag_id) VALUES (?, ?)",
        [recipeId, tagId]
      );
    }

    res.status(200).send({ message: "Recipe added successfully!" });
  } catch (error) {
    console.error("Error adding recipe:", error);
    res.status(500).send({ error: "Failed to add recipe." });
  }
});

app.put("/api/recipes", async (req, res) => {
  const { id, name, instructions, cookingtime, servings, ingredients, tags } = req.body;

  try {
    // Update servings
    await sqlquery(
      "UPDATE servings SET amount = ?, unit = ? WHERE id = (SELECT servings_id FROM recipes WHERE id = ?)",
      [servings.amount, servings.unit, id]
    );

    // Update recipe
    await sqlquery(
      "UPDATE recipes SET name = ?, instructions = ?, cookingtime = ? WHERE id = ?",
      [name, instructions, cookingtime, id]
    );

    // Update ingredients
    await sqlquery("DELETE FROM recipe_ingredients WHERE recipe_id = ?", [id]);
    for (const ingredient of ingredients) {
      const [ingredientRow] = await sqlquery(
        "SELECT id FROM ingredients WHERE name = ?",
        [ingredient.name]
      );

      let ingredientId;
      if (ingredientRow) {
        ingredientId = ingredientRow.id;
      } else {
        const ingredientResult = await sqlquery(
          "INSERT INTO ingredients (name) VALUES (?)",
          [ingredient.name]
        );
        ingredientId = ingredientResult.insertId;
      }

      await sqlquery(
        "INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES (?, ?, ?, ?)",
        [id, ingredientId, ingredient.quantity, ingredient.unit]
      );
    }

    // Update tags
    await sqlquery("DELETE FROM recipe_tags WHERE recipe_id = ?", [id]);
    for (const tag of tags) {
      const [tagRow] = await sqlquery("SELECT id FROM tags WHERE name = ?", [tag]);

      let tagId;
      if (tagRow) {
        tagId = tagRow.id;
      } else {
        const tagResult = await sqlquery(
          "INSERT INTO tags (name) VALUES (?)",
          [tag]
        );
        tagId = tagResult.insertId;
      }

      await sqlquery(
        "INSERT INTO recipe_tags (recipe_id, tag_id) VALUES (?, ?)",
        [id, tagId]
      );
    }

    res.status(200).send({ message: "Recipe updated successfully!" });
  } catch (error) {
    console.error("Error updating recipe:", error);
    res.status(500).send({ error: "Failed to update recipe." });
  }
});

app.get("/api/recipes-with-ingredients", async (req, res) => {
  try {
    const recipes = await sqlquery(`
      SELECT r.id, r.name, r.instructions, r.cookingtime, s.amount AS servings_amount, s.unit AS servings_unit
      FROM recipes r
      LEFT JOIN servings s ON r.servings_id = s.id
    `);

    const recipesWithDetails = await Promise.all(
      recipes.map(async (recipe) => {
        // Fetch ingredients for the recipe
        const ingredients = await sqlquery(
          `SELECT i.name, ri.quantity, ri.unit
           FROM recipe_ingredients ri
           JOIN ingredients i ON ri.ingredient_id = i.id
           WHERE ri.recipe_id = ?`,
          [recipe.id]
        );

        // Fetch tags for the recipe
        const tags = await sqlquery(
          `SELECT t.name
           FROM recipe_tags rt
           JOIN tags t ON rt.tag_id = t.id
           WHERE rt.recipe_id = ?`,
          [recipe.id]
        );

        return {
          ...recipe,
          ingredients,
          tags: tags.map((tag) => tag.name),
        };
      })
    );

    res.status(200).send(recipesWithDetails);
  } catch (error) {
    console.error("Error fetching recipes with details:", error);
    res.status(500).send({ error: "Failed to fetch recipes." });
  }
});

app.get("/api/tags", async (req, res) => {
  try {
    const tags = await sqlquery("SELECT name FROM tags ORDER BY name");
    res.status(200).send(tags.map((tag) => tag.name));
  } catch (error) {
    console.error("Error fetching tags:", error);
    res.status(500).send({ error: "Failed to fetch tags." });
  }
});

let server = app.listen(5000, function () {
    let host = server.address().address
    let port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port);

    // Test database connection
    con.connect((err) => {
      if (err) {
          console.error("Error connecting to the database:", err.message);
      } else {
          console.log("Successfully connected to the database!");
      }
  });

})