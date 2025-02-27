import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Markdown from '@tiptap/extension-markdown';
import { useState } from 'react';

// npm install @tiptap/extension-document @tiptap/extension-paragraph @tiptap/extension-text @tiptap/react

const Editor: React.FC = () => {
  const editor = useEditor({
    extensions: [StarterKit, Markdown],
    content: '**Welcome to Tiptap!** Start typing...',
  });

  const [markdown, setMarkdown] = useState('');

  if (!editor) return null;

  const handleConvertToMarkdown = () => {
    setMarkdown(editor.getHTML()); // Change to Markdown if needed
  };

  return (
    <div className="p-4 border rounded-md shadow-md">
      {/* Toolbar */}
      <div className="flex gap-2 mb-2">
        <button onClick={() => editor.chain().focus().toggleBold().run()} className="px-2 py-1 border">Bold</button>
        <button onClick={() => editor.chain().focus().toggleItalic().run()} className="px-2 py-1 border">Italic</button>
        <button onClick={() => editor.chain().focus().toggleUnderline().run()} className="px-2 py-1 border">Underline</button>
        <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className="px-2 py-1 border">H2</button>
      </div>
      
      {/* Editor */}
      <EditorContent editor={editor} className="border p-2 min-h-[200px]" />
      
      {/* Markdown Preview */}
      <button onClick={handleConvertToMarkdown} className="mt-2 px-4 py-2 bg-blue-500 text-white">Convert to Markdown</button>
      <pre className="mt-2 p-2 bg-gray-100 border">{markdown}</pre>
    </div>
  );
};

export default Editor;
