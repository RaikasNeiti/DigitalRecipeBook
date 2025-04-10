import React from "react";

interface TagNavbarProps {
  tags: string[];
  selectedTag: string | null;
  onTagSelect: (tag: string | null) => void;
  onAddRecipe: () => void; // Add the new prop
}

const TagNavbar: React.FC<TagNavbarProps> = ({ tags, selectedTag, onTagSelect, onAddRecipe }) => {
  return (
    <div className="flex justify-center items-center px-8 py-4">
      <div className="flex space-x-4">
        {tags.map((tag) => (
          <button
            key={tag}
            className={`text-lg text-gray-600 font-medium ${
              selectedTag === tag ? "border-b-2 border-yellow-400" : "text-gray-300"
            } hover:text-black`}
            onClick={() => onTagSelect(selectedTag === tag ? null : tag)}
          >
            {tag}
          </button>
        ))}
      </div>
      {/* Add Recipe Button */}
      <button
        className="bg-yellow-400 text-white px-6 py-2 rounded-full font-medium hover:bg-yellow-500 transition ml-8"
        onClick={onAddRecipe} // Use the passed function
      >
        Add Recipe
      </button>
    </div>
  );
};

export default TagNavbar;