import type { JSONContent } from "@tiptap/react";

export interface ContactInfo {
  name: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  website?: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  title: string;
  location: string;
  startDate: string;
  /** null indicates a current/ongoing role */
  endDate: string | null;
  description: JSONContent;
  highlights: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  description: JSONContent;
}

export interface ResumeHeader {
  contactInfo: ContactInfo;
  summary: JSONContent;
}

export interface ResumeDocument {
  id: string;
  header: ResumeHeader;
  workExperiences: WorkExperience[];
  educations: Education[];
  createdAt: string;
  updatedAt: string;
}

// ─── Zustand store shape ──────────────────────────────────────────────────────

export interface ResumeContent {
  content: Record<string, unknown> | null;
}

export interface ResumeData {
  document: ResumeDocument | null;
  resumeContent: ResumeContent;
  isDirty: boolean;
}

export interface ResumeActions {
  setFullDocument: (document: ResumeDocument) => void;
  setHeader: (header: ResumeHeader) => void;
  setWorkExperiences: (workExperiences: WorkExperience[]) => void;
  setEducations: (educations: Education[]) => void;
  setContent: (newContent: Record<string, unknown>) => void;
  markDirty: () => void;
  markClean: () => void;
}

export type ResumeState = ResumeData & ResumeActions;
