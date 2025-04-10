interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function SearchBar({ searchQuery, onSearchChange }: SearchBarProps) {
  return (
    <div className="py-4 px-8 flex justify-center">
        <div className="relative w-[50%]">
          <span className="absolute inset-y-0 left-3 flex items-center">
            <img
              src="/search-icon.svg"
              alt="Search Icon"
              className="w-5 h-5 text-gray-500"
            />
          </span>
          <input
            type="text"
            placeholder="Search any recipe"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full p-2 pl-10 rounded-full bg-gray-200 placeholder-gray-600"
          />
        </div>
    </div>
  );
}

