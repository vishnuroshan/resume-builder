"use client";

import { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import type { JSONContent } from "@tiptap/react";
import { Button, TextField, Label, Input } from "react-aria-components";
import { useResumeStore } from "@/store/useResumeStore";
import { sanitizePastedHtml } from "@/lib/sanitizePaste";
import type {
  CustomSection,
  CustomEntry,
  CustomBodyType,
} from "@/types/resume.types";

const inputClass =
  "w-full rounded border border-zinc-200 bg-white px-3 py-1.5 text-sm text-zinc-800 outline-none focus:border-zinc-400";
const labelClass = "mb-1 block text-xs font-medium text-zinc-500";
const addBtnClass =
  "cursor-pointer rounded border border-dashed border-zinc-300 px-3 py-1.5 text-xs text-zinc-500 hover:border-zinc-400 hover:text-zinc-700";
const removeBtnClass =
  "cursor-pointer rounded bg-red-50 px-2 py-1 text-xs text-red-500 hover:bg-red-100";

function emptyBody(bodyType: CustomBodyType): JSONContent {
  if (bodyType === "bullets") {
    return { type: "doc", content: [{ type: "bulletList", content: [] }] };
  }
  return { type: "doc", content: [] };
}

// ─── Custom Entry Body Editor ────────────────────────────────────────────────

interface BodyEditorProps {
  bodyType: CustomBodyType;
  body: JSONContent;
  onChange: (json: JSONContent) => void;
}

function CustomBodyEditor({ bodyType, body, onChange }: BodyEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure(
        bodyType === "bullets"
          ? {
              heading: false,
              orderedList: false,
              blockquote: false,
              codeBlock: false,
              horizontalRule: false,
            }
          : {
              heading: false,
              bulletList: false,
              orderedList: false,
              listItem: false,
              blockquote: false,
              codeBlock: false,
              horizontalRule: false,
            },
      ),
    ],
    immediatelyRender: false,
    content: body,
    editorProps: { transformPastedHTML: sanitizePastedHtml },
    onUpdate: ({ editor: e }) => onChange(e.getJSON()),
  });

  useEffect(() => {
    if (editor === null) return;
    const isSynced = JSON.stringify(editor.getJSON()) === JSON.stringify(body);
    if (isSynced) return;
    editor.commands.setContent(body as JSONContent);
  }, [body, editor]);

  const bulletStyles =
    bodyType === "bullets"
      ? "[&_.ProseMirror_ul]:list-disc [&_.ProseMirror_ul]:pl-5"
      : "";

  return (
    <EditorContent
      editor={editor}
      className={`min-h-16 rounded border border-zinc-100 bg-zinc-50 p-2 text-sm text-zinc-800 [&_.ProseMirror]:outline-none [&_.ProseMirror_p]:mb-1 ${bulletStyles}`}
    />
  );
}

// ─── Custom Entry ─────────────────────────────────────────────────────────────

interface EntryProps {
  entry: CustomEntry;
  bodyType: CustomBodyType;
  onChange: (updated: CustomEntry) => void;
  onRemove: () => void;
}

function CustomEntryEditor({
  entry,
  bodyType,
  onChange,
  onRemove,
}: EntryProps) {
  return (
    <div className="rounded border border-zinc-100 bg-zinc-50 p-3">
      <div className="mb-2 grid grid-cols-2 gap-3">
        <TextField className="flex flex-col">
          <Label className={labelClass}>Title (optional)</Label>
          <Input
            value={entry.title ?? ""}
            onChange={(e) =>
              onChange({ ...entry, title: e.target.value || undefined })
            }
            className={inputClass}
          />
        </TextField>
        <div className="flex items-end gap-2">
          <TextField className="flex flex-1 flex-col">
            <Label className={labelClass}>Subtitle (optional)</Label>
            <Input
              value={entry.subtitle ?? ""}
              onChange={(e) =>
                onChange({ ...entry, subtitle: e.target.value || undefined })
              }
              className={inputClass}
            />
          </TextField>
          <button onClick={onRemove} className={`${removeBtnClass} mb-0.5`}>
            Remove
          </button>
        </div>
      </div>
      <CustomBodyEditor
        bodyType={bodyType}
        body={entry.body}
        onChange={(body) => onChange({ ...entry, body })}
      />
    </div>
  );
}

