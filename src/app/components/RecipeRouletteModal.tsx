import React, { useMemo, useRef, useState } from "react";

export interface RouletteRecipe {
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

interface RecipeRouletteModalProps {
  recipes: RouletteRecipe[];
  availableTags: string[];
  onClose: () => void;
  onViewRecipe: (recipe: RouletteRecipe) => void;
}

type Rarity = {
  name: string;
  color: string;
  weight: number;
};

const RARITIES: Rarity[] = [
  { name: "Common", color: "#9ca3af", weight: 40 },
  { name: "Mil-Spec", color: "#4b69ff", weight: 28 },
  { name: "Restricted", color: "#8847ff", weight: 18 },
  { name: "Classified", color: "#d32ce6", weight: 10 },
  { name: "Covert", color: "#eb4b4b", weight: 3 },
  { name: "Legendary", color: "#ffd700", weight: 1 },
];

const TOTAL_WEIGHT = RARITIES.reduce((sum, r) => sum + r.weight, 0);

function pickRarity(): Rarity {
  let roll = Math.random() * TOTAL_WEIGHT;
  for (const rarity of RARITIES) {
    if (roll < rarity.weight) return rarity;
    roll -= rarity.weight;
  }
  return RARITIES[0];
}

const TILE_WIDTH = 128;
const TILE_GAP = 12;
const SLOT = TILE_WIDTH + TILE_GAP;
const REEL_LENGTH = 60;
const WINNER_INDEX = 48;
const SPIN_DURATION_MS = 6500;

type Tile = { key: string; recipe: RouletteRecipe; rarity: Rarity };
type Phase = "idle" | "spinning" | "revealed";

export default function RecipeRouletteModal({
  recipes,
  availableTags,
  onClose,
  onViewRecipe,
}: RecipeRouletteModalProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [phase, setPhase] = useState<Phase>("idle");
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [winner, setWinner] = useState<Tile | null>(null);
  const [translateX, setTranslateX] = useState(0);
  const [transitionEnabled, setTransitionEnabled] = useState(false);

  const viewportRef = useRef<HTMLDivElement>(null);

  const pool = useMemo(() => {
    if (selectedTags.length === 0) return recipes;
    return recipes.filter((recipe) => selectedTags.some((tag) => recipe.tags?.includes(tag)));
  }, [recipes, selectedTags]);

  const toggleTag = (tag: string) => {
    if (phase === "spinning") return;
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const startSpin = () => {
    if (pool.length === 0 || phase === "spinning") return;

    const winnerRecipe = pool[Math.floor(Math.random() * pool.length)];
    const nextTiles: Tile[] = [];
    for (let i = 0; i < REEL_LENGTH; i++) {
      const recipe = i === WINNER_INDEX ? winnerRecipe : pool[Math.floor(Math.random() * pool.length)];
      nextTiles.push({ key: `${i}-${recipe.id}-${Math.random()}`, recipe, rarity: pickRarity() });
    }

    setTiles(nextTiles);
    setWinner(nextTiles[WINNER_INDEX]);
    setPhase("spinning");
    setTransitionEnabled(false);
    setTranslateX(0);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const width = viewportRef.current?.clientWidth ?? 700;
        const winnerCenter = TILE_GAP + WINNER_INDEX * SLOT + TILE_WIDTH / 2;
        const jitter = (Math.random() - 0.5) * (TILE_WIDTH * 0.5);
        const target = -(winnerCenter - width / 2 + jitter);
        setTransitionEnabled(true);
        setTranslateX(target);
      });
    });
  };

  const handleTransitionEnd = (event: React.TransitionEvent<HTMLDivElement>) => {
    if (event.propertyName !== "transform" || phase !== "spinning") return;
    setPhase("revealed");
  };

  const handleSpinAgain = () => {
    setPhase("idle");
    setWinner(null);
    setTiles([]);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4"
      onClick={phase === "spinning" ? undefined : onClose}
    >
      <div
        className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Recipe Roulette</h2>
            <p className="mt-0.5 text-sm text-slate-500">
              Can&apos;t decide what to cook? Open the case and find out.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            disabled={phase === "spinning"}
            className="rounded-full p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-5 overflow-y-auto px-6 py-5">
          {availableTags.length > 0 && (
            <div>
              <p className="mb-2 text-sm font-medium text-slate-700">Filter by tags (optional)</p>
              <div className="flex flex-wrap gap-2">
                {availableTags.map((tag) => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      disabled={phase === "spinning"}
                      className={`rounded-full px-4 py-1.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${
                        isSelected
                          ? "bg-amber-400 text-white"
                          : "border border-slate-200 bg-white text-slate-600 hover:border-amber-300"
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Case-opening reel */}
          <div
            ref={viewportRef}
            className="relative h-44 w-full overflow-hidden rounded-xl border border-slate-800 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950"
          >
            {/* Center marker */}
            <div className="pointer-events-none absolute left-1/2 top-0 z-20 h-full w-0.5 -translate-x-1/2 bg-amber-400 shadow-[0_0_12px_2px_rgba(251,191,36,0.8)]" />
            <div className="pointer-events-none absolute left-1/2 top-0 z-20 h-0 w-0 -translate-x-1/2 border-x-8 border-t-8 border-x-transparent border-t-amber-400" />
            <div className="pointer-events-none absolute left-1/2 bottom-0 z-20 h-0 w-0 -translate-x-1/2 border-x-8 border-b-8 border-x-transparent border-b-amber-400" />

            {/* Fade edges */}
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-slate-950 to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-slate-950 to-transparent" />

            {phase === "idle" ? (
              <div className="flex h-full items-center justify-center px-6 text-center">
                <p className="text-sm text-slate-400">
                  {pool.length === 0
                    ? "No recipes match these tags."
                    : `${pool.length} recipe${pool.length === 1 ? "" : "s"} in the pool. Open the case to spin!`}
                </p>
              </div>
            ) : (
              <div
                className="flex h-full items-center"
                style={{
                  transform: `translateX(${translateX}px)`,
                  transition: transitionEnabled
                    ? `transform ${SPIN_DURATION_MS}ms cubic-bezier(0.12, 0.75, 0.185, 1)`
                    : "none",
                  gap: `${TILE_GAP}px`,
                  paddingLeft: `${TILE_GAP}px`,
                }}
                onTransitionEnd={handleTransitionEnd}
              >
                {tiles.map((tile, index) => {
                  const isWinner = phase === "revealed" && index === WINNER_INDEX;
                  return (
                    <div
                      key={tile.key}
                      className={`flex shrink-0 flex-col overflow-hidden rounded-lg border-t-4 bg-slate-800 ${
                        isWinner ? "roulette-glow" : ""
                      }`}
                      style={
                        {
                          width: `${TILE_WIDTH}px`,
                          height: "152px",
                          borderTopColor: tile.rarity.color,
                          "--glow-color": `${tile.rarity.color}99`,
                        } as React.CSSProperties
                      }
                    >
                      <div className="h-24 w-full shrink-0 overflow-hidden bg-slate-700">
                        {tile.recipe.image ? (
                          <img
                            src={tile.recipe.image}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-2xl">
                            🍽️
                          </div>
                        )}
                      </div>
                      <div className="flex flex-1 items-center px-2 py-1.5">
                        <p className="line-clamp-2 text-xs font-medium leading-tight text-white">
                          {tile.recipe.name}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Winner reveal */}
          {phase === "revealed" && winner && (
            <div
              className="roulette-reveal flex items-center gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4"
              style={{ borderColor: winner.rarity.color }}
            >
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-slate-200">
                {winner.recipe.image ? (
                  <img src={winner.recipe.image} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xl">🍽️</div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p
                  className="text-xs font-semibold uppercase tracking-wide"
                  style={{ color: winner.rarity.color }}
                >
                  {winner.rarity.name} pull
                </p>
                <h3 className="truncate text-lg font-semibold text-slate-900">
                  {winner.recipe.name}
                </h3>
                <p className="text-sm text-slate-500">⏱ {winner.recipe.cookingtime} minutes</p>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-end gap-3 border-t border-slate-100 px-6 py-4">
          {phase === "revealed" && winner ? (
            <>
              <button
                type="button"
                onClick={handleSpinAgain}
                className="rounded-full px-5 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
              >
                Spin Again
              </button>
              <button
                type="button"
                onClick={() => onViewRecipe(winner.recipe)}
                className="rounded-full bg-amber-400 px-5 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-amber-500"
              >
                View Recipe
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={startSpin}
              disabled={pool.length === 0 || phase === "spinning"}
              className="rounded-full bg-amber-400 px-6 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-amber-500 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {phase === "spinning" ? "Opening..." : "Open Case"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
