import { useState } from "react";

interface HeaderProps {
  onRouletteClick?: () => void;
}

export default function Header({ onRouletteClick }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks: { label: string; href?: string; onClick?: () => void }[] = [
    { label: "Home", href: "#" },
    ...(onRouletteClick ? [{ label: "Recipe Roulette", onClick: onRouletteClick }] : []),
    { label: "Shopping List", href: "#" },
    { label: "Calendar", href: "#" },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-white/70 bg-white/55 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-5 sm:px-6">
        <div className="flex items-center gap-3.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-100 shadow-[0_6px_18px_rgba(56,189,248,0.25)]">
            <img src="/cutlery-icon.svg" alt="" className="h-5 w-5" />
          </span>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
              Kitchen Archive
            </p>
            <span className="text-lg font-bold tracking-tight text-slate-900">Digital Recipe Book</span>
          </div>
        </div>

        <nav className="hidden items-center gap-2 rounded-full border border-white/80 bg-white/70 p-1.5 shadow-sm backdrop-blur sm:flex">
          {navLinks.map((link, index) =>
            link.onClick ? (
              <button
                key={link.label}
                type="button"
                onClick={link.onClick}
                className="rounded-full px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-sky-100 hover:text-slate-900"
              >
                {link.label}
              </button>
            ) : (
              <a
                key={link.label}
                href={link.href}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  index === 0
                    ? "bg-slate-900 text-white"
                    : "text-slate-700 hover:bg-sky-100 hover:text-slate-900"
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
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/80 bg-white/80 text-slate-700 transition hover:bg-sky-100 sm:hidden"
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
        <nav className="rise-in mx-5 mb-4 flex flex-col gap-1 rounded-2xl border border-white/80 bg-white/90 p-2 shadow-[0_12px_28px_rgba(30,64,175,0.15)] backdrop-blur sm:hidden">
          {navLinks.map((link, index) =>
            link.onClick ? (
              <button
                key={link.label}
                type="button"
                onClick={() => {
                  setIsMenuOpen(false);
                  link.onClick?.();
                }}
                className="rounded-xl px-3 py-2 text-left text-sm font-semibold text-slate-700 transition hover:bg-sky-100 hover:text-slate-900"
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
                    ? "bg-slate-900 text-white"
                    : "text-slate-700 hover:bg-sky-100 hover:text-slate-900"
                }`}
              >
                {link.label}
              </a>
            )
          )}
        </nav>
      )}
    </header>
  );
}
