import { useState } from "react";

interface HeaderProps {
  onRouletteClick?: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function Header({ onRouletteClick, searchQuery, onSearchChange }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks: { label: string; href?: string; onClick?: () => void }[] = [
    { label: "Home", href: "#" },
    ...(onRouletteClick ? [{ label: "Recipe Roulette", onClick: onRouletteClick }] : []),
    { label: "Shopping List", href: "#" },
    { label: "Calendar", href: "#" },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-white/70 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-20 w-full max-w-[1500px] items-center gap-4 px-5 sm:px-6">
        <div className="flex shrink-0 items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#417df6]/14 shadow-[0_6px_14px_rgba(65,125,246,0.25)]">
            <img src="/cutlery-icon.svg" alt="" className="h-4.5 w-4.5" />
          </span>
          <span className="text-lg font-semibold tracking-tight text-slate-900">Digital Recipe Book</span>
        </div>

        <div className="hidden flex-1 justify-center md:flex">
          <div className="relative w-full max-w-[520px]">
            <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="h-4 w-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.35-4.35m0 0A7.5 7.5 0 1 0 6 6a7.5 7.5 0 0 0 10.65 10.65Z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search any recipe..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="h-11 w-full rounded-full border border-white/80 bg-white pl-11 pr-4 text-sm text-slate-900 shadow-[0_2px_8px_rgba(15,23,42,0.05)] outline-none transition focus:border-[#417df6] focus:ring-2 focus:ring-[#417df6]/20"
            />
          </div>
        </div>

        <nav className="ml-auto hidden items-center gap-6 lg:flex">
          {navLinks.map((link, index) =>
            link.onClick ? (
              <button
                key={link.label}
                type="button"
                onClick={link.onClick}
                className="border-b border-transparent px-1 py-1 text-xs font-medium text-slate-700 transition hover:border-[#417df6] hover:text-[#417df6]"
              >
                {link.label}
              </button>
            ) : (
              <a
                key={link.label}
                href={link.href}
                className={`border-b px-1 py-1 text-xs font-medium transition ${
                  index === 0
                    ? "border-[#417df6] text-[#417df6]"
                    : "border-transparent text-slate-700 hover:border-[#417df6] hover:text-[#417df6]"
                }`}
              >
                {link.label}
              </a>
            )
          )}
        </nav>

        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className="ml-auto flex h-10 w-10 items-center justify-center rounded-xl border border-white/80 bg-white text-slate-700 transition hover:bg-[#417df6]/10 lg:hidden"
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

      {isMenuOpen && (
        <div className="rise-in mx-5 mb-4 space-y-2 rounded-2xl border border-white/80 bg-white p-3 shadow-[0_12px_28px_rgba(30,64,175,0.12)] lg:hidden">
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="h-4 w-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.35-4.35m0 0A7.5 7.5 0 1 0 6 6a7.5 7.5 0 0 0 10.65 10.65Z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search any recipe..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="h-10 w-full rounded-full border border-white/80 bg-white pl-10 pr-3 text-sm text-slate-900 outline-none transition focus:border-[#417df6] focus:ring-2 focus:ring-[#417df6]/20"
            />
          </div>

          <nav className="flex flex-col gap-1">
          {navLinks.map((link, index) =>
            link.onClick ? (
              <button
                key={link.label}
                type="button"
                onClick={() => {
                  setIsMenuOpen(false);
                  link.onClick?.();
                }}
                className="rounded-xl px-3 py-2 text-left text-sm font-semibold text-slate-700 transition hover:bg-[#417df6]/10 hover:text-[#417df6]"
              >
                {link.label}
              </button>
            ) : (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={`rounded-xl px-3 py-2 text-sm font-medium transition ${
                  index === 0
                    ? "bg-[#417df6]/14 text-[#417df6]"
                    : "text-slate-700 hover:bg-[#417df6]/10 hover:text-[#417df6]"
                }`}
              >
                {link.label}
              </a>
            )
          )}
          </nav>
        </div>
      )}
    </header>
  );
}
