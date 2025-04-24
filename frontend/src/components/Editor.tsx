import StarterKit from "@tiptap/starter-kit"
import { useEditor, EditorContent } from "@tiptap/react"

const extensions = [
  StarterKit
]

const content = ``

const TipTap = () => {
  const editor = useEditor({
    extensions,
    content
  })

  if (!editor) {
    return null
  }

  return <EditorContent editor={editor} />
}

export default TipTap
