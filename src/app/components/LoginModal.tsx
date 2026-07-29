import React, { useState } from "react";

interface LoginModalProps {
  onClose: () => void;
  onLogin: (password: string) => Promise<boolean>;
}

export default function LoginModal({ onClose, onLogin }: LoginModalProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setError("Enter the password.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    const success = await onLogin(password);
    setIsSubmitting(false);

    if (success) {
      onClose();
    } else {
      setError("Incorrect password.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 p-4" onClick={onClose}>
      <div
        className="w-full max-w-sm rounded-3xl border border-[#dfe7f3] bg-[#f8fbff] p-6 shadow-[0_20px_46px_rgba(30,64,175,0.18)]"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold text-slate-900">Log In</h2>
        <p className="mt-1 text-sm text-slate-500">
          Enter the shared password to add, edit, or delete recipes.
        </p>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <input
            type="password"
            autoFocus
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-2xl border border-[#d7e2f1] bg-white px-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-[#417df6] focus:ring-2 focus:ring-[#417df6]/20"
          />
          {error && <p className="text-sm text-rose-600">{error}</p>}

          <div className="flex justify-end gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-700 transition hover:bg-[#417df6]/8"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-full bg-[#417df6] px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#3268d1] disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {isSubmitting ? "Logging in..." : "Log In"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
