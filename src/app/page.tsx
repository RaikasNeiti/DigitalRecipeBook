"use client";
import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import RecipeCard from "./components/RecipeCard";
import RecipeModal from "./components/RecipeModal";
import AddRecipeModal from "./components/AddRecipeModal";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRecipeModalOpen, setIsRecipeModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    instructions: "",
    cookingtime: "",
    ingredients: [{ name: "", quantity: "", unit: "" }],
    tags: "",
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

  useEffect(() => {
    fetchRecipes();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index?: number) => {
    const { id, name, value } = e.target;

    if (typeof index === "number") {
      const updatedIngredients = [...formData.ingredients];
      updatedIngredients[index] = { ...updatedIngredients[index], [name]: value };
      setFormData((prev) => ({ ...prev, ingredients: updatedIngredients }));
    } else {
      setFormData((prev) => ({ ...prev, [id]: value }));
    }
  };

  const addIngredientField = () => {
    setFormData((prev) => ({
      ...prev,
      ingredients: [...prev.ingredients, { name: "", quantity: "", unit: "" }],
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
          tags: formData.tags.split(",").map((tag) => tag.trim()),
        }),
      });

      if (response.ok) {
        alert("Recipe added successfully!");
        setFormData({
          name: "",
          instructions: "",
          cookingtime: "",
          ingredients: [{ name: "", quantity: "", unit: "" }],
          tags: "",
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

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      {/* Recipes Section */}
      <main className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
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

      {/* Modals */}
      {isModalOpen && (
        <AddRecipeModal
          formData={formData}
          onChange={handleChange}
          onAddIngredient={addIngredientField}
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