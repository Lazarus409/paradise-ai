import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Team() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="space-y-2">
          <Badge className="rounded-full px-4 py-1.5">Team</Badge>
          <h1 className="text-4xl font-semibold">Collaborate without losing the thread.</h1>
          <p className="max-w-2xl text-muted-foreground">
            Keep owners, editors, and viewers aligned in the same workspace.
          </p>
        </div>

        <Card className="border-border/70">
          <CardHeader>
            <CardTitle>Membership</CardTitle>
            <CardDescription>Invite teammates, assign roles, and review access.</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Team management scaffolding is in place and ready to connect to invites,
            roles, and collaboration permissions.
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
