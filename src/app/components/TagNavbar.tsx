import React from "react";

interface TagNavbarProps {
  tags: string[];
  selectedTag: string | null;
  onTagSelect: (tag: string | null) => void;
}

const TagNavbar: React.FC<TagNavbarProps> = ({ tags, selectedTag, onTagSelect }) => {
  return (
    <div className="flex justify-center space-x-4 py-4">
      {tags.map((tag) => (
        <button
          key={tag}
          className={`text-lg font-medium ${
            selectedTag === tag ? "border-b-2 border-white" : "text-gray-400"
          } hover:text-white`}
          onClick={() => onTagSelect(selectedTag === tag ? null : tag)}
        >
          {tag}
        </button>
      ))}
    </div>
  );
};

export default TagNavbar;