require('dotenv').config({ path: '../../.env' }); // Specify the relative path to the .env file
let express = require('express');
let app = express();
const { Pool } = require('pg');
let cors = require('cors');
let bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

app.use(bodyParser.json());
app.use(cors());

// Create Postgres connection pool using environment variables
const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

const sqlquery = async (text, params) => {
    const result = await pool.query(text, params);
    return result.rows;
};

app.use(bodyParser.json())
const {body, query, validationResult} = require('express-validator')

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secret = require('./config/secret');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // for reading JSON

app.use(express.static('public'));

// Image uploads
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadsDir),
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed.'));
        }
    },
});

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

// Verifies a JWT from the Authorization: Bearer <token> header. Used only on
// the write routes (POST/PUT/DELETE) — GET routes stay public for browsing.
function authenticate(req, res, next) {
    const authHeader = req.headers.authorization || "";
    const [scheme, token] = authHeader.split(" ");

    if (scheme !== "Bearer" || !token) {
        return res.status(401).send({ error: "Missing or invalid Authorization header." });
    }

    jwt.verify(token, secret.jwtSecret, (err) => {
        if (err) {
            return res.status(401).send({ error: "Invalid or expired token." });
        }
        next();
    });
}

app.post("/api/login", async (req, res) => {
    const { password } = req.body;

    if (!password) {
        return res.status(400).send({ error: "Password is required." });
    }

    const passwordHash = process.env.APP_PASSWORD_HASH;
    if (!passwordHash) {
        console.error("APP_PASSWORD_HASH is not set.");
        return res.status(500).send({ error: "Server authentication is not configured." });
    }

    try {
        const isMatch = await bcrypt.compare(password, passwordHash);
        if (!isMatch) {
            return res.status(401).send({ error: "Incorrect password." });
        }

        const token = jwt.sign({ role: "editor" }, secret.jwtSecret, { expiresIn: "7d" });
        res.status(200).send({ token });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).send({ error: "Login failed." });
    }
});

app.post("/api/recipes", authenticate, upload.single("image"), async (req, res) => {
  const { name, instructions, cookingtime } = req.body;
  const servings = JSON.parse(req.body.servings);
  const ingredients = JSON.parse(req.body.ingredients);
  const tags = JSON.parse(req.body.tags);
  const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    // Insert servings into the `servings` table
    const [servingsRow] = await sqlquery(
      "INSERT INTO servings (amount, unit) VALUES ($1, $2) RETURNING id",
      [servings.amount, servings.unit]
    );
    const servingsId = servingsRow.id;

    // Insert recipe into the `recipes` table
    const [recipeRow] = await sqlquery(
      "INSERT INTO recipes (name, instructions, cookingtime, servings_id, image_path) VALUES ($1, $2, $3, $4, $5) RETURNING id",
      [name, instructions, cookingtime, servingsId, imagePath]
    );
    const recipeId = recipeRow.id;

    // Insert ingredients into the `ingredients` table and link them to the recipe
    for (const ingredient of ingredients) {
      const [ingredientRow] = await sqlquery(
        "SELECT id FROM ingredients WHERE name = $1",
        [ingredient.name]
      );

      let ingredientId;
      if (ingredientRow) {
        ingredientId = ingredientRow.id;
      } else {
        const [insertedIngredient] = await sqlquery(
          "INSERT INTO ingredients (name) VALUES ($1) RETURNING id",
          [ingredient.name]
        );
        ingredientId = insertedIngredient.id;
      }

      await sqlquery(
        "INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES ($1, $2, $3, $4)",
        [recipeId, ingredientId, ingredient.quantity, ingredient.unit]
      );
    }

    // Insert tags into the `tags` table and link them to the recipe
    for (const tag of tags) {
      const [tagRow] = await sqlquery("SELECT id FROM tags WHERE name = $1", [tag]);

      let tagId;
      if (tagRow) {
        tagId = tagRow.id;
      } else {
        const [insertedTag] = await sqlquery(
          "INSERT INTO tags (name) VALUES ($1) RETURNING id",
          [tag]
        );
        tagId = insertedTag.id;
      }

      await sqlquery(
        "INSERT INTO recipe_tags (recipe_id, tag_id) VALUES ($1, $2)",
        [recipeId, tagId]
      );
    }

    res.status(200).send({ message: "Recipe added successfully!" });
  } catch (error) {
    console.error("Error adding recipe:", error);
    res.status(500).send({ error: "Failed to add recipe." });
  }
});

