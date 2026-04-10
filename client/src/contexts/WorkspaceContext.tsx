import { createContext, useContext, useState } from "react";

const WorkspaceContext = createContext<any>(null);

export function WorkspaceProvider({ children }: any) {
  const [workspace, setWorkspace] = useState<string | null>(null);

  return (
    <WorkspaceContext.Provider value={{ workspace, setWorkspace }}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export const useWorkspace = () => useContext(WorkspaceContext);
