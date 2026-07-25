import Image from "next/image";

interface HomeHeroProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenFilters: () => void;
  activeFilterCount: number;
}

export default function HomeHero({
  searchQuery,
  onSearchChange,
  onOpenFilters,
  activeFilterCount,
}: HomeHeroProps) {
  return (
    <section className="relative w-full overflow-hidden rounded-[34px] bg-white/60 px-5 py-7 shadow-[0_18px_42px_rgba(22,41,75,0.1)] sm:rounded-[38px] sm:px-8 lg:px-10 lg:py-10">
      <div className="pointer-events-none absolute inset-y-0 right-0 w-[58%] min-w-[320px]">
        <Image
          src="/MainHeader.avif"
          alt="Plate with blueberries and herbs"
          fill
          priority
          sizes="(max-width: 640px) 100vw, (max-width: 1279px) 60vw, 50vw"
          className="object-cover object-right"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-white" />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white/94 via-white/72 to-white/12" />
      <div className="pointer-events-none absolute -left-24 top-10 h-80 w-80 rounded-full bg-[#417df6]/20 blur-3xl" />
      <div className="pointer-events-none absolute left-[40%] top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-[#417df6]/16 blur-3xl" />

      <div className="relative">
        <div className="relative z-10 max-w-[560px]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-[#417df6]">Your recipes, your way</p>
          <h1 className="mt-4 font-serif text-[54px] font-semibold leading-[0.98] tracking-tight text-slate-900 sm:text-[70px]">
            Discover recipes
            <br />
            you&apos;ll <span className="relative inline-block italic text-[#417df6]">love
              <svg viewBox="0 0 152 26" className="absolute -bottom-2 left-0 h-4 w-[120%] text-[#417df6]/80" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M3 18.2c17.5-7.4 32.7-11.6 45.3-12.8 19.6-1.8 35.8 2.7 49.7 8.2 14.3 5.7 28.8 8.8 50 2.1" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
              </svg>
            </span>
          </h1>
          <p className="mt-5 max-w-md text-base leading-7 text-slate-500">
            All your favorite recipes in one place. Find inspiration for every meal and every occasion.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative min-w-0 flex-1">
              <span className="pointer-events-none absolute inset-y-0 left-5 flex items-center text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.9} stroke="currentColor" className="h-4 w-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.35-4.35m0 0A7.5 7.5 0 1 0 6 6a7.5 7.5 0 0 0 10.65 10.65Z" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Search any recipe..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="h-14 w-full rounded-full border border-white/90 bg-white/95 pl-14 pr-5 text-sm text-slate-900 shadow-[0_14px_30px_rgba(148,163,184,0.2),0_2px_8px_rgba(255,255,255,0.55)] outline-none transition focus:border-[#417df6] focus:ring-2 focus:ring-[#417df6]/20"
              />
            </div>
            <button
              type="button"
              onClick={onOpenFilters}
              className="relative inline-flex h-14 items-center gap-2 rounded-full border border-white/90 bg-white/95 px-6 text-sm font-semibold text-slate-700 shadow-[0_14px_30px_rgba(148,163,184,0.2),0_2px_8px_rgba(255,255,255,0.55)] transition hover:bg-[#417df6]/8"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.9} stroke="currentColor" className="h-4 w-4" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 6.75h13.5l-5.25 5.625v4.125l-3 1.5v-5.625L5.25 6.75Z" />
              </svg>
              Filters
              {activeFilterCount > 0 && <span className="absolute right-4 top-4 h-2.5 w-2.5 rounded-full bg-[#417df6]" />}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
