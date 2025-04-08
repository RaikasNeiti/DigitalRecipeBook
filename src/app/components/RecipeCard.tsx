interface RecipeCardProps {
    recipe: {
      id: number;
      name: string;
      cookingtime: string;
      tags?: string[];
    };
    onClick: () => void;
  }
  
  export default function RecipeCard({ recipe, onClick }: RecipeCardProps) {
    return (
      <div
        className="bg-white text-black rounded-lg shadow-md p-4 cursor-pointer max-w-sm mx-auto"
        onClick={onClick}
      >
        <h2 className="text-xl font-bold mb-2">{recipe.name}</h2>
        <p className="text-sm text-gray-600 mb-2">Cooking Time: {recipe.cookingtime} minutes</p>
        <div className="bg-gray-200 h-32 rounded mb-2 flex items-center justify-center">
          <p className="text-gray-500">Image Placeholder</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {recipe.tags?.map((tag, index) => (
            <span
              key={index}
              className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    );
  }