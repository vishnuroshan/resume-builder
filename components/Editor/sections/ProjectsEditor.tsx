"use client";

import { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import type { JSONContent } from "@tiptap/react";
import { Button, TextField, Label, Input } from "react-aria-components";
import { useResumeStore } from "@/store/useResumeStore";
import { sanitizePastedHtml } from "@/lib/sanitizePaste";
import type { ProjectEntry } from "@/types/resume.types";

const inputClass =
  "w-full rounded border border-zinc-200 bg-white px-3 py-1.5 text-sm text-zinc-800 outline-none focus:border-zinc-400";
const labelClass = "mb-1 block text-xs font-medium text-zinc-500";
const addBtnClass =
  "cursor-pointer rounded border border-dashed border-zinc-300 px-3 py-1.5 text-xs text-zinc-500 hover:border-zinc-400 hover:text-zinc-700";
const removeBtnClass =
  "cursor-pointer rounded bg-red-50 px-2 py-1 text-xs text-red-500 hover:bg-red-100";

const EMPTY_BULLETS: JSONContent = {
  type: "doc",
  content: [{ type: "bulletList", content: [] }],
};

interface ProjectEntryEditorProps {
  entry: ProjectEntry;
  onChange: (updated: ProjectEntry) => void;
  onRemove: () => void;
}

function ProjectEntryEditor({
  entry,
  onChange,
  onRemove,
}: ProjectEntryEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        orderedList: false,
        blockquote: false,
        codeBlock: false,
        horizontalRule: false,
      }),
    ],
    immediatelyRender: false,
    content: entry.bullets,
    editorProps: { transformPastedHTML: sanitizePastedHtml },
    onUpdate: ({ editor: e }) => onChange({ ...entry, bullets: e.getJSON() }),
  });

  useEffect(() => {
    if (editor === null) return;
    const isSynced =
      JSON.stringify(editor.getJSON()) === JSON.stringify(entry.bullets);
    if (isSynced) return;
    editor.commands.setContent(entry.bullets as JSONContent);
  }, [entry.bullets, editor]);

  return (
    <div className="rounded-lg border border-zinc-200 p-4">
      <div className="mb-3 flex items-start justify-between">
        <span className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
          Project
        </span>
        <button onClick={onRemove} className={removeBtnClass}>
          Remove
        </button>
      </div>
      <div className="mb-3 grid grid-cols-2 gap-3">
        <TextField className="flex flex-col">
          <Label className={labelClass}>Project Name</Label>
          <Input
            value={entry.name}
            onChange={(e) => onChange({ ...entry, name: e.target.value })}
            className={inputClass}
          />
        </TextField>
        <TextField className="flex flex-col">
          <Label className={labelClass}>Subtitle (optional)</Label>
          <Input
            value={entry.subtitle ?? ""}
            onChange={(e) =>
              onChange({ ...entry, subtitle: e.target.value || undefined })
            }
            className={inputClass}
          />
        </TextField>
      </div>
      <p className={labelClass}>Bullet Points</p>
      <EditorContent
        editor={editor}
        className="min-h-16 rounded border border-zinc-100 bg-zinc-50 p-2 text-sm text-zinc-800 [&_.ProseMirror]:outline-none [&_.ProseMirror_ul]:list-disc [&_.ProseMirror_ul]:pl-5"
      />
    </div>
  );
}

export default function ProjectsEditor() {
  const projects = useResumeStore((state) => state.document?.projects ?? null);
  const setProjects = useResumeStore((state) => state.setProjects);

  if (projects === null) return null;

  function updateEntry(index: number, updated: ProjectEntry) {
    if (projects === null) return;
    const entries = projects.entries.map((e, i) => (i === index ? updated : e));
    setProjects({ ...projects, entries });
  }

  function removeEntry(index: number) {
    if (projects === null) return;
    setProjects({
      ...projects,
      entries: projects.entries.filter((_, i) => i !== index),
    });
  }

  function addEntry() {
    if (projects === null) return;
    const newEntry: ProjectEntry = {
      id: crypto.randomUUID(),
      name: "",
      bullets: EMPTY_BULLETS,
    };
    setProjects({ ...projects, entries: [...projects.entries, newEntry] });
  }

  return (
    <section className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-zinc-400">
        Projects
      </h2>
      <div className="flex flex-col gap-4">
        {projects.entries.map((entry, i) => (
          <ProjectEntryEditor
            key={entry.id}
            entry={entry}
            onChange={(updated) => updateEntry(i, updated)}
            onRemove={() => removeEntry(i)}
          />
        ))}
      </div>
      <Button
        onPress={addEntry}
        className={`${addBtnClass} mt-4 w-full text-center`}
      >
        + Add Project
      </Button>
    </section>
  );
}
