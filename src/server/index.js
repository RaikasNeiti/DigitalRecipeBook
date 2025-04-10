require('dotenv').config({ path: '../../.env' }); // Specify the relative path to the .env file
let express = require('express');
let app = express();
let mysql = require('mysql');
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

app.get("/recipes", function (req, res) {
    let sql = "SELECT" + " * " + "FROM recipes"
        + " ORDER BY name";
    (async () => {
        try {
            console.log("test")
            const rows = await sqlquery(sql);
            console.log(rows);
            res.send(rows);
        } catch (err) {
            console.log("error");
        }
    })()
});


app.get("/recipe",
    query('id').isNumeric(),
    (req, res) => {
    const errors = validationResult(req);
    console.log(errors );
    if(!errors.isEmpty()){
        res.send("parametrit")
    }else {
        let id = req.query.id;
        console.log(id);
        let sql = "SELECT" + " * " + "FROM recipes"
            + " WHERE id ='"+ id + "'";
        (async () => {
            try {
                let rows = await sqlquery(sql, [id]);
                console.log(rows);
                if (!rows.length) {
                    console.log("error");
                } else {
                    res.send(rows);
                }
            }catch (err) {
                console.log("error");
            }


        })()
    }
})

app.post("/recipes",
    body('nimi').isLength({ min: 2, max: 25 }).withMessage('nimi'),
    body('Ainekset').isLength({ min: 2, max: 1000 }),
    body('ohje').isLength({ min: 20, max: 1000 }),
    body('aika').isNumeric(),
    body('author').isLength({ min: 2, max: 25 }),
    function (req, res) {
        const errors = validationResult(req);

        console.log(errors);
        if (!errors.isEmpty()) {
            res.send("parametrit");
        } else {
            let sql = "INSERT INTO recipes(name, ingredients, instructions, cookingtime, maker)"
                + "VALUES('" + req.body.nimi + "', '" + req.body.Ainekset + "', '" + req.body.ohje + "', '" + req.body.aika + "', '" + req.body.author + "')";
            console.log(sql);
            (async () => {
                try {
                    const rows = await sqlquery(sql);
                    console.log(rows);
                    res.send(rows);
                } catch (err) {
                    console.log("error");
                }
            })();
        }
    });

app.delete("/recipes",
    query('id').isNumeric(),
    function (req, res) {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.send("parametrit");
        } else {
            let id = req.query.id;
            console.log(id);
            let sql = "DELETE FROM recipes"
                + " WHERE id ='" + id + "'";
            (async () => {
                try {
                    const rows = await sqlquery(sql, [id]);
                    console.log(rows);
                    res.send(rows);
                } catch (err) {
                    console.log("error");
                }
            })();
        }
    });


app.put('/recipes',
    body('id').isNumeric(),
    body('nimi').isLength({ min: 2, max: 25 }),
    body('Ainekset').isLength({ min: 2, max: 1000 }),
    body('ohje').isLength({ min: 20, max: 1000 }),
    body('aika').isNumeric(),
    body('author').isLength({ min: 2, max: 25 }),
    (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.send("parametrit");
        } else {
            let find = "select maker from recipes where id= ?";
            let sql = "UPDATE recipes"
                + " SET name= '" + req.body.nimi + "', ingredients= '" + req.body.Ainekset + "', instructions= '" + req.body.ohje + "', cookingtime= '" + req.body.aika + "', maker= '" + req.body.author + "'"
                + " WHERE id ='" + req.body.id + "'";
            console.log(sql);
            (async () => {
                try {
                    const rows = await sqlquery(sql);
                    res.send(rows);
                } catch (err) {
                    console.log("Error inputting the recipe");
                }
            })();
        }
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
})