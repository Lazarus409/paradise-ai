import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, Sparkles, Star, WandSparkles } from "lucide-react";
import {
  coreFeatures,
  heroBullets,
  integrations,
  templates,
} from "@/data/product";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
};

export default function Home() {
  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.18),transparent_34%),radial-gradient(circle_at_top_right,rgba(139,92,246,0.16),transparent_26%),radial-gradient(circle_at_bottom,rgba(34,197,94,0.14),transparent_30%)]" />

      <section className="container relative py-24 md:py-32">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <motion.div
            initial="initial"
            animate="animate"
            transition={{ staggerChildren: 0.12 }}
            className="space-y-8"
          >
            <motion.h1
              variants={fadeUp}
              className="text-balance text-5xl font-semibold tracking-tight md:text-7xl"
            >
              Build decks that feel like your brand, not a generic template.
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="max-w-2xl text-lg text-muted-foreground md:text-xl"
            >
              Paradise AI turns prompts, notes, and source material into
              polished presentation flows with smart structure, beautiful
              themes, and a visual language that feels personal.
            </motion.p>

            <motion.ul
              variants={fadeUp}
              className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-3"
            >
              {heroBullets.map(item => (
                <li
                  key={item}
                  className="rounded-2xl border border-border/60 bg-card/80 px-4 py-3 shadow-sm backdrop-blur"
                >
                  <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Star className="h-4 w-4" />
                  </div>
                  {item}
                </li>
              ))}
            </motion.ul>

            <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="gap-2 rounded-2xl px-6">
                <Link href="/register">
                  Start creating
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>

              <Button
                asChild
                size="lg"
                variant="outline"
                className="gap-2 rounded-2xl px-6"
              >
                <Link href="/login">
                  Sign in
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative"
          >
            <div className="absolute -inset-8 rounded-4xl bg-linear-to-br from-primary/15 via-transparent to-emerald-400/10 blur-3xl" />
            <Card className="relative overflow-hidden border-border/70 bg-card/90 shadow-2xl backdrop-blur">
              <CardContent className="space-y-6 p-6 md:p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Live presentation command center
                    </p>
                    <h2 className="text-2xl font-semibold">
                      Prompt to deck in minutes
                    </h2>
                  </div>
                  <div className="rounded-full bg-primary/10 p-3 text-primary">
                    <WandSparkles className="h-5 w-5" />
                  </div>
                </div>

                <div className="rounded-3xl border border-border/70 bg-background/70 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    Example prompt
                  </p>
                  <p className="mt-2 text-lg font-medium">
                    "Create a brand-first pitch deck for my product launch."
                  </p>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  {["Outline", "Theme", "Speaker notes", "Share link"].map(
                    item => (
                      <div
                        key={item}
                        className="rounded-2xl border border-border/70 bg-background/60 px-4 py-3 text-sm font-medium"
                      >
                        {item}
                      </div>
                    )
                  )}
                </div>

                <div className="rounded-3xl border border-border/70 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-5 text-slate-50 shadow-lg">
                  <div className="flex items-center justify-between text-sm text-slate-300">
                    <span>Generated deck</span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1">
                      <Sparkles className="h-3.5 w-3.5" />
                      AI ready
                    </span>
                  </div>
                  <div className="mt-4 space-y-3">
                    <div className="h-3 w-2/3 rounded-full bg-white/15" />
                    <div className="h-3 w-full rounded-full bg-white/10" />
                    <div className="h-3 w-5/6 rounded-full bg-white/10" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      <section className="container relative py-8 md:py-12">
        <div className="grid gap-4 md:grid-cols-3">
          {templates.map(template => (
            <Card key={template.name} className="border-border/70 bg-card/90">
              <CardContent className="space-y-2 p-6">
                <p className="text-sm text-muted-foreground">Template</p>
                <h3 className="text-xl font-semibold">{template.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {template.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="container py-16 md:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="space-y-3">
              <Badge
                variant="outline"
                className="w-fit rounded-full px-4 py-1.5"
              >
                Built for personal brands
              </Badge>
              <h2 className="text-3xl font-semibold md:text-5xl">
                Everything you need to move from idea to polished deck.
              </h2>
            </div>
            <p className="max-w-2xl text-muted-foreground">
              The product includes a richer generation flow, a modern editor,
              sharing, and integration-ready building blocks for the tools you
              already use.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {coreFeatures.map(feature => {
              const Icon = feature.icon;

              return (
                <Card key={feature.title} className="border-border/70">
                  <CardContent className="space-y-4 p-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-xl font-semibold">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="container py-16 md:py-20">
        <div className="mx-auto max-w-6xl rounded-4xl border border-border/70 bg-card/80 p-6 shadow-xl backdrop-blur md:p-10">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
                Ready for the tools your team already trusts.
              </h2>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {integrations.map(integration => (
              <div
                key={integration.name}
                className="rounded-3xl border border-border/70 bg-background/70 p-5"
              >
                <p className="font-semibold">{integration.name}</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {integration.summary}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container py-16 md:py-20">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <Card className="border-border/70">
            <CardContent className="space-y-4 p-6 md:p-8">
              <p className="text-sm uppercase tracking-[0.25em] text-muted-foreground">
                Always free
              </p>
              <h2 className="text-3xl font-semibold">
                Start creating without a paywall.
              </h2>
            </CardContent>
          </Card>

          <Card className="border-border/70">
            <CardContent className="grid gap-3 p-6 md:p-8 sm:grid-cols-2">
              {[
                "Login required for the workspace",
                "Free access to the dashboard",
                "Brand-first presentation flow",
                "No billing screens to interrupt the work",
              ].map(item => (
                <div
                  key={item}
                  className="rounded-2xl border border-border/70 bg-background/70 px-4 py-3 text-sm font-medium"
                >
                  {item}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
