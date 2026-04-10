import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  Presentation,
  BarChart3,
  CreditCard,
  Users,
  Settings,
} from "lucide-react";

const items = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Presentations", path: "/dashboard", icon: Presentation },
  { name: "Analytics", path: "/analytics", icon: BarChart3 },
  { name: "Billing", path: "/billing", icon: CreditCard },
  { name: "Team", path: "/team", icon: Users },
  { name: "Settings", path: "/settings", icon: Settings },
];

export default function Sidebar() {
  const [location] = useLocation();

  return (
    <aside className="w-64 border-r bg-background h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 font-bold text-xl border-b">Paradise AI</div>

      {/* Nav */}
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
