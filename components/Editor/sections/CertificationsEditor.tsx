"use client";

import { Button, TextField, Label, Input } from "react-aria-components";
import { useResumeStore } from "@/store/useResumeStore";
import type { CertificationEntry } from "@/types/resume.types";

const inputClass =
  "w-full rounded border border-zinc-200 bg-white px-3 py-1.5 text-sm text-zinc-800 outline-none focus:border-zinc-400";
const labelClass = "mb-1 block text-xs font-medium text-zinc-500";
const addBtnClass =
  "cursor-pointer rounded border border-dashed border-zinc-300 px-3 py-1.5 text-xs text-zinc-500 hover:border-zinc-400 hover:text-zinc-700";
const removeBtnClass =
  "cursor-pointer rounded bg-red-50 px-2 py-1 text-xs text-red-500 hover:bg-red-100";

export default function CertificationsEditor() {
  const certifications = useResumeStore(
    (state) => state.document?.certifications ?? null,
  );
  const setCertifications = useResumeStore((state) => state.setCertifications);

  if (certifications === null) return null;

  function updateEntry(index: number, updated: CertificationEntry) {
    if (certifications === null) return;
    const entries = certifications.entries.map((e, i) =>
      i === index ? updated : e,
    );
    setCertifications({ ...certifications, entries });
  }

  function removeEntry(index: number) {
    if (certifications === null) return;
    setCertifications({
      ...certifications,
      entries: certifications.entries.filter((_, i) => i !== index),
    });
  }

  function addEntry() {
    if (certifications === null) return;
    const newEntry: CertificationEntry = {
      id: crypto.randomUUID(),
      name: "",
    };
    setCertifications({
      ...certifications,
      entries: [...certifications.entries, newEntry],
    });
  }

  return (
    <section className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-zinc-400">
        Certifications
      </h2>
      <div className="flex flex-col gap-3">
        {certifications.entries.map((entry, i) => (
          <div
            key={entry.id}
            className="grid grid-cols-3 items-end gap-3 rounded-lg border border-zinc-200 p-3"
          >
            <TextField className="flex flex-col">
              <Label className={labelClass}>Certificate Name</Label>
              <Input
                value={entry.name}
                onChange={(e) =>
                  updateEntry(i, { ...entry, name: e.target.value })
                }
                className={inputClass}
              />
            </TextField>
            <TextField className="flex flex-col">
              <Label className={labelClass}>Issuer (optional)</Label>
              <Input
                value={entry.issuer ?? ""}
                onChange={(e) =>
                  updateEntry(i, {
                    ...entry,
                    issuer: e.target.value || undefined,
                  })
                }
                className={inputClass}
              />
            </TextField>
            <div className="flex items-end gap-2">
              <TextField className="flex flex-1 flex-col">
                <Label className={labelClass}>Year (optional)</Label>
                <Input
                  value={entry.year ?? ""}
                  onChange={(e) =>
                    updateEntry(i, {
                      ...entry,
                      year: e.target.value || undefined,
                    })
                  }
                  className={inputClass}
                />
              </TextField>
              <button
                onClick={() => removeEntry(i)}
                className={`${removeBtnClass} mb-0.5`}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
      <Button
        onPress={addEntry}
        className={`${addBtnClass} mt-4 w-full text-center`}
      >
        + Add Certification
      </Button>
    </section>
  );
}
