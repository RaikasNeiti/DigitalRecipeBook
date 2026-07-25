interface HomeFloatingActionsProps {
  onOpenAddRecipe: () => void;
}

export default function HomeFloatingActions({ onOpenAddRecipe }: HomeFloatingActionsProps) {
  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3">
      <button
        type="button"
        onClick={onOpenAddRecipe}
        className="inline-flex h-14 items-center gap-3 rounded-full bg-[#417df6] px-6 text-base font-semibold text-white shadow-[0_14px_28px_rgba(65,125,246,0.35)] transition hover:translate-y-[-1px]"
        aria-label="Add Recipe"
        title="Add Recipe"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2.2}
          stroke="currentColor"
          className="h-5 w-5"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14m7-7H5" />
        </svg>
        Add Recipe
      </button>

      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-white/85 bg-white/95 text-slate-700 shadow-[0_12px_24px_rgba(15,23,42,0.12)] transition hover:translate-y-[-1px] hover:bg-white"
        aria-label="Scroll to top"
        title="Scroll to top"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2.2}
          stroke="currentColor"
          className="h-5 w-5"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 19.5V4.5m0 0L6.75 9.75M12 4.5l5.25 5.25" />
        </svg>
      </button>
    </div>
  );
}
