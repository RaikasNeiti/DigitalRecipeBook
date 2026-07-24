export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-400">
            <img
              src="/cutlery-icon.svg"
              alt=""
              className="h-5 w-5 invert"
            />
          </span>
          <span className="text-lg font-semibold tracking-tight text-slate-900">
            Digital Recipe Book
          </span>
        </div>
        <nav className="hidden items-center gap-8 sm:flex">
          <a href="#" className="text-sm font-medium text-slate-900">
            Home
          </a>
          <a
            href="#"
            className="text-sm font-medium text-slate-500 transition hover:text-slate-900"
          >
            Recipe Roulette
          </a>
          <a
            href="#"
            className="text-sm font-medium text-slate-500 transition hover:text-slate-900"
          >
            Shopping List
          </a>
        </nav>
      </div>
    </header>
  );
}