app.put("/api/recipes", authenticate, upload.single("image"), async (req, res) => {
  const { id, name, instructions, cookingtime } = req.body;

  let servings;
  let ingredients;
  let tags;

  try {
    servings = JSON.parse(req.body.servings || "{}");
    ingredients = JSON.parse(req.body.ingredients || "[]");
    tags = JSON.parse(req.body.tags || "[]");
  } catch (parseError) {
    return res.status(400).send({ error: "Invalid JSON payload for servings, ingredients, or tags." });
  }

  if (!id || !name || !instructions || !cookingtime) {
    return res.status(400).send({ error: "Missing required fields for recipe update." });
  }

  const client = await pool.connect();
  let oldImagePath = null;

  try {
    await client.query("BEGIN");

    const recipeResult = await client.query(
      "SELECT id, servings_id, image_path FROM recipes WHERE id = $1",
      [id]
    );

    if (recipeResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).send({ error: "Recipe not found." });
    }

    const recipeRow = recipeResult.rows[0];
    oldImagePath = recipeRow.image_path;

    if (recipeRow.servings_id) {
      await client.query(
        "UPDATE servings SET amount = $1, unit = $2 WHERE id = $3",
        [servings.amount, servings.unit, recipeRow.servings_id]
      );
    }

    if (req.file) {
      const imagePath = `/uploads/${req.file.filename}`;
      await client.query(
        "UPDATE recipes SET name = $1, instructions = $2, cookingtime = $3, image_path = $4 WHERE id = $5",
        [name, instructions, cookingtime, imagePath, id]
      );
    } else {
      await client.query(
        "UPDATE recipes SET name = $1, instructions = $2, cookingtime = $3 WHERE id = $4",
        [name, instructions, cookingtime, id]
      );
    }

    await client.query("DELETE FROM recipe_ingredients WHERE recipe_id = $1", [id]);
    for (const ingredient of ingredients) {
      const ingredientName = ingredient.name?.trim();
      const ingredientQuantity = ingredient.quantity?.toString().trim();
      const ingredientUnit = ingredient.unit?.trim();

      if (!ingredientName || !ingredientQuantity || !ingredientUnit) {
        continue;
      }

      const ingredientResult = await client.query(
        "SELECT id FROM ingredients WHERE name = $1",
        [ingredientName]
      );

      let ingredientId;
      if (ingredientResult.rows.length > 0) {
        ingredientId = ingredientResult.rows[0].id;
      } else {
        const insertedIngredient = await client.query(
          "INSERT INTO ingredients (name) VALUES ($1) RETURNING id",
          [ingredientName]
        );
        ingredientId = insertedIngredient.rows[0].id;
      }

      await client.query(
        "INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES ($1, $2, $3, $4)",
        [id, ingredientId, ingredientQuantity, ingredientUnit]
      );
    }

    await client.query("DELETE FROM recipe_tags WHERE recipe_id = $1", [id]);
    for (const rawTag of tags) {
      const tagName = (rawTag || "").trim();
      if (!tagName) {
        continue;
      }

      const tagResult = await client.query("SELECT id FROM tags WHERE name = $1", [tagName]);

      let tagId;
      if (tagResult.rows.length > 0) {
        tagId = tagResult.rows[0].id;
      } else {
        const insertedTag = await client.query(
          "INSERT INTO tags (name) VALUES ($1) RETURNING id",
          [tagName]
        );
        tagId = insertedTag.rows[0].id;
      }

      await client.query(
        "INSERT INTO recipe_tags (recipe_id, tag_id) VALUES ($1, $2)",
        [id, tagId]
      );
    }

    await client.query("COMMIT");

    if (req.file && oldImagePath) {
      fs.unlink(path.join(uploadsDir, path.basename(oldImagePath)), () => {});
    }

    res.status(200).send({ message: "Recipe updated successfully!" });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error updating recipe:", error);
    res.status(500).send({ error: "Failed to update recipe." });
  } finally {
    client.release();
  }
});

app.get("/api/recipes-with-ingredients", async (req, res) => {
  try {
    const recipes = await sqlquery(`
      SELECT r.id, r.name, r.instructions, r.cookingtime, r.image_path AS image, s.amount AS servings_amount, s.unit AS servings_unit
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
           WHERE ri.recipe_id = $1`,
          [recipe.id]
        );

        // Fetch tags for the recipe
        const tags = await sqlquery(
          `SELECT t.name
           FROM recipe_tags rt
           JOIN tags t ON rt.tag_id = t.id
           WHERE rt.recipe_id = $1`,
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

app.delete("/api/recipes/:id", authenticate, async (req, res) => {
  const { id } = req.params;

  try {
    const [recipe] = await sqlquery(
      "SELECT servings_id, image_path FROM recipes WHERE id = $1",
      [id]
    );

    if (!recipe) {
      return res.status(404).send({ error: "Recipe not found." });
    }

    await sqlquery("DELETE FROM recipe_ingredients WHERE recipe_id = $1", [id]);
    await sqlquery("DELETE FROM recipe_tags WHERE recipe_id = $1", [id]);
    await sqlquery("DELETE FROM recipes WHERE id = $1", [id]);

    if (recipe.servings_id) {
      await sqlquery("DELETE FROM servings WHERE id = $1", [recipe.servings_id]);
    }

    if (recipe.image_path) {
      fs.unlink(path.join(uploadsDir, path.basename(recipe.image_path)), () => {});
    }

    res.status(200).send({ message: "Recipe deleted successfully!" });
  } catch (error) {
    console.error("Error deleting recipe:", error);
    res.status(500).send({ error: "Failed to delete recipe." });
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

let server = app.listen(5000, async function () {
    let host = server.address().address
    let port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port);

    // Test database connection
    try {
      await pool.query("SELECT 1");
      console.log("Successfully connected to the database!");
    } catch (err) {
      console.error("Error connecting to the database:", err.message);
    }
})
