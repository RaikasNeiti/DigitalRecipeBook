interface RecipeCardProps {
  recipe: {
    id: number;
    name: string;
    cookingtime: string;
    tags?: string[];
    image?: string;
  };
  onClick: () => void;
}

export default function RecipeCard({ recipe, onClick }: RecipeCardProps) {
  return (
    <div
      className="bg-white rounded-lg shadow-lg overflow-hidden hover:scale-105 transition transform"
      onClick={onClick}
    >
      <div className="w-full h-40">
        {recipe.image ? (
          <img
            src={recipe.image}
            alt={recipe.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full object-cover bg-gray-200 flex items-center justify-center text-gray-500">
            No Image
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-600">{recipe.name}</h2>
          <p className="text-sm text-gray-500">⏱ {recipe.cookingtime} min</p>
        </div>
        {/* Display tags */}
        {recipe.tags && recipe.tags.length > 0 && (
          <p className="text-sm text-gray-400 mt-1">
            {recipe.tags.join(", ")} {/* Join tags into a comma-separated string */}
          </p>
        )}
      </div>
    </div>
  );
}