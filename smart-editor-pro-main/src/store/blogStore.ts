import { create } from "zustand";
import { postsAPI, commentsAPI } from "../services/api";

export type PostStatus = "draft" | "published";

export interface Post {
  id: string;
  title: string;
  content: string; // Lexical JSON serialized state
  contentText: string; // Plain text for word count / AI
  status: PostStatus;
  createdAt: Date;
  updatedAt: Date;
  wordCount: number;
  author?: {
    id: string;
    full_name: string;
  };
}

interface BlogStore {
  posts: Post[];
  publicPosts: Post[];
  activePostId: string | null;
  saveStatus: "idle" | "saving" | "saved" | "error";
  isLoading: boolean;
  isPublicLoading: boolean;
  isSidebarOpen: boolean;
  sidebarTab: "my-posts" | "public";
  aiPanel: {
    isOpen: boolean;
    mode: "summary" | "grammar" | null;
    result: string;
    isStreaming: boolean;
  };

  // Actions
  loadPosts: () => Promise<void>;
  loadPublicPosts: () => Promise<void>;
  createPost: (title?: string) => Promise<Post | null>;
  updatePost: (id: string, updates: Partial<Post>) => Promise<void>;
  deletePost: (id: string) => Promise<void>;
  setActivePost: (id: string | null) => void;
  publishPost: (id: string) => Promise<void>;
  unpublishPost: (id: string) => Promise<void>;
  setSaveStatus: (status: BlogStore["saveStatus"]) => void;
  setIsLoading: (loading: boolean) => void;
  setIsPublicLoading: (loading: boolean) => void;
  toggleSidebar: () => void;
  setSidebarTab: (tab: "my-posts" | "public") => void;
  openAIPanel: (mode: "summary" | "grammar") => void;
  closeAIPanel: () => void;
  setAIResult: (result: string) => void;
  setAIStreaming: (isStreaming: boolean) => void;
  appendAIResult: (chunk: string) => void;
  clearAIResult: () => void;
  getActivePost: () => Post | null;
}

