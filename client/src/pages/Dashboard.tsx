import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";

import { billingAPI, presentationAPI } from "@/lib/api";

import DashboardLayout from "@/components/layout/DashboardLayout";
import UsageChart from "@/components/analytics/UsageChart";
import SortablePresentationCard from "@/components/presentations/SortablePresentationCard";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { useAnalytics } from "@/hooks/useAnalytics";

/* Drag system */
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";

interface Presentation {
  id: string;
  title: string;
  created_at: string;
}

export default function Dashboard() {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  const analytics = useAnalytics();

  const [presentations, setPresentations] = useState<Presentation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const [usage, setUsage] = useState(0);
  const monthlyQuota = 3;

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"newest" | "oldest" | "az">("newest");

  /* =========================
     INITIAL LOAD
  ========================== */

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation("/login");
      return;
    }

    fetchPresentations();
    fetchUsage();
  }, [isAuthenticated]);

  /* =========================
     FETCH USAGE
  ========================== */

  const fetchUsage = async () => {
    try {
      const res = await billingAPI.usage();
      setUsage(res.data.usage);
    } catch {
      console.warn("Failed to fetch usage");
    }
  };

  /* =========================
     FETCH PRESENTATIONS
  ========================== */

  const fetchPresentations = async () => {
    try {
      const response = await presentationAPI.list();
      setPresentations(response.data);
    } catch {
      toast.error("Failed to load presentations");
    } finally {
      setIsLoading(false);
    }
  };

  /* =========================
     GENERATE PRESENTATION
  ========================== */

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!prompt.trim()) return;

    setIsGenerating(true);

    try {
      const response = await presentationAPI.generate(prompt);

      setPresentations(prev => [response.data, ...prev]);

      setPrompt("");

      toast.success("Presentation generated");

      await fetchUsage();

      setLocation(`/editor/${response.data.id}`);
    } catch (error: any) {
      if (error.response?.status === 403) {
        toast.error("Monthly quota reached. Upgrade your plan.");
      } else {
        toast.error(error.response?.data?.detail || "Generation failed");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  /* =========================
     DELETE PRESENTATION
  ========================== */

  const handleDelete = async (id: string) => {
    if (!confirm("Delete presentation?")) return;

    try {
      await presentationAPI.delete(id);

      setPresentations(prev => prev.filter(p => p.id !== id));

      toast.success("Deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  /* =========================
     DRAG & DROP
  ========================== */

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    setPresentations(items => {
      const oldIndex = items.findIndex(i => i.id === active.id);
      const newIndex = items.findIndex(i => i.id === over.id);

      return arrayMove(items, oldIndex, newIndex);
    });
  };

  /* =========================
     SEARCH + SORT
  ========================== */

  const filteredPresentations = useMemo(() => {
    let result = presentations.filter(p =>
      p.title.toLowerCase().includes(search.toLowerCase())
    );

    if (sort === "newest") {
      result.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    }

    if (sort === "oldest") {
      result.sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
    }

    if (sort === "az") {
      result.sort((a, b) => a.title.localeCompare(b.title));
    }

    return result;
  }, [presentations, search, sort]);

  /* =========================
     RENDER
  ========================== */

  return (
    <DashboardLayout>
      <div className="space-y-10">
        {/* =========================
           STATS
        ========================== */}

        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Total Presentations</CardTitle>
            </CardHeader>

            <CardContent>
              <p className="text-3xl font-bold">{presentations.length}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Monthly Usage</CardTitle>
            </CardHeader>

            <CardContent>
              <p className="text-3xl font-bold">
                {usage} / {monthlyQuota}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quota Status</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-500"
                  style={{
                    width: `${Math.min((usage / monthlyQuota) * 100, 100)}%`,
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* =========================
           ANALYTICS
        ========================== */}

        {analytics && (
          <Card>
            <CardHeader>
              <CardTitle>Usage Analytics</CardTitle>

              <CardDescription>
                AI presentation generation over time
              </CardDescription>
            </CardHeader>

            <CardContent>
              <UsageChart data={analytics.usage || []} />
            </CardContent>
          </Card>
        )}

        {/* =========================
           SEARCH + SORT
        ========================== */}

        <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
          <input
            type="text"
            placeholder="Search presentations..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="border border-border rounded-lg px-3 py-2 bg-background"
          />

          <select
            value={sort}
            onChange={e => setSort(e.target.value as any)}
            className="border border-border rounded-lg px-3 py-2 bg-background"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="az">A-Z</option>
          </select>
        </div>

        {/* =========================
           GENERATOR
        ========================== */}

        <Card>
          <CardHeader>
            <CardTitle>Create Presentation</CardTitle>

            <CardDescription>Describe your presentation topic</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleGenerate} className="space-y-4">
              <textarea
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                className="w-full h-28 p-3 border border-border rounded-xl bg-background resize-none"
                placeholder="e.g. AI in Healthcare"
              />

              <Button type="submit" disabled={isGenerating || !prompt.trim()}>
                {isGenerating && (
                  <Loader2 className="animate-spin h-4 w-4 mr-2" />
                )}

                {isGenerating ? "Generating..." : "Generate"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* =========================
           PRESENTATIONS
        ========================== */}

        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={filteredPresentations.map(p => p.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="grid gap-4">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <Card key={i}>
                    <CardContent className="py-6">
                      <div className="animate-pulse space-y-3">
                        <div className="h-4 bg-muted rounded w-1/3" />
                        <div className="h-3 bg-muted rounded w-1/4" />
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : filteredPresentations.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center text-muted-foreground">
                    No presentations found
                  </CardContent>
                </Card>
              ) : (
                filteredPresentations.map(p => (
                  <SortablePresentationCard
                    key={p.id}
                    presentation={p}
                    onEdit={id => setLocation(`/editor/${id}`)}
                    onDelete={handleDelete}
                  />
                ))
              )}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </DashboardLayout>
  );
}
