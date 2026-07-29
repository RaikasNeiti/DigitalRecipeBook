interface HomeTopNavProps {
  onOpenRoulette: () => void;
  isAuthenticated: boolean;
  onLoginClick: () => void;
  onLogoutClick: () => void;
}

export default function HomeTopNav({
  onOpenRoulette,
  isAuthenticated,
  onLoginClick,
  onLogoutClick,
}: HomeTopNavProps) {
  return (
    <div className="sticky top-3 z-30 mb-5 flex items-center justify-between gap-4 rounded-2xl px-4 py-3 lg:mb-7">
      <div className="flex items-center gap-3 lg:hidden">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#417df6]/14 text-[#417df6] shadow-[0_10px_24px_rgba(65,125,246,0.22)]">
          <img src="/cutlery-icon.svg" alt="" className="h-5 w-5" />
        </span>
        <div>
          <p className="text-base font-bold leading-tight text-slate-900">Digital Recipe Book</p>
        </div>
      </div>

      <div className="hidden items-center justify-end lg:flex lg:flex-1">
        <nav className="flex items-center gap-9">
          <a href="#" className="border-b-2 border-[#417df6] px-1 pb-4 text-sm font-semibold tracking-[0.01em] text-[#417df6]">Home</a>
          <button type="button" onClick={onOpenRoulette} className="border-b-2 border-transparent pb-4 text-sm font-semibold tracking-[0.01em] text-slate-600 transition hover:border-[#417df6] hover:text-[#417df6]">Recipe Roulette</button>
          <a href="#" className="border-b-2 border-transparent pb-4 text-sm font-semibold tracking-[0.01em] text-slate-600 transition hover:border-[#417df6] hover:text-[#417df6]">Shopping List</a>
          <a href="#" className="border-b-2 border-transparent pb-4 text-sm font-semibold tracking-[0.01em] text-slate-600 transition hover:border-[#417df6] hover:text-[#417df6]">Calendar</a>
        </nav>
      </div>

      <button
        type="button"
        onClick={isAuthenticated ? onLogoutClick : onLoginClick}
        className="shrink-0 rounded-full border border-[#d7e2f1] bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-[#417df6] hover:text-[#417df6]"
      >
        {isAuthenticated ? "Log Out" : "Log In"}
      </button>
    </div>
  );
}
