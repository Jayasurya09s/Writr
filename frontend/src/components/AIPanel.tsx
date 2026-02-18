import { X, Sparkles, Wand2, Copy, Check } from "lucide-react";
import { useState } from "react";
import { useBlogStore } from "@/store/blogStore";
import { useAI } from "@/hooks/useAI";
import { cn } from "@/lib/utils";

export default function AIPanel() {
  const { aiPanel, closeAIPanel } = useBlogStore();
  const { runAI } = useAI();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!aiPanel.result) return;
    await navigator.clipboard.writeText(aiPanel.result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!aiPanel.isOpen) return null;

  return (
    <div className="animate-fade-in ai-panel-border rounded-xl shadow-ai bg-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-accent/15 flex items-center justify-center">
            {aiPanel.mode === "summary" ? (
              <Sparkles className="w-3.5 h-3.5 text-accent" />
            ) : (
              <Wand2 className="w-3.5 h-3.5 text-accent" />
            )}
          </div>
          <span className="text-sm font-semibold text-foreground">
            {aiPanel.mode === "summary" ? "AI Summary" : "Grammar Fix"}
          </span>
          {aiPanel.isStreaming && (
            <span className="text-xs text-accent saving-indicator font-medium">
              Generating…
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          {aiPanel.result && !aiPanel.isStreaming && (
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-md 
                bg-muted hover:bg-border text-muted-foreground hover:text-foreground transition-all"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-status-published" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  Copy
                </>
              )}
            </button>
          )}
          <button
            onClick={closeAIPanel}
            className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 min-h-[100px] max-h-[280px] overflow-y-auto">
        {!aiPanel.result && aiPanel.isStreaming && (
          <div className="flex items-center gap-3 py-4">
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full bg-accent"
                  style={{
                    animation: `save-pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
                  }}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground italic">
              {aiPanel.mode === "summary"
                ? "Analyzing your content…"
                : "Reviewing grammar and style…"}
            </span>
          </div>
        )}

        {aiPanel.result && (
          <p
            className={cn(
              "text-sm text-foreground/90 leading-relaxed font-serif",
              aiPanel.isStreaming && "ai-streaming"
            )}
          >
            {aiPanel.result}
          </p>
        )}
      </div>

      {/* Action row */}
      {!aiPanel.isStreaming && aiPanel.result && (
        <div className="px-4 py-3 border-t border-border bg-muted/30 flex items-center gap-2">
          <button
            onClick={() => runAI(aiPanel.mode!)}
            className="text-xs px-3 py-1.5 rounded-md bg-accent/15 text-accent hover:bg-accent/25 
              font-medium transition-all flex items-center gap-1.5"
          >
            <Sparkles className="w-3 h-3" />
            Regenerate
          </button>
          <span className="text-xs text-muted-foreground">
            AI-generated · review before using
          </span>
        </div>
      )}
    </div>
  );
}
