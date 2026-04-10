import { Link } from "wouter";

export default function Sidebar() {
  return (
    <aside className="w-64 border-r border-border bg-card p-6 hidden md:block">
      <h2 className="font-bold mb-6">Dashboard</h2>

      <div className="flex flex-col gap-3">
        <Link href="/dashboard">Overview</Link>
        <Link href="/editor/1">Editor</Link>
      </div>
    </aside>
  );
}
