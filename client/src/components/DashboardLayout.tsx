import Sidebar from "./Sidebar";

export default function DashboardLayout({
  children,
  workspaces,
  setWorkspace,
}: {
  children: React.ReactNode;
  workspaces?: { id: string; name: string }[];
  setWorkspace?: (id: string) => void;
}) {
  return (
    <div className="min-h-screen flex">
      <Sidebar />

      <main className="flex-1 p-8">
        {/* Workspace Selector */}
        {workspaces && setWorkspace && (
          <div className="mb-6">
            <select
              onChange={e => setWorkspace(e.target.value)}
              className="border rounded-lg px-3 py-2"
            >
              {workspaces.map(w => (
                <option key={w.id} value={w.id}>
                  {w.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {children}
      </main>
    </div>
  );
}
