"use client";
import React, { useState } from "react";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    ingredients: "",
    instructions: "",
    cookingtime: "",
    maker: "",
  });

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/recipes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Recipe added successfully!");
        setFormData({
          name: "",
          ingredients: "",
          instructions: "",
          cookingtime: "",
          maker: "",
        });
        handleCloseModal();
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
      {/* Title */}
      <header className="text-center py-4">
        <h1 className="text-4xl font-bold">Digital Recipe Book</h1>
      </header>

      {/* Recipes Section */}
      <main className="p-8">
        <div className="text-center">
          <p className="text-lg">Here is where your recipes will be displayed.</p>
          {/* Add your recipes here */}
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white text-black rounded-lg p-8 w-[800px] max-w-full">
            <h2 className="text-2xl font-bold mb-4">Add Recipe</h2>
            <form onSubmit={handleSubmit}>
              {/* Recipe Name */}
              <div className="mb-4">
                <label className="block font-medium mb-1" htmlFor="name">
                  Recipe Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full border rounded p-2"
                  placeholder="Enter recipe name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              {/* Ingredient List */}
              <div className="mb-4">
                <label className="block font-medium mb-1" htmlFor="ingredients">
                  Ingredients
                </label>
                <textarea
                  id="ingredients"
                  className="w-full border rounded p-2 h-32"
                  placeholder="Enter ingredients"
                  value={formData.ingredients}
                  onChange={handleChange}
                ></textarea>
              </div>

              {/* Instructions */}
              <div className="mb-4">
                <label className="block font-medium mb-1" htmlFor="instructions">
                  Instructions
                </label>
                <textarea
                  id="instructions"
                  className="w-full border rounded p-2 h-32"
                  placeholder="Enter instructions"
                  value={formData.instructions}
                  onChange={handleChange}
                ></textarea>
              </div>

              {/* Cooking Time */}
              <div className="mb-4">
                <label className="block font-medium mb-1" htmlFor="cookingtime">
                  Cooking Time (minutes)
                </label>
                <input
                  type="number"
                  id="cookingtime"
                  className="w-full border rounded p-2"
                  placeholder="Enter cooking time"
                  value={formData.cookingtime}
                  onChange={handleChange}
                />
              </div>

              {/* Maker */}
              <div className="mb-4">
                <label className="block font-medium mb-1" htmlFor="maker">
                  Maker
                </label>
                <input
                  type="text"
                  id="maker"
                  className="w-full border rounded p-2"
                  placeholder="Enter your name"
                  value={formData.maker}
                  onChange={handleChange}
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}