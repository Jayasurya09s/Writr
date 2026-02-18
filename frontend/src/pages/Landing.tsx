import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Sparkles,
  Pencil,
  ShieldCheck,
  Timer,
  BookOpen,
} from "lucide-react";
import { isAuthenticated } from "@/lib/auth";
import { useBlogStore } from "@/store/blogStore";

const features = [
  {
    title: "Block-based editor",
    desc: "Write with Lexical blocks, headings, and lists. Everything feels instant.",
    icon: Pencil,
  },
  {
    title: "Intelligent auto-save",
    desc: "Debounced saves wait for quiet moments, keeping the API clean.",
    icon: Timer,
  },
  {
    title: "AI writing assistant",
    desc: "Generate summaries or fix grammar in a single click.",
    icon: Sparkles,
  },
  {
    title: "JWT security",
    desc: "Private drafts stay private with secure token-based sessions.",
    icon: ShieldCheck,
  },
];

export default function Landing() {
  const navigate = useNavigate();
  const { publicPosts, loadPublicPosts } = useBlogStore();

  useEffect(() => {
    loadPublicPosts();
  }, [loadPublicPosts]);

  const handleCTA = () => {
    navigate(isAuthenticated() ? "/editor" : "/auth");
  };

  return (
    <div className="min-h-screen bg-paper text-ink">
      <nav className="sticky top-0 z-20 border-b border-ink/10 bg-paper/80 backdrop-blur">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-ink text-paper flex items-center justify-center">
              <Pencil className="w-4 h-4" />
            </div>
            <span className="text-sm font-semibold tracking-wide">SyncDraft</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/posts")}
              className="text-xs font-semibold text-ink-muted hover:text-ink transition"
            >
              Public posts
            </button>
            <button
              onClick={() => navigate("/auth")}
              className="text-xs font-semibold text-ink-muted hover:text-ink transition"
            >
              Sign in
            </button>
            <button
              onClick={handleCTA}
              className="text-xs font-semibold px-4 py-2 rounded-lg bg-ink text-paper hover:opacity-90 transition"
            >
              Start writing
            </button>
          </div>
        </div>
      </nav>

      <section className="relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-ink/5 blur-3xl" />
        <div className="absolute top-40 -left-24 w-72 h-72 rounded-full bg-olive/10 blur-3xl" />

        <div className="max-w-6xl mx-auto px-6 py-20 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-ink-muted">
              Notion-style blog editor
            </p>
            <h1 className="mt-5 text-4xl md:text-6xl font-serif font-semibold leading-tight">
              Write smarter drafts with an editor built for focus.
            </h1>
            <p className="mt-5 text-base text-ink-muted max-w-xl">
              SyncDraft combines a block-based editor, AI assistance, and smart
              auto-save to keep you in flow. Publish when you are ready.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                onClick={handleCTA}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-ink text-paper text-sm font-semibold shadow-paper hover:opacity-90 transition"
              >
                Open editor
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigate("/posts")}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-ink/10 text-sm font-semibold text-ink hover:bg-ink/5 transition"
              >
                Browse posts
                <BookOpen className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="bg-card border border-ink/10 rounded-3xl p-6 shadow-paper">
            <div className="text-xs font-semibold text-ink-muted uppercase tracking-[0.25em]">
              Feature highlights
            </div>
            <div className="mt-6 space-y-4">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={feature.title}
                    className="flex items-start gap-3 rounded-2xl border border-ink/10 bg-paper p-4"
                  >
                    <div className="w-9 h-9 rounded-xl bg-ink text-paper flex items-center justify-center">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-ink">
                        {feature.title}
                      </h3>
                      <p className="text-xs text-ink-muted mt-1">
                        {feature.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-ink/10 bg-paper/60">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="flex items-center justify-between gap-6 flex-wrap">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-ink-muted">
                Community
              </p>
              <h2 className="mt-3 text-2xl font-serif font-semibold">
                Latest published drafts
              </h2>
            </div>
            <button
              onClick={() => navigate("/posts")}
              className="text-xs font-semibold text-ink hover:text-ink-muted transition"
            >
              View all posts
            </button>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {publicPosts.slice(0, 4).map((post) => (
              <button
                key={post.id}
                onClick={() => navigate(`/posts/${post.id}`)}
                className="text-left rounded-2xl border border-ink/10 bg-card p-5 hover:shadow-paper transition"
              >
                <p className="text-[11px] uppercase tracking-[0.3em] text-ink-muted">
                  Published
                </p>
                <h3 className="mt-3 text-lg font-serif font-semibold">
                  {post.title || "Untitled"}
                </h3>
                <p className="mt-2 text-xs text-ink-muted line-clamp-2">
                  {post.contentText || "No preview available yet."}
                </p>
              </button>
            ))}
            {publicPosts.length === 0 && (
              <div className="text-sm text-ink-muted">No posts published yet.</div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
