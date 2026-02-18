import { useParams, useNavigate } from "react-router-dom";
import { useBlogStore } from "@/store/blogStore";
import { format } from "date-fns";
import { ArrowLeft, ArrowRight, Clock, Hash, PenLine, User } from "lucide-react";
import { isAuthenticated } from "@/lib/auth";

export default function PostReader() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { publicPosts } = useBlogStore();
  const post = publicPosts.find((p) => p.id === id);

  if (!post) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center text-center px-4">
        <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-5">
          <PenLine className="w-7 h-7 text-muted-foreground" />
        </div>
        <h1 className="font-serif text-2xl font-bold text-foreground mb-2">Post not found</h1>
        <p className="text-sm text-muted-foreground mb-6">
          This post might be unpublished or doesn't exist.
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

  // Parse content paragraphs from contentText
  const paragraphs = post.contentText
    ? post.contentText.split(/\n+/).filter(Boolean)
    : [];

  const handleAuthorClick = (authorId: string) => {
    navigate(`/profile/${authorId}`);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <nav className="sticky top-0 z-40 backdrop-blur-md bg-background/80 border-b border-border/50">
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
          <button
            onClick={() => navigate("/posts")}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            All Posts
          </button>

          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-accent flex items-center justify-center">
              <PenLine className="w-3.5 h-3.5 text-accent-foreground" />
            </div>
            <span className="font-semibold text-sm">Writr</span>
          </div>

          <button
            onClick={() => navigate(isAuthenticated() ? "/editor" : "/auth")}
            className="text-sm px-4 py-1.5 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-all"
          >
            {isAuthenticated() ? "Editor" : "Sign In"}
          </button>
        </div>
      </nav>

      {/* Article */}
      <article className="max-w-3xl mx-auto px-6 py-14 animate-fade-in">
        {/* Meta */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-5">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-accent px-2.5 py-1 rounded-full bg-accent/10">
              Published
            </span>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {format(post.updatedAt, "MMMM d, yyyy")}
            </span>
            {post.wordCount > 0 && (
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Hash className="w-3 h-3" />
                {Math.ceil(post.wordCount / 200)} min read
              </span>
            )}
          </div>

          <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground leading-tight mb-6">
            {post.title || "Untitled Post"}
          </h1>

          {/* Author info */}
          {post.author && (
            <button
              onClick={() => handleAuthorClick(post.author!.id)}
              className="flex items-center gap-3 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors mb-6 text-left"
            >
              <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                <User className="w-6 h-6 text-accent" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">By</p>
                <p className="text-sm font-semibold text-foreground hover:text-accent transition-colors">
                  {post.author.full_name}
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground" />
            </button>
          )}

          <div className="border-b border-border/60" />
        </div>

        {/* Content */}
        <div className="editor-content">
          {paragraphs.length > 0 ? (
            paragraphs.map((para, i) => (
              <p key={i} className="mb-5">
                {para}
              </p>
            ))
          ) : (
            <p className="text-muted-foreground italic">No content available.</p>
          )}
        </div>

        {/* Footer nav */}
        <div className="mt-16 pt-8 border-t border-border/50 flex items-center justify-between">
          <button
            onClick={() => navigate("/posts")}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            All Posts
          </button>
          <button
            onClick={() => navigate(isAuthenticated() ? "/editor" : "/auth")}
            className="text-sm px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-all"
          >
            {isAuthenticated() ? "Write a Post" : "Sign Up to Write"}
          </button>
        </div>
      </article>
    </div>
  );
}
