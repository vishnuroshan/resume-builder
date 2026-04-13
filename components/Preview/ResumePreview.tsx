"use client";

import { useMemo } from "react";
import { generateHTML } from "@tiptap/html";
import StarterKit from "@tiptap/starter-kit";
import type { JSONContent } from "@tiptap/react";
import { useResumeStore } from "@/store/useResumeStore";
import type {
  ResumeDocument,
  ExperienceEntry,
  EducationEntry,
  SkillEntry,
  ProjectEntry,
  CertificationEntry,
  CustomSection,
  CustomBodyType,
} from "@/types/resume.types";

// ─── HTML generation helpers ──────────────────────────────────────────────────

const PARAGRAPH_EXTENSIONS = [
  StarterKit.configure({
    heading: false, bulletList: false, orderedList: false, listItem: false,
    blockquote: false, codeBlock: false, horizontalRule: false,
  }),
];

const BULLET_EXTENSIONS = [
  StarterKit.configure({
    heading: false, orderedList: false, blockquote: false,
    codeBlock: false, horizontalRule: false,
  }),
];

function extensionsFor(bodyType: CustomBodyType) {
  return bodyType === "bullets" ? BULLET_EXTENSIONS : PARAGRAPH_EXTENSIONS;
}

function toHtml(json: JSONContent, bodyType: CustomBodyType = "bullets"): string {
  return generateHTML(json, extensionsFor(bodyType));
}

// ─── Section wrapper ─────────────────────────────────────────────────────────

function SectionHeading({ title }: { title: string }) {
  return (
    <h2 className="mb-3 border-b border-zinc-200 pb-1 text-xs font-semibold uppercase tracking-widest text-zinc-400">
      {title}
    </h2>
  );
}

// ─── Contact Info ─────────────────────────────────────────────────────────────

function ContactInfoPreview({ doc }: { doc: ResumeDocument }) {
  const { name, email, phone, location, linkedin, website } = doc.contactInfo;
  return (
    <header className="mb-6">
      <h1 className="text-2xl font-bold text-zinc-900">{name}</h1>
      <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-sm text-zinc-500">
        {email && <span>{email}</span>}
        {phone && <span>{phone}</span>}
        {location && <span>{location}</span>}
        {linkedin && <span>{linkedin}</span>}
        {website && <span>{website}</span>}
      </div>
    </header>
  );
}

// ─── Objective ────────────────────────────────────────────────────────────────

function ObjectivePreview({ doc }: { doc: ResumeDocument }) {
  const html = useMemo(
    () => toHtml(doc.objective.content, "paragraphs"),
    [doc.objective.content],
  );
  const hasContent = doc.objective.content.content && doc.objective.content.content.length > 0;
  if (!hasContent) return null;

  return (
    <section className="mb-6">
      <SectionHeading title="Objective" />
      <div
        className="text-sm text-zinc-700 [&_p]:mb-1"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </section>
  );
}

// ─── Work Experience ──────────────────────────────────────────────────────────

function ExperienceEntryPreview({ entry }: { entry: ExperienceEntry }) {
  const isCurrentRole = entry.endYear === null;
  const yearRange = isCurrentRole
    ? `${entry.startYear} – Present`
    : `${entry.startYear} – ${entry.endYear}`;

  const bulletsHtml = useMemo(
    () => toHtml(entry.bullets, "bullets"),
    [entry.bullets],
  );

  return (
    <article className="mb-4">
      <div className="flex items-baseline justify-between">
        <div>
          <span className="font-semibold text-zinc-900">{entry.designation}</span>
          {entry.company && (
            <span className="ml-1 text-sm text-zinc-600">· {entry.company}</span>
          )}
        </div>
        <span className="text-xs text-zinc-400">{yearRange}</span>
      </div>

      {/* Top-level bullets */}
      <div
        className="mt-1 text-sm text-zinc-700 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-0.5"
        dangerouslySetInnerHTML={{ __html: bulletsHtml }}
      />

      {/* Project sub-sections */}
      {entry.projects.map((project) => {
        const projectHtml = toHtml(project.bullets, "bullets");
        return (
          <div key={project.id} className="mt-2 pl-2">
            {project.name && (
              <p className="text-sm font-medium text-zinc-700">{project.name}</p>
            )}
            <div
              className="text-sm text-zinc-700 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-0.5"
              dangerouslySetInnerHTML={{ __html: projectHtml }}
            />
          </div>
        );
      })}
    </article>
  );
}

function ExperiencePreview({ doc }: { doc: ResumeDocument }) {
  if (doc.experience.entries.length === 0) return null;
  return (
    <section className="mb-6">
      <SectionHeading title="Work Experience" />
      {doc.experience.entries.map((entry) => (
        <ExperienceEntryPreview key={entry.id} entry={entry} />
      ))}
    </section>
  );
}

// ─── Education ────────────────────────────────────────────────────────────────

function EducationEntryPreview({ entry }: { entry: EducationEntry }) {
  return (
    <article className="mb-3">
      <div className="flex items-baseline justify-between">
        <div>
          <span className="font-semibold text-zinc-900">{entry.programme}</span>
          {entry.institution && (
            <span className="ml-1 text-sm text-zinc-600">· {entry.institution}</span>
          )}
        </div>
        <span className="text-xs text-zinc-400">
          {entry.startYear} – {entry.endYear}
        </span>
      </div>
      {entry.description && (
        <p className="mt-0.5 text-sm text-zinc-600">{entry.description}</p>
      )}
    </article>
  );
}

