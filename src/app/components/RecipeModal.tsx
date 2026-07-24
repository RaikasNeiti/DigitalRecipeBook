interface RecipeModalProps {
  recipe: {
    id: number;
    name: string;
    cookingtime: string;
    ingredients: { name: string; quantity: string; unit: string }[];
    instructions: string;
    image?: string;
    tags?: string[];
    servings_amount?: string | number;
    servings_unit?: string;
  };
  onClose: () => void;
  onDelete: () => void;
  onEdit: () => void;
}
export default function RecipeModal({ recipe, onClose, onDelete, onEdit }: RecipeModalProps) {
  const instructionSteps = recipe.instructions
    .split(/\r?\n/)
    .map((step) => step.trim())
    .filter(Boolean);
  const primaryTag = recipe.tags?.[0];
  const midpoint = Math.ceil(recipe.ingredients.length / 2);
  const leftIngredients = recipe.ingredients.slice(0, midpoint);
  const rightIngredients = recipe.ingredients.slice(midpoint);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 p-4"
      onClick={onClose}
    >
      <div
        className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-[#dfe7f3] bg-[#f8fbff] shadow-[0_24px_52px_rgba(30,64,175,0.2)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative h-56 overflow-hidden bg-zinc-100 sm:h-72">
          {recipe.image ? (
            <img
              src={recipe.image}
              alt={recipe.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm font-medium text-zinc-500">
              No Image
            </div>
          )}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute left-3 top-3 rounded-full bg-white p-2 text-slate-700 shadow-sm transition hover:bg-[#417df6]/10 hover:text-slate-900"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
          </button>

          <div className="absolute right-3 top-3 flex items-center gap-2">
            <button
              onClick={onEdit}
              aria-label="Edit recipe"
              className="rounded-full bg-white p-2 text-slate-700 shadow-sm transition hover:bg-[#417df6]/10 hover:text-slate-900"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931ZM18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
              </svg>
            </button>
            <button
              onClick={onDelete}
              aria-label="Delete recipe"
              className="rounded-full bg-white p-2 text-slate-700 shadow-sm transition hover:bg-rose-50 hover:text-rose-500"
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
          </div>
        </div>

        <div className="min-h-0 overflow-y-auto p-5 sm:p-6">
          <h2 className="text-4xl font-bold leading-tight text-slate-900">{recipe.name}</h2>
          <div className="mt-3 flex items-center gap-3 text-sm text-slate-600">
            <span className="inline-flex items-center gap-1.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-4 w-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v6l4 2m6-2a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z"
                />
              </svg>
              <span>{recipe.cookingtime} minutes</span>
            </span>
            {primaryTag && (
              <span className="rounded-full border border-[#417df6]/30 bg-[#417df6]/14 px-2.5 py-1 text-xs font-semibold text-slate-700">
                {primaryTag}
              </span>
            )}
          </div>

          <h3 className="mt-6 text-xl font-bold text-slate-900">Ingredients</h3>
          <div className="relative mt-3 grid grid-cols-1 gap-y-2 sm:grid-cols-2 sm:gap-x-8">
            <div className="hidden sm:block absolute inset-y-1 left-1/2 w-px -translate-x-1/2 bg-[#edf2fa]" />

            <ul className="space-y-2 pr-0 sm:pr-4">
              {leftIngredients.map((ingredient, index) => (
                <li key={`left-${index}`} className="flex items-center justify-between gap-3 text-sm text-slate-700">
                  <span className="flex min-w-0 items-center gap-2">
                    <span className="h-1 w-1 shrink-0 rounded-full bg-slate-500" />
                    <span className="truncate">{ingredient.name}</span>
                  </span>
                  <span className="shrink-0 whitespace-nowrap text-xs text-slate-500">
                    {ingredient.quantity} {ingredient.unit}
                  </span>
                </li>
              ))}
            </ul>

            <ul className="space-y-2 pl-0 sm:pl-4">
              {rightIngredients.map((ingredient, index) => (
                <li key={`right-${index}`} className="flex items-center justify-between gap-3 text-sm text-slate-700">
                  <span className="flex min-w-0 items-center gap-2">
                    <span className="h-1 w-1 shrink-0 rounded-full bg-slate-500" />
                    <span className="truncate">{ingredient.name}</span>
                  </span>
                  <span className="shrink-0 whitespace-nowrap text-xs text-slate-500">
                    {ingredient.quantity} {ingredient.unit}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <h3 className="mt-6 text-xl font-bold text-slate-900">Instructions</h3>
          {instructionSteps.length > 0 ? (
            <ol className="mt-3 space-y-2 text-sm text-slate-700">
              {instructionSteps.map((step, index) => (
                <li key={index} className="flex gap-2">
                  <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#417df6]/14 text-xs font-semibold text-slate-700">
                    {index + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          ) : (
            <p className="mt-3 text-sm text-slate-600">No instructions available.</p>
          )}

          <div className="mt-6 grid grid-cols-2 border-t border-[#dfe7f3] pt-4">
            <div className="flex items-start gap-2.5 pr-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.8}
                stroke="currentColor"
                className="mt-0.5 h-4 w-4 text-slate-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6.75c0-1.657 1.343-3 3-3h.75a3 3 0 0 1 3 3v.75a2.25 2.25 0 0 1-2.25 2.25h-9A2.25 2.25 0 0 1 5.25 7.5v-.75a3 3 0 0 1 3-3H9c1.657 0 3 1.343 3 3Zm-5.25 3h10.5c1.243 0 2.25 1.007 2.25 2.25v4.5A2.25 2.25 0 0 1 17.25 18.75H6.75A2.25 2.25 0 0 1 4.5 16.5V12c0-1.243 1.007-2.25 2.25-2.25Z"
                />
              </svg>
              <div>
                <p className="text-[11px] leading-none text-slate-500">Makes</p>
                <p className="mt-1 text-sm font-semibold leading-none text-slate-900">
                  {recipe.servings_amount ? `${recipe.servings_amount} ${recipe.servings_unit ?? ""}`.trim() : "Not set"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 border-l border-[#e6edf8] pl-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.8}
                stroke="currentColor"
                className="mt-0.5 h-4 w-4 text-slate-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v6l4 2m6-2a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z"
                />
              </svg>
              <div>
                <p className="text-[11px] leading-none text-slate-500">Bake Time</p>
                <p className="mt-1 text-sm font-semibold leading-none text-slate-900">{recipe.cookingtime} minutes</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
