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
        className="bg-white text-black rounded-2xl shadow-lg overflow-hidden cursor-pointer transition hover:scale-105 duration-300 w-full aspect-video"
        onClick={onClick}
      >

      {recipe.image ? (
        <img
          src={recipe.image}
          alt={recipe.name}
          className="w-full h-[60%] object-cover"
        />
      ) : (
        <div className="w-full h-[60%] bg-gray-200 flex items-center justify-center text-gray-500">
          No Image
        </div>
            )}
      <div className="p-2 w-full h-auto">
        <h2 className="text-xl font-semibold mb-1 text-gray-600 text-center">{recipe.name}</h2>
        <p className="text-s text-gray-500 mb-1 text-center"> 
          ⏱ {recipe.cookingtime} min
        </p>
        <div className="flex flex-wrap gap-1 justify-center"> 
          {recipe.tags?.map((tag, index) => (
            <span
              key={index}
              className="bg-yellow-400 text-black text-xs px-2 py-0.5 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}