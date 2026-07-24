"use client";
import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import RecipeCard from "./components/RecipeCard";
import RecipeModal from "./components/RecipeModal";
import AddRecipeModal from "./components/AddRecipeModal";
import EditRecipeModal from "./components/EditRecipeModal";
import SearchBar from "./components/SearchBar"; // Import the SearchBar component
import TagNavbar from "./components/TagNavbar"; // Import the TagNavbar component
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

type FilterChip = { key: string; label: string };

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRecipeModalOpen, setIsRecipeModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [showAddSuccess, setShowAddSuccess] = useState(false);
  const [isAdvancedFilterModalOpen, setIsAdvancedFilterModalOpen] = useState(false);
  const [isRouletteOpen, setIsRouletteOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [selectedTag, setSelectedTag] = useState<string | null>(null); // State for selected tag
  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFilters>(defaultAdvancedFilters);
  const [tags, setTags] = useState<string[]>([]); // State for tags
  const [formData, setFormData] = useState({
    name: "",
    instructions: "",
    cookingtime: "",
    servings: { amount: "", unit: "" }, // Add default structure for servings
    ingredients: [{ name: "", quantity: "", unit: "" }],
    tags: [] as string[], // Ensure tags is an array of strings
    image: null as File | null,
  });
  const [editRecipeId, setEditRecipeId] = useState<number | null>(null);
  const [editExistingImage, setEditExistingImage] = useState<string | undefined>(undefined);
  const [editFormData, setEditFormData] = useState({
    name: "",
    instructions: "",
    cookingtime: "",
    servings: { amount: "", unit: "" },
    ingredients: [{ name: "", quantity: "", unit: "" }],
    tags: [] as string[],
    image: null as File | null,
  });
  const [selectedRecipe, setSelectedRecipe] = useState<{
    id: number;
    name: string;
    cookingtime: string;
    ingredients: { name: string; quantity: string; unit: string }[];
    instructions: string;
    tags?: string[];
    image?: string;
    servings_amount?: string | number;
    servings_unit?: string;
  } | null>(null);
  const [recipes, setRecipes] = useState<
    {
      id: number;
      name: string;
      cookingtime: string;
      ingredients: { name: string; quantity: string; unit: string }[];
      instructions: string;
      tags?: string[];
      image?: string;
      servings_amount?: string | number;
      servings_unit?: string;
    }[]
  >([]);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  interface Recipe {
    id: number;
    name: string;
    cookingtime: string;
    ingredients: { name: string; quantity: string; unit: string }[];
    instructions: string;
    tags?: string[];
    image?: string;
    servings_amount?: string | number;
    servings_unit?: string;
  }

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    index?: number
  ) => {
    const { id, name, value } = e.target;

    if (id.startsWith("servings.")) {
      // Update servings property
      const key = id.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        servings: { ...prev.servings, [key]: value },
      }));
    } else if (typeof index === "number") {
      // Update ingredients array
      const updatedIngredients = [...formData.ingredients];
      updatedIngredients[index] = { ...updatedIngredients[index], [name]: value };
      setFormData((prev) => ({ ...prev, ingredients: updatedIngredients }));
    } else {
      // Update other properties
      setFormData((prev) => ({ ...prev, [id]: value }));
    }
  };

  const handleImageChange = (file: File | null) => {
    setFormData((prev) => ({ ...prev, image: file }));
  };

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    index?: number
  ) => {
    const { id, name, value } = e.target;

    if (id.startsWith("servings.")) {
      const key = id.split(".")[1];
      setEditFormData((prev) => ({
        ...prev,
        servings: { ...prev.servings, [key]: value },
      }));
    } else if (typeof index === "number") {
      const updatedIngredients = [...editFormData.ingredients];
      updatedIngredients[index] = { ...updatedIngredients[index], [name]: value };
      setEditFormData((prev) => ({ ...prev, ingredients: updatedIngredients }));
    } else {
      setEditFormData((prev) => ({ ...prev, [id]: value }));
    }
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
        setFormData({
          name: "",
          instructions: "",
          cookingtime: "",
          servings: { amount: "", unit: "" }, // Add default structure for servings
          ingredients: [{ name: "", quantity: "", unit: "" }],
          tags: [], // Ensure tags is an array
          image: null,
        });
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

  const activeFilterChips: FilterChip[] = [
    ...(advancedFilters.minCookingTime.trim()
      ? [{ key: "minCookingTime", label: `Min ${advancedFilters.minCookingTime} min` }]
      : []),
    ...(advancedFilters.maxCookingTime.trim()
      ? [{ key: "maxCookingTime", label: `Max ${advancedFilters.maxCookingTime} min` }]
      : []),
    ...(advancedFilters.ingredientQuery.trim()
      ? [{ key: "ingredientQuery", label: `Ingredients: ${advancedFilters.ingredientQuery}` }]
      : []),
    ...advancedFilters.selectedTags.map((tag) => ({ key: `tag:${tag}`, label: `Tag: ${tag}` })),
  ];

  const handleRemoveFilterChip = (key: string) => {
    if (key.startsWith("tag:")) {
      const tagToRemove = key.replace("tag:", "");
      setAdvancedFilters((prev) => ({
        ...prev,
        selectedTags: prev.selectedTags.filter((tag) => tag !== tagToRemove),
      }));
      return;
    }

    setAdvancedFilters((prev) => {
      if (key === "minCookingTime") {
        return { ...prev, minCookingTime: "" };
      }

      if (key === "maxCookingTime") {
        return { ...prev, maxCookingTime: "" };
      }

      if (key === "ingredientQuery") {
        return { ...prev, ingredientQuery: "" };
      }

      return prev;
    });
  };

  // Filter recipes based on the search query and selected tag
  const filteredRecipes = recipes.filter((recipe) => {
    const matchesSearch = recipe.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = selectedTag ? recipe.tags?.includes(selectedTag) : true;

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
      matchesTag &&
      matchesMinCookingTime &&
      matchesMaxCookingTime &&
      matchesIngredients &&
      matchesAdvancedTags
    );
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <Header onRouletteClick={() => setIsRouletteOpen(true)} />

      {/* Search Bar */}
      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenFilters={() => setIsAdvancedFilterModalOpen(true)}
        activeFilterCount={activeFilterCount}
        activeFilters={activeFilterChips}
        onRemoveFilter={handleRemoveFilterChip}
      />

      <AdvancedFiltersModal
        isOpen={isAdvancedFilterModalOpen}
        filters={advancedFilters}
        availableTags={tags}
        onClose={() => setIsAdvancedFilterModalOpen(false)}
        onApply={setAdvancedFilters}
        onReset={() => setAdvancedFilters(defaultAdvancedFilters)}
      />

      {/* Navbar for Tags */}
      <TagNavbar
        tags={tags}
        selectedTag={selectedTag}
        onTagSelect={setSelectedTag}
      />

      {/* AddRecipeModal */}
      {isModalOpen && (
        <AddRecipeModal
          formData={formData}
          onChange={handleChange}
          onImageChange={handleImageChange}
          onAddIngredient={addIngredientField}
          onRemoveIngredient={removeIngredientField} // Pass the remove function
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
      {isRouletteOpen && (
        <RecipeRouletteModal
          recipes={recipes}
          availableTags={tags}
          onClose={() => setIsRouletteOpen(false)}
          onViewRecipe={(recipe) => {
            setIsRouletteOpen(false);
            handleOpenRecipeModal(recipe);
          }}
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

      {/* Recipes Section */}
      <main className="mx-auto max-w-6xl px-6 py-6">
        {filteredRecipes.length > 0 ? (
          <div className="grid gap-6 grid-cols-[repeat(auto-fill,minmax(250px,1fr))]">
            {filteredRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe} // Pass the entire recipe object, including tags
                onClick={() => handleOpenRecipeModal(recipe)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white py-20 text-center">
            <p className="text-lg font-medium text-slate-900">No recipes found</p>
            <p className="mt-1 text-sm text-slate-500">
              Try a different search or tag, or add a new recipe.
            </p>
          </div>
        )}
      </main>
      {/* Add Recipe Button */}
      <button
        onClick={handleOpenModal}
        className="fixed bottom-24 right-8 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-white shadow-lg transition hover:bg-slate-700"
        aria-label="Add Recipe"
        title="Add Recipe"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2.5}
          stroke="currentColor"
          className="h-6 w-6"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14m7-7H5" />
        </svg>
      </button>
      {/* Back to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-8 right-8 flex h-12 w-12 items-center justify-center rounded-full bg-amber-400 text-white shadow-lg transition hover:bg-amber-500"
        aria-label="Back to Top"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 15l7-7 7 7"
          />
        </svg>
      </button>
    </div>
  );
}