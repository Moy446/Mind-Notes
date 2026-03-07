import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import mammoth from "mammoth";
import { useEffect } from 'react';
import '/src/Doc.css'

export default function TipTap({ onReady }) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: "<p>Empieza a escribir…</p>",
  });

  const importDocx = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.convertToHtml({ arrayBuffer });
    editor.commands.setContent(result.value);
  };

  useEffect(() => {
    if (editor && onReady) {
      onReady(editor);
    }
  }, [editor, onReady]);

  return (
    <div className="editor-wrapper">
      <div className="page">
        <EditorContent editor={editor} />
      </div>

      <input
        type="file"
        accept=".docx"
        onChange={(e) => importDocx(e.target.files[0])}
      />
    </div>
  );
}