import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  Presentation,
  BarChart3,
  Users,
  Settings,
} from "lucide-react";

const items = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Presentations", path: "/dashboard", icon: Presentation },
  { name: "Analytics", path: "/analytics", icon: BarChart3 },
  { name: "Team", path: "/team", icon: Users },
  { name: "Settings", path: "/settings", icon: Settings },
];

export default function Sidebar() {
  const [location] = useLocation();

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-border/70 bg-background/95">
      <div className="border-b border-border/70 p-6">
        <div className="font-semibold text-xl">Paradise AI</div>
        <p className="mt-1 text-sm text-muted-foreground">
          Create, polish, and ship with your own brand voice.
        </p>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {items.map(item => {
          const Icon = item.icon;
          const active = location === item.path;

          return (
            <Link key={item.name} href={item.path}>
              <div
                className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition
                ${
                  active
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.name}
              </div>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
