"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useResumeStore } from "@/store/useResumeStore";

export default function ResumeEditor() {
  const setContent = useResumeStore((state) => state.setContent);

  const editor = useEditor({
    extensions: [StarterKit],
    // Prevent SSR/client hydration mismatch — do not render on the server.
    immediatelyRender: false,
    content: "<p>Start writing your resume here…</p>",
    onUpdate: ({ editor: currentEditor }) => {
      setContent(currentEditor.getJSON() as Record<string, unknown>);
    },
  });

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
      <EditorContent editor={editor} />
    </div>
  );
}
