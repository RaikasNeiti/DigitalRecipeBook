interface RecipeModalProps {
  recipe: {
    name: string;
    cookingtime: string;
    ingredients: { name: string; quantity: string; unit: string }[];
    instructions: string;
    image?: string;
  };
  onClose: () => void;
  onDelete: () => void;
}

export default function RecipeModal({ recipe, onClose, onDelete }: RecipeModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
      onClick={onClose}
    >
      <div
        className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {recipe.image && (
          <img
            src={recipe.image}
            alt={recipe.name}
            className="h-56 w-full shrink-0 object-cover"
          />
        )}
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">{recipe.name}</h2>
            <p className="mt-1 text-sm text-slate-500">
              ⏱ {recipe.cookingtime} minutes
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <button
              onClick={onDelete}
              aria-label="Delete recipe"
              className="rounded-full p-1.5 text-slate-400 transition hover:bg-red-50 hover:text-red-500"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m14.74 9-.346 9m-4.788 0L9.26 9M19.228 5.79c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                />
              </svg>
            </button>
            <button
              onClick={onClose}
              aria-label="Close"
              className="rounded-full p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <div className="overflow-y-auto px-6 py-5">
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
            Ingredients
          </h3>
          <ul className="mb-6 space-y-1.5">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index} className="flex justify-between text-sm text-slate-700">
                <span>{ingredient.name}</span>
                <span className="text-slate-500">
                  {ingredient.quantity} {ingredient.unit}
                </span>
              </li>
            ))}
          </ul>
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
            Instructions
          </h3>
          <p className="whitespace-pre-line text-sm leading-relaxed text-slate-700">
            {recipe.instructions}
          </p>
        </div>
      </div>
    </div>
  );
}
