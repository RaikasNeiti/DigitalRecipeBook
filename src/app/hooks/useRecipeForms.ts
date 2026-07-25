import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import { Recipe, RecipeFormData, createInitialFormData } from "../types/recipes";

export function useRecipeForms() {
  const [formData, setFormData] = useState<RecipeFormData>(createInitialFormData);
  const [editRecipeId, setEditRecipeId] = useState<number | null>(null);
  const [editExistingImage, setEditExistingImage] = useState<string | undefined>(undefined);
  const [editFormData, setEditFormData] = useState<RecipeFormData>(createInitialFormData);

  const resetAddForm = () => setFormData(createInitialFormData());

  const updateRecipeForm = (
    setData: Dispatch<SetStateAction<RecipeFormData>>,
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    index?: number
  ) => {
    const { id, name, value } = e.target;

    if (id.startsWith("servings.")) {
      const key = id.split(".")[1];
      setData((prev) => ({
        ...prev,
        servings: { ...prev.servings, [key]: value },
      }));
      return;
    }

    if (typeof index === "number") {
      setData((prev) => {
        const updatedIngredients = [...prev.ingredients];
        updatedIngredients[index] = { ...updatedIngredients[index], [name]: value };
        return { ...prev, ingredients: updatedIngredients };
      });
      return;
    }

    setData((prev) => ({ ...prev, [id]: value }));
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    index?: number
  ) => updateRecipeForm(setFormData, e, index);

  const handleEditChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    index?: number
  ) => updateRecipeForm(setEditFormData, e, index);

  const handleImageChange = (file: File | null) => {
    setFormData((prev) => ({ ...prev, image: file }));
  };

  const handleEditImageChange = (file: File | null) => {
    setEditFormData((prev) => ({ ...prev, image: file }));
  };

  const addIngredientField = () => {
    setFormData((prev) => ({
      ...prev,
      ingredients: [...prev.ingredients, { name: "", quantity: "", unit: "" }],
    }));
  };

  const removeIngredientField = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index),
    }));
  };

  const addEditIngredientField = () => {
    setEditFormData((prev) => ({
      ...prev,
      ingredients: [...prev.ingredients, { name: "", quantity: "", unit: "" }],
    }));
  };

  const removeEditIngredientField = (index: number) => {
    setEditFormData((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, ingredientIndex) => ingredientIndex !== index),
    }));
  };

  const openEditModal = (recipe: Recipe) => {
    setEditRecipeId(recipe.id);
    setEditExistingImage(recipe.image);
    setEditFormData({
      name: recipe.name,
      instructions: recipe.instructions,
      cookingtime: String(recipe.cookingtime ?? ""),
      servings: {
        amount: String(recipe.servings_amount ?? ""),
        unit: String(recipe.servings_unit ?? ""),
      },
      ingredients:
        recipe.ingredients.length > 0
          ? recipe.ingredients.map((ingredient) => ({
              name: String(ingredient.name ?? ""),
              quantity: String(ingredient.quantity ?? ""),
              unit: String(ingredient.unit ?? ""),
            }))
          : [{ name: "", quantity: "", unit: "" }],
      tags: recipe.tags ?? [],
      image: null,
    });
  };

  const closeEditModalState = () => {
    setEditRecipeId(null);
    setEditExistingImage(undefined);
  };

  return {
    formData,
    editRecipeId,
    editExistingImage,
    editFormData,
    resetAddForm,
    handleChange,
    handleEditChange,
    handleImageChange,
    handleEditImageChange,
    addIngredientField,
    removeIngredientField,
    addEditIngredientField,
    removeEditIngredientField,
    openEditModal,
    closeEditModalState,
  };
}
