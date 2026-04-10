import { useEffect, useState } from "react";
import { useRoute } from "wouter";
import { api } from "@/lib/axios";

export default function ShareViewer() {
  const [, params] = useRoute("/share/:token");
  const [presentation, setPresentation] = useState<any>(null);

  useEffect(() => {
    api
      .get(`/presentations/share/${params?.token}`)
      .then(res => setPresentation(res.data));
  }, [params]);

  if (!presentation) return <p>Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">{presentation.title}</h1>

      <pre className="bg-muted p-6 rounded-lg">
        {JSON.stringify(presentation.content, null, 2)}
      </pre>
    </div>
  );
}
