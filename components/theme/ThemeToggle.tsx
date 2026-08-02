"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

/** Light/dark toggle (placed inside the navbar); persists under `ossium-theme`. */
export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    if (typeof localStorage !== "undefined") {
      setIsDark(localStorage.getItem("ossium-theme") !== "light");
    }
  }, []);

  const toggle = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("ossium-theme", next ? "dark" : "light");
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-neutral-700 transition-colors duration-200 ease-out hover:bg-neutral-200 hover:text-neutral-900 dark:bg-white/5 dark:text-neutral-300 dark:hover:bg-white/10 dark:hover:text-neutral-100"
    >
      {isDark ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
