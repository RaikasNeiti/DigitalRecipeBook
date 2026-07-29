export type Ingredient = {
  name: string;
  quantity: string;
  unit: string;
};

export type Recipe = {
  id: number;
  name: string;
  cookingtime: string;
  ingredients: Ingredient[];
  instructions: string;
  tags?: string[];
  image?: string;
  servings_amount?: string | number;
  servings_unit?: string;
};

export type RecipeFormData = {
  name: string;
  instructions: string;
  cookingtime: string;
  servings: { amount: string; unit: string };
  ingredients: Ingredient[];
  tags: string[];
  image: File | null;
};

export const createInitialFormData = (): RecipeFormData => ({
  name: "",
  instructions: "",
  cookingtime: "",
  servings: { amount: "4", unit: "servings" },
  ingredients: [{ name: "", quantity: "", unit: "" }],
  tags: [],
  image: null,
});
