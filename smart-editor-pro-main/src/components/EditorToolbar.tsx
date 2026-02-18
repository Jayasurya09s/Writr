import { useState, useCallback, useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  FORMAT_TEXT_COMMAND,
  $getSelection,
  $isRangeSelection,
  TextFormatType,
} from "lexical";
import {
  $setBlocksType,
  $getSelectionStyleValueForProperty,
} from "@lexical/selection";
import { $createHeadingNode, $isHeadingNode, HeadingTagType } from "@lexical/rich-text";
import { $createParagraphNode } from "lexical";
import { INSERT_ORDERED_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND, REMOVE_LIST_COMMAND } from "@lexical/list";
import { $isListNode, ListNode } from "@lexical/list";
import { $getNearestNodeOfType, mergeRegister } from "@lexical/utils";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Type,
  Minus,
} from "lucide-react";
import { cn } from "@/lib/utils";

type BlockType = "paragraph" | "h1" | "h2" | "h3" | "ul" | "ol";

export default function EditorToolbar() {
  const [editor] = useLexicalComposerContext();
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [blockType, setBlockType] = useState<BlockType>("paragraph");

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsUnderline(selection.hasFormat("underline"));
      setIsStrikethrough(selection.hasFormat("strikethrough"));

      const anchorNode = selection.anchor.getNode();
      const element =
        anchorNode.getKey() === "root"
          ? anchorNode
          : anchorNode.getTopLevelElementOrThrow();

      if ($isListNode(element)) {
        const parentList = $getNearestNodeOfType<ListNode>(anchorNode, ListNode);
        const type = parentList ? parentList.getListType() : element.getListType();
        setBlockType(type === "bullet" ? "ul" : "ol");
      } else if ($isHeadingNode(element)) {
        setBlockType(element.getTag() as BlockType);
      } else {
        setBlockType("paragraph");
      }
    }
  }, []);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbar();
        });
      })
    );
  }, [editor, updateToolbar]);

  const formatText = (format: TextFormatType) => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
  };

  const formatHeading = (tag: HeadingTagType) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        if (blockType === tag) {
          $setBlocksType(selection, () => $createParagraphNode());
        } else {
          $setBlocksType(selection, () => $createHeadingNode(tag));
        }
      }
    });
  };

  const formatList = (type: "ul" | "ol") => {
    if (type === "ul") {
      if (blockType === "ul") {
        editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
      } else {
        editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
      }
    } else {
      if (blockType === "ol") {
        editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
      } else {
        editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
      }
    }
  };

  const formatParagraph = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createParagraphNode());
      }
    });
  };

  const ToolbarButton = ({
    active,
    onClick,
    title,
    children,
  }: {
    active?: boolean;
    onClick: () => void;
    title: string;
    children: React.ReactNode;
  }) => (
    <button
      title={title}
      onMouseDown={(e) => {
        e.preventDefault();
        onClick();
      }}
      className={cn("toolbar-btn", active && "active")}
    >
      {children}
    </button>
  );

  const Divider = () => (
    <div className="w-px h-5 bg-border mx-1 self-center" />
  );

  return (
    <div className="flex items-center gap-0.5 px-4 py-2.5 border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10 flex-wrap">
      {/* Block type */}
      <ToolbarButton
        active={blockType === "paragraph"}
        onClick={formatParagraph}
        title="Normal text (P)"
      >
        <Type className="w-3.5 h-3.5" />
      </ToolbarButton>
      <ToolbarButton
        active={blockType === "h1"}
        onClick={() => formatHeading("h1")}
        title="Heading 1"
      >
        <Heading1 className="w-3.5 h-3.5" />
      </ToolbarButton>
      <ToolbarButton
        active={blockType === "h2"}
        onClick={() => formatHeading("h2")}
        title="Heading 2"
      >
        <Heading2 className="w-3.5 h-3.5" />
      </ToolbarButton>
      <ToolbarButton
        active={blockType === "h3"}
        onClick={() => formatHeading("h3")}
        title="Heading 3"
      >
        <Heading3 className="w-3.5 h-3.5" />
      </ToolbarButton>

      <Divider />

      {/* Text formatting */}
      <ToolbarButton active={isBold} onClick={() => formatText("bold")} title="Bold (⌘B)">
        <Bold className="w-3.5 h-3.5" />
      </ToolbarButton>
      <ToolbarButton active={isItalic} onClick={() => formatText("italic")} title="Italic (⌘I)">
        <Italic className="w-3.5 h-3.5" />
      </ToolbarButton>
      <ToolbarButton active={isUnderline} onClick={() => formatText("underline")} title="Underline (⌘U)">
        <Underline className="w-3.5 h-3.5" />
      </ToolbarButton>
      <ToolbarButton
        active={isStrikethrough}
        onClick={() => formatText("strikethrough")}
        title="Strikethrough"
      >
        <Strikethrough className="w-3.5 h-3.5" />
      </ToolbarButton>

      <Divider />

      {/* Lists */}
      <ToolbarButton
        active={blockType === "ul"}
        onClick={() => formatList("ul")}
        title="Bullet List"
      >
        <List className="w-3.5 h-3.5" />
      </ToolbarButton>
      <ToolbarButton
        active={blockType === "ol"}
        onClick={() => formatList("ol")}
        title="Ordered List"
      >
        <ListOrdered className="w-3.5 h-3.5" />
      </ToolbarButton>
    </div>
  );
}
