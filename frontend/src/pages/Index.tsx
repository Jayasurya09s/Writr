import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useBlogStore } from "@/store/blogStore";
import { useAutoSave } from "@/hooks/useAutoSave";
import { useDebounce } from "@/hooks/useDebounce";
import { useAI } from "@/hooks/useAI";
import BlogEditor from "@/components/BlogEditor";
import DraftsSidebar from "@/components/DraftsSidebar";
import SaveStatusIndicator from "@/components/SaveStatusIndicator";
import AIPanel from "@/components/AIPanel";
import { format } from "date-fns";
import { getCurrentUser, logout } from "@/lib/auth";
import {
  PanelLeft,
  Globe,
  Lock,
  Sparkles,
  Wand2,
  AlignLeft,
  Hash,
  Clock,
  LogOut,
  Home,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function Index() {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  const {
    posts,
    activePostId,
    isSidebarOpen,
    toggleSidebar,
    getActivePost,
    updatePost,
    publishPost,
    unpublishPost,
    createPost,
  } = useBlogStore();
  const { runAI } = useAI();
  const { save } = useAutoSave();

  const activePost = getActivePost();

  const [title, setTitle] = useState(activePost?.title || "");
  const titleRef = useRef(title);
  titleRef.current = title;

  // Sync title when active post changes
  useEffect(() => {
    setTitle(activePost?.title || "");
  }, [activePostId]);

  // Debounced title save
  const { debouncedFn: debouncedTitleSave } = useDebounce(
    (...args: unknown[]) => {
      const id = args[0] as string;
      const t = args[1] as string;
      updatePost(id, { title: t });
    },
    800
  );

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    if (activePost) {
      debouncedTitleSave(activePost.id, newTitle);
    }
  };

  const handleTogglePublish = () => {
    if (!activePost) return;
    if (activePost.status === "published") {
      unpublishPost(activePost.id);
    } else {
      publishPost(activePost.id);
    }
  };

  // Empty state
  if (posts.length === 0 && !activePost) {
    return (
      <div className="flex h-screen bg-background">
        <DraftsSidebar isOpen={isSidebarOpen} />
        {!isSidebarOpen && (
          <button
            onClick={toggleSidebar}
            className="fixed top-4 left-4 z-30 p-2 rounded-lg bg-sidebar text-sidebar-foreground hover:bg-sidebar-accent transition-all shadow-md"
          >
            <PanelLeft className="w-4 h-4" />
          </button>
        )}
        <div className="flex-1 flex items-center justify-center flex-col gap-6 text-center px-4">
          <div className="w-16 h-16 rounded-2xl bg-accent/15 flex items-center justify-center mb-2">
            <AlignLeft className="w-8 h-8 text-accent" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">No posts yet</h2>
            <p className="text-muted-foreground text-sm max-w-xs">
              Create your first post and start writing. Your work saves automatically.
            </p>
          </div>
          <button
            onClick={() => createPost()}
            className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm 
              hover:opacity-90 active:scale-95 transition-all shadow-md"
          >
            Create First Post
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <DraftsSidebar isOpen={isSidebarOpen} />

      {/* Toggle sidebar when closed */}
      {!isSidebarOpen && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-30 p-2 rounded-lg bg-sidebar text-sidebar-foreground 
            hover:bg-sidebar-accent transition-all shadow-md animate-fade-in"
        >
          <PanelLeft className="w-4 h-4" />
        </button>
      )}

      {/* Main editor area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center justify-between px-6 py-3 border-b border-border bg-card/60 backdrop-blur-sm shrink-0">
          <div className="flex items-center gap-3">
            {!isSidebarOpen && <div className="w-10" />}
            {/* Status badge */}
            {activePost && (
              <span
                className={cn(
                  "text-xs font-semibold px-2.5 py-1 rounded-full",
                  activePost.status === "published" ? "status-published" : "status-draft"
                )}
              >
                {activePost.status === "published" ? "● Published" : "○ Draft"}
              </span>
            )}
            <SaveStatusIndicator />
          </div>

          <div className="flex items-center gap-2">
            {/* Metadata */}
            {activePost && (
              <div className="hidden md:flex items-center gap-3 text-xs text-muted-foreground mr-3">
                <span className="flex items-center gap-1">
                  <Hash className="w-3 h-3" />
                  {activePost.wordCount} words
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {format(activePost.updatedAt, "MMM d, h:mm a")}
                </span>
              </div>
            )}

            {/* AI Buttons */}
            <button
              onClick={() => runAI("summary")}
              className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg 
                bg-accent/12 text-accent hover:bg-accent/22 font-medium transition-all border border-accent/20"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Summarize</span>
            </button>

            <button
              onClick={() => runAI("grammar")}
              className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg 
                bg-muted hover:bg-border text-muted-foreground hover:text-foreground font-medium transition-all"
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Fix Grammar</span>
            </button>

            {/* Publish button */}
            {activePost && (
              <button
                onClick={handleTogglePublish}
                className={cn(
                  "flex items-center gap-1.5 text-xs px-4 py-2 rounded-lg font-semibold transition-all active:scale-95",
                  activePost.status === "published"
                    ? "bg-secondary text-secondary-foreground hover:bg-border"
                    : "bg-primary text-primary-foreground hover:opacity-90 shadow-sm"
                )}
              >
                {activePost.status === "published" ? (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Unpublish</span>
                  </>
                ) : (
                  <>
                    <Globe className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Publish</span>
                  </>
                )}
              </button>
                )}

            {/* User avatar + logout */}
            <div className="flex items-center gap-1 ml-1 pl-3 border-l border-border">
              <button
                onClick={() => navigate("/")}
                title="Home"
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
              >
                <Home className="w-3.5 h-3.5" />
              </button>
              {currentUser && (
                <div className="flex items-center gap-2">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-7 h-7 rounded-full border border-border"
                  />
                  <span className="hidden md:block text-xs font-medium text-foreground/70 max-w-[80px] truncate">
                    {currentUser.name}
                  </span>
                </div>
              )}
              <button
                onClick={() => { logout(); navigate("/"); }}
                title="Sign Out"
                className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/8 transition-all"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </header>

        {/* Editor scroll container */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-4 pt-10 pb-20">
            {/* Title */}
            {activePost && (
              <div className="mb-6">
                <input
                  value={title}
                  onChange={handleTitleChange}
                  placeholder="Post title…"
                  className="w-full text-4xl font-bold font-serif bg-transparent border-none outline-none
                    text-foreground placeholder:text-muted-foreground/50 leading-tight"
                  spellCheck
                />
                <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                  <span>{format(activePost.createdAt, "MMMM d, yyyy")}</span>
                  <span>·</span>
                  <span>
                    {Math.ceil((activePost.wordCount || 1) / 200)} min read
                  </span>
                </div>
                <div className="mt-4 border-b border-border/50" />
              </div>
            )}

            {/* Lexical Editor */}
            {activePost && (
              <div className="rounded-xl border border-border shadow-editor bg-card overflow-hidden">
                <BlogEditor
                  key={activePost.id}
                  postId={activePost.id}
                  content={activePost.content}
                  title={title}
                />
              </div>
            )}

            {/* AI Panel */}
            <div className="mt-6">
              <AIPanel />
            </div>

            {/* Keyboard shortcuts hint */}
            <div className="mt-8 flex flex-wrap gap-3 text-xs text-muted-foreground/60">
              <span>⌘B Bold</span>
              <span>⌘I Italic</span>
              <span>⌘U Underline</span>
              <span>Auto-saves after 2s of inactivity</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
