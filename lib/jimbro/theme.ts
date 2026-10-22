import type { Preferences } from "./types.ts";

export type ThemePreference = NonNullable<Preferences["theme"]>;
export const themeCacheKey = "jimbro-theme-v1";

export function isThemePreference(value: unknown): value is ThemePreference {
  return value === "light" || value === "dark" || value === "system";
}

// IndexedDB remains authoritative. This small cache avoids a wrong-theme flash
// before its asynchronous read completes; it contains no workout data.
export function applyThemePreference(theme: ThemePreference, cache = true) {
  document.documentElement.dataset.jimTheme = theme;
  if (cache) {
    try {
      localStorage.setItem(themeCacheKey, theme);
    } catch {
      // Theme and workout storage still work when the optional cache is blocked.
    }
  }
}

// A fixed, validated pre-paint script; no user-provided text becomes script code.
export const themeBootstrap = `try{var t=localStorage.getItem(${JSON.stringify(themeCacheKey)});if(t==='light'||t==='dark'||t==='system')document.documentElement.dataset.jimTheme=t}catch{}`;
