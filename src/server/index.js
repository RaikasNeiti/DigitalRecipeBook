require('dotenv').config({ path: '../../.env' }); // Specify the relative path to the .env file
let express = require('express');
let app = express();
const { Pool } = require('pg');
let cors = require('cors');
let bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const session = require('express-session');
const PgSession = require('connect-pg-simple')(session);

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
    console.error("SESSION_SECRET is not set. Refusing to start (generate one with `openssl rand -hex 32`).");
    process.exit(1);
}

// Defaults to true; set COOKIE_SECURE=false only to test over plain http on the LAN
const cookieSecure = process.env.COOKIE_SECURE !== 'false';

// Caddy sits in front and terminates TLS, so trust its X-Forwarded-* headers
app.set('trust proxy', 1);

app.use(bodyParser.json());

const allowedOrigin = process.env.ALLOWED_ORIGIN || 'http://localhost:3000';
app.use(cors({
    origin: allowedOrigin,
    credentials: true, // the session cookie must be sent cross-origin (frontend :3000 -> API :5000)
}));

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

app.get("/health", async (req, res) => {
    try {
        await pool.query("SELECT 1");
        res.status(200).send({ status: "ok" });
    } catch (error) {
        console.error("Health check failed:", error.message);
        res.status(503).send({ status: "error" });
    }
});

app.use(bodyParser.json())
const {body, query, validationResult} = require('express-validator')

const bcrypt = require('bcrypt');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // for reading JSON

const SESSION_COOKIE_NAME = 'recipebook.sid';
const sessionCookieOptions = {
    httpOnly: true,
    sameSite: 'lax',
    secure: cookieSecure,
};

app.use(session({
    store: new PgSession({ pool, tableName: 'session' }),
    name: SESSION_COOKIE_NAME,
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: { ...sessionCookieOptions, maxAge: 30 * 24 * 60 * 60 * 1000 }, // 30 days
}));

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

// --- Accounts & sessions ---

const BCRYPT_COST = 12;
const INVALID_LOGIN = "Invalid username or password.";

// Compared against when the username doesn't exist, so an unknown user costs
// the same bcrypt work as a wrong password and timing doesn't reveal which
// usernames exist.
const DUMMY_PASSWORD_HASH = bcrypt.hashSync(crypto.randomBytes(16).toString('hex'), BCRYPT_COST);

// Invite and reset tokens are only ever stored as SHA-256 hex digests
const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');

const toPublicUser = (user) => ({
    id: user.id,
    username: user.username,
    display_name: user.display_name,
    role: user.role,
});

// Responds 400 if any express-validator check on the route failed
function validate(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send({
            error: "Invalid input.",
            details: errors.array().map((e) => ({ field: e.path, message: e.msg })),
        });
    }
    next();
}

const MAX_PASSWORD_BYTES = 72; // bcrypt ignores everything past 72 bytes
const fitsBcrypt = (value) => Buffer.byteLength(value, 'utf8') <= MAX_PASSWORD_BYTES;

// Minimum 10 characters, maximum 72 bytes, no composition rules
const newPasswordRules = (field) =>
    body(field)
        .isString().withMessage("Password is required.").bail()
        .isLength({ min: 10 }).withMessage("Password must be at least 10 characters.")
        .custom(fitsBcrypt).withMessage(`Password must be at most ${MAX_PASSWORD_BYTES} bytes.`);

const regenerateSession = (req) =>
    new Promise((resolve, reject) => req.session.regenerate((err) => (err ? reject(err) : resolve())));

const saveSession = (req) =>
    new Promise((resolve, reject) => req.session.save((err) => (err ? reject(err) : resolve())));

// Issues a fresh session ID on login so a pre-login session can't be fixated
async function startSession(req, userId) {
    await regenerateSession(req);
    req.session.userId = userId;
    await saveSession(req);
}

// Requires a logged-in, non-disabled user and exposes it as req.user. The user
// is re-read each request so disabling an account takes effect immediately.
async function requireAuth(req, res, next) {
    const userId = req.session.userId;
    if (!userId) {
        return res.status(401).send({ error: "Not logged in." });
    }

    try {
        const [user] = await sqlquery(
            "SELECT id, username, display_name, role, disabled FROM users WHERE id = $1",
            [userId]
        );

        if (!user || user.disabled) {
            return req.session.destroy(() => res.status(401).send({ error: "Not logged in." }));
        }

        req.user = toPublicUser(user);
        next();
    } catch (error) {
        console.error("Error loading session user:", error);
        res.status(500).send({ error: "Authentication failed." });
    }
}

