"use client";

import { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import type { JSONContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useResumeStore } from "@/store/useResumeStore";
import EditorToolbar from "./EditorToolbar";

function handleUndo() {
  useResumeStore.temporal.getState().undo();
}

function handleRedo() {
  useResumeStore.temporal.getState().redo();
}

export default function ResumeEditor() {
  const setContent = useResumeStore((state) => state.setContent);
  const content = useResumeStore((state) => state.resumeContent.content);

  const editor = useEditor({
    extensions: [StarterKit],
    // Prevent SSR/client hydration mismatch — do not render on the server.
    immediatelyRender: false,
    content: "<p>Start writing your resume here…</p>",
    onUpdate: ({ editor: currentEditor }) => {
      setContent(currentEditor.getJSON() as Record<string, unknown>);
    },
  });

  // When zundo alters the store via undo/redo, the Tiptap DOM must reflect the
  // restored state. We skip the update when the editor is already in sync to
  // avoid a redundant setContent call on every keystroke.
  useEffect(() => {
    const isEditorReady = editor !== null;
    const hasContent = content !== null;

    if (!isEditorReady || !hasContent) return;

    const editorJson = JSON.stringify(editor.getJSON());
    const storeJson = JSON.stringify(content);
    const isSynced = editorJson === storeJson;

    if (isSynced) return;

    editor.commands.setContent(content as JSONContent);
  }, [content, editor]);

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
      <EditorToolbar onUndo={handleUndo} onRedo={handleRedo} />
      <EditorContent editor={editor} />
    </div>
  );
}
