interface RecipeModalProps {
  recipe: {
    id: number;
    name: string;
    cookingtime: string;
    ingredients: { name: string; quantity: string; unit: string }[];
    instructions: string;
    image?: string;
    servings_amount?: string | number;
    servings_unit?: string;
  };
  onClose: () => void;
  onDelete: () => void;
  onEdit: () => void;
}
export default function RecipeModal({ recipe, onClose, onDelete, onEdit }: RecipeModalProps) {

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 p-4"
      onClick={onClose}
    >
      <div
        className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-[#dfe7f3] bg-[#f8fbff] shadow-[0_24px_52px_rgba(30,64,175,0.2)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="relative min-h-[240px] overflow-hidden bg-zinc-100 lg:min-h-full">
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
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />

            <div className="absolute left-3 top-3 flex items-center gap-2">
              <button
                onClick={onEdit}
                aria-label="Edit recipe"
                className="rounded-full bg-white p-2 text-slate-700 shadow-sm transition hover:bg-sky-100 hover:text-slate-900"
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

            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute right-3 top-3 rounded-full bg-white p-2 text-slate-700 shadow-sm transition hover:bg-sky-100 hover:text-slate-900"
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

            <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-100">Recipe Card</p>
              <h2 className="mt-1 text-2xl font-bold leading-tight">{recipe.name}</h2>
            </div>
          </div>

          <div className="flex min-h-0 flex-col">
            <div className="grid grid-cols-2 gap-2 border-b border-[#dfe7f3] px-5 py-4">
              <div className="rounded-2xl border border-[#e3eaf5] bg-white px-3 py-2.5">
                <p className="text-[11px] uppercase tracking-wide text-slate-500">Time</p>
                <p className="mt-1 text-base font-bold text-slate-900">{recipe.cookingtime} min</p>
              </div>
              <div className="rounded-2xl border border-sky-200 bg-sky-100/70 px-3 py-2.5">
                <p className="text-[11px] uppercase tracking-wide text-slate-600">Servings</p>
                <p className="mt-1 text-base font-bold text-slate-900">
                  {recipe.servings_amount
                    ? `${recipe.servings_amount} ${recipe.servings_unit ?? ""}`.trim()
                    : "Not set"}
                </p>
              </div>
            </div>
            <div className="min-h-0 overflow-y-auto px-5 py-5">
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
                Ingredients
              </h3>
              <ul className="mb-6 space-y-2.5">
                {recipe.ingredients.map((ingredient, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between rounded-2xl border border-[#e3eaf5] bg-white px-3 py-2.5 text-sm text-slate-800"
                  >
                    <span className="pr-2 font-medium">{ingredient.name}</span>
                    <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500">
                      {ingredient.quantity} {ingredient.unit}
                    </span>
                  </li>
                ))}
              </ul>

              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
                Instructions
              </h3>
              <div className="rounded-2xl border border-[#e3eaf5] bg-white p-4">
                <p className="whitespace-pre-line text-sm leading-relaxed text-slate-800">
                  {recipe.instructions}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
