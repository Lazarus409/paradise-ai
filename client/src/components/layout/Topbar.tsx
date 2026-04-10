import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

export default function Topbar() {
  const { logout } = useAuth();

  return (
    <header className="h-16 border-b flex items-center justify-between px-6">
      <div className="font-semibold">Workspace</div>

      <Button variant="outline" onClick={logout}>
        Logout
      </Button>
    </header>
  );
}
