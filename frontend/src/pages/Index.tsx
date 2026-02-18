import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import {
  PanelLeft,
  Globe,
  Lock,
  Sparkles,
  Wand2,
  Home,
  LogOut,
  FilePlus2,
  Clock,
  Hash,
} from "lucide-react";
import { useBlogStore } from "@/store/blogStore";
import { useAI } from "@/hooks/useAI";
import { useDebounce } from "@/hooks/useDebounce";
import { getCurrentUser, logout } from "@/lib/auth";
import DraftsSidebar from "@/components/DraftsSidebar";
import BlogEditor from "@/components/BlogEditor";
import SaveStatusIndicator from "@/components/SaveStatusIndicator";
import AIPanel from "@/components/AIPanel";
import { cn } from "@/lib/utils";

export default function Index() {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const { runAI } = useAI();
  const {
    posts,
    activePostId,
    isSidebarOpen,
    toggleSidebar,
    getActivePost,
    createPost,
    publishPost,
    unpublishPost,
    updatePostLocal,
    updatePost,
    loadPosts,
  } = useBlogStore();

  const activePost = getActivePost();
  const [title, setTitle] = useState(activePost?.title ?? "");

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  useEffect(() => {
    setTitle(activePost?.title ?? "");
  }, [activePostId, activePost?.title]);

  const { debouncedFn: debouncedTitleSave } = useDebounce(
    (nextTitle: string) => {
      if (!activePost) return;
      updatePost(activePost.id, {
        title: nextTitle,
      });
    },
    800
  );

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextTitle = event.target.value;
    setTitle(nextTitle);
    if (!activePost) return;
    updatePostLocal(activePost.id, { title: nextTitle });
    debouncedTitleSave(nextTitle);
  };

  const handleTogglePublish = () => {
    if (!activePost) return;
    if (activePost.status === "published") {
      unpublishPost(activePost.id);
    } else {
      publishPost(activePost.id);
    }
  };

  const stats = useMemo(() => {
    if (!activePost) return null;
    return {
      updatedAt: format(activePost.updatedAt, "MMM d, h:mm a"),
      wordCount: activePost.wordCount,
      readTime: Math.max(1, Math.ceil(activePost.wordCount / 220)),
    };
  }, [activePost]);

  if (posts.length === 0 && !activePost) {
    return (
      <div className="min-h-screen bg-paper text-ink flex">
        <DraftsSidebar isOpen={isSidebarOpen} />
        {!isSidebarOpen && (
          <button
            onClick={toggleSidebar}
            className="fixed top-5 left-5 z-30 p-2 rounded-xl bg-ink text-paper shadow-lg hover:opacity-90 transition"
          >
            <PanelLeft className="w-4 h-4" />
          </button>
        )}
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="max-w-md text-center">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-ink text-paper flex items-center justify-center shadow-sm">
              <FilePlus2 className="w-6 h-6" />
            </div>
            <h1 className="mt-6 text-2xl font-serif font-semibold text-ink">
              Start your first draft
            </h1>
            <p className="mt-2 text-sm text-ink-muted">
              Everything you write is auto-saved. Create a draft and let the editor do the rest.
            </p>
            <button
              onClick={() => createPost()}
              className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-ink text-paper text-sm font-semibold shadow-md hover:opacity-90 transition"
            >
              <FilePlus2 className="w-4 h-4" />
              New Draft
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper text-ink flex">
      <DraftsSidebar isOpen={isSidebarOpen} />

      {!isSidebarOpen && (
        <button
          onClick={toggleSidebar}
          className="fixed top-5 left-5 z-30 p-2 rounded-xl bg-ink text-paper shadow-lg hover:opacity-90 transition"
        >
          <PanelLeft className="w-4 h-4" />
        </button>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-20 border-b border-ink/10 bg-paper/80 backdrop-blur">
          <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {activePost && (
                <span
                  className={cn(
                    "text-[11px] font-semibold tracking-wide px-2.5 py-1 rounded-full",
                    activePost.status === "published"
                      ? "bg-olive/15 text-olive"
                      : "bg-ink/10 text-ink-muted"
                  )}
                >
                  {activePost.status === "published" ? "Published" : "Draft"}
                </span>
              )}
              <SaveStatusIndicator />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => runAI("summary")}
                className="hidden sm:inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-ink/10 text-xs font-semibold text-ink hover:bg-ink/5 transition"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Summarize
              </button>
              <button
                onClick={() => runAI("grammar")}
                className="hidden sm:inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-ink/10 text-xs font-semibold text-ink-muted hover:text-ink hover:bg-ink/5 transition"
              >
                <Wand2 className="w-3.5 h-3.5" />
                Fix grammar
              </button>
              {activePost && (
                <button
                  onClick={handleTogglePublish}
                  className={cn(
                    "inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold shadow-sm transition",
                    activePost.status === "published"
                      ? "bg-ink/10 text-ink hover:bg-ink/15"
                      : "bg-ink text-paper hover:opacity-90"
                  )}
                >
                  {activePost.status === "published" ? (
                    <>
                      <Lock className="w-3.5 h-3.5" />
                      Unpublish
                    </>
                  ) : (
                    <>
                      <Globe className="w-3.5 h-3.5" />
                      Publish
                    </>
                  )}
                </button>
              )}

              <div className="ml-2 pl-3 border-l border-ink/10 flex items-center gap-2">
                <button
                  onClick={() => navigate("/")}
                  className="p-2 rounded-lg text-ink-muted hover:text-ink hover:bg-ink/5 transition"
                  title="Home"
                >
                  <Home className="w-4 h-4" />
                </button>
                {currentUser && (
                  <div className="hidden md:flex items-center gap-2 text-xs text-ink-muted">
                    <div className="w-7 h-7 rounded-full bg-ink/10 flex items-center justify-center">
                      {currentUser.name?.slice(0, 1) || "U"}
                    </div>
                    <span className="max-w-[120px] truncate">
                      {currentUser.name || currentUser.full_name}
                    </span>
                  </div>
                )}
                <button
                  onClick={() => {
                    logout();
                    navigate("/");
                  }}
                  className="p-2 rounded-lg text-ink-muted hover:text-ink hover:bg-ink/5 transition"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto px-6 py-10">
            {activePost && (
              <div className="mb-6">
                <input
                  value={title}
                  onChange={handleTitleChange}
                  placeholder="Untitled"
                  className="w-full text-4xl md:text-5xl font-serif font-semibold bg-transparent text-ink placeholder:text-ink-muted/60 outline-none"
                  spellCheck
                />
                {stats && (
                  <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-ink-muted">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      Updated {stats.updatedAt}
                    </span>
                    <span className="flex items-center gap-1">
                      <Hash className="w-3.5 h-3.5" />
                      {stats.wordCount} words · {stats.readTime} min read
                    </span>
                  </div>
                )}
              </div>
            )}

            {activePost && (
              <div className="rounded-3xl border border-ink/10 bg-paper shadow-paper">
                <BlogEditor
                  postId={activePost.id}
                  content={activePost.content}
                  title={title}
                />
              </div>
            )}

            <div className="mt-8">
              <AIPanel />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
