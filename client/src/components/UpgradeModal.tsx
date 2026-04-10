import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { billingAPI } from "@/lib/api";

export default function UpgradeModal({ open, onClose }: any) {
  const handleUpgrade = async () => {
    const res = await billingAPI.checkout();
    window.location.href = res.data.url;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <div className="p-8 bg-card rounded-2xl w-100">
        <h2 className="text-2xl font-bold mb-4">Upgrade to Pro</h2>

        <ul className="space-y-2 text-muted-foreground mb-6">
          <li>✓ Unlimited generations</li>
          <li>✓ Team collaboration</li>
          <li>✓ Export to PDF & PPT</li>
        </ul>

        <Button onClick={handleUpgrade} className="w-full">
          Upgrade Now
        </Button>
      </div>
    </Dialog>
  );
}
