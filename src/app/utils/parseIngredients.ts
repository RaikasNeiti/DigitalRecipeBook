import { Ingredient } from "../types/recipes";

// Maps common shorthand/English/Finnish unit abbreviations onto the units
// already offered in the ingredient unit <select>, so imported rows land on
// a recognized option whenever possible.
const UNIT_ALIASES: Record<string, string> = {
  tbsp: "Tablespoon",
  tbs: "Tablespoon",
  tablespoon: "Tablespoon",
  tablespoons: "Tablespoon",
  rkl: "Tablespoon",
  tsp: "Teaspoon",
  teaspoon: "Teaspoon",
  teaspoons: "Teaspoon",
  tl: "Teaspoon",
  pc: "Pieces",
  pcs: "Pieces",
  piece: "Pieces",
  pieces: "Pieces",
  kpl: "Pieces",
  g: "g",
  gram: "g",
  grams: "g",
  grammaa: "g",
  kg: "kg",
  ml: "ml",
  dl: "dl",
  l: "L",
  ltr: "L",
  cup: "Cup",
  cups: "Cup",
  kuppi: "Cup",
  oz: "oz",
};

const FRACTION_ALIASES: Record<string, string> = {
  "½": "0.5",
  "⅓": "0.333",
  "⅔": "0.667",
  "¼": "0.25",
  "¾": "0.75",
  "⅛": "0.125",
};

const NUMBER_PATTERN = /^\d+(\.\d+)?$/;

function normalizeLine(line: string): string {
  let normalized = line;
  for (const [symbol, value] of Object.entries(FRACTION_ALIASES)) {
    normalized = normalized.split(symbol).join(` ${value} `);
  }
  return normalized.replace(/\s+/g, " ").trim();
}

function parseLine(rawLine: string): Ingredient | null {
  const line = normalizeLine(rawLine);
  if (!line) return null;

  const tokens = line.split(" ");
  const firstToken = tokens[0].replace(",", ".");

  if (!NUMBER_PATTERN.test(firstToken)) {
    // No leading quantity — treat the whole line as the ingredient name
    // (e.g. "suolaa myllystä" / "salt to taste").
    return { name: line, quantity: "", unit: "" };
  }

  const quantity = firstToken;
  const rest = tokens.slice(1);

  if (rest.length === 0) {
    return null;
  }

  if (rest.length === 1) {
    // Just quantity + one word — most likely "3 eggs", not a bare unit.
    return { name: rest[0], quantity, unit: "" };
  }

  const [unitToken, ...nameTokens] = rest;
  const unit = UNIT_ALIASES[unitToken.toLowerCase()] ?? unitToken;

  return { name: nameTokens.join(" ").trim(), quantity, unit };
}

export function parseIngredientLines(text: string): Ingredient[] {
  return text
    .split("\n")
    .map((line) => parseLine(line))
    .filter((ingredient): ingredient is Ingredient => ingredient !== null && ingredient.name.length > 0);
}
