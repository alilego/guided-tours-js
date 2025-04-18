import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
}

const RichTextEditor = ({ content, onChange }: RichTextEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="rich-text-editor">
      <div className="menu-bar bg-gray-50 border border-gray-300 rounded-t-md p-2 flex flex-wrap gap-2">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-2 py-1 rounded ${
            editor.isActive('bold')
              ? 'bg-gray-200 text-gray-900'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
          type="button"
        >
          <strong>B</strong>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-2 py-1 rounded ${
            editor.isActive('italic')
              ? 'bg-gray-200 text-gray-900'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
          type="button"
        >
          <em>I</em>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`px-2 py-1 rounded ${
            editor.isActive('underline')
              ? 'bg-gray-200 text-gray-900'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
          type="button"
        >
          <u>U</u>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`px-2 py-1 rounded ${
            editor.isActive('bulletList')
              ? 'bg-gray-200 text-gray-900'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
          type="button"
        >
          • List
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`px-2 py-1 rounded ${
            editor.isActive('orderedList')
              ? 'bg-gray-200 text-gray-900'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
          type="button"
        >
          1. List
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`px-2 py-1 rounded ${
            editor.isActive('blockquote')
              ? 'bg-gray-200 text-gray-900'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
          type="button"
        >
          Quote
        </button>
      </div>
      <EditorContent
        editor={editor}
        className="prose max-w-none border border-t-0 border-gray-300 rounded-b-md min-h-[300px] p-4"
      />
    </div>
  );
};

export default RichTextEditor; 