import { useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, User } from "lucide-react";
import { format } from "date-fns";
import { useBlogStore } from "@/store/blogStore";
import { isAuthenticated } from "@/lib/auth";

export default function PostReader() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { publicPosts, loadPublicPosts, isPublicLoading } = useBlogStore();

  useEffect(() => {
    if (publicPosts.length === 0) {
      loadPublicPosts();
    }
  }, [publicPosts.length, loadPublicPosts]);

  const post = publicPosts.find((item) => item.id === id);
  const paragraphs = useMemo(() => {
    if (!post?.contentText) return [];
    return post.contentText.split(/\n+/).filter(Boolean);
  }, [post?.contentText]);

  if (!post) {
    return (
      <div className="min-h-screen bg-paper text-ink flex flex-col items-center justify-center px-6">
        <h1 className="text-2xl font-serif font-semibold">Post not found</h1>
        <p className="mt-2 text-sm text-ink-muted">
          {isPublicLoading
            ? "Loading posts..."
            : "This post might be unpublished or removed."}
        </p>
        <button
          onClick={() => navigate("/posts")}
          className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-ink text-paper text-sm font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to posts
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper text-ink">
      <nav className="sticky top-0 z-20 border-b border-ink/10 bg-paper/80 backdrop-blur">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
          <button
            onClick={() => navigate("/posts")}
            className="flex items-center gap-2 text-xs font-semibold text-ink-muted hover:text-ink transition"
          >
            <ArrowLeft className="w-4 h-4" />
            All posts
          </button>
          <button
            onClick={() => navigate(isAuthenticated() ? "/editor" : "/auth")}
            className="text-xs font-semibold px-4 py-2 rounded-lg bg-ink text-paper hover:opacity-90 transition"
          >
            {isAuthenticated() ? "Open editor" : "Sign in"}
          </button>
        </div>
      </nav>

      <article className="max-w-3xl mx-auto px-6 py-14">
        <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.3em] text-ink-muted">
          <span>Published</span>
          <span>·</span>
          <span>{format(post.updatedAt, "MMMM d, yyyy")}</span>
        </div>

        <h1 className="mt-4 text-4xl md:text-5xl font-serif font-semibold">
          {post.title || "Untitled"}
        </h1>

        {post.author && (
          <button
            onClick={() => navigate(`/profile/${post.author!.id}`)}
            className="mt-6 flex items-center gap-3 rounded-2xl border border-ink/10 bg-card px-4 py-3 text-left hover:shadow-paper transition"
          >
            <div className="w-10 h-10 rounded-full bg-ink/10 flex items-center justify-center">
              <User className="w-5 h-5 text-ink" />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.3em] text-ink-muted">
                Author
              </p>
              <p className="text-sm font-semibold text-ink">
                {post.author.full_name}
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-ink-muted ml-auto" />
          </button>
        )}

        <div className="mt-10 editor-content">
          {paragraphs.length > 0 ? (
            paragraphs.map((para, index) => <p key={index}>{para}</p>)
          ) : (
            <p className="text-ink-muted italic">No content available.</p>
          )}
        </div>
      </article>
    </div>
  );
}
