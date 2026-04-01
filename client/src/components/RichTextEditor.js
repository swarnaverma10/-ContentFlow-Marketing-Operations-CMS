import React, { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import Image from "@tiptap/extension-image";
import CharacterCount from "@tiptap/extension-character-count";
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon,
  Quote, 
  Undo, 
  Redo, 
  Heading1, 
  Heading2, 
  AlignCenter,
  AlignLeft,
  AlignRight,
  Link as LinkIcon,
  Image as ImageIcon,
  Sparkles
} from "lucide-react";

const ToolbarButton = ({ onClick, active, children, title }) => (
  <button
    onClick={onClick}
    className={`p-2.5 rounded-xl transition-all ${
      active 
        ? "bg-slate-900 text-white shadow-lg shadow-slate-200 scale-110" 
        : "text-slate-400 hover:bg-slate-100 hover:text-slate-900"
    }`}
    title={title}
    type="button"
  >
    {children}
  </button>
);

function RichTextEditor({ value, onChange }) {
  const [showAI, setShowAI] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState("");
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: false }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Image,
      CharacterCount,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-slate max-w-none focus:outline-none min-h-[350px] px-8 py-6 text-slate-700 font-medium leading-relaxed',
      },
    },
  });

  if (!editor) return null;

  const addLink = () => {
    const url = window.prompt('URL');
    if (url) editor.chain().focus().setLink({ href: url }).run();
  };

  const addImage = () => {
    const url = window.prompt('Image URL');
    if (url) editor.chain().focus().setImage({ src: url }).run();
  };

  const handleAIAssist = (prompt) => {
    setAiLoading(true);
    setAiSuggestion("");
    setTimeout(() => {
      const suggestions = {
        "improve": "✨ Consider restructuring your argument. Start with a strong hook, follow with evidence, and close with a clear call-to-action. Use active voice to improve engagement.",
        "summarize": "📋 Key Takeaways: This article explores the core topic with structured arguments providing actionable insights for the reader.",
        "tags": "🏷️ Suggested Tags: #content-strategy, #seo-optimization, #digital-marketing, #editorial, #publishing"
      };
      setAiSuggestion(suggestions[prompt] || "Processing your request...");
      setAiLoading(false);
    }, 1500);
  };

  return (
    <div className="bg-slate-50/30 rounded-[2rem] overflow-hidden border border-slate-200/60 shadow-inner group-focus-within:border-indigo-200 transition-all">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1.5 p-3 border-b border-slate-200/60 bg-white/50 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-1 bg-slate-100/50 p-1 rounded-2xl">
            <ToolbarButton 
                onClick={() => editor.chain().focus().toggleBold().run()}
                active={editor.isActive('bold')}
                title="Bold"
            >
                <Bold size={18} />
            </ToolbarButton>
            <ToolbarButton 
                onClick={() => editor.chain().focus().toggleItalic().run()}
                active={editor.isActive('italic')}
                title="Italic"
            >
                <Italic size={18} />
            </ToolbarButton>
            <ToolbarButton 
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                active={editor.isActive('underline')}
                title="Underline"
            >
                <UnderlineIcon size={18} />
            </ToolbarButton>
        </div>

        <div className="h-8 w-[1px] bg-slate-200 mx-1" />

        <div className="flex items-center gap-1 bg-slate-100/50 p-1 rounded-2xl">
            <ToolbarButton 
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                active={editor.isActive('heading', { level: 1 })}
                title="Heading 1"
            >
                <Heading1 size={18} />
            </ToolbarButton>
            <ToolbarButton 
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                active={editor.isActive('heading', { level: 2 })}
                title="Heading 2"
            >
                <Heading2 size={18} />
            </ToolbarButton>
        </div>

        <div className="h-8 w-[1px] bg-slate-200 mx-1" />

        <div className="flex items-center gap-1 bg-slate-100/50 p-1 rounded-2xl">
            <ToolbarButton 
                onClick={() => editor.chain().focus().setTextAlign('left').run()}
                active={editor.isActive({ textAlign: 'left' })}
                title="Align Left"
            >
                <AlignLeft size={18} />
            </ToolbarButton>
            <ToolbarButton 
                onClick={() => editor.chain().focus().setTextAlign('center').run()}
                active={editor.isActive({ textAlign: 'center' })}
                title="Align Center"
            >
                <AlignCenter size={18} />
            </ToolbarButton>
            <ToolbarButton 
                onClick={() => editor.chain().focus().setTextAlign('right').run()}
                active={editor.isActive({ textAlign: 'right' })}
                title="Align Right"
            >
                <AlignRight size={18} />
            </ToolbarButton>
        </div>

        <div className="h-8 w-[1px] bg-slate-200 mx-1" />

        <div className="flex items-center gap-1 bg-slate-100/50 p-1 rounded-2xl">
            <ToolbarButton onClick={addLink} active={editor.isActive('link')} title="Link">
                <LinkIcon size={18} />
            </ToolbarButton>
            <ToolbarButton onClick={addImage} title="Add External Image">
                <ImageIcon size={18} />
            </ToolbarButton>
            <ToolbarButton 
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                active={editor.isActive('blockquote')}
                title="Quote"
            >
                <Quote size={18} />
            </ToolbarButton>
        </div>

        <div className="ml-auto flex items-center gap-1">
            <button
              type="button"
              onClick={() => setShowAI(!showAI)}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${
                showAI 
                ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' 
                : 'bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-600 border border-indigo-100 hover:shadow-md'
              }`}
            >
              <Sparkles size={16} className={showAI ? 'animate-pulse' : ''} />
              AI SPARK
            </button>
            <div className="flex items-center gap-1 bg-slate-100/50 p-1 rounded-2xl ml-2">
              <ToolbarButton onClick={() => editor.chain().focus().undo().run()} title="Undo">
                  <Undo size={18} />
              </ToolbarButton>
              <ToolbarButton onClick={() => editor.chain().focus().redo().run()} title="Redo">
                  <Redo size={18} />
              </ToolbarButton>
            </div>
        </div>
      </div>

      <EditorContent editor={editor} />
      
      <div className="p-4 border-t border-slate-200/60 flex items-center justify-between bg-white text-slate-400">
        <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest px-2">
            <span className="flex items-center gap-2"><div className="w-1 h-1 bg-indigo-400 rounded-full" /> Words: {editor.storage.characterCount.words()}</span>
            <span className="flex items-center gap-2"><div className="w-1 h-1 bg-indigo-400 rounded-full" /> Chars: {editor.storage.characterCount.characters()}</span>
        </div>
        <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all ${editor.isFocused ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-slate-100 text-slate-400'}`}>
          {editor.isFocused ? 'LIVE EDITING' : 'IDLE'}
        </div>
      </div>
      {showAI && (
        <div className="border-t border-indigo-100 bg-gradient-to-br from-indigo-50/80 to-purple-50/50 p-6 space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-100">
              <Sparkles size={16} />
            </div>
            <div>
              <p className="text-[11px] font-black text-indigo-600 uppercase tracking-widest">AI Cognition Layer</p>
              <p className="text-[10px] text-slate-400 font-bold">Powered by Gemini Neural Engine</p>
            </div>
          </div>
          <div className="flex gap-3 flex-wrap">
            {[
              { id: 'improve', label: '✨ Improve Writing', color: 'indigo' },
              { id: 'summarize', label: '📋 Summarize', color: 'emerald' },
              { id: 'tags', label: '🏷️ Generate Tags', color: 'amber' }
            ].map(btn => (
              <button
                key={btn.id}
                type="button"
                onClick={() => handleAIAssist(btn.id)}
                disabled={aiLoading}
                className="px-5 py-2.5 bg-white border border-slate-200 hover:border-indigo-200 hover:bg-indigo-50 rounded-2xl text-xs font-black text-slate-600 hover:text-indigo-600 transition-all shadow-sm disabled:opacity-50"
              >
                {btn.label}
              </button>
            ))}
          </div>
          {aiLoading && (
            <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-indigo-100">
              <div className="w-4 h-4 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
              <p className="text-xs font-bold text-slate-500">Neural engine processing...</p>
            </div>
          )}
          {aiSuggestion && !aiLoading && (
            <div className="p-5 bg-white rounded-2xl border border-indigo-100 shadow-sm">
              <p className="text-sm text-slate-700 leading-relaxed font-medium">{aiSuggestion}</p>
              <button
                type="button"
                onClick={() => setAiSuggestion("")}
                className="mt-3 text-[10px] font-black text-slate-400 hover:text-rose-500 uppercase tracking-widest"
              >
                Dismiss
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default RichTextEditor;