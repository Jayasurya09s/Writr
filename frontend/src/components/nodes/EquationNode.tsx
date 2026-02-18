import {
  DecoratorNode,
  EditorConfig,
  LexicalNode,
  NodeKey,
  SerializedLexicalNode,
  Spread,
} from "lexical";
import katex from "katex";
import "katex/dist/katex.min.css";

export type SerializedEquationNode = Spread<
  {
    equation: string;
    inline: boolean;
  },
  SerializedLexicalNode
>;

export class EquationNode extends DecoratorNode<JSX.Element> {
  __equation: string;
  __inline: boolean;

  static getType(): string {
    return "equation";
  }

  static clone(node: EquationNode): EquationNode {
    return new EquationNode(node.__equation, node.__inline, node.__key);
  }

  constructor(equation: string, inline: boolean = false, key?: NodeKey) {
    super(key);
    this.__equation = equation;
    this.__inline = inline;
  }

  static importJSON(serializedNode: SerializedEquationNode): EquationNode {
    const node = $createEquationNode(
      serializedNode.equation,
      serializedNode.inline
    );
    return node;
  }

  exportJSON(): SerializedEquationNode {
    return {
      equation: this.__equation,
      inline: this.__inline,
      type: "equation",
      version: 1,
    };
  }

  createDOM(config: EditorConfig): HTMLElement {
    const element = document.createElement(this.__inline ? "span" : "div");
    element.className = this.__inline
      ? "equation-inline"
      : "equation-block my-4";
    return element;
  }

  updateDOM(): false {
    return false;
  }

  getEquation(): string {
    return this.__equation;
  }

  setEquation(equation: string): void {
    const writable = this.getWritable();
    writable.__equation = equation;
  }

  decorate(): JSX.Element {
    return (
      <EquationComponent
        equation={this.__equation}
        inline={this.__inline}
        nodeKey={this.__key}
      />
    );
  }
}

export function $createEquationNode(
  equation: string = "",
  inline: boolean = false
): EquationNode {
  return new EquationNode(equation, inline);
}

export function $isEquationNode(node: LexicalNode | null | undefined): node is EquationNode {
  return node instanceof EquationNode;
}

interface EquationComponentProps {
  equation: string;
  inline: boolean;
  nodeKey: NodeKey;
}

function EquationComponent({ equation, inline }: EquationComponentProps) {
  const katexString = (() => {
    try {
      return katex.renderToString(equation, {
        displayMode: !inline,
        throwOnError: false,
        output: "html",
      });
    } catch (error) {
      return `<span style="color: red;">Error: ${error instanceof Error ? error.message : String(error)}</span>`;
    }
  })();

  return (
    <span
      className={inline ? "inline-equation" : "block-equation"}
      dangerouslySetInnerHTML={{ __html: katexString }}
    />
  );
}
