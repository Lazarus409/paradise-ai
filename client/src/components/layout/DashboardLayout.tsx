import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

interface Props {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: Props) {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main */}
      <div className="flex flex-col flex-1">
        <Topbar />

        <main className="flex-1 overflow-y-auto p-8 bg-muted/30">
          {children}
        </main>
      </div>
    </div>
  );
}
