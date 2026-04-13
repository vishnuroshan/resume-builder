"use client";

import { TextField, Label, Input } from "react-aria-components";
import { useResumeStore } from "@/store/useResumeStore";
import type { ContactInfo } from "@/types/resume.types";

const inputClass =
  "w-full rounded border border-zinc-200 bg-white px-3 py-1.5 text-sm text-zinc-800 outline-none focus:border-zinc-400";
const labelClass = "mb-1 block text-xs font-medium text-zinc-500";

interface FieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}

function ContactField({ label, value, onChange, type = "text" }: FieldProps) {
  return (
    <TextField className="flex flex-col">
      <Label className={labelClass}>{label}</Label>
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={inputClass}
      />
    </TextField>
  );
}

export default function ContactInfoEditor() {
  const contactInfo = useResumeStore(
    (state) => state.document?.contactInfo ?? null,
  );
  const setContactInfo = useResumeStore((state) => state.setContactInfo);

  if (contactInfo === null) return null;

  function update(patch: Partial<ContactInfo>) {
    if (contactInfo === null) return;
    setContactInfo({ ...contactInfo, ...patch });
  }

  return (
    <section className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-zinc-400">
        Contact Info
      </h2>
      <div className="grid grid-cols-2 gap-3">
        <ContactField
          label="Full Name"
          value={contactInfo.name}
          onChange={(name) => update({ name })}
        />
        <ContactField
          label="Email"
          type="email"
          value={contactInfo.email}
          onChange={(email) => update({ email })}
        />
        <ContactField
          label="Phone"
          type="tel"
          value={contactInfo.phone}
          onChange={(phone) => update({ phone })}
        />
        <ContactField
          label="Location"
          value={contactInfo.location}
          onChange={(location) => update({ location })}
        />
        <ContactField
          label="LinkedIn (optional)"
          value={contactInfo.linkedin ?? ""}
          onChange={(linkedin) => update({ linkedin: linkedin || undefined })}
        />
        <ContactField
          label="Website (optional)"
          value={contactInfo.website ?? ""}
          onChange={(website) => update({ website: website || undefined })}
        />
      </div>
    </section>
  );
}
