"use client";

import { useEffect, useState } from "react";

type Mode = "light" | "dark" | "auto";

function readMode(): Mode {
  if (typeof window === "undefined") return "auto";
  const stored = localStorage.getItem("casa-theme");
  if (stored === "light" || stored === "dark") return stored;
  return "auto";
}

function applyMode(mode: Mode) {
  const root = document.documentElement;
  if (mode === "auto") {
    root.removeAttribute("data-theme");
    localStorage.removeItem("casa-theme");
  } else {
    root.setAttribute("data-theme", mode);
    localStorage.setItem("casa-theme", mode);
  }
}

export function ThemeToggle() {
  const [mode, setMode] = useState<Mode>("auto");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setMode(readMode());
  }, []);

  const cycle = () => {
    const next: Mode = mode === "auto" ? "light" : mode === "light" ? "dark" : "auto";
    setMode(next);
    applyMode(next);
  };

  if (!mounted) {
    return (
      <button className="theme-toggle" aria-label="Cambiar tema" suppressHydrationWarning>
        ◐
      </button>
    );
  }

  const icon = mode === "light" ? "☀" : mode === "dark" ? "☾" : "◐";
  const title =
    mode === "auto"
      ? "Tema: automático (sigue el sistema)"
      : mode === "light"
      ? "Tema: claro"
      : "Tema: oscuro";

  return (
    <button
      className="theme-toggle"
      onClick={cycle}
      aria-label={title}
      title={title}
    >
      {icon}
    </button>
  );
}
