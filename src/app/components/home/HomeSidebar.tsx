interface HomeSidebarProps {
  quickFilterTags: string[];
  onOpenRoulette: () => void;
  selectedView: "all" | "favorites";
  onSelectView: (view: "all" | "favorites") => void;
  selectedCategory: string | null;
  onSelectCategory: (tag: string | null) => void;
}

const categoryIconPaths: Record<string, string[]> = {
  appetizers: [
    "M3.75 11.25h16.5m-13.5 0V9.75A3.75 3.75 0 0 1 10.5 6h3a3.75 3.75 0 0 1 3.75 3.75v1.5m-12 0-.45 4.05A2.25 2.25 0 0 0 7.04 17.75h9.92a2.25 2.25 0 0 0 2.24-2.45l-.45-4.05",
  ],
  dessert: ["M7.5 10.5h9M6 10.5a2.25 2.25 0 0 1 2.25-2.25h7.5A2.25 2.25 0 0 1 18 10.5v1.5H6v-1.5Zm1.5 1.5h9l-.75 6.75H8.25L7.5 12Z"],
  dinner: ["M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12Zm0 0v1.5m-7.5-7.5H3m18 0h-1.5"],
  lunch: ["M4.5 12h15M6.75 12 9 7.5h6L17.25 12M6 12v4.5A1.5 1.5 0 0 0 7.5 18h9a1.5 1.5 0 0 0 1.5-1.5V12"],
  seafood: ["M3.75 12s2.5-4.5 8.25-4.5S20.25 12 20.25 12s-2.5 4.5-8.25 4.5S3.75 12 3.75 12Zm8.25 0h.008v.008H12V12Z"],
  vegan: [
    "M12 19.5c6 0 7.5-7.5 7.5-12-4.5 0-12 1.5-12 7.5 0 2.25 1.5 4.5 4.5 4.5Z",
    "M12 19.5c0-4.5 1.5-7.5 4.5-10.5",
  ],
  vegetarian: ["M12 20.25v-6m0 0c0-3.314 2.686-6 6-6v.75c0 3.314-2.686 6-6 6Zm0 0c0-3.314-2.686-6-6-6v.75c0 3.314 2.686 6 6 6Z"],
};

const defaultCategoryIconPaths = [
  "M12 3.75c-1.104 0-2 .896-2 2v1.19a7.501 7.501 0 0 0-4.53 10.89 2.25 2.25 0 0 0 1.98 1.17h9.1a2.25 2.25 0 0 0 1.98-1.17A7.501 7.501 0 0 0 14 6.94V5.75c0-1.104-.896-2-2-2Z",
];

function CategoryIcon({ tag, className }: { tag: string; className: string }) {
  const normalizedTag = tag.trim().toLowerCase();
  const paths = categoryIconPaths[normalizedTag] ?? defaultCategoryIconPaths;

  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className={className}>
      {paths.map((pathValue) => (
        <path key={pathValue} strokeLinecap="round" strokeLinejoin="round" d={pathValue} />
      ))}
    </svg>
  );
}

