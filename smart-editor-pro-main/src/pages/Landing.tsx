import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "@/lib/auth";
import {
  PenLine,
  Sparkles,
  Zap,
  Globe,
  ShieldCheck,
  ArrowRight,
  BookOpen,
} from "lucide-react";
import { useBlogStore } from "@/store/blogStore";

const features = [
  {
    icon: PenLine,
    title: "Notion-style Editor",
    desc: "Rich text powered by Lexical. Headings, bold, lists, and more — all keyboard-native.",
  },
  {
    icon: Zap,
    title: "Intelligent Auto-Save",
    desc: "Debounced saving triggers only after you stop typing. No keystroke spam.",
  },
  {
    icon: Sparkles,
    title: "AI Writing Assistant",
    desc: "Generate summaries or fix grammar with a single click using streaming AI responses.",
  },
  {
    icon: Globe,
    title: "One-Click Publish",
    desc: "Toggle between Draft and Published instantly. Share your work with the world.",
  },
  {
    icon: ShieldCheck,
    title: "JWT Authentication",
    desc: "Token-based auth keeps your posts private and your session secure.",
  },
  {
    icon: BookOpen,
    title: "Public Reader View",
    desc: "Visitors can browse and read all published posts without logging in.",
  },
];

export default function Landing() {
  const navigate = useNavigate();
  const { posts } = useBlogStore();
  const publishedPosts = posts.filter((p) => p.status === "published");
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Stagger animate hero children
    const el = heroRef.current;
    if (!el) return;
    const children = Array.from(el.children) as HTMLElement[];
    children.forEach((child, i) => {
      child.style.opacity = "0";
      child.style.transform = "translateY(24px)";
      setTimeout(() => {
        child.style.transition = "opacity 0.6s ease, transform 0.6s ease";
        child.style.opacity = "1";
        child.style.transform = "translateY(0)";
      }, 100 + i * 120);
    });
  }, []);

  const handleCTA = () => {
    if (isAuthenticated()) {
      navigate("/editor");
    } else {
      navigate("/auth");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* ── Nav ── */}
      <nav className="fixed top-0 inset-x-0 z-50 backdrop-blur-md bg-background/80 border-b border-border/50">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-accent flex items-center justify-center">
              <PenLine className="w-4 h-4 text-accent-foreground" />
            </div>
            <span className="font-semibold text-sm tracking-wide">Writr</span>
          </div>
          <div className="flex items-center gap-3">
            {publishedPosts.length > 0 && (
              <button
                onClick={() => navigate("/posts")}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Read Posts
              </button>
            )}
            <button
              onClick={() => navigate("/auth")}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={handleCTA}
              className="text-sm px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-all font-medium"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative pt-36 pb-28 px-6 overflow-hidden">
        {/* Background glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% -10%, hsl(var(--accent) / 0.12), transparent 70%)",
          }}
        />

        <div ref={heroRef} className="max-w-3xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full border border-accent/30 bg-accent/8 text-accent mb-8">
            <Sparkles className="w-3 h-3" />
            AI-powered · Auto-save · JWT Auth
          </div>

          <h1 className="font-serif text-5xl md:text-7xl font-bold leading-[1.1] tracking-tight text-foreground mb-6">
            Write, Think &amp;{" "}
            <span className="relative">
              <span
                style={{
                  background: "var(--gradient-accent)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Publish
              </span>
            </span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl mx-auto mb-10">
            A professional blog editor built with Lexical, Zustand, and
            streaming AI — exactly how modern writing tools should feel.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handleCTA}
              className="group flex items-center gap-2 px-7 py-3.5 rounded-xl bg-primary text-primary-foreground
                font-semibold text-sm hover:opacity-90 active:scale-[0.98] transition-all shadow-md"
            >
              Start Writing
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            {publishedPosts.length > 0 && (
              <button
                onClick={() => navigate("/posts")}
                className="flex items-center gap-2 px-7 py-3.5 rounded-xl border border-border
                  text-sm font-medium text-foreground hover:bg-muted transition-all"
              >
                <BookOpen className="w-4 h-4" />
                Browse {publishedPosts.length} Published Post
                {publishedPosts.length !== 1 ? "s" : ""}
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium mb-3">
              Everything you need
            </p>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
              Built for serious writers
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="group p-6 rounded-2xl border border-border bg-card hover:border-accent/40
                    hover:shadow-md transition-all duration-300 animate-fade-in"
                  style={{ animationDelay: `${i * 80}ms`, animationFillMode: "both" }}
                >
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center mb-4
                    group-hover:bg-accent/20 transition-colors">
                    <Icon className="w-5 h-5 text-accent" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2 text-sm">{f.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Published posts preview ── */}
      {publishedPosts.length > 0 && (
        <section className="py-20 px-6 bg-muted/30 border-y border-border/50">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-10">
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium mb-1">
                  From the blog
                </p>
                <h2 className="font-serif text-2xl font-bold text-foreground">
                  Latest Posts
                </h2>
              </div>
              <button
                onClick={() => navigate("/posts")}
                className="text-sm text-accent font-medium flex items-center gap-1 hover:gap-2 transition-all"
              >
                View all <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {publishedPosts.slice(0, 4).map((post, i) => (
                <button
                  key={post.id}
                  onClick={() => navigate(`/posts/${post.id}`)}
                  className="text-left p-5 rounded-xl border border-border bg-card hover:border-accent/40
                    hover:shadow-md transition-all duration-300 animate-fade-in group"
                  style={{ animationDelay: `${i * 80}ms`, animationFillMode: "both" }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-accent/80 px-2 py-0.5 rounded-full bg-accent/10">
                      Published
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {post.wordCount}w
                    </span>
                  </div>
                  <h3 className="font-serif font-semibold text-foreground text-base mb-2 group-hover:text-accent transition-colors leading-snug">
                    {post.title || "Untitled Post"}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {post.contentText || "No preview available"}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA bottom ── */}
      <section className="py-24 px-6 text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
            Ready to write?
          </h2>
          <p className="text-muted-foreground mb-8 text-sm leading-relaxed">
            Join and start crafting your ideas. Your drafts are saved automatically.
          </p>
          <button
            onClick={handleCTA}
            className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl
              bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90
              active:scale-[0.98] transition-all shadow-lg"
          >
            Open the Editor
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-border/50 py-6 px-6 text-center text-xs text-muted-foreground/50">
        Writr · Built with React, Lexical, Zustand &amp; Tailwind CSS
      </footer>
    </div>
  );
}
