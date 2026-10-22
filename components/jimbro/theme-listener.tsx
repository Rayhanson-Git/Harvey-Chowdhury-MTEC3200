"use client";
import { useEffect } from "react";
import {
  applyThemePreference,
  isThemePreference,
  themeCacheKey,
} from "@/lib/jimbro/theme";

export function ThemeListener() {
  useEffect(() => {
    const sync = (event: StorageEvent) => {
      if (event.key === themeCacheKey || event.key === null)
        applyThemePreference(
          isThemePreference(event.newValue) ? event.newValue : "system",
          false,
        );
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);
  return null;
}
