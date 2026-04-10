import { useEffect, useState } from "react";
import { api } from "@/lib/axios";
import { useWorkspace } from "@/contexts/WorkspaceContext";

export default function WorkspaceSwitcher() {
  const { workspace, setWorkspace } = useWorkspace();
  const [workspaces, setWorkspaces] = useState<any[]>([]);

  useEffect(() => {
    api.get("/workspaces").then(res => {
      setWorkspaces(res.data);
    });
  }, []);

  return (
    <select
      value={workspace || ""}
      onChange={e => setWorkspace(e.target.value)}
      className="border rounded-lg px-3 py-2"
    >
      {workspaces.map(w => (
        <option key={w.id} value={w.id}>
          {w.name}
        </option>
      ))}
    </select>
  );
}
