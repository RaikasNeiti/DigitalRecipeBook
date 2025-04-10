import React, { useState, useEffect } from "react";

interface AddRecipeModalProps {
  formData: {
    name: string;
    instructions: string;
    cookingtime: string;
    servings: { amount: string; unit: string };
    ingredients: { name: string; quantity: string; unit: string }[];
    tags: string[];
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>, index?: number) => void;
  onAddIngredient: () => void;
  onRemoveIngredient: (index: number) => void; // New prop for removing an ingredient
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function AddRecipeModal({
  formData,
  onChange,
  onAddIngredient,
  onRemoveIngredient,
  onClose,
  onSubmit,
}: AddRecipeModalProps) {
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>(formData.tags);
  const [error, setError] = useState<string | null>(null); // State for validation errors

  // Fetch tags from the backend
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch("http://192.168.1.87:5000/api/tags");
        if (response.ok) {
          const data = await response.json();
          setAvailableTags(data);
        } else {
          console.error("Failed to fetch tags.");
        }
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };

    fetchTags();
  }, []);

  // Toggle tag selection
  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  // Validate form before submission
  const validateForm = () => {
    if (!formData.name.trim()) return "Recipe name cannot be empty.";
    if (!formData.instructions.trim()) return "Instructions cannot be empty.";
    if (!formData.cookingtime.trim()) return "Cooking time cannot be empty.";
    if (!formData.servings.amount.trim() || !formData.servings.unit.trim())
      return "Servings amount and unit cannot be empty.";
    if (formData.ingredients.some((ingredient) => !ingredient.name.trim() || !ingredient.quantity.trim() || !ingredient.unit.trim()))
      return "All ingredient fields must be filled.";
    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    onSubmit(e);
    formData.tags = selectedTags;
  };

  const removeIngredientField = (index: number) => {
    const updatedIngredients = formData.ingredients.filter((_, i) => i !== index);
    onChange({
      target: {
        name: "ingredients",
        value: updatedIngredients,
      },
    } as unknown as React.ChangeEvent<HTMLInputElement>);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white text-black rounded-lg p-8 w-[800px] max-w-full">
        <h2 className="text-2xl font-bold mb-4">Add Recipe</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
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
              onChange={onChange}
            />
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
              onChange={onChange}
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
              onChange={onChange}
            />
          </div>

          {/* Servings */}
          <div className="mb-4">
            <label className="block font-medium mb-1">Servings</label>
            <div className="flex gap-2">
              <input
                type="number"
                id="servings.amount"
                className="w-1/2 border rounded p-2"
                placeholder="Amount"
                value={formData.servings.amount}
                onChange={onChange}
              />
              <select
                id="servings.unit"
                className="w-1/2 border rounded p-2"
                value={formData.servings.unit}
                onChange={onChange}
              >
                <option value="">Select Unit</option>
                <option value="people">People</option>
                <option value="servings">Servings</option>
              </select>
            </div>
          </div>

          {/* Ingredients */}
          <div className="mb-4">
            <label className="block font-medium mb-1">Ingredients</label>
            {formData.ingredients.map((ingredient, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  name="name"
                  className="w-1/3 border rounded p-2"
                  placeholder="Ingredient name"
                  value={ingredient.name}
                  onChange={(e) => onChange(e, index)}
                />
                <input
                  type="number"
                  name="quantity"
                  className="w-1/3 border rounded p-2"
                  placeholder="Quantity"
                  value={ingredient.quantity}
                  onChange={(e) => onChange(e, index)}
                />
                <select
                  name="unit"
                  className="w-1/3 border rounded p-2"
                  value={ingredient.unit}
                  onChange={(e) => onChange(e, index)}
                >
                  <option value="">Select Unit</option>
                  <option value="Tablespoon">Tablespoon</option>
                  <option value="Teaspoon">Teaspoon</option>
                  <option value="Pieces">Pieces</option>
                  <option value="g">g</option>
                  <option value="kg">kg</option>
                  <option value="ml">ml</                  option>
                  <option value="dl">dl</option>
                  <option value="L">L</option>
                  <option value="Cup">Cup</option>
                  <option value="oz">oz</option>
                </select>
                <button
                  type="button"
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  onClick={() => onRemoveIngredient(index)}
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
              onClick={onAddIngredient}
            >
              Add Ingredient
            </button>
          </div>

          {/* Tags */}
          <div className="mb-4">
            <label className="block font-medium mb-1">Tags</label>
            <div className="flex flex-wrap gap-2">
              {availableTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  className={`px-4 py-2 rounded-full border ${
                    selectedTags.includes(tag)
                      ? "bg-gray-500 text-white"
                      : "bg-gray-200 text-black"
                  }`}
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
              onClick={onClose}
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
  );
}