import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext(null);

// Applies a `dark`/`light` class to <html>. Tailwind is configured with
// darkMode: 'class', and the main layout shells (Sidebar, DashboardLayout,
// RepoLayout, Landing/Login/Signup) use dark: variants — inner analytics
// pages still assume the dark palette for now (see README).
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("ctm_theme") || "dark"
  );

  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
    localStorage.setItem("ctm_theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
