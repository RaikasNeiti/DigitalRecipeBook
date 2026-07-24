"use client";
import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import RecipeCard from "./components/RecipeCard";
import RecipeModal from "./components/RecipeModal";
import AddRecipeModal from "./components/AddRecipeModal";
import SearchBar from "./components/SearchBar"; // Import the SearchBar component
import TagNavbar from "./components/TagNavbar"; // Import the TagNavbar component
import ConfirmDialog from "./components/ConfirmDialog";

const API_BASE = "http://192.168.1.125:5000";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRecipeModalOpen, setIsRecipeModalOpen] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [showAddSuccess, setShowAddSuccess] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [selectedTag, setSelectedTag] = useState<string | null>(null); // State for selected tag
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
  const [selectedRecipe, setSelectedRecipe] = useState<{
    id: number;
    name: string;
    cookingtime: string;
    ingredients: { name: string; quantity: string; unit: string }[];
    instructions: string;
    tags?: string[];
    image?: string;
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
  }

  const handleOpenRecipeModal = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setIsRecipeModalOpen(true);
  };
  const handleCloseRecipeModal = () => setIsRecipeModalOpen(false);

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

  // Filter recipes based on the search query and selected tag
  const filteredRecipes = recipes.filter((recipe) => {
    const matchesSearch = recipe.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = selectedTag ? recipe.tags?.includes(selectedTag) : true;
    return matchesSearch && matchesTag;
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      {/* Search Bar */}
      <SearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      {/* Navbar for Tags */}
      <TagNavbar
        tags={tags}
        selectedTag={selectedTag}
        onTagSelect={setSelectedTag}
        onAddRecipe={handleOpenModal} // Pass the function to open the modal
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