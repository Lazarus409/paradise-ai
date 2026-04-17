import { Link } from "wouter";
import ThemeSwitch from "../components/ThemeSwitch";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-50 border-b border-border/70 bg-background/75 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/">
          <div className="flex items-center gap-2 font-semibold">
            <div className="h-8 w-8 rounded-2xl bg-primary text-primary-foreground grid place-items-center">
              P
            </div>
            Paradise AI
          </div>
        </Link>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <Button asChild variant="ghost" className="rounded-2xl">
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              <Button variant="ghost" className="rounded-2xl" onClick={logout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" className="rounded-2xl">
                <Link href="/login">Sign in</Link>
              </Button>
              <Button asChild className="rounded-2xl">
                <Link href="/register">Get started</Link>
              </Button>
            </>
          )}
          <ThemeSwitch />
        </div>
      </div>
    </nav>
  );
}
