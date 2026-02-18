import { create } from "zustand";
import { postsAPI, publicAPI } from "../services/api";

export type PostStatus = "draft" | "published";

export interface Post {
  id: string;
  title: string;
  content: string;
  contentText: string;
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

  loadPosts: () => Promise<void>;
  loadPublicPosts: () => Promise<void>;
  loadPostById: (id: string) => Promise<void>;
  createPost: (title?: string) => Promise<Post | null>;
  updatePost: (id: string, updates: Partial<Post>) => Promise<void>;
  updatePostLocal: (id: string, updates: Partial<Post>) => void;
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

const EMPTY_EDITOR_STATE = JSON.stringify({
  root: {
    children: [{ children: [{ text: "", type: "text" }], type: "paragraph" }],
    direction: "ltr",
    format: "",
    indent: 0,
    type: "root",
    version: 1,
  },
});

const STORAGE_KEY = "blog_editor_posts";

const normalizeContent = (content: unknown): string => {
  if (typeof content === "string") {
    return content.trim() ? content : EMPTY_EDITOR_STATE;
  }
  if (content && typeof content === "object") {
    return JSON.stringify(content);
  }
  return EMPTY_EDITOR_STATE;
};

const extractTextFromLexical = (content: string): string => {
  try {
    const parsed = JSON.parse(content);
    const root = parsed?.root;
    if (!root?.children) return "";

    const lines: string[] = [];

    const collect = (node: any) => {
      if (!node) return;
      if (node.type === "text" && typeof node.text === "string") {
        lines.push(node.text);
        return;
      }
      if (Array.isArray(node.children)) {
        const before = lines.length;
        node.children.forEach((child: any) => collect(child));
        const isBlock =
          node.type === "paragraph" ||
          node.type === "heading" ||
          node.type === "listitem" ||
          node.type === "quote";
        if (isBlock && lines.length > before) {
          lines.push("\n");
        }
      }
    };

    root.children.forEach((child: any) => collect(child));
    return lines.join("").replace(/\n{2,}/g, "\n").trim();
  } catch {
    return "";
  }
};

const getWordCount = (text: string) =>
  text.trim() ? text.trim().split(/\s+/).filter(Boolean).length : 0;

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

const mapPostFromApi = (data: any): Post => {
  const normalizedContent = normalizeContent(data.content ?? "");
  const contentText = extractTextFromLexical(normalizedContent);
  return {
    id: data.id,
    title: data.title || "Untitled Post",
    content: normalizedContent,
    contentText,
    status: data.status as PostStatus,
    createdAt: new Date(data.createdAt),
    updatedAt: new Date(data.updatedAt),
    wordCount: getWordCount(contentText),
    author: data.authorId
      ? { id: data.authorId, full_name: data.authorName || "Anonymous" }
      : undefined,
  };
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
          content: "",
          contentText: "",
          status: p.status as PostStatus,
          createdAt: new Date(p.createdAt),
          updatedAt: new Date(p.updatedAt),
          wordCount: 0,
        }));
        saveToStorage(posts);
        const activePostId = posts.length > 0 ? posts[0].id : null;
        set({ posts, activePostId, isLoading: false });
        if (activePostId) {
          await get().loadPostById(activePostId);
        }
      } catch (error) {
        console.error("Failed to load posts:", error);
        set({ isLoading: false });
      }
    },

    loadPostById: async (id: string) => {
      try {
        const response = await postsAPI.getById(id);
        const post = mapPostFromApi(response.data);
        set((state) => {
          const posts = state.posts.map((p) => (p.id === id ? post : p));
          saveToStorage(posts);
          return { posts };
        });
      } catch (error) {
        console.error("Failed to load post:", error);
      }
    },

    loadPublicPosts: async () => {
      set({ isPublicLoading: true });
      try {
        const response = await publicAPI.getPublishedPosts();
        const publicPosts: Post[] = response.data.map((p: any) =>
          mapPostFromApi({
            ...p,
            status: "published",
            authorId: p.authorId,
            authorName: p.authorName,
          })
        );
        set({ publicPosts, isPublicLoading: false });
      } catch (error) {
        console.error("Failed to load public posts:", error);
        set({ isPublicLoading: false });
      }
    },

    createPost: async (title = "Untitled Post") => {
      set({ saveStatus: "saving" });
      try {
        const response = await postsAPI.create(title, EMPTY_EDITOR_STATE);
        const post: Post = mapPostFromApi({
          ...response.data,
          content: response.data.content || EMPTY_EDITOR_STATE,
        });
        set((state) => {
          const posts = [post, ...state.posts];
          saveToStorage(posts);
          return { posts, activePostId: post.id, saveStatus: "saved" };
        });
        setTimeout(() => set({ saveStatus: "idle" }), 1600);
        return post;
      } catch (error) {
        console.error("Failed to create post:", error);
        set({ saveStatus: "error" });
        setTimeout(() => set({ saveStatus: "idle" }), 2400);
        return null;
      }
    },

    updatePostLocal: (id, updates) => {
      set((state) => {
        const posts = state.posts.map((p) =>
          p.id === id
            ? {
                ...p,
                ...updates,
                updatedAt: new Date(),
                wordCount:
                  updates.contentText !== undefined
                    ? getWordCount(updates.contentText)
                    : p.wordCount,
              }
            : p
        );
        saveToStorage(posts);
        return { posts };
      });
    },

    updatePost: async (id, updates) => {
      set({ saveStatus: "saving" });
      try {
        const existing = get().posts.find((post) => post.id === id);
        const nextContent =
          updates.content ?? existing?.content ?? EMPTY_EDITOR_STATE;
        const nextTitle = updates.title ?? existing?.title ?? "Untitled Post";
        await postsAPI.update(id, {
          title: nextTitle,
          content: nextContent,
        });
        get().updatePostLocal(id, { ...updates, title: nextTitle, content: nextContent });
        set({ saveStatus: "saved" });
        setTimeout(() => set({ saveStatus: "idle" }), 1800);
      } catch (error) {
        console.error("Failed to update post:", error);
        set({ saveStatus: "error" });
        setTimeout(() => set({ saveStatus: "idle" }), 2400);
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
        setTimeout(() => set({ saveStatus: "idle" }), 2400);
      }
    },

    setActivePost: (id) => {
      set({ activePostId: id });
      if (id) {
        const existing = get().posts.find((post) => post.id === id);
        if (existing && (!existing.content || existing.content === EMPTY_EDITOR_STATE)) {
          get().loadPostById(id);
        }
      }
    },

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
        setTimeout(() => set({ saveStatus: "idle" }), 1600);
      } catch (error) {
        console.error("Failed to publish post:", error);
        set({ saveStatus: "error" });
        setTimeout(() => set({ saveStatus: "idle" }), 2400);
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
        setTimeout(() => set({ saveStatus: "idle" }), 1600);
      } catch (error) {
        console.error("Failed to unpublish post:", error);
        set({ saveStatus: "error" });
        setTimeout(() => set({ saveStatus: "idle" }), 2400);
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
