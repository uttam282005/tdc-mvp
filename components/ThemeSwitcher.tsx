"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

const themes: Array<{ value: Theme; label: string; icon: React.ComponentType<{ className?: string }> }> = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
];

function applyTheme(theme: Theme) {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const shouldUseDark = theme === "dark" || (theme === "system" && prefersDark);
  document.documentElement.classList.toggle("dark", shouldUseDark);
  document.documentElement.style.colorScheme = shouldUseDark ? "dark" : "light";
}

export function ThemeSwitcher() {
  // Initialize with a default state to match the server
  const [theme, setTheme] = useState<Theme>("system");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Read the saved theme only after the component mounts on the client
    const savedTheme = window.localStorage.getItem("theme") as Theme;
    if (savedTheme === "light" || savedTheme === "dark" || savedTheme === "system") {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    // Skip running this until the initial mount is complete
    if (!mounted) return; 
    
    applyTheme(theme);

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const syncSystemTheme = () => {
      if ((window.localStorage.getItem("theme") ?? "system") === "system") {
        applyTheme("system");
      }
    };

    media.addEventListener("change", syncSystemTheme);
    return () => media.removeEventListener("change", syncSystemTheme);
  }, [theme, mounted]);

  function updateTheme(nextTheme: Theme) {
    setTheme(nextTheme);
    window.localStorage.setItem("theme", nextTheme);
  }

  // Prevent rendering the toggle until we know the correct client-side theme
  if (!mounted) {
    return <div className="inline-flex h-[42px] w-[106px] rounded-md border border-stone-200 bg-white p-1 dark:border-stone-700 dark:bg-stone-900" />;
  }

  return (
    <div className="inline-flex rounded-md border border-stone-200 bg-white p-1 shadow-sm dark:border-stone-700 dark:bg-stone-900">
      {themes.map((option) => {
        const Icon = option.icon;
        const active = theme === option.value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => updateTheme(option.value)}
            className={`flex size-8 items-center justify-center rounded text-stone-500 transition hover:bg-stone-100 hover:text-stone-950 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-stone-100 ${
              active ? "bg-rose-600 text-white hover:bg-rose-600 hover:text-white dark:bg-rose-500 dark:text-white" : ""
            }`}
            aria-label={`Use ${option.label} theme`}
            title={option.label}
          >
            <Icon className="size-4" aria-hidden="true" />
          </button>
        );
      })}
    </div>
  );
}
