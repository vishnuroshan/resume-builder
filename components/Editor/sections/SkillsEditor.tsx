"use client";

import { Button, TextField, Label, Input } from "react-aria-components";
import { useResumeStore } from "@/store/useResumeStore";
import type { SkillEntry } from "@/types/resume.types";

const labelClass = "mb-1 block text-xs font-medium text-zinc-500";
const inputClass =
  "w-full rounded border border-zinc-200 bg-white px-3 py-1.5 text-sm text-zinc-800 outline-none focus:border-zinc-400";
const addBtnClass =
  "cursor-pointer rounded border border-dashed border-zinc-300 px-3 py-1.5 text-xs text-zinc-500 hover:border-zinc-400 hover:text-zinc-700";
const removeBtnClass =
  "cursor-pointer rounded bg-red-50 px-2 py-1 text-xs text-red-500 hover:bg-red-100";

export default function SkillsEditor() {
  const skills = useResumeStore((state) => state.document?.skills ?? null);
  const setSkills = useResumeStore((state) => state.setSkills);

  if (skills === null) return null;

  function updateEntry(index: number, updated: SkillEntry) {
    if (skills === null) return;
    const entries = skills.entries.map((e, i) => (i === index ? updated : e));
    setSkills({ ...skills, entries });
  }

  function removeEntry(index: number) {
    if (skills === null) return;
    setSkills({
      ...skills,
      entries: skills.entries.filter((_, i) => i !== index),
    });
  }

  function addEntry() {
    if (skills === null) return;
    const newEntry: SkillEntry = {
      id: crypto.randomUUID(),
      name: "",
      level: 50,
    };
    setSkills({ ...skills, entries: [...skills.entries, newEntry] });
  }

  function handleLevelChange(index: number, raw: string) {
    if (skills === null) return;
    const parsed = parseInt(raw, 10);
    const isValidLevel = !isNaN(parsed) && parsed >= 0 && parsed <= 100;
    if (!isValidLevel) return;
    updateEntry(index, { ...skills.entries[index], level: parsed });
  }

  return (
    <section className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-zinc-400">
        Skills
      </h2>
      <div className="flex flex-col gap-3">
        {skills.entries.map((entry, i) => (
          <div key={entry.id} className="flex items-end gap-3">
            <TextField className="flex flex-1 flex-col">
              <Label className={labelClass}>Skill Name</Label>
              <Input
                value={entry.name}
                onChange={(e) =>
                  updateEntry(i, { ...entry, name: e.target.value })
                }
                className={inputClass}
              />
            </TextField>

            <div className="flex flex-1 flex-col gap-1">
              <label className={labelClass}>Level: {entry.level}</label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={entry.level}
                  onChange={(e) => handleLevelChange(i, e.target.value)}
                  className="flex-1 accent-zinc-700"
                />
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={entry.level}
                  onChange={(e) => handleLevelChange(i, e.target.value)}
                  className="w-14 rounded border border-zinc-200 px-2 py-1 text-center text-sm text-zinc-800 outline-none focus:border-zinc-400"
                />
              </div>
            </div>

            <button
              onClick={() => removeEntry(i)}
              className={`${removeBtnClass} mb-0.5`}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      <Button
        onPress={addEntry}
        className={`${addBtnClass} mt-4 w-full text-center`}
      >
        + Add Skill
      </Button>
    </section>
  );
}
