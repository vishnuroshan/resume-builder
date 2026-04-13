import { create } from "zustand";
import { temporal } from "zundo";
import { useStoreWithEqualityFn } from "zustand/traditional";
import { shallow } from "zustand/shallow";
import type { TemporalState } from "zundo";
import type {
  ResumeState,
  ResumeDocument,
  ContactInfo,
  ObjectiveSection,
  ExperienceSection,
  EducationSection,
  SkillsSection,
  ProjectsSection,
  CertificationsSection,
  CustomSection,
} from "@/types/resume.types";

export const useResumeStore = create<ResumeState>()(
  temporal(
    (set) => ({
      document: null,
      isDirty: false,

      setContactInfo: (contactInfo: ContactInfo) =>
        set((state) => {
          if (state.document === null) return state;
          return {
            document: { ...state.document, contactInfo },
            isDirty: true,
          };
        }),

      setObjective: (objective: ObjectiveSection) =>
        set((state) => {
          if (state.document === null) return state;
          return {
            document: { ...state.document, objective },
            isDirty: true,
          };
        }),

      setExperience: (experience: ExperienceSection) =>
        set((state) => {
          if (state.document === null) return state;
          return {
            document: { ...state.document, experience },
            isDirty: true,
          };
        }),

      setEducation: (education: EducationSection) =>
        set((state) => {
          if (state.document === null) return state;
          return {
            document: { ...state.document, education },
            isDirty: true,
          };
        }),

      setSkills: (skills: SkillsSection) =>
        set((state) => {
          if (state.document === null) return state;
          return {
            document: { ...state.document, skills },
            isDirty: true,
          };
        }),

      setProjects: (projects: ProjectsSection) =>
        set((state) => {
          if (state.document === null) return state;
          return {
            document: { ...state.document, projects },
            isDirty: true,
          };
        }),

      setCertifications: (certifications: CertificationsSection) =>
        set((state) => {
          if (state.document === null) return state;
          return {
            document: { ...state.document, certifications },
            isDirty: true,
          };
        }),

      setCustomSections: (customSections: CustomSection[]) =>
        set((state) => {
          if (state.document === null) return state;
          return {
            document: { ...state.document, customSections },
            isDirty: true,
          };
        }),

      markDirty: () => set({ isDirty: true }),
      markClean: () => set({ isDirty: false }),
    }),
    {
      // Track only the document in undo history — exclude actions and isDirty.
      partialize: (state) => ({ document: state.document }),
    },
  ),
);

// ─── Bootstrap helper ─────────────────────────────────────────────────────────
// Call this once when the app loads to hydrate the store with a blank document.

export function initBlankDocument(): void {
  const blankDoc: ResumeDocument = {
    id: crypto.randomUUID(),
    contactInfo: { name: "", email: "", phone: "", location: "" },
    objective: { type: "objective", content: { type: "doc", content: [] } },
    experience: { type: "experience", entries: [] },
    education: { type: "education", entries: [] },
    skills: { type: "skills", entries: [] },
    projects: { type: "projects", entries: [] },
    certifications: { type: "certifications", entries: [] },
    customSections: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  useResumeStore.setState({ document: blankDoc, isDirty: false });
}

// ─── Reactive temporal hook ───────────────────────────────────────────────────
// Accessing .temporal.getState() directly is non-reactive. This hook makes
// pastStates / futureStates trigger re-renders when consumed in components.

type TemporalResumeState = TemporalState<Pick<ResumeState, "document">>;

export function useTemporalStore(): TemporalResumeState;
export function useTemporalStore<T>(
  selector: (state: TemporalResumeState) => T,
): T;
export function useTemporalStore<T>(
  selector?: (state: TemporalResumeState) => T,
) {
  return useStoreWithEqualityFn(
    useResumeStore.temporal,
    selector ?? ((s) => s as T),
    shallow,
  );
}
