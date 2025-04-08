interface RecipeModalProps {
    recipe: {
      name: string;
      cookingtime: string;
      ingredients: { name: string; quantity: string; unit: string }[];
      instructions: string;
    };
    onClose: () => void;
  }
  
  export default function RecipeModal({ recipe, onClose }: RecipeModalProps) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white text-black rounded-lg p-8 w-[800px] max-w-full">
          <h2 className="text-2xl font-bold mb-4">{recipe.name}</h2>
          <p className="text-sm text-gray-600 mb-2">
            Cooking Time: {recipe.cookingtime} minutes
          </p>
          <h3 className="font-semibold mb-1">Ingredients:</h3>
          <ul className="list-disc list-inside mb-2">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index}>
                {ingredient.name} - {ingredient.quantity} {ingredient.unit}
              </li>
            ))}
          </ul>
          <h3 className="font-semibold mb-1">Instructions:</h3>
          <p className="text-sm">{recipe.instructions}</p>
          <div className="flex justify-end mt-4">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }