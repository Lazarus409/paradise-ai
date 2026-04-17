import { useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Loader2, Sparkles, WandSparkles } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import SortablePresentationCard from "@/components/presentations/SortablePresentationCard";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { presentationAPI, usageAPI } from "@/lib/api";
import { integrations, templates } from "@/data/product";
import { type PresentationDeck } from "../../../shared/presentation";

type PresentationRecord = {
  id: string;
  title: string;
  createdAt: string;
  content?: PresentationDeck;
};

const quickStarts = [
  "Pitch deck for a SaaS startup",
  "Sales proposal for a new client",
  "Investor update for a growing team",
  "Workshop deck for onboarding",
];

const dashboardCards = [
  {
    label: "Fast drafts",
    description: "Prompt, generate, refine, share.",
  },
  {
    label: "Modern themes",
    description: "Use bold layouts with a cohesive visual system.",
  },
  {
    label: "Free forever",
    description: "No billing wall between you and the dashboard.",
  },
];

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const [presentations, setPresentations] = useState<PresentationRecord[]>([]);
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [usage, setUsage] = useState(0);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"newest" | "oldest" | "az">("newest");

  useEffect(() => {
    void fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const [presentationsRes, usageRes] = await Promise.all([
        presentationAPI.list(),
        usageAPI.status(),
      ]);

      setPresentations(
        presentationsRes.data.map((item: any) => ({
          ...item,
          content: item.content as PresentationDeck | undefined,
        }))
      );
      setUsage(usageRes.data.usage ?? 0);
    } catch {
      toast.error("Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!prompt.trim()) {
      return;
    }

    setIsGenerating(true);

    try {
      const response = await presentationAPI.generate(prompt.trim());
      const deck = response.data as PresentationRecord;

      setPresentations(prev => [deck, ...prev]);
      setPrompt("");
      toast.success("Presentation generated");
      setLocation(`/editor/${deck.id}`);
      await fetchDashboard();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Generation failed");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete presentation?")) return;

    try {
      await presentationAPI.delete(id);
      setPresentations(prev =>
        prev.filter(presentation => presentation.id !== id)
      );
      toast.success("Deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  const filteredPresentations = useMemo(() => {
    const items = presentations.filter(item =>
      item.title.toLowerCase().includes(search.toLowerCase())
    );

    items.sort((a, b) => {
      if (sort === "az") return a.title.localeCompare(b.title);
      if (sort === "oldest") {
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      }

      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return items;
  }, [presentations, search, sort]);

  return (
    <DashboardLayout>
      <div className="space-y-10">
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]"
        >
          <Card className="overflow-hidden border-border/70 bg-gradient-to-br from-background via-background to-primary/5">
            <CardContent className="space-y-6 p-6 md:p-8">
              <div className="flex flex-wrap gap-3"></div>

              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">Welcome back</p>
                <h1 className="max-w-3xl text-4xl font-semibold tracking-tight md:text-5xl">
                  Create sharp decks from one prompt, then refine them like a
                  pro.
                </h1>
                <p className="max-w-2xl text-muted-foreground">
                  Use fast generation, guided templates, and a modern editor to
                  turn rough ideas into presentations that sound like your brand
                  and feel like a real launch.
                </p>
              </div>

              <form onSubmit={handleGenerate} className="space-y-4">
                <Textarea
                  value={prompt}
                  onChange={e => setPrompt(e.target.value)}
                  placeholder="Describe the deck you want: a startup pitch, workshop, report, or client proposal."
                  className="min-h-32 rounded-3xl border-border/70 bg-background/80 p-4 text-base shadow-sm"
                />

                <div className="flex flex-wrap gap-2">
                  {quickStarts.map(item => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setPrompt(item)}
                      className="rounded-full border border-border/70 bg-background/70 px-4 py-2 text-sm text-muted-foreground transition hover:border-primary/40 hover:text-foreground"
                    >
                      {item}
                    </button>
                  ))}
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button
                    type="submit"
                    disabled={isGenerating || !prompt.trim()}
                    className="gap-2 rounded-2xl px-5"
                  >
                    {isGenerating && (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    )}
                    Generate presentation
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <div className="grid gap-4">
            {dashboardCards.map(card => (
              <Card key={card.label} className="border-border/70">
                <CardContent className="space-y-2 p-6">
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-semibold">{card.label}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {card.description}
                  </p>
                </CardContent>
              </Card>
            ))}

            <Card className="border-border/70 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-slate-50">
              <CardContent className="space-y-3 p-6">
                <div className="flex items-center justify-between">
                  <div className="rounded-2xl bg-white/10 p-3">
                    <WandSparkles className="h-5 w-5 text-emerald-300" />
                  </div>
                  <Badge className="rounded-full bg-white/10 text-slate-50 hover:bg-white/15">
                    Ready now
                  </Badge>
                </div>
                <p className="text-sm text-slate-300">Plan</p>
                <div className="text-3xl font-semibold">Free</div>
                <p className="text-sm text-slate-300">
                  No billing, no upgrade wall, full dashboard access.
                </p>
              </CardContent>
            </Card>
          </div>
        </motion.section>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="border-border/70">
            <CardHeader>
              <CardTitle>Total presentations</CardTitle>
              <CardDescription>
                Everything you have generated so far.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-semibold">{presentations.length}</p>
            </CardContent>
          </Card>

          <Card className="border-border/70">
            <CardHeader>
              <CardTitle>Usage this month</CardTitle>
              <CardDescription>
                Generations logged for the current month.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-semibold">{usage}</p>
            </CardContent>
          </Card>

          <Card className="border-border/70">
            <CardHeader>
              <CardTitle>Access status</CardTitle>
              <CardDescription>
                Workspace access is available after login.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                You are already on the free plan. Keep creating, sharing, and
                editing without interruptions.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-border/70">
          <CardHeader>
            <CardTitle>Templates and momentum</CardTitle>
            <CardDescription>
              Ready-made structures that help people move quickly.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {templates.map(template => (
              <div
                key={template.name}
                className="rounded-3xl border border-border/70 bg-background/70 p-4"
              >
                <p className="font-semibold">{template.name}</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {template.description}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-border/70">
          <CardHeader>
            <CardTitle>Integrated surfaces</CardTitle>
            <CardDescription>
              Built to connect with the apps teams already use.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {integrations.map(item => (
              <div
                key={item.name}
                className="rounded-3xl border border-border/70 p-4"
              >
                <p className="font-semibold">{item.name}</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {item.summary}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-border/70">
          <CardHeader>
            <CardTitle>Recent presentations</CardTitle>
            <CardDescription>
              Organize, edit, and share the latest work from the dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between gap-4 pb-4">
              <Input
                placeholder="Search presentations..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="max-w-sm rounded-2xl"
              />
              <select
                value={sort}
                onChange={e =>
                  setSort(e.target.value as "newest" | "oldest" | "az")
                }
                className="rounded-2xl border border-border bg-background px-3 py-2 text-sm"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="az">A-Z</option>
              </select>
            </div>

            <div className="grid gap-4">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-20 animate-pulse rounded-3xl border border-border/70 bg-muted/40"
                  />
                ))
              ) : filteredPresentations.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-border/70 p-10 text-center text-muted-foreground">
                  No presentations found. Generate your first one above.
                </div>
              ) : (
                filteredPresentations.map(presentation => (
                  <SortablePresentationCard
                    key={presentation.id}
                    presentation={presentation}
                    onEdit={id => setLocation(`/editor/${id}`)}
                    onDelete={handleDelete}
                  />
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