const generateId = () =>
  `post_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

const createDefaultPost = (): Post => ({
  id: generateId(),
  title: "Untitled Post",
  content: "",
  contentText: "",
  status: "draft",
  createdAt: new Date(),
  updatedAt: new Date(),
  wordCount: 0,
});

const STORAGE_KEY = "blog_editor_posts";

const loadFromStorage = (): Post[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return parsed.map((p: Post) => ({
      ...p,
      createdAt: new Date(p.createdAt),
      updatedAt: new Date(p.updatedAt),
    }));
  } catch {
    return [];
  }
};

const saveToStorage = (posts: Post[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  } catch {
    // Ignore storage errors
  }
};

export const useBlogStore = create<BlogStore>((set, get) => {
  const savedPosts = loadFromStorage();

  return {
    posts: savedPosts,
    publicPosts: [],
    activePostId: savedPosts.length > 0 ? savedPosts[0].id : null,
    saveStatus: "idle",
    isLoading: false,
    isPublicLoading: false,
    isSidebarOpen: true,
    sidebarTab: "my-posts",
    aiPanel: {
      isOpen: false,
      mode: null,
      result: "",
      isStreaming: false,
    },

    loadPosts: async () => {
      set({ isLoading: true });
      try {
        const response = await postsAPI.list();
        const posts: Post[] = response.data.map((p: any) => ({
          id: p.id,
          title: p.title || "Untitled Post",
          content: p.content || "",
          contentText: "",
          status: p.status,
          createdAt: new Date(p.createdAt),
          updatedAt: new Date(p.updatedAt),
          wordCount: 0,
        }));
        saveToStorage(posts);
        const activePostId = posts.length > 0 ? posts[0].id : null;
        set({ posts, activePostId, isLoading: false });
      } catch (error) {
        console.error("Failed to load posts:", error);
        set({ isLoading: false });
      }
    },

    loadPublicPosts: async () => {
      set({ isPublicLoading: true });
      try {
        const response = await postsAPI.getPublic();
        const publicPosts: Post[] = response.data.map((p: any) => ({
          id: p.id,
          title: p.title || "Untitled Post",
          content: p.content || "",
          contentText: p.contentText || "",
          status: "published" as PostStatus,
          createdAt: new Date(p.createdAt),
          updatedAt: new Date(p.updatedAt),
          wordCount: 0,
          author: p.author || { id: "", full_name: "Anonymous" },
        }));
        set({ publicPosts, isPublicLoading: false });
      } catch (error) {
        console.error("Failed to load public posts:", error);
        set({ isPublicLoading: false });
      }
    },

    createPost: async (title = "Untitled Post") => {
      set({ saveStatus: "saving" });
      try {
        const response = await postsAPI.create(title, "");
        const post: Post = {
          id: response.data.id,
          title: response.data.title,
          content: response.data.content || "",
          contentText: "",
          status: response.data.status,
          createdAt: new Date(response.data.createdAt),
          updatedAt: new Date(response.data.updatedAt),
          wordCount: 0,
        };
        set((state) => {
          const posts = [post, ...state.posts];
          saveToStorage(posts);
          return { posts, activePostId: post.id, saveStatus: "saved" };
        });
        return post;
      } catch (error) {
        console.error("Failed to create post:", error);
        set({ saveStatus: "error" });
        return null;
      }
    },

    updatePost: async (id, updates) => {
      set({ saveStatus: "saving" });
      try {
        await postsAPI.update(id, {
          title: updates.title,
          content: updates.content,
        });
        set((state) => {
          const posts = state.posts.map((p) =>
            p.id === id
              ? {
                  ...p,
                  ...updates,
                  updatedAt: new Date(),
                  wordCount:
                    updates.contentText !== undefined
                      ? updates.contentText
                          .trim()
                          .split(/\s+/)
                          .filter(Boolean).length
                      : p.wordCount,
                }
              : p
          );
          saveToStorage(posts);
          return { posts, saveStatus: "saved" };
        });
      } catch (error) {
        console.error("Failed to update post:", error);
        set({ saveStatus: "error" });
      }
    },

    deletePost: async (id) => {
      try {
        await postsAPI.delete(id);
        set((state) => {
          const posts = state.posts.filter((p) => p.id !== id);
          saveToStorage(posts);
          const activePostId =
            state.activePostId === id
              ? posts.length > 0
                ? posts[0].id
                : null
              : state.activePostId;
          return { posts, activePostId };
        });
      } catch (error) {
        console.error("Failed to delete post:", error);
        set({ saveStatus: "error" });
      }
    },

    setActivePost: (id) => set({ activePostId: id }),

    publishPost: async (id) => {
      set({ saveStatus: "saving" });
      try {
        await postsAPI.publish(id);
        set((state) => {
          const posts = state.posts.map((p) =>
            p.id === id
              ? { ...p, status: "published" as PostStatus, updatedAt: new Date() }
              : p
          );
          saveToStorage(posts);
          return { posts, saveStatus: "saved" };
        });
      } catch (error) {
        console.error("Failed to publish post:", error);
        set({ saveStatus: "error" });
      }
    },

    unpublishPost: async (id) => {
      set({ saveStatus: "saving" });
      try {
        await postsAPI.unpublish(id);
        set((state) => {
          const posts = state.posts.map((p) =>
            p.id === id
              ? { ...p, status: "draft" as PostStatus, updatedAt: new Date() }
              : p
          );
          saveToStorage(posts);
          return { posts, saveStatus: "saved" };
        });
      } catch (error) {
        console.error("Failed to unpublish post:", error);
        set({ saveStatus: "error" });
      }
    },

    setSaveStatus: (status) => set({ saveStatus: status }),
    
    setIsLoading: (loading) => set({ isLoading: loading }),

    setIsPublicLoading: (loading) => set({ isPublicLoading: loading }),

    toggleSidebar: () =>
      set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

    setSidebarTab: (tab) => set({ sidebarTab: tab }),

    openAIPanel: (mode) =>
      set((state) => ({
        aiPanel: { ...state.aiPanel, isOpen: true, mode, result: "", isStreaming: false },
      })),

    closeAIPanel: () =>
      set((state) => ({
        aiPanel: { ...state.aiPanel, isOpen: false, mode: null, result: "", isStreaming: false },
      })),

    setAIResult: (result) =>
      set((state) => ({ aiPanel: { ...state.aiPanel, result } })),

    setAIStreaming: (isStreaming) =>
      set((state) => ({ aiPanel: { ...state.aiPanel, isStreaming } })),

    appendAIResult: (chunk) =>
      set((state) => ({
        aiPanel: { ...state.aiPanel, result: state.aiPanel.result + chunk },
      })),

    clearAIResult: () =>
      set((state) => ({
        aiPanel: { ...state.aiPanel, result: "", isStreaming: false },
      })),

    getActivePost: () => {
      const { posts, activePostId } = get();
      return posts.find((p) => p.id === activePostId) ?? null;
    },
  };
});
