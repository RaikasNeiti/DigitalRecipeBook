import { useEffect, useState } from "react";

export interface AdvancedFilters {
  minCookingTime: string;
  maxCookingTime: string;
  ingredientQuery: string;
  selectedTags: string[];
}

interface AdvancedFiltersModalProps {
  isOpen: boolean;
  filters: AdvancedFilters;
  availableTags: string[];
  onClose: () => void;
  onApply: (filters: AdvancedFilters) => void;
  onReset: () => void;
}

const inputClass =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-100";

export default function AdvancedFiltersModal({
  isOpen,
  filters,
  availableTags,
  onClose,
  onApply,
  onReset,
}: AdvancedFiltersModalProps) {
  const [draftFilters, setDraftFilters] = useState<AdvancedFilters>(filters);

  useEffect(() => {
    if (isOpen) {
      setDraftFilters(filters);
    }
  }, [filters, isOpen]);

  if (!isOpen) {
    return null;
  }

  const toggleTag = (tag: string) => {
    setDraftFilters((prev) => {
      const isSelected = prev.selectedTags.includes(tag);
      return {
        ...prev,
        selectedTags: isSelected
          ? prev.selectedTags.filter((value) => value !== tag)
          : [...prev.selectedTags, tag],
      };
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4" onClick={onClose}>
      <div
        className="flex max-h-[90vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h2 className="text-xl font-semibold text-slate-900">Advanced Filters</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-full p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-5 overflow-y-auto px-6 py-5">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Cooking Time (minutes)</label>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <input
                type="number"
                min="0"
                placeholder="Min"
                value={draftFilters.minCookingTime}
                onChange={(event) =>
                  setDraftFilters((prev) => ({ ...prev, minCookingTime: event.target.value }))
                }
                className={inputClass}
              />
              <input
                type="number"
                min="0"
                placeholder="Max"
                value={draftFilters.maxCookingTime}
                onChange={(event) =>
                  setDraftFilters((prev) => ({ ...prev, maxCookingTime: event.target.value }))
                }
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700" htmlFor="ingredient-filter">
              Ingredient Contains
            </label>
            <input
              id="ingredient-filter"
              type="text"
              placeholder="e.g. chicken, garlic"
              value={draftFilters.ingredientQuery}
              onChange={(event) =>
                setDraftFilters((prev) => ({ ...prev, ingredientQuery: event.target.value }))
              }
              className={inputClass}
            />
            <p className="mt-1 text-xs text-slate-500">Use commas to include multiple ingredients.</p>
          </div>

          <div>
            <p className="mb-2 text-sm font-medium text-slate-700">Recipe Tags</p>
            <div className="flex flex-wrap gap-2">
              {availableTags.map((tag) => {
                const isSelected = draftFilters.selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
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
        </div>

        <div className="flex flex-wrap items-center justify-end gap-3 border-t border-slate-100 px-6 py-4">
          <button
            type="button"
            onClick={() => {
              onReset();
              onClose();
            }}
            className="rounded-full px-5 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full px-5 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onApply(draftFilters);
              onClose();
            }}
            className="rounded-full bg-amber-400 px-5 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-amber-500"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}
