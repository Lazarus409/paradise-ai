import { motion } from "framer-motion";
import { Link } from "wouter";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero */}
      <section className="container flex flex-col items-center justify-center text-center py-32">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl md:text-6xl font-bold mb-6"
        >
          Build Stunning AI Presentations
        </motion.h1>

        <p className="text-lg text-muted-foreground max-w-2xl mb-8">
          Paradise AI generates beautiful, structured, investor-ready
          presentations instantly using artificial intelligence.
        </p>

        <div className="flex gap-4">
          <Link href="/register">
            <button className="bg-primary text-primary-foreground px-6 py-3 rounded-xl shadow-lg hover:scale-105 transition">
              Get Started
            </button>
          </Link>

          <Link href="/login">
            <button className="border border-border px-6 py-3 rounded-xl hover:bg-muted transition">
              Login
            </button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="container py-20 grid md:grid-cols-3 gap-10">
        {[
          "AI Slide Generation",
          "Beautiful Templates",
          "Export to PDF / PPT",
        ].map(feature => (
          <div
            key={feature}
            className="bg-card p-6 rounded-2xl shadow-md border border-border"
          >
            <h3 className="font-semibold mb-2">{feature}</h3>
            <p className="text-muted-foreground">
              Smart automation designed for speed and clarity.
            </p>
          </div>
        ))}
      </section>
    </div>
  );
}
