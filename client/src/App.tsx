import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import RequireAuth from "./components/auth/RequireAuth";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Editor from "./pages/Editor";
import ShareViewer from "./pages/ShareViewer";
import Analytics from "./pages/Analytics";
import Team from "./pages/Team";
import Settings from "./pages/Settings";
import Navbar from "./components/Navbar";

function Router() {
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
      <Route path="/404" component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

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

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <AuthProvider>
          <Navbar />
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
