import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Topbar() {
  const { logout } = useAuth();

  return (
    <header className="flex h-16 items-center justify-between border-b border-border/70 px-6 backdrop-blur">
      <div className="flex items-center gap-3">
        <div className="font-semibold">Workspace</div>
        <Badge variant="outline" className="rounded-full">
          Live
        </Badge>
      </div>

      <Button variant="outline" onClick={logout} className="rounded-2xl">
        Logout
      </Button>
    </header>
  );
}
