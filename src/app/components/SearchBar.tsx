interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function SearchBar({ searchQuery, onSearchChange }: SearchBarProps) {
  return (
    <div className="flex justify-center p-4">
      <input
        type="text"
        placeholder="Search recipes..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full max-w-lg p-3 rounded-full bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}