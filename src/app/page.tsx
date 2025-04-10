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
      <div className="p-4">
        <header
          className="bg-yellow-400 rounded-full text-black px-12 py-4 flex items-center"
          style={{ height: "64px" }}
        >
          <div className="flex items-center space-x-16">
            {/* Logo */}
            <img
              src="/cutlery-icon.svg"
              alt="Digital Recipe Book Logo"
              className="w-14 h-14 filter invert"
            />
            <nav className="flex space-x-8">
              <a href="#" className="text-lg font-bold text-white">Home</a>
              <a href="#" className="text-lg text-white/70 hover:text-white/90">Recipe Roulette</a>
              <a href="#" className="text-lg text-white/70 hover:text-white/90">Shopping List</a>
            </nav>
          </div>
        </header>
      </div>

      {/* Search Bar */}
      <div className="py-4 px-8 flex justify-center">
        <div className="relative w-[50%]">
          <span className="absolute inset-y-0 left-3 flex items-center">
            <img
              src="/search-icon.svg"
              alt="Search Icon"
              className="w-5 h-5 text-gray-500"
            />
          </span>
          <input
            type="text"
            placeholder="Search any recipe"
            className="w-full p-2 pl-10 rounded-full bg-gray-200 placeholder-gray-600"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="flex justify-center items-center px-8 py-4">
        <div className="flex space-x-4">
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
        {/* Add Recipe Button */}
        <button
          className="bg-yellow-400 text-white px-6 py-2 rounded-full font-medium hover:bg-yellow-500 transition ml-8"
          onClick={() => alert("Add Recipe Clicked!")} // Replace with your functionality
        >
          Add Recipe
        </button>
      </div>

      {/* Recipes Grid */}
      <main className="px-8 py-4">
        <div className="grid gap-6 grid-cols-[repeat(auto-fill,minmax(250px,1fr))]">
          {filteredRecipes.map((recipe, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:scale-105 transition transform"
            >
              <div className="w-full h-40">
                <img
                  src={recipe.image}
                  alt={recipe.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-bold text-gray-600">{recipe.name}</h2>
                  <p className="text-sm text-gray-500">⏱ {recipe.time}</p>
                </div>
                <p className="text-sm text-gray-400 mt-1">{recipe.category}</p>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Back to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-8 right-8 bg-yellow-400 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:bg-yellow-500 transition"
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