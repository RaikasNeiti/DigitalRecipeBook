# The Recipe Database Setup
## Recipe Fact Table
```bash
CREATE TABLE recipes (
    id INT AUTO_INCREMENT,
    name VARCHAR(100),
    instructions TEXT,
    cookingtime INT,
    servings_id INT,
    PRIMARY KEY(id),
    FOREIGN KEY (servings_id) REFERENCES servings(id)
);
```
## Ingredients Table
```bash
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
```
## Servings Table
```bash
CREATE TABLE servings (
    id INT AUTO_INCREMENT,
    amount DECIMAL(10, 2),        -- numeric value for scaling
    unit VARCHAR(50),             -- e.g. 'people', 'cookies', 'ml', 'slices'
    PRIMARY KEY(id)
);
```

## Tags Table
```bash
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
```

## Unit Conversion Table
```bash
CREATE TABLE unit_conversions (
    id INT AUTO_INCREMENT,
    ingredient_id INT,
    from_unit VARCHAR(20),
    to_unit VARCHAR(20),
    factor DECIMAL(10, 4),
    PRIMARY KEY(id),
    FOREIGN KEY (ingredient_id) REFERENCES ingredients(id)
);
```

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Run BackEnd from src/server

```bash
node index.js
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
