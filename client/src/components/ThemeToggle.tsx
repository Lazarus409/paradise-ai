import { motion } from "framer-motion";
import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const cycleTheme = () => {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("system");
    else setTheme("light");
  };

  const icon =
    theme === "light" ? (
      <Sun size={18} />
    ) : theme === "dark" ? (
      <Moon size={18} />
    ) : (
      <Monitor size={18} />
    );

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      whileHover={{ rotate: 15 }}
      onClick={cycleTheme}
      className="relative flex items-center justify-center w-10 h-10 rounded-full bg-muted"
    >
      <motion.div
        key={theme}
        initial={{ rotate: -90, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        exit={{ rotate: 90, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {icon}
      </motion.div>
    </motion.button>
  );
}