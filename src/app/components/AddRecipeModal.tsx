interface AddRecipeModalProps {
    formData: {
      name: string;
      instructions: string;
      cookingtime: string;
      ingredients: { name: string; quantity: string; unit: string }[];
      tags: string;
    };
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index?: number) => void;
    onAddIngredient: () => void;
    onClose: () => void;
    onSubmit: (e: React.FormEvent) => void;
  }
  
  export default function AddRecipeModal({
    formData,
    onChange,
    onAddIngredient,
    onClose,
    onSubmit,
  }: AddRecipeModalProps) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white text-black rounded-lg p-8 w-[800px] max-w-full">
          <h2 className="text-2xl font-bold mb-4">Add Recipe</h2>
          <form onSubmit={onSubmit}>
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
  
            {/* Other fields (instructions, cooking time, ingredients, tags) */}
            {/* Add the rest of the form fields here, similar to the original code */}
  
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