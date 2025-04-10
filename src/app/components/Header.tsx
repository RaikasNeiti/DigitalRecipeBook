export default function Header() {
    return (
      <div className="p-4">
        <header
          className="bg-yellow-400 rounded-full text-black px-12 py-4 flex items-center"
          style={{ height: "64px" }}
        >
          <div className="flex items-center space-x-16">
            {/* Logo */}
            <img
              src="/cutlery-icon.svg"
              alt="Digital Recipe Book Logo"
              className="w-14 h-14 filter invert"
            />
            <nav className="flex space-x-8">
              <a href="#" className="text-lg font-bold text-white">Home</a>
              <a href="#" className="text-lg text-white/70 hover:text-white/90">Recipe Roulette</a>
              <a href="#" className="text-lg text-white/70 hover:text-white/90">Shopping List</a>
            </nav>
          </div>
        </header>
      </div>
    );
  }