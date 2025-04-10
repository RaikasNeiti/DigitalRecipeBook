"use client";
import React, { useState } from "react";

export default function RecipePage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>("All");
  const categories = ["All", "Breakfast", "Lunch", "Dinner", "Appetizer", "Dessert", "Drink"];
  const recipes = [
    { name: "Pancakes", time: "10 min", category: "Dessert", image: "/images/pancakes.jpg" },
    { name: "Avocado Toast", time: "12 min", category: "Breakfast, Lunch", image: "/images/avocado-toast.jpg" },
    { name: "Smoothie", time: "10 min", category: "Drink", image: "/images/smoothie.jpg" },
    { name: "Bolognaise", time: "25 min", category: "Dinner", image: "/images/bolognaise.jpeg" },
    { name: "Fruit Salad", time: "15 min", category: "Dessert", image: "/images/fruit-salad.jpg" },
    { name: "Ceaser Salad", time: "15 min", category: "Lunch, Dinner", image: "/images/ceaser-salad.jpg" },
    { name: "Red Velvet Cake", time: "50 min", category: "Dessert", image: "/images/red-velvet-cake.jpg" },
    { name: "Wrap", time: "10 min", category: "Lunch, Dinner", image: "/images/wrap.jpg" },
    { name: "Sweet and Sour", time: "25 min", category: "Dinner", image: "/images/sweet-and-sour.jpg" },
    { name: "Cookies", time: "25 min", category: "Dessert", image: "/images/cookies.jpg" },
    { name: "Taco's", time: "15 min", category: "Dinner", image: "/images/tacos.jpg" },
    { name: "Yoghurt Bowl", time: "10 min", category: "Breakfast", image: "/images/yoghurt-bowl.jpg" },
  ];

  const filteredRecipes = selectedCategory === "All"
    ? recipes
    : recipes.filter((recipe) => recipe.category.includes(selectedCategory!));

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-yellow-400 text-black py-4 px-8 flex items-center">
        <div className="flex items-center space-x-16">
          <h1 className="text-2xl font-bold text-white">Digital Recipe Book</h1>
          <nav className="flex space-x-8">
            <a href="#" className="text-lg font-medium hover:underline text-black">Home</a>
            <a href="#" className="text-lg font-medium hover:underline text-gray-600">Recipe Roulette</a>
            <a href="#" className="text-lg font-medium hover:underline text-gray-600">Shopping List</a>
          </nav>
        </div>
      </header>

      {/* Search Bar */}
      <div className="bg-white py-4 px-8 flex justify-center">
        <input
          type="text"
          placeholder="Search any recipe"
          className="w-[50%] p-2 rounded border border-gray-300"
        />
      </div>

      {/* Categories */}
      <div className="flex justify-center space-x-4 py-4 bg-white">
        {categories.map((category) => (
          <button
            key={category}
            className={`text-lg text-gray-600 font-medium ${
              selectedCategory === category ? "border-b-2 border-yellow-400" : "text-gray-300"
            } hover:text-black`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Recipes Grid */}
      <main className="px-8 py-4">
        <div className="grid gap-6 grid-cols-[repeat(auto-fill,minmax(250px,1fr))]">
          {filteredRecipes.map((recipe, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:scale-105 transition transform"
            >
              <img
                src={recipe.image}
                alt={recipe.name}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h2 className="text-lg font-bold text-gray-600 text-center">{recipe.name}</h2>
                <p className="text-sm text-gray-500 text-center">⏱ {recipe.time}</p>
                <p className="text-sm text-gray-400 text-center">{recipe.category}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}