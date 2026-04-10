export default function DashboardLayout({ children }: any) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 border-r p-4">
        <h2 className="text-xl font-bold">Paradise AI</h2>
      </aside>

      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