function EducationPreview({ doc }: { doc: ResumeDocument }) {
  if (doc.education.entries.length === 0) return null;
  return (
    <section className="mb-6">
      <SectionHeading title="Education" />
      {doc.education.entries.map((entry) => (
        <EducationEntryPreview key={entry.id} entry={entry} />
      ))}
    </section>
  );
}

// ─── Skills ───────────────────────────────────────────────────────────────────
// ATS note: the skill name and numeric level must be present as visible text in
// the DOM. The visual bar is CSS-only and never uses <progress> (ATS-unfriendly).

function SkillEntryPreview({ entry }: { entry: SkillEntry }) {
  return (
    <div className="mb-2">
      {/* ATS-readable text */}
      <div className="mb-1 flex items-baseline justify-between text-sm">
        <span className="text-zinc-800">{entry.name}</span>
        <span className="text-xs text-zinc-400">{entry.level}%</span>
      </div>
      {/* CSS-only visual bar */}
      <div className="h-1.5 w-full rounded-full bg-zinc-100">
        <div
          className="h-1.5 rounded-full bg-zinc-700"
          style={{ width: `${entry.level}%` }}
        />
      </div>
    </div>
  );
}

function SkillsPreview({ doc }: { doc: ResumeDocument }) {
  if (doc.skills.entries.length === 0) return null;
  return (
    <section className="mb-6">
      <SectionHeading title="Skills" />
      {doc.skills.entries.map((entry) => (
        <SkillEntryPreview key={entry.id} entry={entry} />
      ))}
    </section>
  );
}

// ─── Projects ─────────────────────────────────────────────────────────────────

function ProjectEntryPreview({ entry }: { entry: ProjectEntry }) {
  const html = useMemo(() => toHtml(entry.bullets, "bullets"), [entry.bullets]);
  return (
    <article className="mb-3">
      <div className="flex items-baseline gap-2">
        <span className="font-semibold text-zinc-900">{entry.name}</span>
        {entry.subtitle && (
          <span className="text-sm text-zinc-500">{entry.subtitle}</span>
        )}
      </div>
      <div
        className="mt-1 text-sm text-zinc-700 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-0.5"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </article>
  );
}

function ProjectsPreview({ doc }: { doc: ResumeDocument }) {
  if (doc.projects.entries.length === 0) return null;
  return (
    <section className="mb-6">
      <SectionHeading title="Projects" />
      {doc.projects.entries.map((entry) => (
        <ProjectEntryPreview key={entry.id} entry={entry} />
      ))}
    </section>
  );
}

// ─── Certifications ───────────────────────────────────────────────────────────

function CertificationEntryPreview({ entry }: { entry: CertificationEntry }) {
  return (
    <div className="mb-1.5 flex items-baseline justify-between text-sm">
      <div>
        <span className="text-zinc-900">{entry.name}</span>
        {entry.issuer && (
          <span className="ml-1 text-zinc-500">· {entry.issuer}</span>
        )}
      </div>
      {entry.year && <span className="text-xs text-zinc-400">{entry.year}</span>}
    </div>
  );
}

function CertificationsPreview({ doc }: { doc: ResumeDocument }) {
  if (doc.certifications.entries.length === 0) return null;
  return (
    <section className="mb-6">
      <SectionHeading title="Certifications" />
      {doc.certifications.entries.map((entry) => (
        <CertificationEntryPreview key={entry.id} entry={entry} />
      ))}
    </section>
  );
}

// ─── Custom Sections ──────────────────────────────────────────────────────────

function CustomSectionPreview({ section }: { section: CustomSection }) {
  if (section.entries.length === 0) return null;
  const entryStyles =
    section.bodyType === "bullets"
      ? "[&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-0.5"
      : "[&_p]:mb-1";

  return (
    <section className="mb-6">
      <SectionHeading title={section.sectionTitle} />
      {section.entries.map((entry) => {
        const html = toHtml(entry.body, section.bodyType);
        return (
          <article key={entry.id} className="mb-3">
            {(entry.title || entry.subtitle) && (
              <div className="flex items-baseline gap-2">
                {entry.title && (
                  <span className="font-semibold text-zinc-900">{entry.title}</span>
                )}
                {entry.subtitle && (
                  <span className="text-sm text-zinc-500">{entry.subtitle}</span>
                )}
              </div>
            )}
            <div
              className={`mt-1 text-sm text-zinc-700 ${entryStyles}`}
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </article>
        );
      })}
    </section>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function ResumePreview() {
  const doc = useResumeStore((state) => state.document);

  if (doc === null) {
    return (
      <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-zinc-300 bg-zinc-50 p-8">
        <p className="text-sm text-zinc-400">Your resume preview will appear here.</p>
      </div>
    );
  }

  return (
    // Source order mirrors the fixed section order for ATS compliance.
    <article className="mx-auto max-w-198.5 bg-white p-10 shadow-md">
      <ContactInfoPreview doc={doc} />
      <ObjectivePreview doc={doc} />
      <ExperiencePreview doc={doc} />
      <EducationPreview doc={doc} />
      <SkillsPreview doc={doc} />
      <ProjectsPreview doc={doc} />
      <CertificationsPreview doc={doc} />
      {doc.customSections.map((section) => (
        <CustomSectionPreview key={section.id} section={section} />
      ))}
    </article>
  );
}
