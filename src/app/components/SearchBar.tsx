interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenFilters: () => void;
  activeFilterCount: number;
  activeFilters: { key: string; label: string }[];
  onRemoveFilter: (key: string) => void;
}

export default function SearchBar({
  searchQuery,
  onSearchChange,
  onOpenFilters,
  activeFilterCount,
  activeFilters,
  onRemoveFilter,
}: SearchBarProps) {
  return (
    <div className="mx-auto w-full max-w-6xl px-5 pt-5 sm:px-6 sm:pt-6">
      <div className="glass-panel flex items-center gap-3 rounded-3xl p-3 sm:p-4">
        <div className="relative min-w-0 flex-1">
          <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center">
            <img
              src="/search-icon.svg"
              alt=""
              className="h-4 w-4 opacity-60"
            />
          </span>
          <input
            type="text"
            placeholder="Search any recipe"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-2xl border border-white/80 bg-white/85 py-3 pl-11 pr-4 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-sky-300 focus:ring-2 focus:ring-sky-100"
          />
        </div>
        <button
          type="button"
          onClick={onOpenFilters}
          aria-label="Open filters"
          title="Open filters"
          className="relative inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/80 bg-white/90 text-slate-900 shadow-[0_10px_20px_rgba(30,64,175,0.18)] transition hover:scale-[1.02] hover:bg-white"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.2}
            className="h-5 w-5 text-zinc-900"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"
            />
          </svg>
          {activeFilterCount > 0 && (
            <span className="absolute -right-1.5 -top-1.5 rounded-full border border-sky-200 bg-sky-100 px-1.5 py-0.5 text-[11px] font-bold leading-none text-slate-900">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {activeFilters.length > 0 && (
        <div className="mt-3 flex items-center gap-2 overflow-x-auto whitespace-nowrap pb-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Active</span>
          {activeFilters.map((filter) => (
            <button
              key={filter.key}
              type="button"
              onClick={() => onRemoveFilter(filter.key)}
              className="inline-flex items-center gap-1 rounded-full border border-sky-200 bg-sky-100/80 px-3 py-1 text-xs font-semibold text-slate-700 transition hover:bg-sky-100"
              title="Remove filter"
              aria-label={`Remove ${filter.label} filter`}
            >
              {filter.label}
              <span aria-hidden="true">x</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
