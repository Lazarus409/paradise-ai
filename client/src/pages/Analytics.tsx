import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import UsageChart from "@/components/analytics/UsageChart";

export default function Analytics() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="space-y-2">
          <Badge className="rounded-full px-4 py-1.5">Analytics</Badge>
          <h1 className="text-4xl font-semibold">Understand how the product is used.</h1>
          <p className="max-w-2xl text-muted-foreground">
            Track generation volume, adoption, and engagement as the product
            grows.
          </p>
        </div>

        <Card className="border-border/70">
          <CardHeader>
            <CardTitle>Usage overview</CardTitle>
            <CardDescription>Generation and activity trends.</CardDescription>
          </CardHeader>
          <CardContent>
            <UsageChart data={[]} />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
