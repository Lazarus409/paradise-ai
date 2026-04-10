import { Route, Switch } from "wouter";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Dashboard from "@/pages/Dashboard";
import Editor from "@/pages/Editor";
import ShareViewer from "@/pages/ShareViewer";

export default function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/editor/:id" component={Editor} />
      <Route path="/share/:token" component={ShareViewer} />
    </Switch>
  );
}
