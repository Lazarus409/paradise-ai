import { motion } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";

export default function ThemeSwitch() {
  const { resolvedTheme, setTheme } = useTheme();

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative w-14 h-8 rounded-full bg-muted flex items-center px-1"
    >
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="w-6 h-6 rounded-full bg-background shadow-md"
        style={{ x: isDark ? 24 : 0 }}
      />
    </button>
  );
}