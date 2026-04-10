import { Link } from "wouter";
import ThemeSwitch from "../components/ThemeSwitch";

export default function Navbar() {
  return (
    <nav className="border-b border-border backdrop-blur-md bg-background/70 sticky top-0 z-50">
      <div className="container flex items-center justify-between h-16">
        <Link href="/">
          <div className="font-bold text-lg cursor-pointer">Paradise AI</div>
        </Link>

        <div className="flex items-center gap-6">
          <Link href="/dashboard">Dashboard</Link>
          <ThemeSwitch />
        </div>
      </div>
    </nav>
  );
}
