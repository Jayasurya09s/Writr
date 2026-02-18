import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import {
  Plus,
  Search,
  Globe,
  Lock,
  Trash2,
  ChevronLeft,
  BookOpen,
} from "lucide-react";
import { useBlogStore, Post } from "@/store/blogStore";
import { cn } from "@/lib/utils";

interface DraftsSidebarProps {
  isOpen: boolean;
}

export default function DraftsSidebar({ isOpen }: DraftsSidebarProps) {
  const navigate = useNavigate();
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

  const filtered = useMemo(() => {
    const list = sidebarTab === "my-posts" ? posts : publicPosts;
    return list.filter((post) => {
      const query = search.toLowerCase();
      return (
        post.title.toLowerCase().includes(query) ||
        post.contentText.toLowerCase().includes(query)
      );
    });
  }, [posts, publicPosts, sidebarTab, search]);

  const handleDelete = (event: React.MouseEvent, id: string) => {
    event.stopPropagation();
    setDeletingId(id);
    setTimeout(() => {
      deletePost(id);
      setDeletingId(null);
    }, 250);
  };

  const handleTogglePublish = (event: React.MouseEvent, post: Post) => {
    event.stopPropagation();
    if (post.status === "published") {
      unpublishPost(post.id);
    } else {
      publishPost(post.id);
    }
  };

  return (
    <aside
      className={cn(
        "transition-all duration-300",
        "bg-ink text-paper border-r border-ink/10",
        isOpen ? "w-80" : "w-0 overflow-hidden"
      )}
    >
      <div className="h-full flex flex-col">
        <div className="px-4 pt-5 pb-4 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-paper/50">
              Workspace
            </p>
            <h2 className="text-sm font-semibold text-paper">
              {sidebarTab === "my-posts" ? "My Drafts" : "Public Library"}
            </h2>
          </div>
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-paper/10 transition"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        <div className="px-4 pb-4 flex gap-2">
          <button
            onClick={() => setSidebarTab("my-posts")}
            className={cn(
              "flex-1 px-3 py-2 rounded-lg text-xs font-semibold transition",
              sidebarTab === "my-posts"
                ? "bg-paper text-ink"
                : "bg-paper/10 text-paper/70 hover:text-paper"
            )}
          >
            My posts
          </button>
          <button
            onClick={() => setSidebarTab("public")}
            className={cn(
              "flex-1 px-3 py-2 rounded-lg text-xs font-semibold transition",
              sidebarTab === "public"
                ? "bg-paper text-ink"
                : "bg-paper/10 text-paper/70 hover:text-paper"
            )}
          >
            Public
          </button>
        </div>

        {sidebarTab === "my-posts" && (
          <div className="px-4 pb-4">
            <button
              onClick={() => createPost()}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold bg-paper text-ink hover:opacity-90 transition"
            >
              <Plus className="w-4 h-4" />
              New draft
            </button>
          </div>
        )}

        <div className="px-4 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-paper/40" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={sidebarTab === "my-posts" ? "Search drafts" : "Search library"}
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-paper/10 text-paper text-xs placeholder:text-paper/40 border border-paper/10 focus:outline-none focus:ring-1 focus:ring-paper/40"
            />
          </div>
        </div>

        <div className="px-4 pb-2 text-[11px] uppercase tracking-[0.2em] text-paper/40 flex items-center justify-between">
          <span>{sidebarTab === "my-posts" ? "Drafts" : "Published"}</span>
          <span>{filtered.length}</span>
        </div>

        <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-2">
          {isPublicLoading && sidebarTab === "public" && (
            <div className="text-xs text-paper/50 px-3 py-6 text-center">
              Loading public posts...
            </div>
          )}
          {!isPublicLoading && filtered.length === 0 && (
            <div className="text-xs text-paper/50 px-3 py-6 text-center">
              {search
                ? "No matches"
                : sidebarTab === "my-posts"
                ? "Create your first draft"
                : "No public posts yet"}
            </div>
          )}

          {filtered.map((post) => (
            <div
              key={post.id}
              onClick={() =>
                sidebarTab === "public"
                  ? navigate(`/posts/${post.id}`)
                  : setActivePost(post.id)
              }
              className={cn(
                "group rounded-xl px-3 py-3 cursor-pointer transition",
                activePostId === post.id && sidebarTab === "my-posts"
                  ? "bg-paper text-ink"
                  : "bg-paper/5 hover:bg-paper/10",
                deletingId === post.id && "opacity-0 scale-95"
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p
                    className={cn(
                      "text-sm font-semibold truncate",
                      activePostId === post.id && sidebarTab === "my-posts"
                        ? "text-ink"
                        : "text-paper"
                    )}
                  >
                    {post.title || "Untitled"}
                  </p>
                  <p className="text-[11px] text-paper/60 truncate mt-1">
                    {sidebarTab === "public" && post.author
                      ? `by ${post.author.full_name}`
                      : post.contentText
                      ? post.contentText.slice(0, 60) +
                        (post.contentText.length > 60 ? "..." : "")
                      : "No content yet"}
                  </p>
                </div>
                {sidebarTab === "my-posts" && (
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                    <button
                      onClick={(event) => handleTogglePublish(event, post)}
                      className="p-1 rounded hover:bg-ink/10"
                      title={post.status === "published" ? "Unpublish" : "Publish"}
                    >
                      {post.status === "published" ? (
                        <Globe className="w-3.5 h-3.5 text-olive" />
                      ) : (
                        <Lock className="w-3.5 h-3.5 text-paper/50" />
                      )}
                    </button>
                    <button
                      onClick={(event) => handleDelete(event, post.id)}
                      className="p-1 rounded hover:bg-ink/10"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-paper/50" />
                    </button>
                  </div>
                )}
              </div>

              <div className="mt-2 flex items-center gap-2 text-[10px] text-paper/40">
                <span>
                  {post.status === "published" ? "Published" : "Draft"}
                </span>
                <span>·</span>
                <span>{formatDistanceToNow(post.updatedAt, { addSuffix: true })}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="px-4 py-4 border-t border-paper/10 text-[11px] text-paper/40 flex items-center gap-2">
          <BookOpen className="w-3.5 h-3.5" />
          SyncDraft Editor
        </div>
      </div>
    </aside>
  );
}
