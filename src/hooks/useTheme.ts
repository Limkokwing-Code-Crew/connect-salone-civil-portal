import { useEffect, useMemo, useState } from "react";

export type ThemeSetting = "light" | "dark" | "system";

const THEME_STORAGE_KEY = "connect_salone_theme";

function getSystemPrefersDark() {
  if (typeof window === "undefined") return false;
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
}

function resolveTheme(theme: ThemeSetting): "light" | "dark" {
  if (theme === "system") return getSystemPrefersDark() ? "dark" : "light";
  return theme;
}

export function useTheme() {
  const [theme, setTheme] = useState<ThemeSetting>(() => {
    if (typeof window === "undefined") return "system";
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY) as ThemeSetting | null;
    if (stored === "light" || stored === "dark" || stored === "system") return stored;
    return "system";
  });

  const resolvedTheme = useMemo(() => resolveTheme(theme), [theme]);

  // Apply + persist
  useEffect(() => {
    const root = document.documentElement;
    if (resolvedTheme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");

    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme, resolvedTheme]);

  // Keep in sync with system changes when in system mode
  useEffect(() => {
    if (theme !== "system") return;

    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      const root = document.documentElement;
      if (resolveTheme("system") === "dark") root.classList.add("dark");
      else root.classList.remove("dark");
    };

    mql.addEventListener?.("change", onChange);
    return () => mql.removeEventListener?.("change", onChange);
  }, [theme]);

  const cycleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : prev === "dark" ? "system" : "light"));
  };

  return {
    theme,
    resolvedTheme,
    setTheme,
    cycleTheme,
  };
}