// ─── Custom Section ───────────────────────────────────────────────────────────

interface SectionProps {
  section: CustomSection;
  onChange: (updated: CustomSection) => void;
  onRemove: () => void;
}

function CustomSectionBlock({ section, onChange, onRemove }: SectionProps) {
  function updateEntry(index: number, updated: CustomEntry) {
    const entries = section.entries.map((e, i) => (i === index ? updated : e));
    onChange({ ...section, entries });
  }

  function removeEntry(index: number) {
    onChange({
      ...section,
      entries: section.entries.filter((_, i) => i !== index),
    });
  }

  function addEntry() {
    const newEntry: CustomEntry = {
      id: crypto.randomUUID(),
      body: emptyBody(section.bodyType),
    };
    onChange({ ...section, entries: [...section.entries, newEntry] });
  }

  return (
    <div className="rounded-lg border border-zinc-200 p-4">
      <div className="mb-3 flex items-center gap-3">
        <TextField className="flex flex-1 flex-col">
          <Label className={labelClass}>Section Title</Label>
          <Input
            value={section.sectionTitle}
            onChange={(e) =>
              onChange({ ...section, sectionTitle: e.target.value })
            }
            className={inputClass}
          />
        </TextField>

        <div className="flex flex-col gap-1">
          <span className={labelClass}>Body Type</span>
          <div className="flex gap-1">
            {(["bullets", "paragraphs"] as CustomBodyType[]).map((type) => (
              <button
                key={type}
                onClick={() => onChange({ ...section, bodyType: type })}
                className={`cursor-pointer rounded px-3 py-1.5 text-xs font-medium transition-colors ${
                  section.bodyType === type
                    ? "bg-zinc-800 text-white"
                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                }`}
              >
                {type === "bullets" ? "• Bullets" : "¶ Paragraphs"}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={onRemove}
          className={`${removeBtnClass} mt-4 self-end`}
        >
          Remove Section
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {section.entries.map((entry, i) => (
          <CustomEntryEditor
            key={entry.id}
            entry={entry}
            bodyType={section.bodyType}
            onChange={(updated) => updateEntry(i, updated)}
            onRemove={() => removeEntry(i)}
          />
        ))}
      </div>

      <Button
        onPress={addEntry}
        className={`${addBtnClass} mt-3 w-full text-center`}
      >
        + Add Entry
      </Button>
    </div>
  );
}

// ─── Section List ─────────────────────────────────────────────────────────────

export default function CustomSectionEditor() {
  const customSections = useResumeStore(
    (state) => state.document?.customSections ?? null,
  );
  const setCustomSections = useResumeStore((state) => state.setCustomSections);

  if (customSections === null) return null;

  function updateSection(index: number, updated: CustomSection) {
    if (customSections === null) return;
    setCustomSections(
      customSections.map((s, i) => (i === index ? updated : s)),
    );
  }

  function removeSection(index: number) {
    if (customSections === null) return;
    setCustomSections(customSections.filter((_, i) => i !== index));
  }

  function addSection() {
    if (customSections === null) return;
    const newSection: CustomSection = {
      id: crypto.randomUUID(),
      type: "custom",
      sectionTitle: "Custom Section",
      bodyType: "bullets",
      entries: [],
    };
    setCustomSections([...customSections, newSection]);
  }

  return (
    <section className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-zinc-400">
        Custom Sections
      </h2>
      <div className="flex flex-col gap-4">
        {customSections.map((section, i) => (
          <CustomSectionBlock
            key={section.id}
            section={section}
            onChange={(updated) => updateSection(i, updated)}
            onRemove={() => removeSection(i)}
          />
        ))}
      </div>
      <Button
        onPress={addSection}
        className={`${addBtnClass} mt-4 w-full text-center`}
      >
        + Add Custom Section
      </Button>
    </section>
  );
}
