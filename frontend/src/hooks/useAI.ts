import { useBlogStore } from "@/store/blogStore";
import { aiAPI } from "@/services/api";

// Simulates streaming AI response token by token
const streamTokens = async (
  text: string,
  appendChunk: (chunk: string) => void,
  delayMs = 18
) => {
  const words = text.split(" ");
  for (const word of words) {
    await new Promise((r) => setTimeout(r, delayMs + Math.random() * 20));
    appendChunk(word + " ");
  }
};

export function useAI() {
  const { openAIPanel, appendAIResult, setAIStreaming, closeAIPanel, getActivePost } =
    useBlogStore();

  const runAI = async (mode: "summary" | "grammar") => {
    const post = getActivePost();
    if (!post || !post.contentText.trim()) {
      alert("Please write some content before using AI features.");
      return;
    }

    openAIPanel(mode);
    setAIStreaming(true);

    try {
      const response = await aiAPI.generate(post.contentText, mode);
      const result = response.data?.result;

      if (!result) {
        throw new Error("No result from AI API");
      }

      // Stream the result token by token
      await streamTokens(result, appendAIResult);
      setAIStreaming(false);
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.detail ||
        (error instanceof Error ? error.message : "Unknown error occurred");
      console.error("AI Error:", errorMessage);
      appendAIResult(`Error: ${errorMessage}`);
      setAIStreaming(false);
    }
  };

  return { runAI };
}
