import React, { useState, useEffect } from "react";
import ConfirmDialog from "./ConfirmDialog";

interface AddRecipeModalProps {
  formData: {
    name: string;
    instructions: string;
    cookingtime: string;
    servings: { amount: string; unit: string };
    ingredients: { name: string; quantity: string; unit: string }[];
    tags: string[];
    image: File | null;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>, index?: number) => void;
  onImageChange: (file: File | null) => void;
  onAddIngredient: () => void;
  onRemoveIngredient: (index: number) => void; // New prop for removing an ingredient
  onClose: () => void;
  onSubmit: () => void;
}

const inputClass =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-100";
const labelClass = "mb-1.5 block text-sm font-medium text-slate-700";

export default function AddRecipeModal({
  formData,
  onChange,
  onImageChange,
  onAddIngredient,
  onRemoveIngredient,
  onClose,
  onSubmit,
}: AddRecipeModalProps) {
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>(formData.tags);
  const [error, setError] = useState<string | null>(null); // State for validation errors
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showAddConfirm, setShowAddConfirm] = useState(false);

  useEffect(() => {
    if (!formData.image) {
      setImagePreview(null);
      return;
    }
    const objectUrl = URL.createObjectURL(formData.image);
    setImagePreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [formData.image]);

  // Fetch tags from the backend
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch("http://192.168.1.125:5000/api/tags");
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
    setShowAddConfirm(true);
  };

  const confirmAdd = () => {
    setShowAddConfirm(false);
    formData.tags = selectedTags;
    onSubmit();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h2 className="text-xl font-semibold text-slate-900">Add Recipe</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-full p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form id="add-recipe-form" onSubmit={handleSubmit} className="overflow-y-auto px-6 py-5">
          {error && (
            <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
          )}

          {/* Recipe Name */}
          <div className="mb-5">
            <label className={labelClass} htmlFor="name">
              Recipe Name
            </label>
            <input
              type="text"
              id="name"
              className={inputClass}
              placeholder="Enter recipe name"
              value={formData.name}
              onChange={onChange}
            />
          </div>

          {/* Image */}
          <div className="mb-5">
            <label className={labelClass}>Recipe Image</label>
            <label
              htmlFor="image"
              className="flex h-40 w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 transition hover:border-amber-300"
            >
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
              ) : (
                <span className="text-sm text-slate-400">Click to upload an image</span>
              )}
            </label>
            <input
              type="file"
              id="image"
              accept="image/*"
              className="hidden"
              onChange={(e) => onImageChange(e.target.files?.[0] ?? null)}
            />
          </div>

          {/* Instructions */}
          <div className="mb-5">
            <label className={labelClass} htmlFor="instructions">
              Instructions
            </label>
            <textarea
              id="instructions"
              className={`${inputClass} h-32 resize-none`}
              placeholder="Enter instructions"
              value={formData.instructions}
              onChange={onChange}
            ></textarea>
          </div>

          {/* Cooking Time */}
          <div className="mb-5">
            <label className={labelClass} htmlFor="cookingtime">
              Cooking Time (minutes)
            </label>
            <input
              type="number"
              id="cookingtime"
              className={inputClass}
              placeholder="Enter cooking time"
              value={formData.cookingtime}
              onChange={onChange}
            />
          </div>

          {/* Servings */}
          <div className="mb-5">
            <label className={labelClass}>Servings</label>
            <div className="flex gap-2">
              <input
                type="number"
                id="servings.amount"
                className={inputClass}
                placeholder="Amount"
                value={formData.servings.amount}
                onChange={onChange}
              />
              <select
                id="servings.unit"
                className={inputClass}
                value={formData.servings.unit}
                onChange={onChange}
              >
                <option value="servings">Servings</option>
                <option value="people">People</option>
              </select>
            </div>
          </div>

          {/* Ingredients */}
          <div className="mb-5">
            <label className={labelClass}>Ingredients</label>
            <div className="space-y-2">
              {formData.ingredients.map((ingredient, index) => (
                <div key={index} className="flex items-center gap-2 rounded-lg bg-slate-50 p-2">
                  <input
                    type="text"
                    name="name"
                    className={`${inputClass} w-2/5`}
                    placeholder="Ingredient name"
                    value={ingredient.name}
                    onChange={(e) => onChange(e, index)}
                  />
                  <input
                    type="number"
                    name="quantity"
                    className={`${inputClass} w-1/5`}
                    placeholder="Qty"
                    value={ingredient.quantity}
                    onChange={(e) => onChange(e, index)}
                  />
                  <select
                    name="unit"
                    className={`${inputClass} w-1/4`}
                    value={ingredient.unit}
                    onChange={(e) => onChange(e, index)}
                  >
                    <option value="">Unit</option>
                    <option value="Tablespoon">Tablespoon</option>
                    <option value="Teaspoon">Teaspoon</option>
                    <option value="Pieces">Pieces</option>
                    <option value="g">g</option>
                    <option value="kg">kg</option>
                    <option value="ml">ml</option>
                    <option value="dl">dl</option>
                    <option value="L">L</option>
                    <option value="Cup">Cup</option>
                    <option value="oz">oz</option>
                  </select>
                  <button
                    type="button"
                    aria-label="Remove ingredient"
                    className="shrink-0 rounded-full p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                    onClick={() => onRemoveIngredient(index)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              className="mt-2 w-full rounded-lg border border-dashed border-slate-300 py-2 text-sm font-medium text-amber-600 transition hover:border-amber-300 hover:bg-amber-50"
              onClick={onAddIngredient}
            >
              + Add Ingredient
            </button>
          </div>

          {/* Tags */}
          <div>
            <label className={labelClass}>Tags</label>
            <div className="flex flex-wrap gap-2">
              {availableTags.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                      isSelected
                        ? "bg-amber-400 text-white"
                        : "border border-slate-200 bg-white text-slate-600 hover:border-amber-300"
                    }`}
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-slate-100 px-6 py-4">
          <button
            type="button"
            className="rounded-full px-5 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            form="add-recipe-form"
            className="rounded-full bg-amber-400 px-5 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-amber-500"
          >
            Save Recipe
          </button>
        </div>
      </div>
      {showAddConfirm && (
        <ConfirmDialog
          title="Add this recipe?"
          message={`Add "${formData.name}" to your recipe book?`}
          confirmLabel="Add Recipe"
          onCancel={() => setShowAddConfirm(false)}
          onConfirm={confirmAdd}
        />
      )}
    </div>
  );
}