export default function HomeSidebar({
  quickFilterTags,
  onOpenRoulette,
  selectedView,
  onSelectView,
  selectedCategory,
  onSelectCategory,
}: HomeSidebarProps) {
  return (
    <aside className="glass-panel hidden h-[calc(100vh-2.5rem)] w-[236px] shrink-0 rounded-[34px] border border-white/85 px-4 py-5 lg:sticky lg:top-5 lg:flex lg:flex-col">
      <div className="flex items-center gap-3 px-2">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#417df6]/14 text-[#417df6] shadow-[0_10px_24px_rgba(65,125,246,0.22)]">
          <img src="/cutlery-icon.svg" alt="" className="h-6 w-6" />
        </span>
        <div>
          <p className="text-lg font-bold leading-tight text-slate-900">Digital</p>
          <p className="text-lg font-bold leading-tight text-slate-900">Recipe Book</p>
        </div>
      </div>

      <nav className="mt-8 space-y-2">
        <button
          type="button"
          onClick={() => {
            onSelectView("all");
            onSelectCategory(null);
          }}
          className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
            selectedView === "all" && selectedCategory === null
              ? "bg-[#417df6] text-white shadow-[0_10px_22px_rgba(65,125,246,0.32)]"
              : "text-slate-700 hover:bg-white/95 hover:text-[#2f5fd5]"
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 9 8.25-6 8.25 6v9a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18V9Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 21V12h4.5v9" />
          </svg>
          All Recipes
        </button>
        <button
          type="button"
          onClick={() => onSelectView("favorites")}
          className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
            selectedView === "favorites"
              ? "bg-[#417df6] text-white shadow-[0_10px_22px_rgba(65,125,246,0.32)]"
              : "text-slate-700 hover:bg-white/95 hover:text-[#2f5fd5]"
          }`}
          aria-pressed={selectedView === "favorites"}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.9} stroke="currentColor" className="h-4 w-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 8.25c0-2.485-2.015-4.5-4.5-4.5-1.74 0-3.25.988-4 2.433-.75-1.445-2.26-2.433-4-2.433-2.485 0-4.5 2.015-4.5 4.5 0 6.375 8.5 11.25 8.5 11.25S21 14.625 21 8.25Z" />
          </svg>
          Favorites
        </button>
      </nav>

      <div className="mt-7 border-t border-slate-200/80 pt-6">
        <p className="px-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Categories</p>
        <div className="mt-4 space-y-2">
          {quickFilterTags.map((tag) => (
              <button
                key={`side-${tag}`}
                type="button"
                onClick={() => onSelectCategory(selectedCategory === tag ? null : tag)}
                className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-2.5 text-left text-sm font-medium transition ${
                  selectedCategory === tag
                    ? "border-[#417df6] bg-[#417df6] text-white shadow-[0_10px_22px_rgba(65,125,246,0.3)]"
                    : "border-transparent text-slate-700 hover:border-[#417df6]/35 hover:bg-white/95 hover:text-[#2f5fd5]"
                }`}
                aria-pressed={selectedCategory === tag}
              >
                <span
                  className={`inline-flex h-8 w-8 items-center justify-center rounded-full shadow-sm ${
                    selectedCategory === tag
                      ? "bg-white/20 text-white"
                      : "bg-white/85 text-[#417df6]"
                  }`}
                >
                  <CategoryIcon tag={tag} className="h-4.5 w-4.5" />
                </span>
                {tag}
              </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={onOpenRoulette}
        className="relative mt-auto overflow-hidden rounded-[22px] border border-white/90 bg-[radial-gradient(circle_at_16%_14%,rgba(173,191,255,0.45)_0%,transparent_36%),radial-gradient(circle_at_88%_18%,rgba(205,190,255,0.42)_0%,transparent_30%),radial-gradient(circle_at_18%_84%,rgba(172,220,255,0.34)_0%,transparent_35%),radial-gradient(circle_at_74%_72%,rgba(175,161,255,0.32)_0%,transparent_34%),linear-gradient(144deg,#f5f8ff_0%,#eaf0ff_45%,#e5ecff_100%)] p-4 text-left shadow-[0_16px_32px_rgba(65,125,246,0.16)] transition hover:translate-y-[-1px]"
        aria-label="Open recipe roulette"
        title="Recipe Roulette"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_90%_82%,rgba(255,255,255,0.48)_0%,transparent_34%),radial-gradient(circle_at_36%_44%,rgba(255,255,255,0.24)_0%,transparent_42%)]" />
        <div className="relative z-10">
          <div className="relative flex items-start justify-between gap-3">
            <img
              src="/dice-icon.svg"
              alt=""
              aria-hidden="true"
              className="h-10 w-10 opacity-95 drop-shadow-[0_6px_16px_rgba(122,136,255,0.2)]"
            />
            <img
              src="/stars-icon.svg"
              alt=""
              aria-hidden="true"
              className="absolute left-11 top-0 h-3.5 w-3.5 text-[#a4b3ea] opacity-85"
            />
          </div>

          <h3 className="mt-5 font-sans text-[30px] font-semibold leading-[1.05] tracking-[-0.01em] text-slate-900">Recipe Roulette</h3>
          <p className="mt-3 font-sans text-lg font-normal leading-7 tracking-[-0.01em] text-slate-700">Can&apos;t decide what to cook?</p>
          <p className="font-sans text-lg font-normal leading-7 tracking-[-0.01em] text-slate-700">Let fate choose for you!</p>

          <div className="mt-5 flex justify-end">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[radial-gradient(circle_at_28%_24%,#5a95ff_0%,#417df6_46%,#5a66f8_74%,#7a59f4_100%)] text-white shadow-[0_12px_24px_rgba(65,125,246,0.46)]">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor" className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </span>
          </div>
        </div>
      </button>
    </aside>
  );
}
