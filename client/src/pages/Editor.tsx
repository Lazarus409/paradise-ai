import { useEffect, useMemo, useState } from "react";
import { useRoute } from "wouter";
import { toast } from "sonner";
import {
  Bot,
  ArrowLeft,
  Eye,
  Loader2,
  Plus,
  Save,
  Share2,
  Sparkles,
  Trash2,
  WandSparkles,
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { presentationAPI } from "@/lib/api";
import { type PresentationDeck, type PresentationSlide } from "../../../shared/presentation";

type PresentationRecord = {
  id: string;
  title: string;
  content: PresentationDeck;
  isPublic?: boolean;
  shareToken?: string | null;
};

const defaultSlide = (index: number): PresentationSlide => ({
  id: `slide-${index + 1}`,
  title: `New slide ${index + 1}`,
  body: ["Add a crisp message here."],
  notes: "",
  layout: "bullets",
  accent: "#8b5cf6",
});

export default function Editor() {
  const [, params] = useRoute("/editor/:id");
  const presentationId = params?.id;
  const [presentation, setPresentation] = useState<PresentationRecord | null>(
    null
  );
  const [selectedSlideIndex, setSelectedSlideIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!presentationId) return;

    void loadPresentation();
  }, [presentationId]);

  const loadPresentation = async () => {
    try {
      const response = await presentationAPI.get(presentationId!);
      setPresentation(response.data);
    } catch {
      toast.error("Unable to load presentation");
    } finally {
      setIsLoading(false);
    }
  };

  const deck = presentation?.content;

  const selectedSlide = useMemo(() => {
    if (!deck?.slides?.length) {
      return null;
    }

    return deck.slides[selectedSlideIndex] || deck.slides[0];
  }, [deck, selectedSlideIndex]);

  const updateDeck = (mutate: (draft: PresentationDeck) => PresentationDeck) => {
    if (!deck) return;

    const next = mutate(JSON.parse(JSON.stringify(deck)) as PresentationDeck);

    setPresentation(current =>
      current
        ? {
            ...current,
            title: next.title,
            content: next,
          }
        : current
    );
  };

  const savePresentation = async () => {
    if (!presentation) return;

    setIsSaving(true);
    try {
      const response = await presentationAPI.update(presentation.id, {
        title: presentation.title,
        content: presentation.content,
      });
      setPresentation(response.data);
      toast.success("Presentation saved");
    } catch {
      toast.error("Save failed");
    } finally {
      setIsSaving(false);
    }
  };

  const sharePresentation = async () => {
    if (!presentation) return;

    try {
      const response = await presentationAPI.share(presentation.id);
      const shareUrl = `${window.location.origin}${response.data.shareUrl}`;
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Share link copied");
    } catch {
      toast.error("Share failed");
    }
  };

  const addSlide = () => {
    if (!deck) return;

    updateDeck(draft => ({
      ...draft,
      slides: [...draft.slides, defaultSlide(draft.slides.length)],
    }));
    setSelectedSlideIndex(deck.slides.length);
  };

  const removeSlide = () => {
    if (!deck || deck.slides.length <= 1) return;

    updateDeck(draft => ({
      ...draft,
      slides: draft.slides.filter((_, index) => index !== selectedSlideIndex),
    }));
    setSelectedSlideIndex(Math.max(0, selectedSlideIndex - 1));
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (!presentation || !deck) {
    return (
      <DashboardLayout>
        <div className="rounded-3xl border border-dashed border-border/70 p-12 text-center">
          Presentation not found.
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={() => window.history.back()}
              className="rounded-2xl"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <p className="text-sm text-muted-foreground">Presentation editor</p>
              <h1 className="text-3xl font-semibold">{presentation.title}</h1>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={sharePresentation} className="gap-2 rounded-2xl">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
            <Button onClick={savePresentation} disabled={isSaving} className="gap-2 rounded-2xl">
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save
            </Button>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[260px_1fr_320px]">
          <Card className="border-border/70">
            <CardHeader className="space-y-2">
              <CardTitle>Slides</CardTitle>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">{deck.theme}</Badge>
                <Badge variant="outline">{deck.audience}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full gap-2 rounded-2xl" onClick={addSlide}>
                <Plus className="h-4 w-4" />
                Add slide
              </Button>
              <Button variant="outline" className="w-full gap-2 rounded-2xl" onClick={removeSlide}>
                <Trash2 className="h-4 w-4" />
                Remove slide
              </Button>

              <div className="space-y-2">
                {deck.slides.map((slide, index) => (
                  <button
                    key={slide.id}
                    onClick={() => setSelectedSlideIndex(index)}
                    className={`w-full rounded-2xl border p-4 text-left transition ${
                      selectedSlideIndex === index
                        ? "border-primary bg-primary/5"
                        : "border-border/70 bg-background/70 hover:bg-muted/40"
                    }`}
                  >
                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                      Slide {index + 1}
                    </p>
                    <p className="mt-1 font-medium">{slide.title}</p>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="overflow-hidden border-border/70">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Canvas</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Edit the active slide and deck structure.
                  </p>
                </div>
                <Badge className="gap-2 rounded-full px-4 py-1.5">
                  <Eye className="h-3.5 w-3.5" />
                  Live draft
                </Badge>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-[1fr_0.75fr]">
                  <div className="space-y-4">
                    <Input
                      value={presentation.title}
                      onChange={e =>
                        setPresentation(current =>
                          current
                            ? {
                                ...current,
                                title: e.target.value,
                                content: {
                                  ...current.content,
                                  title: e.target.value,
                                },
                              }
                            : current
                        )
                      }
                      className="rounded-2xl"
                    />
                    <Textarea
                      value={deck.prompt}
                      onChange={e =>
                        updateDeck(draft => ({
                          ...draft,
                          prompt: e.target.value,
                        }))
                      }
                      className="min-h-28 rounded-2xl"
                      placeholder="Describe the idea behind the presentation"
                    />
                  </div>

                  <div
                    className="rounded-[2rem] p-5 text-slate-50 shadow-lg"
                    style={{
                      background: `linear-gradient(135deg, ${deck.accent}, #0f172a 70%)`,
                    }}
                  >
                    <p className="text-xs uppercase tracking-[0.2em] text-white/70">
                      {deck.theme}
                    </p>
                    <h2 className="mt-4 text-3xl font-semibold">
                      {selectedSlide?.title}
                    </h2>
                    <div className="mt-4 space-y-3">
                      {(selectedSlide?.body || []).map(line => (
                        <div
                          key={line}
                          className="rounded-2xl bg-white/10 px-4 py-3 text-sm"
                        >
                          {line}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {selectedSlide && (
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-3">
                      <label className="text-sm font-medium">Slide title</label>
                      <Input
                        value={selectedSlide.title}
                        onChange={e =>
                          updateDeck(draft => {
                            draft.slides[selectedSlideIndex].title = e.target.value;
                            return draft;
                          })
                        }
                        className="rounded-2xl"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-sm font-medium">Layout</label>
                      <Input
                        value={selectedSlide.layout}
                        onChange={e =>
                          updateDeck(draft => {
                            draft.slides[selectedSlideIndex].layout = e.target.value as PresentationSlide["layout"];
                            return draft;
                          })
                        }
                        className="rounded-2xl"
                      />
                    </div>
                    <div className="md:col-span-2 space-y-3">
                      <label className="text-sm font-medium">Body points</label>
                      <Textarea
                        value={selectedSlide.body.join("\n")}
                        onChange={e =>
                          updateDeck(draft => {
                            draft.slides[selectedSlideIndex].body = e.target.value
                              .split("\n")
                              .filter(Boolean);
                            return draft;
                          })
                        }
                        className="min-h-36 rounded-2xl"
                      />
                    </div>
                    <div className="md:col-span-2 space-y-3">
                      <label className="text-sm font-medium">Speaker notes</label>
                      <Textarea
                        value={selectedSlide.notes || ""}
                        onChange={e =>
                          updateDeck(draft => {
                            draft.slides[selectedSlideIndex].notes = e.target.value;
                            return draft;
                          })
                        }
                        className="min-h-28 rounded-2xl"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card className="border-border/70">
            <CardHeader className="space-y-2">
              <CardTitle>Smart controls</CardTitle>
              <p className="text-sm text-muted-foreground">
                Adjust the experience and keep the deck sharp.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-3xl border border-border/70 bg-muted/30 p-4">
                <div className="flex items-center gap-2">
                  <Bot className="h-4 w-4 text-primary" />
                  <p className="font-medium">AI notes</p>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Reframe slides, tighten copy, and make the story feel more
                  cinematic.
                </p>
              </div>

              <div className="rounded-3xl border border-border/70 bg-muted/30 p-4">
                <div className="flex items-center gap-2">
                  <WandSparkles className="h-4 w-4 text-primary" />
                  <p className="font-medium">Theme accent</p>
                </div>
                <Input
                  value={deck.accent}
                  onChange={e =>
                    updateDeck(draft => ({
                      ...draft,
                      accent: e.target.value,
                    }))
                  }
                  className="mt-3 rounded-2xl"
                />
              </div>

              <div className="rounded-3xl border border-border/70 bg-muted/30 p-4">
                <p className="font-medium">Presentation metadata</p>
                <div className="mt-3 space-y-2 text-sm text-muted-foreground">
                  <p>Audience: {deck.audience}</p>
                  <p>Tone: {deck.tone}</p>
                  <p>Integrations: {deck.integrations.join(", ")}</p>
                </div>
              </div>

              <Button
                onClick={() => window.open(`/share/${presentation.shareToken || ""}`, "_blank")}
                variant="outline"
                className="w-full gap-2 rounded-2xl"
                disabled={!presentation.shareToken}
              >
                <Sparkles className="h-4 w-4" />
                Open share preview
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
