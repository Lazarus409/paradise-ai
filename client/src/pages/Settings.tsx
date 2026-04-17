import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Settings() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="space-y-2">
          <Badge className="rounded-full px-4 py-1.5">Settings</Badge>
          <h1 className="text-4xl font-semibold">Tune the experience.</h1>
          <p className="max-w-2xl text-muted-foreground">
            Brand, theme, and notification settings belong here.
          </p>
        </div>

        <Card className="border-border/70">
          <CardHeader>
            <CardTitle>Workspace preferences</CardTitle>
            <CardDescription>Theme, brand color, and profile defaults.</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Settings scaffolding is ready for workspace branding and account
            preferences.
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
