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
    <button
      onClick={onClick}
      className="group rise-in flex h-full flex-col overflow-hidden rounded-3xl border border-white/80 bg-white/72 text-left shadow-[0_14px_32px_rgba(30,64,175,0.14)] backdrop-blur transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_38px_rgba(30,64,175,0.2)]"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-100">
        {recipe.image ? (
          <img
            src={recipe.image}
            alt={recipe.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm font-medium text-zinc-500">
            No Image
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        {recipe.tags && recipe.tags.length > 0 && (
          <span className="absolute left-3 top-3 rounded-full bg-white/88 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-700 backdrop-blur">
            {recipe.tags[0]}
          </span>
        )}
        <span className="absolute bottom-3 right-3 rounded-full bg-white/88 px-3 py-1 text-xs font-semibold text-slate-900 shadow-sm backdrop-blur">
          {recipe.cookingtime} min
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2.5 p-4">
        <div className="flex items-start justify-between gap-2">
          <h2 className="line-clamp-1 text-base font-bold text-slate-900">{recipe.name}</h2>
        </div>
        <p className="text-xs text-slate-500">Tap to open full recipe details.</p>
        {recipe.tags && recipe.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {recipe.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-sky-200 bg-sky-100/80 px-2.5 py-0.5 text-xs font-semibold text-slate-700"
              >
                {tag}
              </span>
            ))}
            {recipe.tags.length > 3 && (
              <span className="rounded-full border border-white/80 bg-white/85 px-2.5 py-0.5 text-xs font-semibold text-slate-500">
                +{recipe.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </button>
  );
}
