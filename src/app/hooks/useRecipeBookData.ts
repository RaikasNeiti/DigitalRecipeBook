import { useCallback, useEffect, useState } from "react";
import { Recipe, RecipeFormData } from "../types/recipes";

const API_BASE = (process.env.NEXT_PUBLIC_API_BASE ?? "").replace(/\/$/, "");
const FAVORITES_STORAGE_KEY = "digital-recipe-book-favorites";

const resolveApiBase = () => {
  if (API_BASE) {
    return API_BASE;
  }

  if (typeof window !== "undefined") {
    return `${window.location.protocol}//${window.location.hostname}:5000`;
  }

  return "";
};

const getApiUrl = (path: string) => {
  const apiBase = resolveApiBase();
  if (!apiBase) {
    throw new Error("NEXT_PUBLIC_API_BASE is not configured.");
  }
  return `${apiBase}${path}`;
};

export function useRecipeBookData(token: string | null, onUnauthorized?: () => void) {
  const [tags, setTags] = useState<string[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [favoriteRecipeIds, setFavoriteRecipeIds] = useState<Set<number>>(new Set());

  const fetchRecipes = useCallback(async () => {
    try {
      const response = await fetch(getApiUrl("/api/recipes-with-ingredients"));
      if (!response.ok) {
        console.error("Failed to fetch recipes.");
        return;
      }

      const data = await response.json();
      const apiBase = resolveApiBase();
      setRecipes(
        data.map((recipe: Recipe) =>
          recipe.image ? { ...recipe, image: `${apiBase}${recipe.image}` } : recipe
        )
      );
    } catch (error) {
      console.error("Error fetching recipes:", error);
    }
  }, []);

  const fetchTags = useCallback(async () => {
    try {
      const response = await fetch(getApiUrl("/api/tags"));
      if (!response.ok) {
        console.error("Failed to fetch tags.");
        return;
      }

      const data = await response.json();
      setTags(data);
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  }, []);

  useEffect(() => {
    fetchRecipes();
    fetchTags();

    try {
      const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (!stored) {
        return;
      }

      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        const normalized = parsed
          .map((value) => Number.parseInt(String(value), 10))
          .filter((value) => Number.isFinite(value));
        setFavoriteRecipeIds(new Set(normalized));
      }
    } catch (error) {
      console.error("Failed to load favorites from local storage:", error);
    }
  }, [fetchRecipes, fetchTags]);

  useEffect(() => {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(Array.from(favoriteRecipeIds)));
  }, [favoriteRecipeIds]);

  const toggleFavorite = (recipeId: number) => {
    setFavoriteRecipeIds((prev) => {
      const next = new Set(prev);
      if (next.has(recipeId)) {
        next.delete(recipeId);
      } else {
        next.add(recipeId);
      }
      return next;
    });
  };

  const authHeaders = (): HeadersInit => (token ? { Authorization: `Bearer ${token}` } : {});

  const handleUnauthorizedResponse = (response: Response) => {
    if (response.status === 401) {
      onUnauthorized?.();
    }
  };

  const addRecipe = async (formData: RecipeFormData) => {
    const body = new FormData();
    body.append("name", formData.name);
    body.append("instructions", formData.instructions);
    body.append("cookingtime", formData.cookingtime);
    body.append("servings", JSON.stringify(formData.servings));
    body.append("ingredients", JSON.stringify(formData.ingredients));
    body.append("tags", JSON.stringify(formData.tags));
    if (formData.image) {
      body.append("image", formData.image);
    }

    const response = await fetch(getApiUrl("/api/recipes"), {
      method: "POST",
      headers: authHeaders(),
      body,
    });

    if (!response.ok) {
      handleUnauthorizedResponse(response);
      return false;
    }

    await fetchRecipes();
    return true;
  };

  const deleteRecipe = async (id: number) => {
    const response = await fetch(getApiUrl(`/api/recipes/${id}`), {
      method: "DELETE",
      headers: authHeaders(),
    });

    if (!response.ok) {
      handleUnauthorizedResponse(response);
      return false;
    }

    await fetchRecipes();
    return true;
  };

  const updateRecipe = async (
    recipeId: number,
    formData: RecipeFormData,
    selectedTags: string[]
  ) => {
    const body = new FormData();
    body.append("id", String(recipeId));
    body.append("name", formData.name);
    body.append("instructions", formData.instructions);
    body.append("cookingtime", formData.cookingtime);
    body.append("servings", JSON.stringify(formData.servings));
    body.append("ingredients", JSON.stringify(formData.ingredients));
    body.append("tags", JSON.stringify(selectedTags));
    if (formData.image) {
      body.append("image", formData.image);
    }

    const response = await fetch(getApiUrl("/api/recipes"), {
      method: "PUT",
      headers: authHeaders(),
      body,
    });

    if (!response.ok) {
      handleUnauthorizedResponse(response);
      throw new Error("Failed to update recipe.");
    }

    await fetchRecipes();
  };

  return {
    tags,
    recipes,
    favoriteRecipeIds,
    toggleFavorite,
    addRecipe,
    deleteRecipe,
    updateRecipe,
  };
}
