import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function UpgradeModal({ open, onClose }: any) {
  const [, setLocation] = useLocation();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-md rounded-3xl border border-border/70 bg-card p-0 shadow-2xl">
        <div className="p-6">
          <h2 className="text-2xl font-semibold">Free access</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Everything in the workspace is included after login. No upgrade
            flow, no billing page.
          </p>

          <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
            <li>• Unlimited generations</li>
            <li>• Team collaboration</li>
            <li>• Export-ready presentation workflows</li>
            <li>• Dashboard access after login</li>
          </ul>

          <Button
            onClick={() => setLocation("/dashboard")}
            className="mt-6 w-full rounded-2xl"
          >
            Continue to dashboard
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
