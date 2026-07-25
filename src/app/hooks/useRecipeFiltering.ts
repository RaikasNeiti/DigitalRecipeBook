import { useMemo } from "react";
import { AdvancedFilters } from "../components/AdvancedFiltersModal";
import { Recipe } from "../types/recipes";

interface UseRecipeFilteringInput {
  recipes: Recipe[];
  searchQuery: string;
  advancedFilters: AdvancedFilters;
  selectedSidebarCategory: string | null;
  selectedSidebarView: "all" | "favorites";
  favoriteRecipeIds: Set<number>;
}

export function useRecipeFiltering({
  recipes,
  searchQuery,
  advancedFilters,
  selectedSidebarCategory,
  selectedSidebarView,
  favoriteRecipeIds,
}: UseRecipeFilteringInput) {
  const activeFilterCount = useMemo(
    () =>
      [
        advancedFilters.minCookingTime.trim() !== "",
        advancedFilters.maxCookingTime.trim() !== "",
        advancedFilters.ingredientQuery.trim() !== "",
        advancedFilters.selectedTags.length > 0,
      ].filter(Boolean).length,
    [advancedFilters]
  );

  const filteredRecipes = useMemo(
    () =>
      recipes.filter((recipe) => {
        const matchesSearch = recipe.name.toLowerCase().includes(searchQuery.toLowerCase());

        const cookingTime = Number.parseInt(recipe.cookingtime, 10);
        const minCookingTime = Number.parseInt(advancedFilters.minCookingTime, 10);
        const maxCookingTime = Number.parseInt(advancedFilters.maxCookingTime, 10);

        const matchesMinCookingTime = Number.isNaN(minCookingTime)
          ? true
          : !Number.isNaN(cookingTime) && cookingTime >= minCookingTime;
        const matchesMaxCookingTime = Number.isNaN(maxCookingTime)
          ? true
          : !Number.isNaN(cookingTime) && cookingTime <= maxCookingTime;

        const ingredientTokens = advancedFilters.ingredientQuery
          .split(",")
          .map((token) => token.trim().toLowerCase())
          .filter(Boolean);
        const ingredientNames = recipe.ingredients.map((ingredient) => ingredient.name.toLowerCase());
        const matchesIngredients =
          ingredientTokens.length === 0 ||
          ingredientTokens.every((token) => ingredientNames.some((name) => name.includes(token)));

        const matchesAdvancedTags =
          advancedFilters.selectedTags.length === 0 ||
          advancedFilters.selectedTags.some((tag) => recipe.tags?.includes(tag));

        const matchesSidebarCategory =
          selectedSidebarCategory === null || recipe.tags?.includes(selectedSidebarCategory);

        const matchesSidebarView =
          selectedSidebarView === "all" || favoriteRecipeIds.has(recipe.id);

        return (
          matchesSearch &&
          matchesMinCookingTime &&
          matchesMaxCookingTime &&
          matchesIngredients &&
          matchesAdvancedTags &&
          matchesSidebarCategory &&
          matchesSidebarView
        );
      }),
    [
      recipes,
      searchQuery,
      advancedFilters,
      selectedSidebarCategory,
      selectedSidebarView,
      favoriteRecipeIds,
    ]
  );

  return { filteredRecipes, activeFilterCount };
}
