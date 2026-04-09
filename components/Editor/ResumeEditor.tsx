"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useResumeStore } from "@/store/useResumeStore";

export default function ResumeEditor() {
  const setHeader = useResumeStore((state) => state.setHeader);
  const header = useResumeStore((state) => state.document?.header);

  const editor = useEditor({
    extensions: [StarterKit],
    // Prevent SSR/client hydration mismatch — do not render on the server.
    immediatelyRender: false,
    content: header?.summary ?? "<p>Write your professional summary…</p>",
    onUpdate: ({ editor: currentEditor }) => {
      if (header === undefined) return;

      setHeader({
        ...header,
        summary: currentEditor.getJSON(),
      });
    },
  });

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
      <EditorContent editor={editor} />
    </div>
  );
}
