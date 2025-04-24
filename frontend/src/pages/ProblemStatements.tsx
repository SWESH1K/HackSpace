import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Highlight from "@tiptap/extension-highlight";
import Image from "@tiptap/extension-image";
import Typography from "@tiptap/extension-typography";
import Superscript from "@tiptap/extension-superscript";
import Subscript from "@tiptap/extension-subscript";
import Link from "@tiptap/extension-link";
import { TrailingNode } from "@/components/tiptap-extension/trailing-node-extension"
interface EventProps {
  problem_statements: object;
}

interface ProblemStatementsProps {
  event: EventProps;
}

const ProblemStatements = ({ event }: ProblemStatementsProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Underline,
      TaskList,
      TaskItem.configure({ nested: true }),
      Highlight.configure({ multicolor: true }),
      Image,
      Typography,
      Superscript,
      Subscript,
      TrailingNode,
      Link.configure({ openOnClick: false }),
    ],
    content: event.problem_statements, // Pass the JSON content here
    editable: false, // Make it read-only
  });

  if (!editor) {
    return null; // Render nothing until the editor is initialized
  }

  return (
    <div className="markdown px-[20%] py-10">
      <EditorContent editor={editor} />
    </div>
  );
};

export default ProblemStatements;