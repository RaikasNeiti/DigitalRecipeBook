"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import RecipeCard from "./components/RecipeCard";
import RecipeModal from "./components/RecipeModal";
import AddRecipeModal from "./components/AddRecipeModal";
import EditRecipeModal from "./components/EditRecipeModal";
import ConfirmDialog from "./components/ConfirmDialog";
import AdvancedFiltersModal, { AdvancedFilters } from "./components/AdvancedFiltersModal";
import RecipeRouletteModal from "./components/RecipeRouletteModal";

const API_BASE = "http://192.168.1.125:5000";

const defaultAdvancedFilters: AdvancedFilters = {
  minCookingTime: "",
  maxCookingTime: "",
  ingredientQuery: "",
  selectedTags: [],
};

type Ingredient = { name: string; quantity: string; unit: string };

type Recipe = {
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

type RecipeFormData = {
  name: string;
  instructions: string;
  cookingtime: string;
  servings: { amount: string; unit: string };
  ingredients: Ingredient[];
  tags: string[];
  image: File | null;
};

const createInitialFormData = (): RecipeFormData => ({
  name: "",
  instructions: "",
  cookingtime: "",
  servings: { amount: "", unit: "" },
  ingredients: [{ name: "", quantity: "", unit: "" }],
  tags: [],
  image: null,
});

const categoryIconPaths: Record<string, string[]> = {
  appetizers: [
    "M3.75 11.25h16.5m-13.5 0V9.75A3.75 3.75 0 0 1 10.5 6h3a3.75 3.75 0 0 1 3.75 3.75v1.5m-12 0-.45 4.05A2.25 2.25 0 0 0 7.04 17.75h9.92a2.25 2.25 0 0 0 2.24-2.45l-.45-4.05",
  ],
  dessert: ["M7.5 10.5h9M6 10.5a2.25 2.25 0 0 1 2.25-2.25h7.5A2.25 2.25 0 0 1 18 10.5v1.5H6v-1.5Zm1.5 1.5h9l-.75 6.75H8.25L7.5 12Z"],
  dinner: ["M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12Zm0 0v1.5m-7.5-7.5H3m18 0h-1.5"],
  lunch: ["M4.5 12h15M6.75 12 9 7.5h6L17.25 12M6 12v4.5A1.5 1.5 0 0 0 7.5 18h9a1.5 1.5 0 0 0 1.5-1.5V12"],
  seafood: ["M3.75 12s2.5-4.5 8.25-4.5S20.25 12 20.25 12s-2.5 4.5-8.25 4.5S3.75 12 3.75 12Zm8.25 0h.008v.008H12V12Z"],
  vegan: [
    "M12 19.5c6 0 7.5-7.5 7.5-12-4.5 0-12 1.5-12 7.5 0 2.25 1.5 4.5 4.5 4.5Z",
    "M12 19.5c0-4.5 1.5-7.5 4.5-10.5",
  ],
  vegetarian: ["M12 20.25v-6m0 0c0-3.314 2.686-6 6-6v.75c0 3.314-2.686 6-6 6Zm0 0c0-3.314-2.686-6-6-6v.75c0 3.314 2.686 6 6 6Z"],
};

const defaultCategoryIconPaths = [
  "M12 3.75c-1.104 0-2 .896-2 2v1.19a7.501 7.501 0 0 0-4.53 10.89 2.25 2.25 0 0 0 1.98 1.17h9.1a2.25 2.25 0 0 0 1.98-1.17A7.501 7.501 0 0 0 14 6.94V5.75c0-1.104-.896-2-2-2Z",
];

function CategoryIcon({ tag, className }: { tag: string; className: string }) {
  const normalizedTag = tag.trim().toLowerCase();
  const paths = categoryIconPaths[normalizedTag] ?? defaultCategoryIconPaths;

  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className={className}>
      {paths.map((pathValue) => (
        <path key={pathValue} strokeLinecap="round" strokeLinejoin="round" d={pathValue} />
      ))}
    </svg>
  );
}

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRecipeModalOpen, setIsRecipeModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [showAddSuccess, setShowAddSuccess] = useState(false);
  const [isRouletteModalOpen, setIsRouletteModalOpen] = useState(false);
  const [isAdvancedFilterModalOpen, setIsAdvancedFilterModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFilters>(defaultAdvancedFilters);
  const [tags, setTags] = useState<string[]>([]); // State for tags
  const [formData, setFormData] = useState<RecipeFormData>(createInitialFormData);
  const [editRecipeId, setEditRecipeId] = useState<number | null>(null);
  const [editExistingImage, setEditExistingImage] = useState<string | undefined>(undefined);
  const [editFormData, setEditFormData] = useState<RecipeFormData>(createInitialFormData);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleOpenRecipeModal = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setIsRecipeModalOpen(true);
  };
  const handleCloseRecipeModal = () => setIsRecipeModalOpen(false);
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditRecipeId(null);
    setEditExistingImage(undefined);
  };

  const fetchRecipes = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/recipes-with-ingredients`);
      if (response.ok) {
        const data = await response.json();
        setRecipes(
          data.map((recipe: Recipe) =>
            recipe.image ? { ...recipe, image: `${API_BASE}${recipe.image}` } : recipe
          )
        );
      } else {
        console.error("Failed to fetch recipes.");
      }
    } catch (error) {
      console.error("Error fetching recipes:", error);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/tags`);
      if (response.ok) {
        const data = await response.json();
        setTags(data);
      } else {
        console.error("Failed to fetch tags.");
      }
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  };

  useEffect(() => {
    fetchRecipes();
    fetchTags(); // Fetch tags when the component mounts
  }, []);

  const updateRecipeForm = (
    setData: React.Dispatch<React.SetStateAction<RecipeFormData>>,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    index?: number
  ) => {
    const { id, name, value } = e.target;

    if (id.startsWith("servings.")) {
      const key = id.split(".")[1];
      setData((prev) => ({
        ...prev,
        servings: { ...prev.servings, [key]: value },
      }));
    } else if (typeof index === "number") {
      setData((prev) => {
        const updatedIngredients = [...prev.ingredients];
        updatedIngredients[index] = { ...updatedIngredients[index], [name]: value };
        return { ...prev, ingredients: updatedIngredients };
      });
    } else {
      setData((prev) => ({ ...prev, [id]: value }));
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    index?: number
  ) => updateRecipeForm(setFormData, e, index);

  const handleImageChange = (file: File | null) => {
    setFormData((prev) => ({ ...prev, image: file }));
  };

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    index?: number
  ) => updateRecipeForm(setEditFormData, e, index);

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

  const handleSubmit = async () => {
    try {
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

      const response = await fetch(`${API_BASE}/api/recipes`, {
        method: "POST",
        body,
      });

      if (response.ok) {
        setFormData(createInitialFormData());
        handleCloseModal();
        fetchRecipes(); // Refresh recipes after adding a new one
        setShowAddSuccess(true);
      } else {
        alert("Failed to add recipe.");
      }
    } catch (error) {
      console.error("Error adding recipe:", error);
      alert("An error occurred while adding the recipe.");
    }
  };

  const handleDeleteRecipe = async (id: number) => {
    try {
      const response = await fetch(`${API_BASE}/api/recipes/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setConfirmDeleteId(null);
        handleCloseRecipeModal();
        fetchRecipes();
      } else {
        alert("Failed to delete recipe.");
      }
    } catch (error) {
      console.error("Error deleting recipe:", error);
      alert("An error occurred while deleting the recipe.");
    }
  };

  const handleOpenEditModal = (recipe: Recipe) => {
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
    setIsRecipeModalOpen(false);
    setIsEditModalOpen(true);
  };

  const handleUpdateRecipe = async (selectedTags: string[]) => {
    if (!editRecipeId) {
      return;
    }

    const body = new FormData();
    body.append("id", String(editRecipeId));
    body.append("name", editFormData.name);
    body.append("instructions", editFormData.instructions);
    body.append("cookingtime", editFormData.cookingtime);
    body.append("servings", JSON.stringify(editFormData.servings));
    body.append("ingredients", JSON.stringify(editFormData.ingredients));
    body.append("tags", JSON.stringify(selectedTags));
    if (editFormData.image) {
      body.append("image", editFormData.image);
    }

    const response = await fetch(`${API_BASE}/api/recipes`, {
      method: "PUT",
      body,
    });

    if (!response.ok) {
      throw new Error("Failed to update recipe.");
    }

    await fetchRecipes();
    handleCloseEditModal();
  };

  const activeFilterCount = [
    advancedFilters.minCookingTime.trim() !== "",
    advancedFilters.maxCookingTime.trim() !== "",
    advancedFilters.ingredientQuery.trim() !== "",
    advancedFilters.selectedTags.length > 0,
  ].filter(Boolean).length;

  // Filter recipes based on the search query and selected tag
  const filteredRecipes = recipes.filter((recipe) => {
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

    return (
      matchesSearch &&
      matchesMinCookingTime &&
      matchesMaxCookingTime &&
      matchesIngredients &&
      matchesAdvancedTags
    );
  });

  const quickFilterTags = tags.slice(0, 6);

  return (
    <div className="app-shell min-h-screen">
      <AdvancedFiltersModal
        isOpen={isAdvancedFilterModalOpen}
        filters={advancedFilters}
        availableTags={tags}
        onClose={() => setIsAdvancedFilterModalOpen(false)}
        onApply={setAdvancedFilters}
        onReset={() => setAdvancedFilters(defaultAdvancedFilters)}
      />

      {/* AddRecipeModal */}
      {isModalOpen && (
        <AddRecipeModal
          formData={formData}
          onChange={handleChange}
          onImageChange={handleImageChange}
          onAddIngredient={addIngredientField}
          onRemoveIngredient={removeIngredientField} // Pass the remove function
          availableTags={tags}
          onClose={handleCloseModal}
          onSubmit={handleSubmit}
        />
      )}
      {isRecipeModalOpen && selectedRecipe && (
        <RecipeModal
          recipe={selectedRecipe}
          onClose={handleCloseRecipeModal}
          onDelete={() => setConfirmDeleteId(selectedRecipe.id)}
          onEdit={() => handleOpenEditModal(selectedRecipe)}
        />
      )}
      {isEditModalOpen && (
        <EditRecipeModal
          formData={editFormData}
          existingImage={editExistingImage}
          availableTags={tags}
          onChange={handleEditChange}
          onImageChange={handleEditImageChange}
          onAddIngredient={addEditIngredientField}
          onRemoveIngredient={removeEditIngredientField}
          onClose={handleCloseEditModal}
          onSubmit={handleUpdateRecipe}
        />
      )}
      {confirmDeleteId !== null && (
        <ConfirmDialog
          title="Delete this recipe?"
          message="This action cannot be undone."
          confirmLabel="Delete"
          tone="danger"
          onCancel={() => setConfirmDeleteId(null)}
          onConfirm={() => handleDeleteRecipe(confirmDeleteId)}
        />
      )}
      {showAddSuccess && (
        <ConfirmDialog
          title="Recipe added"
          message="Your recipe was successfully added to the book."
          confirmLabel="OK"
          onConfirm={() => setShowAddSuccess(false)}
        />
      )}
      {isRouletteModalOpen && (
        <RecipeRouletteModal
          recipes={recipes}
          availableTags={tags}
          onClose={() => setIsRouletteModalOpen(false)}
          onViewRecipe={(recipe) => {
            setIsRouletteModalOpen(false);
            handleOpenRecipeModal(recipe);
          }}
        />
      )}

      <main className="flex min-h-screen w-full gap-4 px-3 py-3 sm:px-5 sm:py-4 lg:gap-6 lg:px-7 lg:py-5 xl:px-9 2xl:px-12">
        <aside className="glass-panel hidden h-[calc(100vh-2.5rem)] w-[236px] shrink-0 rounded-[34px] border border-white/85 px-4 py-5 lg:sticky lg:top-5 lg:flex lg:flex-col">
          <div className="flex items-center gap-3 px-2">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#417df6]/14 text-[#417df6] shadow-[0_10px_24px_rgba(65,125,246,0.22)]">
              <img src="/cutlery-icon.svg" alt="" className="h-6 w-6" />
            </span>
            <div>
              <p className="text-lg font-bold leading-tight text-slate-900">Digital</p>
              <p className="text-lg font-bold leading-tight text-slate-900">Recipe Book</p>
            </div>
          </div>

          <nav className="mt-8 space-y-2">
            <button
              type="button"
              className="flex w-full items-center gap-3 rounded-2xl bg-[#417df6]/14 px-4 py-3 text-sm font-semibold text-[#417df6]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 9 8.25-6 8.25 6v9a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18V9Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 21V12h4.5v9" />
              </svg>
              All Recipes
            </button>
            <div className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-700">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.9} stroke="currentColor" className="h-4 w-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 8.25c0-2.485-2.015-4.5-4.5-4.5-1.74 0-3.25.988-4 2.433-.75-1.445-2.26-2.433-4-2.433-2.485 0-4.5 2.015-4.5 4.5 0 6.375 8.5 11.25 8.5 11.25S21 14.625 21 8.25Z" />
              </svg>
              Favorites
            </div>
            <div className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-700">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.9} stroke="currentColor" className="h-4 w-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3.75h10.5A2.25 2.25 0 0 1 19.5 6v14.25l-7.5-3-7.5 3V6a2.25 2.25 0 0 1 2.25-2.25Z" />
              </svg>
              My Recipes
            </div>
          </nav>

          <div className="mt-7 border-t border-slate-200/80 pt-6">
            <p className="px-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Categories</p>
            <div className="mt-4 space-y-2">
              {quickFilterTags.map((tag) => (
                <div key={`side-${tag}`} className="flex items-center gap-3 rounded-2xl px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-white/70">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-[#417df6] shadow-sm">
                    <CategoryIcon tag={tag} className="h-4.5 w-4.5" />
                  </span>
                  {tag}
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsRouletteModalOpen(true)}
            className="relative mt-auto overflow-hidden rounded-[22px] border border-white/90 bg-[radial-gradient(circle_at_16%_14%,rgba(173,191,255,0.45)_0%,transparent_36%),radial-gradient(circle_at_88%_18%,rgba(205,190,255,0.42)_0%,transparent_30%),radial-gradient(circle_at_18%_84%,rgba(172,220,255,0.34)_0%,transparent_35%),radial-gradient(circle_at_74%_72%,rgba(175,161,255,0.32)_0%,transparent_34%),linear-gradient(144deg,#f5f8ff_0%,#eaf0ff_45%,#e5ecff_100%)] p-4 text-left shadow-[0_16px_32px_rgba(65,125,246,0.16)] transition hover:translate-y-[-1px]"
            aria-label="Open recipe roulette"
            title="Recipe Roulette"
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_90%_82%,rgba(255,255,255,0.48)_0%,transparent_34%),radial-gradient(circle_at_36%_44%,rgba(255,255,255,0.24)_0%,transparent_42%)]" />
            <div className="relative z-10">
              <div className="flex items-start justify-between gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/70 text-[#7a88ff] shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.9} stroke="currentColor" className="h-6 w-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 4.5h10.5a2.25 2.25 0 0 1 2.25 2.25v10.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 17.25V6.75A2.25 2.25 0 0 1 6.75 4.5Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 9h.008v.008H9V9Zm0 6h.008v.008H9V15Zm6-3h.008v.008H15V12Z" />
                  </svg>
                </span>
                <span className="text-[#b7c4ef]">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="h-4 w-4">
                    <path d="M12 2l1.2 3.6L16.8 7l-3.6 1.4L12 12l-1.2-3.6L7.2 7l3.6-1.4L12 2Zm7 8 1 2.8L22.8 14 20 15l-1 2.8L18 15l-2.8-1 2.8-1.2L19 10ZM5 13l.8 2.2L8 16l-2.2.8L5 19l-.8-2.2L2 16l2.2-.8L5 13Z" />
                  </svg>
                </span>
              </div>

              <h3 className="mt-5 text-[30px] font-semibold leading-[1.05] tracking-tight text-slate-900">Recipe Roulette</h3>
              <p className="mt-3 text-lg leading-7 text-slate-700">Can&apos;t decide what to cook?</p>
              <p className="text-lg leading-7 text-slate-700">Let fate choose for you!</p>

              <div className="mt-5 flex justify-end">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[radial-gradient(circle_at_28%_24%,#5a95ff_0%,#417df6_46%,#5a66f8_74%,#7a59f4_100%)] text-white shadow-[0_12px_24px_rgba(65,125,246,0.46)]">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor" className="h-5 w-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </span>
              </div>
            </div>
          </button>
        </aside>

        <div className="min-w-0 flex-1">
          <div className="sticky top-3 z-30 mb-5 flex items-center justify-between gap-4 rounded-2xl px-4 py-3 lg:mb-7">
            <div className="flex items-center gap-3 lg:hidden">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#417df6]/14 text-[#417df6] shadow-[0_10px_24px_rgba(65,125,246,0.22)]">
                <img src="/cutlery-icon.svg" alt="" className="h-5 w-5" />
              </span>
              <div>
                <p className="text-base font-bold leading-tight text-slate-900">Digital Recipe Book</p>
              </div>
            </div>

            <div className="hidden items-center justify-end lg:flex lg:flex-1">
              <nav className="flex items-center gap-9">
                <a href="#" className="border-b-2 border-[#417df6] px-1 pb-4 text-sm font-semibold tracking-[0.01em] text-[#417df6]">Home</a>
                <button type="button" onClick={() => setIsRouletteModalOpen(true)} className="border-b-2 border-transparent pb-4 text-sm font-semibold tracking-[0.01em] text-slate-600 transition hover:border-[#417df6] hover:text-[#417df6]">Recipe Roulette</button>
                <a href="#" className="border-b-2 border-transparent pb-4 text-sm font-semibold tracking-[0.01em] text-slate-600 transition hover:border-[#417df6] hover:text-[#417df6]">Shopping List</a>
                <a href="#" className="border-b-2 border-transparent pb-4 text-sm font-semibold tracking-[0.01em] text-slate-600 transition hover:border-[#417df6] hover:text-[#417df6]">Calendar</a>
              </nav>
            </div>
          </div>

          <section className="relative w-full overflow-hidden rounded-[34px] bg-white/60 px-5 py-7 shadow-[0_18px_42px_rgba(22,41,75,0.1)] sm:rounded-[38px] sm:px-8 lg:px-10 lg:py-10">
            <div className="pointer-events-none absolute inset-y-0 right-0 w-[58%] min-w-[320px]">
              <Image
                src="/MainHeader.avif"
                alt="Plate with blueberries and herbs"
                fill
                priority
                sizes="(max-width: 640px) 100vw, (max-width: 1279px) 60vw, 50vw"
                className="object-cover object-right"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-white" />
            </div>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white/94 via-white/72 to-white/12" />
            <div className="pointer-events-none absolute -left-24 top-10 h-80 w-80 rounded-full bg-[#417df6]/20 blur-3xl" />
            <div className="pointer-events-none absolute left-[40%] top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-[#417df6]/16 blur-3xl" />

            <div className="relative">
              <div className="relative z-10 max-w-[560px]">
                <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-[#417df6]">Your recipes, your way</p>
                <h1 className="mt-4 font-serif text-[54px] font-semibold leading-[0.98] tracking-tight text-slate-900 sm:text-[70px]">
                  Discover recipes
                  <br />
                  you&apos;ll <span className="relative inline-block italic text-[#417df6]">love
                    <svg viewBox="0 0 152 26" className="absolute -bottom-2 left-0 h-4 w-[120%] text-[#417df6]/80" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                      <path d="M3 18.2c17.5-7.4 32.7-11.6 45.3-12.8 19.6-1.8 35.8 2.7 49.7 8.2 14.3 5.7 28.8 8.8 50 2.1" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
                    </svg>
                  </span>
                </h1>
                <p className="mt-5 max-w-md text-base leading-7 text-slate-500">
                  All your favorite recipes in one place. Find inspiration for every meal and every occasion.
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <div className="relative min-w-0 flex-1">
                    <span className="pointer-events-none absolute inset-y-0 left-5 flex items-center text-slate-400">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.9} stroke="currentColor" className="h-4 w-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.35-4.35m0 0A7.5 7.5 0 1 0 6 6a7.5 7.5 0 0 0 10.65 10.65Z" />
                      </svg>
                    </span>
                    <input
                      type="text"
                      placeholder="Search any recipe..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="h-14 w-full rounded-full border border-white/90 bg-white/95 pl-14 pr-5 text-sm text-slate-900 shadow-[0_14px_30px_rgba(148,163,184,0.2),0_2px_8px_rgba(255,255,255,0.55)] outline-none transition focus:border-[#417df6] focus:ring-2 focus:ring-[#417df6]/20"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsAdvancedFilterModalOpen(true)}
                    className="relative inline-flex h-14 items-center gap-2 rounded-full border border-white/90 bg-white/95 px-6 text-sm font-semibold text-slate-700 shadow-[0_14px_30px_rgba(148,163,184,0.2),0_2px_8px_rgba(255,255,255,0.55)] transition hover:bg-[#417df6]/8"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.9} stroke="currentColor" className="h-4 w-4" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 6.75h13.5l-5.25 5.625v4.125l-3 1.5v-5.625L5.25 6.75Z" />
                    </svg>
                    Filters
                    {activeFilterCount > 0 && <span className="absolute right-4 top-4 h-2.5 w-2.5 rounded-full bg-[#417df6]" />}
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section className="w-full pt-8">
            <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-[36px] font-semibold tracking-tight text-slate-900">Recently added</h2>
                <span className="text-[#417df6]">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5 19.5 4.5M10.5 4.5h9v9" />
                  </svg>
                </span>
              </div>

              <div className="flex items-center gap-3 self-start sm:self-auto">
                <button type="button" className="inline-flex h-11 items-center gap-2 rounded-full border border-white/80 bg-white/90 px-5 text-sm font-semibold text-slate-700 shadow-sm">
                  Latest added
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="h-4 w-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                  </svg>
                </button>
                <div className="inline-flex items-center gap-1 rounded-full border border-white/80 bg-white/90 p-1 shadow-sm">
                  <button type="button" className="flex h-9 w-9 items-center justify-center rounded-full bg-[#417df6]/10 text-[#417df6]">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                      <path d="M4 4h6v6H4V4Zm0 10h6v6H4v-6Zm10-10h6v6h-6V4Zm0 10h6v6h-6v-6Z" />
                    </svg>
                  </button>
                  <button type="button" className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.9} stroke="currentColor" className="h-4 w-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 6.75h15M4.5 12h15M4.5 17.25h15" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {filteredRecipes.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-[repeat(auto-fit,minmax(210px,1fr))] 2xl:grid-cols-[repeat(auto-fit,minmax(220px,1fr))]">
                {filteredRecipes.map((recipe) => (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    onClick={() => handleOpenRecipeModal(recipe)}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-[28px] border border-dashed border-slate-300/70 bg-white/50 py-20 text-center">
                <p className="text-lg font-bold text-slate-900">No recipes found</p>
                <p className="mt-1 text-sm text-slate-600">Try another search or filter combination.</p>
              </div>
            )}
          </section>
        </div>
      </main>

      <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3">
        <button
          type="button"
          onClick={handleOpenModal}
          className="inline-flex h-14 items-center gap-3 rounded-full bg-[#417df6] px-6 text-base font-semibold text-white shadow-[0_14px_28px_rgba(65,125,246,0.35)] transition hover:translate-y-[-1px]"
          aria-label="Add Recipe"
          title="Add Recipe"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.2}
            stroke="currentColor"
            className="h-5 w-5"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14m7-7H5" />
          </svg>
          Add Recipe
        </button>

        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-white/85 bg-white/95 text-slate-700 shadow-[0_12px_24px_rgba(15,23,42,0.12)] transition hover:translate-y-[-1px] hover:bg-white"
          aria-label="Scroll to top"
          title="Scroll to top"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.2}
            stroke="currentColor"
            className="h-5 w-5"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 19.5V4.5m0 0L6.75 9.75M12 4.5l5.25 5.25" />
          </svg>
        </button>
      </div>
    </div>
  );
}