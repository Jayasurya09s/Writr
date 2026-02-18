import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, BookOpen } from "lucide-react";
import { format } from "date-fns";
import { useBlogStore } from "@/store/blogStore";
import { isAuthenticated } from "@/lib/auth";

export default function PublishedPosts() {
  const navigate = useNavigate();
  const { publicPosts, loadPublicPosts, isPublicLoading } = useBlogStore();

  useEffect(() => {
    loadPublicPosts();
  }, [loadPublicPosts]);

  return (
    <div className="min-h-screen bg-paper text-ink">
      <nav className="sticky top-0 z-20 border-b border-ink/10 bg-paper/80 backdrop-blur">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-xs font-semibold text-ink-muted hover:text-ink transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Home
          </button>
          <button
            onClick={() => navigate(isAuthenticated() ? "/editor" : "/auth")}
            className="text-xs font-semibold px-4 py-2 rounded-lg bg-ink text-paper hover:opacity-90 transition"
          >
            {isAuthenticated() ? "Open editor" : "Sign in"}
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="flex items-start justify-between gap-6 flex-wrap">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-ink-muted">
              Public library
            </p>
            <h1 className="mt-3 text-3xl font-serif font-semibold">
              Published posts
            </h1>
            <p className="mt-2 text-sm text-ink-muted">
              {publicPosts.length === 0
                ? "No posts published yet."
                : `${publicPosts.length} posts available to read.`}
            </p>
          </div>
        </div>

        {isPublicLoading && (
          <div className="mt-10 text-sm text-ink-muted">Loading posts...</div>
        )}

        {!isPublicLoading && publicPosts.length === 0 && (
          <div className="mt-12 rounded-2xl border border-ink/10 bg-card p-10 text-center">
            <div className="mx-auto w-12 h-12 rounded-2xl bg-ink/10 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-ink" />
            </div>
            <h2 className="mt-4 text-lg font-semibold">No published posts</h2>
            <p className="mt-2 text-sm text-ink-muted">
              Publish a draft from the editor to share it publicly.
            </p>
          </div>
        )}

        <div className="mt-8 grid gap-4">
          {publicPosts.map((post) => (
            <article
              key={post.id}
              onClick={() => navigate(`/posts/${post.id}`)}
              className="group cursor-pointer rounded-2xl border border-ink/10 bg-card p-6 hover:shadow-paper transition"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.3em] text-ink-muted">
                    Published · {format(post.updatedAt, "MMM d, yyyy")}
                  </p>
                  <h2 className="mt-3 text-xl font-serif font-semibold">
                    {post.title || "Untitled"}
                  </h2>
                  <p className="mt-2 text-sm text-ink-muted line-clamp-2">
                    {post.contentText || "No preview available."}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-ink/5 flex items-center justify-center group-hover:bg-ink/10 transition">
                  <ArrowRight className="w-4 h-4 text-ink" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
