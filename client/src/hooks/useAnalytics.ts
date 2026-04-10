import { useEffect, useState } from "react";
import { api } from "@/lib/axios";

interface AnalyticsData {
  usage: {
    month: string;
    count: number;
  }[];
}

export function useAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    api.get("/analytics/dashboard").then(res => {
      setData(res.data);
    });
  }, []);

  return data;
}
