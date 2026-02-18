import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, User } from "lucide-react";
import { format } from "date-fns";
import { useBlogStore } from "@/store/blogStore";

export default function UserProfile() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { publicPosts, loadPublicPosts } = useBlogStore();

  useEffect(() => {
    if (publicPosts.length === 0) {
      loadPublicPosts();
    }
  }, [publicPosts.length, loadPublicPosts]);

  const authorPosts = publicPosts.filter((post) => post.author?.id === userId);
  const author = authorPosts[0]?.author;

  if (!author || authorPosts.length === 0) {
    return (
      <div className="min-h-screen bg-paper text-ink flex flex-col items-center justify-center px-6">
        <div className="w-14 h-14 rounded-2xl bg-ink/10 flex items-center justify-center">
          <User className="w-6 h-6 text-ink" />
        </div>
        <h1 className="mt-5 text-2xl font-serif font-semibold">Author not found</h1>
        <p className="mt-2 text-sm text-ink-muted">
          No published posts from this author yet.
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
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center">
          <button
            onClick={() => navigate("/posts")}
            className="flex items-center gap-2 text-xs font-semibold text-ink-muted hover:text-ink transition"
          >
            <ArrowLeft className="w-4 h-4" />
            All posts
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="rounded-3xl border border-ink/10 bg-card p-8 shadow-paper">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-ink/10 flex items-center justify-center">
              <User className="w-7 h-7 text-ink" />
            </div>
            <h1 className="mt-5 text-3xl font-serif font-semibold">
              {author.full_name}
            </h1>
            <p className="mt-2 text-sm text-ink-muted">
              {authorPosts.length} published post{authorPosts.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        <div className="mt-10 grid gap-4">
          {authorPosts.map((post) => (
            <button
              key={post.id}
              onClick={() => navigate(`/posts/${post.id}`)}
              className="text-left rounded-2xl border border-ink/10 bg-card p-6 hover:shadow-paper transition"
            >
              <p className="text-[11px] uppercase tracking-[0.3em] text-ink-muted">
                Published · {format(post.updatedAt, "MMM d, yyyy")}
              </p>
              <h2 className="mt-3 text-xl font-serif font-semibold">
                {post.title || "Untitled"}
              </h2>
              <p className="mt-2 text-sm text-ink-muted line-clamp-2">
                {post.contentText || "No preview available."}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
