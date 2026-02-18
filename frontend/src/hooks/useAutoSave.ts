import { useCallback, useRef } from "react";
import { useBlogStore } from "@/store/blogStore";

export interface SavePayload {
  id: string;
  title: string;
  content: string;
  contentText: string;
  status: "draft" | "published";
}

export function useAutoSave(delayMs = 1200) {
  const { setSaveStatus, updatePost, updatePostLocal } = useBlogStore();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingRef = useRef<SavePayload | null>(null);

  const schedule = useCallback(
    (payload: SavePayload) => {
      pendingRef.current = payload;
      updatePostLocal(payload.id, {
        title: payload.title,
        content: payload.content,
        contentText: payload.contentText,
      });
      setSaveStatus("saving");

      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = setTimeout(async () => {
        if (!pendingRef.current) return;
        const pending = pendingRef.current;
        pendingRef.current = null;
        await updatePost(pending.id, {
          title: pending.title,
          content: pending.content,
          contentText: pending.contentText,
        });
      }, delayMs);
    },
    [delayMs, setSaveStatus, updatePost, updatePostLocal]
  );

  const flush = useCallback(async () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (pendingRef.current) {
      const pending = pendingRef.current;
      pendingRef.current = null;
      await updatePost(pending.id, {
        title: pending.title,
        content: pending.content,
        contentText: pending.contentText,
      });
    }
  }, [updatePost]);

  return { schedule, flush };
}
