import { Route, Switch } from "wouter";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Dashboard from "@/pages/Dashboard";
import Editor from "@/pages/Editor";
import ShareViewer from "@/pages/ShareViewer";
import Analytics from "@/pages/Analytics";
import Team from "@/pages/Team";
import Settings from "@/pages/Settings";
import RequireAuth from "@/components/auth/RequireAuth";

function ProtectedDashboard() {
  return (
    <RequireAuth>
      <Dashboard />
    </RequireAuth>
  );
}

function ProtectedEditor() {
  return (
    <RequireAuth>
      <Editor />
    </RequireAuth>
  );
}

function ProtectedAnalytics() {
  return (
    <RequireAuth>
      <Analytics />
    </RequireAuth>
  );
}

function ProtectedTeam() {
  return (
    <RequireAuth>
      <Team />
    </RequireAuth>
  );
}

function ProtectedSettings() {
  return (
    <RequireAuth>
      <Settings />
    </RequireAuth>
  );
}

export default function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/dashboard" component={ProtectedDashboard} />
      <Route path="/editor/:id" component={ProtectedEditor} />
      <Route path="/share/:token" component={ShareViewer} />
      <Route path="/analytics" component={ProtectedAnalytics} />
      <Route path="/team" component={ProtectedTeam} />
      <Route path="/settings" component={ProtectedSettings} />
    </Switch>
  );
}
