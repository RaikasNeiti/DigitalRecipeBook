import React from "react";

interface TagNavbarProps {
  tags: string[];
  selectedTag: string | null;
  onTagSelect: (tag: string | null) => void;
}

const TagNavbar: React.FC<TagNavbarProps> = ({ tags, selectedTag, onTagSelect }) => {
  return (
    <div className="mx-auto max-w-6xl px-5 py-4 sm:px-6">
      <div className="glass-panel flex flex-1 gap-2 overflow-x-auto rounded-3xl p-3">
        {tags.map((tag) => {
          const isSelected = selectedTag === tag;
          return (
            <button
              key={tag}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
                isSelected
                  ? "bg-slate-900 text-white shadow-[0_8px_16px_rgba(15,23,42,0.22)]"
                  : "border border-white/80 bg-white/80 text-slate-700 hover:border-sky-200 hover:bg-sky-50"
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
