"use client";

import { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import type { JSONContent } from "@tiptap/react";
import { Button, TextField, Label, Input } from "react-aria-components";
import { useResumeStore } from "@/store/useResumeStore";
import { sanitizePastedHtml } from "@/lib/sanitizePaste";
import type {
  ExperienceEntry,
  ExperienceProject,
  ExperienceSection,
} from "@/types/resume.types";

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

function useBulletEditor(
  initial: JSONContent,
  onChange: (json: JSONContent) => void,
  externalJson: JSONContent,
) {
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
    content: initial,
    editorProps: { transformPastedHTML: sanitizePastedHtml },
    onUpdate: ({ editor: e }) => onChange(e.getJSON()),
  });

  // Undo/redo sync guard
  useEffect(() => {
    if (editor === null) return;
    const isSynced =
      JSON.stringify(editor.getJSON()) === JSON.stringify(externalJson);
    if (isSynced) return;
    editor.commands.setContent(externalJson as JSONContent);
  }, [externalJson, editor]);

  return editor;
}

// ─── Project sub-section ─────────────────────────────────────────────────────

interface ProjectEditorProps {
  project: ExperienceProject;
  onChange: (updated: ExperienceProject) => void;
  onRemove: () => void;
}

function ProjectSubEditor({ project, onChange, onRemove }: ProjectEditorProps) {
  const editor = useBulletEditor(
    project.bullets,
    (bullets) => onChange({ ...project, bullets }),
    project.bullets,
  );

  return (
    <div className="mt-3 rounded border border-zinc-100 bg-zinc-50 p-3">
      <div className="mb-2 flex items-center gap-2">
        <TextField className="flex flex-1 flex-col">
          <Label className={labelClass}>Project / Sub-header (optional)</Label>
          <Input
            value={project.name ?? ""}
            onChange={(e) =>
              onChange({ ...project, name: e.target.value || null })
            }
            className={inputClass}
          />
        </TextField>
        <button
          onClick={onRemove}
          className={`${removeBtnClass} mt-4 self-end`}
        >
          Remove
        </button>
      </div>
      <EditorContent
        editor={editor}
        className="min-h-16 text-sm text-zinc-800 [&_.ProseMirror]:outline-none [&_.ProseMirror_ul]:list-disc [&_.ProseMirror_ul]:pl-5"
      />
    </div>
  );
}

// ─── Single experience entry ──────────────────────────────────────────────────

interface EntryEditorProps {
  entry: ExperienceEntry;
  onChange: (updated: ExperienceEntry) => void;
  onRemove: () => void;
}

function ExperienceEntryEditor({
  entry,
  onChange,
  onRemove,
}: EntryEditorProps) {
  const isCurrentRole = entry.endYear === null;

  const bulletEditor = useBulletEditor(
    entry.bullets,
    (bullets) => onChange({ ...entry, bullets }),
    entry.bullets,
  );

  function updateProject(index: number, updated: ExperienceProject) {
    const projects = entry.projects.map((p, i) => (i === index ? updated : p));
    onChange({ ...entry, projects });
  }

  function removeProject(index: number) {
    const projects = entry.projects.filter((_, i) => i !== index);
    onChange({ ...entry, projects });
  }

  function addProject() {
    const newProject: ExperienceProject = {
      id: crypto.randomUUID(),
      name: null,
      bullets: EMPTY_BULLETS,
    };
    onChange({ ...entry, projects: [...entry.projects, newProject] });
  }

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4">
      <div className="mb-3 flex items-start justify-between">
        <span className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
          Entry
        </span>
        <button onClick={onRemove} className={removeBtnClass}>
          Remove Entry
        </button>
      </div>

      <div className="mb-3 grid grid-cols-2 gap-3">
        <TextField className="flex flex-col">
          <Label className={labelClass}>Company</Label>
          <Input
            value={entry.company}
            onChange={(e) => onChange({ ...entry, company: e.target.value })}
            className={inputClass}
          />
        </TextField>
        <TextField className="flex flex-col">
          <Label className={labelClass}>Designation / Role</Label>
          <Input
            value={entry.designation}
            onChange={(e) =>
              onChange({ ...entry, designation: e.target.value })
            }
            className={inputClass}
          />
        </TextField>
        <TextField className="flex flex-col">
          <Label className={labelClass}>Start Year</Label>
          <Input
            value={entry.startYear}
            onChange={(e) => onChange({ ...entry, startYear: e.target.value })}
            className={inputClass}
          />
        </TextField>
        <div className="flex flex-col gap-1">
          <TextField className="flex flex-col">
            <Label className={labelClass}>
              End Year{" "}
              <button
                onClick={() =>
                  onChange({ ...entry, endYear: isCurrentRole ? "" : null })
                }
                className="ml-2 cursor-pointer text-zinc-400 underline hover:text-zinc-600"
              >
                {isCurrentRole ? "add end year" : "mark as current"}
              </button>
            </Label>
            <Input
              value={entry.endYear ?? ""}
              disabled={isCurrentRole}
              onChange={(e) => onChange({ ...entry, endYear: e.target.value })}
              className={`${inputClass} disabled:cursor-not-allowed disabled:opacity-50`}
            />
          </TextField>
        </div>
      </div>

      <p className="mb-1 text-xs font-medium text-zinc-500">Bullet Points</p>
      <EditorContent
        editor={bulletEditor}
        className="min-h-16 rounded border border-zinc-100 bg-zinc-50 p-2 text-sm text-zinc-800 [&_.ProseMirror]:outline-none [&_.ProseMirror_ul]:list-disc [&_.ProseMirror_ul]:pl-5"
      />

      {entry.projects.map((project, i) => (
        <ProjectSubEditor
          key={project.id}
          project={project}
          onChange={(updated) => updateProject(i, updated)}
          onRemove={() => removeProject(i)}
        />
      ))}

      <Button onPress={addProject} className={`${addBtnClass} mt-3`}>
        + Add Project / Sub-section
      </Button>
    </div>
  );
}

// ─── Section ─────────────────────────────────────────────────────────────────

export default function ExperienceEditor() {
  const experience = useResumeStore(
    (state) => state.document?.experience ?? null,
  );
  const setExperience = useResumeStore((state) => state.setExperience);

  if (experience === null) return null;

  function updateEntry(index: number, updated: ExperienceEntry) {
    if (experience === null) return;
    const entries = experience.entries.map((e, i) =>
      i === index ? updated : e,
    );
    setExperience({ ...experience, entries });
  }

  function removeEntry(index: number) {
    if (experience === null) return;
    const entries = experience.entries.filter((_, i) => i !== index);
    setExperience({ ...experience, entries });
  }

  function addEntry() {
    if (experience === null) return;
    const newEntry: ExperienceEntry = {
      id: crypto.randomUUID(),
      company: "",
      designation: "",
      startYear: "",
      endYear: null,
      bullets: EMPTY_BULLETS,
      projects: [],
    };
    setExperience({
      ...experience,
      entries: [...experience.entries, newEntry],
    });
  }

  return (
    <section className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-zinc-400">
        Work Experience
      </h2>
      <div className="flex flex-col gap-4">
        {experience.entries.map((entry, i) => (
          <ExperienceEntryEditor
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
        + Add Experience
      </Button>
    </section>
  );
}
