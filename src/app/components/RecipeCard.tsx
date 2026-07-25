import { getTagClassName } from "./tagColor";

interface RecipeCardProps {
  recipe: {
    id: number;
    name: string;
    cookingtime: string;
    tags?: string[];
    image?: string;
  };
  isFavorited: boolean;
  onToggleFavorite: (recipeId: number) => void;
  onClick: () => void;
}

export default function RecipeCard({
  recipe,
  isFavorited,
  onToggleFavorite,
  onClick,
}: RecipeCardProps) {
  return (
    <button
      onClick={onClick}
      className="group rise-in flex h-full flex-col overflow-hidden rounded-[22px] border border-white/90 bg-white/95 text-left shadow-[0_14px_30px_rgba(148,163,184,0.2)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_36px_rgba(148,163,184,0.26)]"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-100">
        {recipe.image ? (
          <img
            src={recipe.image}
            alt={recipe.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm font-medium text-zinc-500">
            No Image
          </div>
        )}
        <span
          role="button"
          tabIndex={0}
          aria-label={isFavorited ? `Remove ${recipe.name} from favorites` : `Add ${recipe.name} to favorites`}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            onToggleFavorite(recipe.id);
          }}
          onKeyDown={(event) => {
            if (event.key !== "Enter" && event.key !== " ") {
              return;
            }
            event.preventDefault();
            event.stopPropagation();
            onToggleFavorite(recipe.id);
          }}
          className={`absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full shadow-[0_10px_24px_rgba(15,23,42,0.08)] transition ${
            isFavorited
              ? "bg-rose-100 text-rose-500"
              : "bg-white/95 text-slate-500 hover:bg-rose-50 hover:text-rose-500"
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill={isFavorited ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="h-3.5 w-3.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 8.25c0-2.485-2.015-4.5-4.5-4.5-1.74 0-3.25.988-4 2.433-.75-1.445-2.26-2.433-4-2.433-2.485 0-4.5 2.015-4.5 4.5 0 6.375 8.5 11.25 8.5 11.25S21 14.625 21 8.25Z" />
          </svg>
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <span className="inline-flex items-center gap-1 text-[11px] text-slate-400">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.9} stroke="currentColor" className="h-3.5 w-3.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2m6-2a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z" />
          </svg>
          {recipe.cookingtime} min
        </span>

        <div className="mt-3 flex items-start justify-between gap-3">
          <h2 className="line-clamp-2 text-[22px] font-semibold leading-7 tracking-tight text-slate-900">{recipe.name}</h2>
        </div>

        <div className="mt-auto flex items-end gap-2 pt-4">
          {recipe.tags && recipe.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5">
              {recipe.tags.map((tag) => (
                <span
                  key={tag}
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium ${getTagClassName(tag)}`}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </button>
  );
}
