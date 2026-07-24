import React from "react";

interface TagNavbarProps {
  tags: string[];
  selectedTag: string | null;
  onTagSelect: (tag: string | null) => void;
  onAddRecipe: () => void; // Add the new prop
}

const TagNavbar: React.FC<TagNavbarProps> = ({ tags, selectedTag, onTagSelect, onAddRecipe }) => {
  return (
    <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
      <div className="flex flex-1 gap-2 overflow-x-auto pb-1">
        {tags.map((tag) => {
          const isSelected = selectedTag === tag;
          return (
            <button
              key={tag}
              className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition ${
                isSelected
                  ? "bg-amber-400 text-white shadow-sm"
                  : "bg-white text-slate-600 border border-slate-200 hover:border-amber-300 hover:text-slate-900"
              }`}
              onClick={() => onTagSelect(isSelected ? null : tag)}
            >
              {tag}
            </button>
          );
        })}
      </div>
      {/* Add Recipe Button */}
      <button
        className="flex shrink-0 items-center gap-1.5 rounded-full bg-slate-900 px-5 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-slate-700"
        onClick={onAddRecipe} // Use the passed function
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="h-4 w-4"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        Add Recipe
      </button>
    </div>
  );
};

export default TagNavbar;
