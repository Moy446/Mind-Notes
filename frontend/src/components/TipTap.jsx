import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { CharacterCount } from '@tiptap/extensions'
import '/src/Doc.css'

const Tiptap = () => 
{
    const editor = useEditor({
        extensions: [StarterKit, CharacterCount.configure({limit:2275})],
        content: 'Hola mundo'
    })
    return(
        <>
            <EditorContent editor={editor}/>
        </>
    )
}
export default Tiptap;