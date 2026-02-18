import React, { useState, useEffect } from "react";
import { format, formatDistanceToNow } from "date-fns";
import {
  Plus,
  FileText,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Globe,
  Lock,
  Search,
  BookOpen,
} from "lucide-react";
import { useBlogStore, Post } from "@/store/blogStore";
import { cn } from "@/lib/utils";

interface DraftsSidebarProps {
  isOpen: boolean;
}

export default function DraftsSidebar({ isOpen }: DraftsSidebarProps) {
  const {
    posts,
    publicPosts,
    activePostId,
    createPost,
    deletePost,
    setActivePost,
    toggleSidebar,
    publishPost,
    unpublishPost,
    loadPublicPosts,
    sidebarTab,
    setSidebarTab,
    isPublicLoading,
  } = useBlogStore();

  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (sidebarTab === "public") {
      loadPublicPosts();
    }
  }, [sidebarTab, loadPublicPosts]);

  const filtered = (sidebarTab === "my-posts" ? posts : publicPosts).filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.contentText.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = () => {
    createPost();
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setDeletingId(id);
    setTimeout(() => {
      deletePost(id);
      setDeletingId(null);
    }, 300);
  };

  const handleTogglePublish = (e: React.MouseEvent, post: Post) => {
    e.stopPropagation();
    if (post.status === "published") {
      unpublishPost(post.id);
    } else {
      publishPost(post.id);
    }
  };

  return (
    <aside
      className={cn(
        "flex flex-col h-full transition-all duration-300 ease-in-out",
        "bg-sidebar text-sidebar-foreground border-r border-sidebar-border",
        isOpen ? "w-72" : "w-0 overflow-hidden"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-5 pb-3">
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-md flex items-center justify-center"
            style={{ background: "hsl(var(--gradient-accent, 35 90% 55%))" }}
          >
            <FileText className="w-4 h-4 text-sidebar-primary-foreground" />
          </div>
          <span className="text-sm font-semibold tracking-wide text-sidebar-foreground/90">
            {sidebarTab === "my-posts" ? "Blog Editor" : "Published"}
          </span>
        </div>
        <button
          onClick={toggleSidebar}
          className="p-1.5 rounded-md hover:bg-sidebar-accent transition-colors text-sidebar-foreground/50 hover:text-sidebar-foreground"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 px-3 pb-3">
        <button
          onClick={() => setSidebarTab("my-posts")}
          className={cn(
            "flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all",
            sidebarTab === "my-posts"
              ? "bg-sidebar-primary text-sidebar-primary-foreground"
              : "bg-sidebar-accent text-sidebar-foreground/60 hover:text-sidebar-foreground"
          )}
        >
          My Posts
        </button>
        <button
          onClick={() => setSidebarTab("public")}
          className={cn(
            "flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5",
            sidebarTab === "public"
              ? "bg-sidebar-primary text-sidebar-primary-foreground"
              : "bg-sidebar-accent text-sidebar-foreground/60 hover:text-sidebar-foreground"
          )}
        >
          <Globe className="w-3 h-3" />
          Public
        </button>
      </div>

      {/* New Post button - only for My Posts tab */}
      {sidebarTab === "my-posts" && (
        <div className="px-3 pb-3">
          <button
            onClick={handleCreate}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all
              text-sidebar-primary-foreground bg-sidebar-primary hover:opacity-90 active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            New Post
          </button>
        </div>
      )}

      {/* Search */}
      <div className="px-3 pb-3">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-sidebar-foreground/40" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={sidebarTab === "my-posts" ? "Search posts..." : "Search public..."}
            className="w-full pl-8 pr-3 py-2 text-xs rounded-lg bg-sidebar-accent border border-sidebar-border
              text-sidebar-foreground placeholder:text-sidebar-foreground/40 focus:outline-none
              focus:ring-1 focus:ring-sidebar-primary transition-all"
          />
        </div>
      </div>

      {/* Divider */}
      <div className="mx-3 mb-2 border-t border-sidebar-border/50" />

      {/* Count */}
      <div className="px-4 pb-2 flex items-center justify-between">
        <span className="text-xs text-sidebar-foreground/40 uppercase tracking-widest font-medium">
          {sidebarTab === "my-posts" ? "Posts" : "Publis"}
        </span>
        <span className="text-xs text-sidebar-foreground/40">{filtered.length}</span>
      </div>

      {/* Posts list */}
      <div className="flex-1 overflow-y-auto px-2 space-y-1 pb-4">
        {isPublicLoading && sidebarTab === "public" && (
          <div className="px-4 py-4 text-center text-sidebar-foreground/40 text-xs">
            Loading public posts...
          </div>
        )}
        {filtered.length === 0 && !isPublicLoading && (
          <div className="px-4 py-8 text-center text-sidebar-foreground/40 text-xs">
            {search ? "No posts found" : sidebarTab === "my-posts" ? "No posts yet. Create one!" : "No published posts"}
          </div>
        )}
        {filtered.map((post) => (
          <div
            key={post.id}
            onClick={() => setActivePost(post.id)}
            className={cn(
              "sidebar-item group relative",
              activePostId === post.id && sidebarTab === "my-posts" && "active",
              deletingId === post.id && "opacity-0 scale-95 transition-all"
            )}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate leading-tight">
                  {post.title || "Untitled Post"}
                </p>
                <p className="text-xs text-sidebar-foreground/50 mt-0.5 truncate">
                  {sidebarTab === "public" && post.author ? (
                    <span>by {post.author.full_name}</span>
                  ) : (
                    <>
                      {post.contentText
                        ? post.contentText.slice(0, 50) + (post.contentText.length > 50 ? "…" : "")
                        : "No content yet"}
                    </>
                  )}
                </p>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                {sidebarTab === "my-posts" && (
                  <>
                    <button
                      onClick={(e) => handleTogglePublish(e, post)}
                      title={post.status === "published" ? "Unpublish" : "Publish"}
                      className="p-1 rounded hover:bg-sidebar-border transition-colors"
                    >
                      {post.status === "published" ? (
                        <Globe className="w-3 h-3 text-status-published" />
                      ) : (
                        <Lock className="w-3 h-3 text-sidebar-foreground/40" />
                      )}
                    </button>
                    <button
                      onClick={(e) => handleDelete(e, post.id)}
                      title="Delete post"
                      className="p-1 rounded hover:bg-destructive/20 text-sidebar-foreground/40 hover:text-destructive transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 mt-1">
              <span
                className={cn(
                  "text-[10px] px-1.5 py-0.5 rounded-full font-medium",
                  post.status === "published" ? "status-published" : "status-draft"
                )}
              >
                {post.status === "published" ? "Published" : "Draft"}
              </span>
              <span className="text-[10px] text-sidebar-foreground/35">
                {formatDistanceToNow(post.updatedAt, { addSuffix: true })}
              </span>
              {post.wordCount > 0 && (
                <span className="text-[10px] text-sidebar-foreground/35">
                  {post.wordCount}w
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-sidebar-border/50 text-[10px] text-sidebar-foreground/30">
        {sidebarTab === "my-posts" ? (
          <>
            {posts.length} post{posts.length !== 1 ? "s" : ""} ·{" "}
            {posts.filter((p) => p.status === "published").length} published
          </>
        ) : (
          `${publicPosts.length} public post${publicPosts.length !== 1 ? "s" : ""}`
        )}
      </div>
    </aside>
  );
}
