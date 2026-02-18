import { Cloud, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { useBlogStore } from "@/store/blogStore";
import { cn } from "@/lib/utils";

export default function SaveStatusIndicator() {
  const { saveStatus } = useBlogStore();

  if (saveStatus === "idle") return null;

  return (
    <div
      className={cn(
        "flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full transition-all",
        saveStatus === "saving" && "text-status-saving bg-status-saving/10 saving-indicator",
        saveStatus === "saved" && "text-status-published bg-status-published/10",
        saveStatus === "error" && "text-destructive bg-destructive/10"
      )}
    >
      {saveStatus === "saving" && (
        <>
          <Loader2 className="w-3 h-3 animate-spin" />
          Saving…
        </>
      )}
      {saveStatus === "saved" && (
      <>
          <CheckCircle2 className="w-3 h-3" />
          Saved
        </>
      )}
      {saveStatus === "error" && (
        <>
          <AlertCircle className="w-3 h-3" />
          Save failed
        </>
      )}
    </div>
  );
}
