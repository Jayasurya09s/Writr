import { useBlogStore } from "@/store/blogStore";

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
      const token = localStorage.getItem('access_token');
      
      const response = await fetch("http://127.0.0.1:8000/api/ai/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { "Authorization": `Bearer ${token}` }),
        },
        body: JSON.stringify({
          text: post.contentText,
          mode: mode,
        }),
      });

      if (!response.ok) {
        try {
          const error = await response.json();
          throw new Error(error.detail || `API Error: ${response.status}`);
        } catch {
          throw new Error(`API Error: ${response.status}`);
        }
      }

      const data = await response.json();
      const result = data.result;

      if (!result) {
        throw new Error("No result from AI API");
      }

      // Stream the result token by token
      await streamTokens(result, appendAIResult);
      setAIStreaming(false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      console.error("AI Error:", errorMessage);
      appendAIResult(`Error: ${errorMessage}`);
      setAIStreaming(false);
    }
  };

  return { runAI };
}
