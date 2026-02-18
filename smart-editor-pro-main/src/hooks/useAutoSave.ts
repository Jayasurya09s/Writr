import { useBlogStore } from "@/store/blogStore";

// Simulates API calls with realistic latency
const simulateAPIDelay = (ms = 400) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export interface SavePayload {
  id: string;
  title: string;
  content: string;
  contentText: string;
  status: "draft" | "published";
}

/**
 * Simulated auto-save hook.
 * In production: replace simulateAPICall with actual fetch('/api/posts/{id}', { method: 'PATCH' })
 */
export function useAutoSave() {
  const { setSaveStatus, updatePost } = useBlogStore();

  const save = async (payload: SavePayload) => {
    setSaveStatus("saving");

    try {
      // === MOCK API CALL ===
      // In production, replace with:
      // await fetch(`/api/posts/${payload.id}`, {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ content: payload.content, title: payload.title }),
      // });
      await simulateAPIDelay(600);

      updatePost(payload.id, {
        content: payload.content,
        contentText: payload.contentText,
        title: payload.title,
      });

      setSaveStatus("saved");

      // Reset to idle after 3s
      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch (err) {
      console.error("[AutoSave] Failed:", err);
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 4000);
    }
  };

  return { save };
}
