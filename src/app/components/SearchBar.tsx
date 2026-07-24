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
    <div className="mx-auto w-full max-w-6xl px-6 pt-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center">
            <img
              src="/search-icon.svg"
              alt=""
              className="h-4 w-4 opacity-40"
            />
          </span>
          <input
            type="text"
            placeholder="Search any recipe"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-full border border-slate-200 bg-white py-2.5 pl-11 pr-4 text-sm text-slate-900 placeholder-slate-400 shadow-sm outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
          />
        </div>
        <button
          type="button"
          onClick={onOpenFilters}
          aria-label="Open filters"
          title="Open filters"
          className="relative inline-flex h-10 w-10 items-center justify-center rounded-full bg-amber-400 text-white shadow-sm transition hover:bg-amber-500"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.2}
            className="h-5 w-5 text-white"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"
            />
          </svg>
          {activeFilterCount > 0 && (
            <span className="absolute -right-1 -top-1 rounded-full bg-white px-1.5 py-0.5 text-[11px] font-semibold leading-none text-amber-600">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {activeFilters.length > 0 && (
        <div className="mt-3 flex items-center gap-2 overflow-x-auto whitespace-nowrap pb-1">
          <span className="text-xs font-medium text-slate-500">Active:</span>
          {activeFilters.map((filter) => (
            <button
              key={filter.key}
              type="button"
              onClick={() => onRemoveFilter(filter.key)}
              className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700 transition hover:bg-amber-100"
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
