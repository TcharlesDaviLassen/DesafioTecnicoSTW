import { useTheme } from "provider/ThemeProvider";

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="px-3 py-1 rounded cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-600 text-black dark:text-white"
    >
      {theme === "dark" ? "🌙 Dark" : "☀️ Light"}
    </button>
  );
};
