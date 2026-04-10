import { useTheme } from "@/contexts/ThemeContext";

export default function ThemeDropdown() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex flex-col gap-1 p-2 bg-card rounded-lg shadow-md w-40">
      {["light", "dark", "system"].map(option => (
        <button
          key={option}
          onClick={() => setTheme(option as any)}
          className={`px-3 py-2 rounded-md text-left capitalize ${
            theme === option ? "bg-primary text-primary-foreground" : ""
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );
}