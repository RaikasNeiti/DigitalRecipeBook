import { useCallback, useEffect, useState } from "react";

const API_BASE = (process.env.NEXT_PUBLIC_API_BASE ?? "").replace(/\/$/, "");
const TOKEN_STORAGE_KEY = "digital-recipe-book-token";

const resolveApiBase = () => {
  if (API_BASE) {
    return API_BASE;
  }

  if (typeof window !== "undefined") {
    return `${window.location.protocol}//${window.location.hostname}:5000`;
  }

  return "";
};

export function useAuth() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (stored) {
      setToken(stored);
    }
  }, []);

  const login = useCallback(async (password: string): Promise<boolean> => {
    try {
      const response = await fetch(`${resolveApiBase()}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        return false;
      }

      const data = await response.json();
      setToken(data.token);
      localStorage.setItem(TOKEN_STORAGE_KEY, data.token);
      return true;
    } catch (error) {
      console.error("Error logging in:", error);
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  }, []);

  return {
    token,
    isAuthenticated: token !== null,
    login,
    logout,
  };
}
