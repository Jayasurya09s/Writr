import { useEffect, useCallback, useRef } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { HeadingNode } from "@lexical/rich-text";
import { ListNode, ListItemNode } from "@lexical/list";
import { $getRoot, EditorState } from "lexical";

import { useAutoSave } from "@/hooks/useAutoSave";
import EditorToolbar from "./EditorToolbar";

// Plugin to load post content when switching posts
function LoadContentPlugin({ postId, content }: { postId: string; content: string }) {
  const [editor] = useLexicalComposerContext();
  const lastLoadedId = useRef<string>("");

  useEffect(() => {
    if (lastLoadedId.current === postId) return;
    lastLoadedId.current = postId;

    if (!content) {
      editor.update(() => {
        const root = $getRoot();
        root.clear();
      });
      return;
    }

    try {
      const parsed = editor.parseEditorState(content);
      editor.setEditorState(parsed);
    } catch {
      editor.update(() => {
        const root = $getRoot();
        root.clear();
      });
    }
  }, [editor, postId, content]);

  return null;
}

interface BlogEditorCoreProps {
  postId: string;
  content: string;
  title: string;
}

function BlogEditorCore({ postId, content, title }: BlogEditorCoreProps) {
  const { schedule } = useAutoSave(1400);

  const handleChange = useCallback(
    (editorState: EditorState) => {
      editorState.read(() => {
        const root = $getRoot();
        const plainText = root.getTextContent();
        const serialized = JSON.stringify(editorState.toJSON());

        schedule({
          id: postId,
          title,
          content: serialized,
          contentText: plainText,
          status: "draft",
        });
      });
    },
    [postId, title, schedule]
  );

  return (
    <>
      <EditorToolbar />
      <div className="relative editor-content px-8 py-8 md:px-16 min-h-[60vh]">
        <RichTextPlugin
          contentEditable={
            <ContentEditable
              className="outline-none min-h-[400px] focus:outline-none"
              aria-label="Blog editor content"
            />
          }
          placeholder={
            <div className="editor-placeholder pointer-events-none">
              Start writing your story…
            </div>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
        <HistoryPlugin />
        <ListPlugin />
        <OnChangePlugin onChange={handleChange} ignoreSelectionChange />
        <LoadContentPlugin postId={postId} content={content} />
      </div>
    </>
  );
}

interface BlogEditorProps {
  postId: string;
  content: string;
  title: string;
}

const editorConfig = {
  namespace: "BlogEditor",
  nodes: [HeadingNode, ListNode, ListItemNode],
  onError: (error: Error) => {
    console.error("[Lexical Error]", error);
  },
  theme: {
    heading: {
      h1: "editor-h1",
      h2: "editor-h2",
      h3: "editor-h3",
    },
    text: {
      bold: "font-bold",
      italic: "italic",
      underline: "underline",
      strikethrough: "line-through",
    },
    list: {
      ul: "list-disc pl-6",
      ol: "list-decimal pl-6",
      listitem: "mb-1",
    },
  },
};

export default function BlogEditor({ postId, content, title }: BlogEditorProps) {
  return (
    <LexicalComposer initialConfig={editorConfig}>
      <BlogEditorCore postId={postId} content={content} title={title} />
    </LexicalComposer>
  );
}
