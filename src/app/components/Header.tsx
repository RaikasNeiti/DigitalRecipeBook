import { useState } from "react";

const navLinks = [
  { label: "Home", href: "#" },
  { label: "Recipe Roulette", href: "#" },
  { label: "Shopping List", href: "#" },
  { label: "Calendar", href: "#" },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-400">
            <img src="/cutlery-icon.svg" alt="" className="h-5 w-5 invert" />
          </span>
          <span className="text-lg font-semibold tracking-tight text-slate-900">
            Digital Recipe Book
          </span>
        </div>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 sm:flex">
          {navLinks.map((link, index) => (
            <a
              key={link.label}
              href={link.href}
              className={`text-sm font-medium transition ${
                index === 0 ? "text-slate-900" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Mobile burger button */}
        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className="flex h-9 w-9 items-center justify-center rounded-full text-slate-600 transition hover:bg-slate-100 sm:hidden"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5">
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu panel */}
      {isMenuOpen && (
        <nav className="flex flex-col gap-1 border-t border-slate-200 bg-white px-6 py-3 sm:hidden">
          {navLinks.map((link, index) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setIsMenuOpen(false)}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                index === 0
                  ? "bg-amber-50 text-slate-900"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
