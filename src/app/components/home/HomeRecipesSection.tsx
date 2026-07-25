import RecipeCard from "../RecipeCard";

interface RecipeListItem {
  id: number;
  name: string;
  cookingtime: string;
  ingredients: { name: string; quantity: string; unit: string }[];
  instructions: string;
  tags?: string[];
  image?: string;
  servings_amount?: string | number;
  servings_unit?: string;
}

interface HomeRecipesSectionProps {
  recipes: RecipeListItem[];
  favoriteRecipeIds: Set<number>;
  onToggleFavorite: (recipeId: number) => void;
  onOpenRecipe: (recipe: RecipeListItem) => void;
}

export default function HomeRecipesSection({
  recipes,
  favoriteRecipeIds,
  onToggleFavorite,
  onOpenRecipe,
}: HomeRecipesSectionProps) {
  return (
    <section className="w-full pt-8">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <h2 className="font-sans text-[36px] font-semibold tracking-[-0.01em] text-slate-900">Recipes</h2>
          <span className="text-[#417df6]">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5 19.5 4.5M10.5 4.5h9v9" />
            </svg>
          </span>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <button type="button" className="inline-flex h-11 items-center gap-2 rounded-full border border-white/80 bg-white/90 px-5 text-sm font-semibold text-slate-700 shadow-sm">
            Latest added
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="h-4 w-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
            </svg>
          </button>
          <div className="inline-flex items-center gap-1 rounded-full border border-white/80 bg-white/90 p-1 shadow-sm">
            <button type="button" className="flex h-9 w-9 items-center justify-center rounded-full bg-[#417df6]/10 text-[#417df6]">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                <path d="M4 4h6v6H4V4Zm0 10h6v6H4v-6Zm10-10h6v6h-6V4Zm0 10h6v6h-6v-6Z" />
              </svg>
            </button>
            <button type="button" className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.9} stroke="currentColor" className="h-4 w-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 6.75h15M4.5 12h15M4.5 17.25h15" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {recipes.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              isFavorited={favoriteRecipeIds.has(recipe.id)}
              onToggleFavorite={onToggleFavorite}
              onClick={() => onOpenRecipe(recipe)}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-[28px] border border-dashed border-slate-300/70 bg-white/50 py-20 text-center">
          <p className="text-lg font-bold text-slate-900">No recipes found</p>
          <p className="mt-1 text-sm text-slate-600">Try another search or filter combination.</p>
        </div>
      )}
    </section>
  );
}
