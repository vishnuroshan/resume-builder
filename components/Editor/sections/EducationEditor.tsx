"use client";

import { Button, TextField, Label, Input } from "react-aria-components";
import { useResumeStore } from "@/store/useResumeStore";
import type { EducationEntry } from "@/types/resume.types";

const inputClass =
  "w-full rounded border border-zinc-200 bg-white px-3 py-1.5 text-sm text-zinc-800 outline-none focus:border-zinc-400";
const labelClass = "mb-1 block text-xs font-medium text-zinc-500";
const addBtnClass =
  "cursor-pointer rounded border border-dashed border-zinc-300 px-3 py-1.5 text-xs text-zinc-500 hover:border-zinc-400 hover:text-zinc-700";
const removeBtnClass =
  "cursor-pointer rounded bg-red-50 px-2 py-1 text-xs text-red-500 hover:bg-red-100";

export default function EducationEditor() {
  const education = useResumeStore(
    (state) => state.document?.education ?? null,
  );
  const setEducation = useResumeStore((state) => state.setEducation);

  if (education === null) return null;

  function updateEntry(index: number, updated: EducationEntry) {
    if (education === null) return;
    const entries = education.entries.map((e, i) =>
      i === index ? updated : e,
    );
    setEducation({ ...education, entries });
  }

  function removeEntry(index: number) {
    if (education === null) return;
    setEducation({
      ...education,
      entries: education.entries.filter((_, i) => i !== index),
    });
  }

  function addEntry() {
    if (education === null) return;
    const newEntry: EducationEntry = {
      id: crypto.randomUUID(),
      institution: "",
      programme: "",
      startYear: "",
      endYear: "",
      description: "",
    };
    setEducation({ ...education, entries: [...education.entries, newEntry] });
  }

  return (
    <section className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-zinc-400">
        Education
      </h2>
      <div className="flex flex-col gap-4">
        {education.entries.map((entry, i) => (
          <div key={entry.id} className="rounded-lg border border-zinc-200 p-4">
            <div className="mb-3 flex items-start justify-between">
              <span className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
                Entry
              </span>
              <button onClick={() => removeEntry(i)} className={removeBtnClass}>
                Remove
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <TextField className="flex flex-col col-span-2">
                <Label className={labelClass}>Institution</Label>
                <Input
                  value={entry.institution}
                  onChange={(e) =>
                    updateEntry(i, { ...entry, institution: e.target.value })
                  }
                  className={inputClass}
                />
              </TextField>
              <TextField className="flex flex-col col-span-2">
                <Label className={labelClass}>Programme / Degree</Label>
                <Input
                  value={entry.programme}
                  onChange={(e) =>
                    updateEntry(i, { ...entry, programme: e.target.value })
                  }
                  className={inputClass}
                />
              </TextField>
              <TextField className="flex flex-col">
                <Label className={labelClass}>Start Year</Label>
                <Input
                  value={entry.startYear}
                  onChange={(e) =>
                    updateEntry(i, { ...entry, startYear: e.target.value })
                  }
                  className={inputClass}
                />
              </TextField>
              <TextField className="flex flex-col">
                <Label className={labelClass}>End Year</Label>
                <Input
                  value={entry.endYear}
                  onChange={(e) =>
                    updateEntry(i, { ...entry, endYear: e.target.value })
                  }
                  className={inputClass}
                />
              </TextField>
              <TextField className="flex flex-col col-span-2">
                <Label className={labelClass}>Description (optional)</Label>
                <Input
                  value={entry.description ?? ""}
                  onChange={(e) =>
                    updateEntry(i, {
                      ...entry,
                      description: e.target.value || undefined,
                    })
                  }
                  className={inputClass}
                />
              </TextField>
            </div>
          </div>
        ))}
      </div>
      <Button
        onPress={addEntry}
        className={`${addBtnClass} mt-4 w-full text-center`}
      >
        + Add Education
      </Button>
    </section>
  );
}
