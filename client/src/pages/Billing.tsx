import { useEffect, useState } from "react";
import { api } from "@/lib/axios";
import { Button } from "@/components/ui/button";

export default function Billing() {
  const [subscription, setSubscription] = useState<any>(null);

  useEffect(() => {
    api.get("/billing/status").then(res => {
      setSubscription(res.data);
    });
  }, []);

  const upgrade = async () => {
    const res = await api.post("/billing/checkout");
    window.location.href = res.data.url;
  };

  return (
    <div className="max-w-xl mx-auto py-20">
      <h1 className="text-3xl font-bold mb-6">Billing</h1>

      <p className="mb-6">Plan: {subscription?.plan || "Free"}</p>

      <Button onClick={upgrade}>Upgrade to Pro</Button>
    </div>
  );
}
