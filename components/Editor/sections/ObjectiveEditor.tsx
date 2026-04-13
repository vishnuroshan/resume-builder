"use client";

import { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import type { JSONContent } from "@tiptap/react";
import { useResumeStore } from "@/store/useResumeStore";

export default function ObjectiveEditor() {
  const objective = useResumeStore(
    (state) => state.document?.objective ?? null,
  );
  const setObjective = useResumeStore((state) => state.setObjective);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Objective allows paragraphs and inline marks only.
        heading: false,
        bulletList: false,
        orderedList: false,
        listItem: false,
        blockquote: false,
        codeBlock: false,
        horizontalRule: false,
      }),
    ],
    immediatelyRender: false,
    content: objective?.content ?? { type: "doc", content: [] },
    onUpdate: ({ editor: e }) => {
      setObjective({ type: "objective", content: e.getJSON() });
    },
  });

  // Undo/redo sync: update editor when the store changes externally.
  useEffect(() => {
    const isEditorReady = editor !== null;
    const hasObjective = objective !== null;

    if (!isEditorReady || !hasObjective) return;

    const isSynced =
      JSON.stringify(editor.getJSON()) === JSON.stringify(objective.content);

    if (isSynced) return;

    editor.commands.setContent(objective.content as JSONContent);
  }, [objective, editor]);

  return (
    <section className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-zinc-400">
        Objective
      </h2>
      <EditorContent
        editor={editor}
        className="min-h-24 text-sm text-zinc-800 [&_.ProseMirror]:outline-none [&_.ProseMirror_p]:mb-2"
      />
    </section>
  );
}
