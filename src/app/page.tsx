"use client";
import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import RecipeCard from "./components/RecipeCard";
import RecipeModal from "./components/RecipeModal";
import AddRecipeModal from "./components/AddRecipeModal";
import SearchBar from "./components/SearchBar"; // Import the SearchBar component
import TagNavbar from "./components/TagNavbar"; // Import the TagNavbar component

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRecipeModalOpen, setIsRecipeModalOpen] = useState(false);
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
  });
  const [selectedRecipe, setSelectedRecipe] = useState<{
    id: number;
    name: string;
    cookingtime: string;
    ingredients: { name: string; quantity: string; unit: string }[];
    instructions: string;
    tags?: string[];
  } | null>(null);
  const [recipes, setRecipes] = useState<
    {
      id: number;
      name: string;
      cookingtime: string;
      ingredients: { name: string; quantity: string; unit: string }[];
      instructions: string;
      tags?: string[];
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
  }

  const handleOpenRecipeModal = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setIsRecipeModalOpen(true);
  };
  const handleCloseRecipeModal = () => setIsRecipeModalOpen(false);

  const fetchRecipes = async () => {
    try {
      const response = await fetch("http://192.168.1.87:5000/api/recipes-with-ingredients");
      if (response.ok) {
        const data = await response.json();
        setRecipes(data);
      } else {
        console.error("Failed to fetch recipes.");
      }
    } catch (error) {
      console.error("Error fetching recipes:", error);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await fetch("http://192.168.1.87:5000/api/tags");
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://192.168.1.87:5000/api/recipes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags,
        }),
      });

      if (response.ok) {
        alert("Recipe added successfully!");
        setFormData({
          name: "",
          instructions: "",
          cookingtime: "",
          servings: { amount: "", unit: "" }, // Add default structure for servings
          ingredients: [{ name: "", quantity: "", unit: "" }],
          tags: [], // Ensure tags is an array
        });
        handleCloseModal();
        fetchRecipes(); // Refresh recipes after adding a new one
      } else {
        alert("Failed to add recipe.");
      }
    } catch (error) {
      console.error("Error adding recipe:", error);
      alert("An error occurred while adding the recipe.");
    }
  };

  // Filter recipes based on the search query and selected tag
  const filteredRecipes = recipes.filter((recipe) => {
    const matchesSearch = recipe.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = selectedTag ? recipe.tags?.includes(selectedTag) : true;
    return matchesSearch && matchesTag;
  });

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      {/* Search Bar */}
      <SearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      {/* Navbar for Tags */}
      <TagNavbar
        tags={tags}
        selectedTag={selectedTag}
        onTagSelect={setSelectedTag}
      />

      {/* Recipes Section */}
      <main className="px-20 py-4"> {/* Added horizontal padding (px-8) */}
        <div className="grid gap-6 justify-center grid-cols-[repeat(auto-fill,minmax(400px,1fr))]">
          {filteredRecipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onClick={() => handleOpenRecipeModal(recipe)}
            />
          ))}
        </div>
      </main>

      {/* Floating Add Recipe Button */}
      <button
        className="fixed bottom-8 right-8 rounded-full bg-blue-500 text-white text-3xl w-16 h-16 flex items-center justify-center shadow-lg hover:bg-blue-600 transition"
        aria-label="Add Recipe"
        onClick={handleOpenModal}
      >
        +
      </button>

      {/* AddRecipeModal */}
      {isModalOpen && (
        <AddRecipeModal
          formData={formData}
          onChange={handleChange}
          onAddIngredient={addIngredientField}
          onRemoveIngredient={removeIngredientField} // Pass the remove function
          onClose={handleCloseModal}
          onSubmit={handleSubmit}
        />
      )}
      {isRecipeModalOpen && selectedRecipe && (
        <RecipeModal recipe={selectedRecipe} onClose={handleCloseRecipeModal} />
      )}
    </div>
  );
}