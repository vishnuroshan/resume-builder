"use client";

import { useResumeStore } from "@/store/useResumeStore";
import type { WorkExperience, Education } from "@/types/resume.types";

function WorkExperienceItem({ experience }: { experience: WorkExperience }) {
  const endLabel = experience.endDate ?? "Present";

  return (
    <div className="mb-4">
      <div className="flex items-baseline justify-between">
        <h3 className="font-semibold text-zinc-900">{experience.title}</h3>
        <span className="text-sm text-zinc-500">
          {experience.startDate} – {endLabel}
        </span>
      </div>
      <p className="text-sm text-zinc-600">
        {experience.company} · {experience.location}
      </p>
    </div>
  );
}

function EducationItem({ education }: { education: Education }) {
  return (
    <div className="mb-4">
      <div className="flex items-baseline justify-between">
        <h3 className="font-semibold text-zinc-900">
          {education.degree} in {education.field}
        </h3>
        <span className="text-sm text-zinc-500">
          {education.startDate} – {education.endDate}
        </span>
      </div>
      <p className="text-sm text-zinc-600">{education.institution}</p>
    </div>
  );
}

export default function ResumePreview() {
  const document = useResumeStore((state) => state.document);

  if (document === null) {
    return (
      <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-zinc-300 bg-zinc-50 p-8">
        <p className="text-sm text-zinc-400">
          Your resume preview will appear here.
        </p>
      </div>
    );
  }

  const { header, workExperiences, educations } = document;
  const { contactInfo } = header;

  return (
    // Source order strictly follows ATS reading order: Header → Experience → Education.
    // Visual layouts (sidebars, columns) must be achieved with CSS Grid/Flexbox only.
    <article className="mx-auto max-w-[794px] bg-white p-10 shadow-md">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <header className="mb-6 border-b border-zinc-200 pb-6">
        <h1 className="text-2xl font-bold text-zinc-900">{contactInfo.name}</h1>
        <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-zinc-500">
          <span>{contactInfo.email}</span>
          <span>{contactInfo.phone}</span>
          <span>{contactInfo.location}</span>
          {contactInfo.linkedin && <span>{contactInfo.linkedin}</span>}
          {contactInfo.website && <span>{contactInfo.website}</span>}
        </div>
      </header>

      {/* ── Work Experience ─────────────────────────────────────────────── */}
      {workExperiences.length > 0 && (
        <section className="mb-6">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-zinc-400">
            Experience
          </h2>
          {workExperiences.map((experience) => (
            <WorkExperienceItem key={experience.id} experience={experience} />
          ))}
        </section>
      )}

      {/* ── Education ───────────────────────────────────────────────────── */}
      {educations.length > 0 && (
        <section className="mb-6">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-zinc-400">
            Education
          </h2>
          {educations.map((education) => (
            <EducationItem key={education.id} education={education} />
          ))}
        </section>
      )}
    </article>
  );
}
