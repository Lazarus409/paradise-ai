import { useEffect, useState } from "react";
import { useRoute } from "wouter";
import { api } from "@/lib/axios";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { type PresentationDeck } from "../../../shared/presentation";

export default function ShareViewer() {
  const [, params] = useRoute("/share/:token");
  const [presentation, setPresentation] = useState<any>(null);

  useEffect(() => {
    api
      .get(`/presentations/share/${params?.token}`)
      .then(res => setPresentation(res.data));
  }, [params]);

  if (!presentation) return <p className="p-8">Loading...</p>;

  const deck: PresentationDeck = presentation.content;

  return (
    <div className="container py-10">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="space-y-3">
          <Badge className="rounded-full px-4 py-1.5">Shared presentation</Badge>
          <h1 className="text-4xl font-semibold">{presentation.title}</h1>
          <p className="max-w-2xl text-muted-foreground">{deck.subtitle}</p>
        </div>

        <div className="grid gap-4">
          {deck.slides.map(slide => (
            <Card key={slide.id} className="border-border/70">
              <CardContent className="space-y-4 p-6">
                <div className="flex items-center justify-between gap-4">
                  <h2 className="text-2xl font-semibold">{slide.title}</h2>
                  <Badge variant="outline">{slide.layout}</Badge>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  {slide.body.map(line => (
                    <div
                      key={line}
                      className="rounded-2xl border border-border/70 bg-muted/30 px-4 py-3"
                    >
                      {line}
                    </div>
                  ))}
                </div>
                {slide.notes ? (
                  <p className="text-sm text-muted-foreground">{slide.notes}</p>
                ) : null}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
