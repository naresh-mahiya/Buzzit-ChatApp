import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: "cmyk", // Fixed theme - no longer changeable
  setTheme: (theme) => {
    // Theme is now fixed to cmyk, so this function does nothing
    // Keeping it for compatibility but it won't change the theme
  },
}));
