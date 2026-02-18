import { useParams, useNavigate } from "react-router-dom";
import { useBlogStore } from "@/store/blogStore";
import { ArrowLeft, User, BookOpen, Calendar } from "lucide-react";
import { format } from "date-fns";

export default function UserProfile() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { publicPosts } = useBlogStore();

  // Get all posts by this author
  const authorPosts = publicPosts.filter((p) => p.author?.id === userId);
  const author = authorPosts[0]?.author;

  if (!author || authorPosts.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center text-center px-4">
        <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-5">
          <User className="w-7 h-7 text-muted-foreground" />
        </div>
        <h1 className="font-serif text-2xl font-bold text-foreground mb-2">Author not found</h1>
        <p className="text-sm text-muted-foreground mb-6">
          No published posts from this author yet.
        </p>
        <button
          onClick={() => navigate("/posts")}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Posts
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <nav className="sticky top-0 z-40 backdrop-blur-md bg-background/80 border-b border-border/50">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
          <button
            onClick={() => navigate("/posts")}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            All Posts
          </button>

          <span className="font-semibold text-sm">SyncDraft AI</span>

          <div className="w-8" />
        </div>
      </nav>

      {/* Profile Header */}
      <div className="max-w-4xl mx-auto px-6 py-14">
        <div className="text-center mb-14">
          <div className="w-24 h-24 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-5">
            <User className="w-12 h-12 text-accent" />
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-3">
            {author.full_name}
          </h1>
          <p className="text-muted-foreground mb-6">
            {authorPosts.length} published post{authorPosts.length !== 1 ? "s" : ""}
          </p>
          <div className="border-b border-border/60" />
        </div>

        {/* Author's Posts */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-8">Published Posts</h2>
          <div className="space-y-5">
            {authorPosts.map((post, i) => (
              <article
                key={post.id}
                onClick={() => navigate(`/posts/${post.id}`)}
                className="group cursor-pointer p-7 rounded-2xl border border-border bg-card
                  hover:border-accent/40 hover:shadow-md transition-all duration-300"
                style={{ animationDelay: `${i * 80}ms`, animationFillMode: "both" }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-3 flex-wrap">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-accent px-2 py-0.5 rounded-full bg-accent/10">
                        Published
                      </span>
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {format(post.updatedAt, "MMM d, yyyy")}
                      </span>
                      {post.wordCount > 0 && (
                        <span className="text-[10px] text-muted-foreground">
                          {post.wordCount}w · {Math.ceil(post.wordCount / 200)} min read
                        </span>
                      )}
                    </div>

                    <h3 className="font-serif font-bold text-xl text-foreground mb-2 group-hover:text-accent transition-colors leading-snug">
                      {post.title || "Untitled Post"}
                    </h3>

                    {post.contentText && (
                      <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                        {post.contentText.slice(0, 200)}
                        {post.contentText.length > 200 ? "…" : ""}
                      </p>
                    )}
                  </div>

                  <div className="shrink-0 w-9 h-9 rounded-xl bg-muted flex items-center justify-center group-hover:bg-accent/10 transition-colors">
                    <ArrowLeft className="w-4 h-4 text-muted-foreground group-hover:text-accent transition-colors rotate-180" />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      <footer className="border-t border-border/50 py-6 px-6 text-center text-xs text-muted-foreground/50">
        SyncDraft AI · All rights reserved
      </footer>
    </div>
  );
}