app.post(
  "/api/auth/login",
  body("username").isString().bail().trim().notEmpty().isLength({ max: 64 }),
  body("password").isString().bail().notEmpty().custom(fitsBcrypt),
  validate,
  async (req, res) => {
    const { username, password } = req.body;

    try {
      const [user] = await sqlquery(
        "SELECT id, username, display_name, role, disabled, password_hash FROM users WHERE LOWER(username) = LOWER($1)",
        [username]
      );

      // Always run bcrypt, even for unknown users, so timing is the same
      const isMatch = await bcrypt.compare(password, user ? user.password_hash : DUMMY_PASSWORD_HASH);
      if (!user || !isMatch || user.disabled) {
        return res.status(401).send({ error: INVALID_LOGIN });
      }

      await startSession(req, user.id);
      res.status(200).send(toPublicUser(user));
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).send({ error: "Login failed." });
    }
  }
);

app.post("/api/auth/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error during logout:", err);
      return res.status(500).send({ error: "Logout failed." });
    }
    res.clearCookie(SESSION_COOKIE_NAME, sessionCookieOptions);
    res.status(200).send({ message: "Logged out." });
  });
});

app.get("/api/auth/me", requireAuth, (req, res) => {
  res.status(200).send(req.user);
});

app.post(
  "/api/auth/register",
  body("inviteToken").isString().bail().trim().notEmpty().isLength({ max: 256 }),
  body("username")
    .isString().withMessage("Username is required.").bail()
    .trim()
    .isLength({ min: 3, max: 32 }).withMessage("Username must be 3-32 characters.")
    .matches(/^[A-Za-z0-9_.-]+$/).withMessage("Username may only contain letters, numbers, '_', '.' and '-'."),
  body("displayName")
    .isString().withMessage("Display name is required.").bail()
    .trim()
    .isLength({ min: 1, max: 100 }).withMessage("Display name must be 1-100 characters."),
  newPasswordRules("password"),
  validate,
  async (req, res) => {
    const { inviteToken, username, displayName, password } = req.body;

    let user;
    const client = await pool.connect();
    try {
      // Hash before taking the invite row lock so the lock is held briefly
      const passwordHash = await bcrypt.hash(password, BCRYPT_COST);

      await client.query("BEGIN");

      const inviteResult = await client.query(
        "SELECT id, role FROM invites WHERE token_hash = $1 AND used_at IS NULL AND expires_at > now() FOR UPDATE",
        [hashToken(inviteToken)]
      );

      if (inviteResult.rows.length === 0) {
        await client.query("ROLLBACK");
        return res.status(400).send({ error: "Invalid or expired invite." });
      }
      const invite = inviteResult.rows[0];

      const userResult = await client.query(
        "INSERT INTO users (username, display_name, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, username, display_name, role",
        [username, displayName, passwordHash, invite.role]
      );
      user = userResult.rows[0];

      await client.query(
        "UPDATE invites SET used_at = now(), used_by = $1 WHERE id = $2",
        [user.id, invite.id]
      );

      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK");
      if (error.code === "23505") {
        return res.status(409).send({ error: "That username is already taken." });
      }
      console.error("Error during registration:", error);
      return res.status(500).send({ error: "Registration failed." });
    } finally {
      client.release();
    }

    try {
      await startSession(req, user.id);
    } catch (error) {
      console.error("Error starting session after registration:", error);
      return res.status(500).send({ error: "Account created, but login failed. Please log in." });
    }

    res.status(201).send(toPublicUser(user));
  }
);

app.post(
  "/api/auth/change-password",
  requireAuth,
  body("currentPassword").isString().bail().notEmpty(),
  newPasswordRules("newPassword"),
  validate,
  async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    try {
      const [row] = await sqlquery("SELECT password_hash FROM users WHERE id = $1", [req.user.id]);
      const isMatch = await bcrypt.compare(currentPassword, row.password_hash);
      if (!isMatch) {
        return res.status(400).send({ error: "Current password is incorrect." });
      }

      const newHash = await bcrypt.hash(newPassword, BCRYPT_COST);

      const client = await pool.connect();
      try {
        await client.query("BEGIN");
        await client.query("UPDATE users SET password_hash = $1 WHERE id = $2", [newHash, req.user.id]);
        // Log out every other session of this user; keep the current one
        await client.query(
          `DELETE FROM "session" WHERE sid <> $1 AND sess->>'userId' = $2`,
          [req.sessionID, String(req.user.id)]
        );
        await client.query("COMMIT");
      } catch (error) {
        await client.query("ROLLBACK");
        throw error;
      } finally {
        client.release();
      }

      res.status(200).send({ message: "Password changed." });
    } catch (error) {
      console.error("Error changing password:", error);
      res.status(500).send({ error: "Failed to change password." });
    }
  }
);

app.post("/api/recipes", requireAuth, upload.single("image"), async (req, res) => {
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
      "INSERT INTO recipes (name, instructions, cookingtime, servings_id, image_path, created_by) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id",
      [name, instructions, cookingtime, servingsId, imagePath, req.user.id]
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

app.put("/api/recipes", requireAuth, upload.single("image"), async (req, res) => {
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

app.delete("/api/recipes/:id", requireAuth, async (req, res) => {
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
