import type { JSONContent } from "@tiptap/react";

// ─── Contact Info ─────────────────────────────────────────────────────────────

export interface ContactInfo {
  name: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  website?: string;
}

// ─── Objective ────────────────────────────────────────────────────────────────
// Paragraphs and inline marks only. No headings, no lists.

export interface ObjectiveSection {
  type: "objective";
  content: JSONContent;
}

// ─── Work Experience ──────────────────────────────────────────────────────────

export interface ExperienceProject {
  id: string;
  /** null = no sub-header; the bullets appear directly under the entry */
  name: string | null;
  bullets: JSONContent;
}

export interface ExperienceEntry {
  id: string;
  company: string;
  designation: string;
  startYear: string;
  /** null = current / ongoing role */
  endYear: string | null;
  bullets: JSONContent;
  projects: ExperienceProject[];
}

export interface ExperienceSection {
  type: "experience";
  entries: ExperienceEntry[];
}

// ─── Education ────────────────────────────────────────────────────────────────

export interface EducationEntry {
  id: string;
  institution: string;
  programme: string;
  startYear: string;
  endYear: string;
  description?: string;
}

export interface EducationSection {
  type: "education";
  entries: EducationEntry[];
}

// ─── Skills ───────────────────────────────────────────────────────────────────

export interface SkillEntry {
  id: string;
  name: string;
  /** 0–100 */
  level: number;
}

export interface SkillsSection {
  type: "skills";
  entries: SkillEntry[];
}

// ─── Projects (standalone) ────────────────────────────────────────────────────

export interface ProjectEntry {
  id: string;
  name: string;
  subtitle?: string;
  bullets: JSONContent;
}

export interface ProjectsSection {
  type: "projects";
  entries: ProjectEntry[];
}

// ─── Certifications ───────────────────────────────────────────────────────────

export interface CertificationEntry {
  id: string;
  name: string;
  issuer?: string;
  year?: string;
}

export interface CertificationsSection {
  type: "certifications";
  entries: CertificationEntry[];
}

// ─── Custom Sections ──────────────────────────────────────────────────────────

export type CustomBodyType = "bullets" | "paragraphs";

export interface CustomEntry {
  id: string;
  title?: string;
  subtitle?: string;
  /** Tiptap JSON restricted to the section's bodyType */
  body: JSONContent;
}

export interface CustomSection {
  id: string;
  type: "custom";
  sectionTitle: string;
  /** Applies uniformly to all entries in this section */
  bodyType: CustomBodyType;
  entries: CustomEntry[];
}

// ─── Resume Document ──────────────────────────────────────────────────────────

export interface ResumeDocument {
  id: string;
  contactInfo: ContactInfo;
  objective: ObjectiveSection;
  experience: ExperienceSection;
  education: EducationSection;
  skills: SkillsSection;
  projects: ProjectsSection;
  certifications: CertificationsSection;
  customSections: CustomSection[];
  createdAt: string;
  updatedAt: string;
}

// ─── Zustand store shape ──────────────────────────────────────────────────────

export interface ResumeData {
  document: ResumeDocument | null;
  isDirty: boolean;
}

export interface ResumeActions {
  setContactInfo: (contactInfo: ContactInfo) => void;
  setObjective: (objective: ObjectiveSection) => void;
  setExperience: (experience: ExperienceSection) => void;
  setEducation: (education: EducationSection) => void;
  setSkills: (skills: SkillsSection) => void;
  setProjects: (projects: ProjectsSection) => void;
  setCertifications: (certifications: CertificationsSection) => void;
  setCustomSections: (customSections: CustomSection[]) => void;
  markDirty: () => void;
  markClean: () => void;
}

export type ResumeState = ResumeData & ResumeActions;
