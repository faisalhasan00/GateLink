import React from 'react';
import { 
  Bold, 
  Italic, 
  Heading2, 
  Heading3, 
  List, 
  ListOrdered, 
  Quote, 
  Image as ImageIcon, 
  Undo, 
  Redo 
} from 'lucide-react';

export function EditorMenuBar({ editor, isDark, onOpenMediaPicker }) {
  if (!editor) return null;

  return (
    <div style={{ backgroundColor: isDark ? '#0F172A' : '#F8FAFC', borderBottom: `1px solid ${isDark ? '#334155' : '#E2E8F0'}`, padding: '12px 16px', display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        style={{ padding: '6px 10px', borderRadius: '6px', border: 'none', backgroundColor: editor.isActive('bold') ? '#1E3A8A' : 'transparent', color: editor.isActive('bold') ? '#FFF' : (isDark ? '#F8FAFC' : '#1E293B'), cursor: 'pointer' }}
      >
        <Bold size={16} />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        style={{ padding: '6px 10px', borderRadius: '6px', border: 'none', backgroundColor: editor.isActive('italic') ? '#1E3A8A' : 'transparent', color: editor.isActive('italic') ? '#FFF' : (isDark ? '#F8FAFC' : '#1E293B'), cursor: 'pointer' }}
      >
        <Italic size={16} />
      </button>

      <div style={{ width: '1px', height: '20px', backgroundColor: isDark ? '#334155' : '#CBD5E1' }} />

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        style={{ padding: '6px 10px', borderRadius: '6px', border: 'none', backgroundColor: editor.isActive('heading', { level: 2 }) ? '#1E3A8A' : 'transparent', color: editor.isActive('heading', { level: 2 }) ? '#FFF' : (isDark ? '#F8FAFC' : '#1E293B'), cursor: 'pointer' }}
      >
        <Heading2 size={16} />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        style={{ padding: '6px 10px', borderRadius: '6px', border: 'none', backgroundColor: editor.isActive('heading', { level: 3 }) ? '#1E3A8A' : 'transparent', color: editor.isActive('heading', { level: 3 }) ? '#FFF' : (isDark ? '#F8FAFC' : '#1E293B'), cursor: 'pointer' }}
      >
        <Heading3 size={16} />
      </button>

      <div style={{ width: '1px', height: '20px', backgroundColor: isDark ? '#334155' : '#CBD5E1' }} />

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        style={{ padding: '6px 10px', borderRadius: '6px', border: 'none', backgroundColor: editor.isActive('bulletList') ? '#1E3A8A' : 'transparent', color: editor.isActive('bulletList') ? '#FFF' : (isDark ? '#F8FAFC' : '#1E293B'), cursor: 'pointer' }}
      >
        <List size={16} />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        style={{ padding: '6px 10px', borderRadius: '6px', border: 'none', backgroundColor: editor.isActive('orderedList') ? '#1E3A8A' : 'transparent', color: editor.isActive('orderedList') ? '#FFF' : (isDark ? '#F8FAFC' : '#1E293B'), cursor: 'pointer' }}
      >
        <ListOrdered size={16} />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        style={{ padding: '6px 10px', borderRadius: '6px', border: 'none', backgroundColor: editor.isActive('blockquote') ? '#1E3A8A' : 'transparent', color: editor.isActive('blockquote') ? '#FFF' : (isDark ? '#F8FAFC' : '#1E293B'), cursor: 'pointer' }}
      >
        <Quote size={16} />
      </button>

      <div style={{ width: '1px', height: '20px', backgroundColor: isDark ? '#334155' : '#CBD5E1' }} />

      <button
        type="button"
        onClick={onOpenMediaPicker}
        style={{ padding: '6px 12px', borderRadius: '6px', border: 'none', backgroundColor: isDark ? '#334155' : '#E2E8F0', color: isDark ? '#F8FAFC' : '#1E293B', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', fontWeight: '600' }}
      >
        <ImageIcon size={16} /> Insert Media
      </button>

      <div style={{ width: '1px', height: '20px', backgroundColor: isDark ? '#334155' : '#CBD5E1' }} />

      <button
        type="button"
        onClick={() => editor.chain().focus().undo().run()}
        style={{ padding: '6px 10px', borderRadius: '6px', border: 'none', backgroundColor: 'transparent', color: isDark ? '#F8FAFC' : '#1E293B', cursor: 'pointer' }}
      >
        <Undo size={16} />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().redo().run()}
        style={{ padding: '6px 10px', borderRadius: '6px', border: 'none', backgroundColor: 'transparent', color: isDark ? '#F8FAFC' : '#1E293B', cursor: 'pointer' }}
      >
        <Redo size={16} />
      </button>
    </div>
  );
}
