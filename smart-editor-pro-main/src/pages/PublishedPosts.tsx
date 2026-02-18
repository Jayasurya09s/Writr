import React from "react";
import { useNavigate } from "react-router-dom";
import { useBlogStore } from "@/store/blogStore";
import { format } from "date-fns";
import { PenLine, ArrowLeft, ArrowRight, BookOpen, Clock, Hash, User } from "lucide-react";
import { isAuthenticated } from "@/lib/auth";

export default function PublishedPosts() {
  const navigate = useNavigate();
  const { publicPosts, loadPublicPosts } = useBlogStore();

  // Load public posts on mount
  React.useEffect(() => {
    loadPublicPosts();
  }, [loadPublicPosts]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <nav className="sticky top-0 z-40 backdrop-blur-md bg-background/80 border-b border-border/50">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Home
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
            {isAuthenticated() ? "Open Editor" : "Sign In"}
          </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-14">
        {/* Header */}
        <div className="mb-12 animate-fade-in">
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium mb-3">
            Public posts
          </p>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
            Published Posts
          </h1>
          <p className="text-muted-foreground text-sm">
            {publicPosts.length === 0
              ? "No posts have been published yet."
              : `${publicPosts.length} post${publicPosts.length !== 1 ? "s" : ""} available to read.`}
          </p>
        </div>

        {/* Empty state */}
        {publicPosts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-5">
              <BookOpen className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="font-semibold text-foreground mb-2">Nothing here yet</h2>
            <p className="text-sm text-muted-foreground mb-6 max-w-xs">
              Once you publish posts from the editor, they'll appear here for everyone to read.
            </p>
            <button
              onClick={() => navigate(isAuthenticated() ? "/editor" : "/auth")}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-all"
            >
              <PenLine className="w-4 h-4" />
              Start Writing
            </button>
          </div>
        )}

        {/* Posts grid */}
        {publicPosts.length > 0 && (
          <div className="space-y-5">
            {publicPosts.map((post, i) => (
              <article
                key={post.id}
                onClick={() => navigate(`/posts/${post.id}`)}
                className="group cursor-pointer p-7 rounded-2xl border border-border bg-card
                  hover:border-accent/40 hover:shadow-md transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${i * 80}ms`, animationFillMode: "both" }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-3 flex-wrap">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-accent px-2 py-0.5 rounded-full bg-accent/10">
                        Published
                      </span>
                      {post.author && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/profile/${post.author!.id}`);
                          }}
                          className="text-[10px] text-muted-foreground hover:text-accent transition-colors flex items-center gap-1"
                        >
                          <User className="w-3 h-3" />
                          {post.author.full_name}
                        </button>
                      )}
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {format(post.updatedAt, "MMM d, yyyy")}
                      </span>
                      {post.wordCount > 0 && (
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                          <Hash className="w-3 h-3" />
                          {post.wordCount}w ·{" "}
                          {Math.ceil(post.wordCount / 200)} min read
                        </span>
                      )}
                    </div>

                    <h2 className="font-serif font-bold text-xl text-foreground mb-2 group-hover:text-accent transition-colors leading-snug">
                      {post.title || "Untitled Post"}
                    </h2>

                    {post.contentText && (
                      <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                        {post.contentText.slice(0, 200)}
                        {post.contentText.length > 200 ? "…" : ""}
                      </p>
                    )}
                  </div>

                  <div className="shrink-0 w-9 h-9 rounded-xl bg-muted flex items-center justify-center group-hover:bg-accent/10 transition-colors">
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-accent transition-colors" />
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      <footer className="border-t border-border/50 py-6 px-6 text-center text-xs text-muted-foreground/50">
        Writr · All rights reserved
      </footer>
    </div>
  );
}
