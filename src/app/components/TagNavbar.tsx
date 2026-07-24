import React from "react";

interface TagNavbarProps {
  tags: string[];
  selectedTag: string | null;
  onTagSelect: (tag: string | null) => void;
}

const TagNavbar: React.FC<TagNavbarProps> = ({ tags, selectedTag, onTagSelect }) => {
  return (
    <div className="mx-auto max-w-6xl px-6 py-4">
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
    </div>
  );
};

export default TagNavbar;
