import {
  createContext,
  useContext,
  useEffect,
  useState,
  PropsWithChildren,
  useRef,
} from "react";
import axios from "axios";

type Theme = "light" | "dark" | "system";

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: "light" | "dark";
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  defaultTheme?: Theme;
  userId?: string; // pass authenticated user ID
}

export function ThemeProvider({
  children,
  defaultTheme = "system",
  userId,
}: PropsWithChildren<ThemeProviderProps>) {
  const firstRender = useRef(true);

  const getSystemTheme = (): "light" | "dark" =>
    window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";

  const getInitialTheme = (): Theme => {
    const stored = localStorage.getItem("theme") as Theme | null;
    return stored || defaultTheme;
  };

  const [theme, setThemeState] = useState<Theme>(getInitialTheme);
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">(
    theme === "system" ? getSystemTheme() : theme
  );

  const applyTheme = (mode: "light" | "dark") => {
    const root = document.documentElement;
    root.classList.toggle("dark", mode === "dark");
  };

  useEffect(() => {
    let finalTheme: "light" | "dark";

    if (theme === "system") {
      finalTheme = getSystemTheme();
    } else {
      finalTheme = theme;
    }

    setResolvedTheme(finalTheme);
    applyTheme(finalTheme);

    localStorage.setItem("theme", theme);

    if (userId) {
      axios.post("/api/user/theme", { theme });
    }

    // Prevent transition on first render
    if (firstRender.current) {
      document.documentElement.classList.add("no-transition");
      setTimeout(() => {
        document.documentElement.classList.remove("no-transition");
      }, 50);
      firstRender.current = false;
    }
  }, [theme, userId]);

  // Listen to OS theme changes
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");

    const handler = () => {
      if (theme === "system") {
        const newTheme = getSystemTheme();
        setResolvedTheme(newTheme);
        applyTheme(newTheme);
      }
    };

    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}