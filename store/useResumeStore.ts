import { create } from "zustand";
import { temporal } from "zundo";
import { useStoreWithEqualityFn } from "zustand/traditional";
import { shallow } from "zustand/shallow";
import type { TemporalState } from "zundo";
import type {
  ResumeState,
  ResumeData,
  ResumeDocument,
  ResumeHeader,
  WorkExperience,
  Education,
  ResumeContent,
} from "@/types/resume.types";

const initialData: ResumeData = {
  document: null,
  resumeContent: { content: null } satisfies ResumeContent,
  isDirty: false,
};

export const useResumeStore = create<ResumeState>()(
  temporal(
    (set) => ({
      ...initialData,

      setFullDocument: (document: ResumeDocument) =>
        set({ document, isDirty: true }),

      setHeader: (header: ResumeHeader) =>
        set((state) => {
          if (state.document === null) return state;
          return { document: { ...state.document, header }, isDirty: true };
        }),

      setWorkExperiences: (workExperiences: WorkExperience[]) =>
        set((state) => {
          if (state.document === null) return state;
          return {
            document: { ...state.document, workExperiences },
            isDirty: true,
          };
        }),

      setEducations: (educations: Education[]) =>
        set((state) => {
          if (state.document === null) return state;
          return { document: { ...state.document, educations }, isDirty: true };
        }),

      setContent: (newContent: Record<string, unknown>) =>
        set({ resumeContent: { content: newContent } }),

      markDirty: () => set({ isDirty: true }),

      markClean: () => set({ isDirty: false }),
    }),
    {
      // Only track the resume document and content in undo history — exclude
      // actions and the isDirty flag to avoid polluting the undo tree.
      partialize: (state) => ({
        document: state.document,
        resumeContent: state.resumeContent,
      }),
    },
  ),
);

// ─── Reactive temporal hook ───────────────────────────────────────────────────
// Accessing .temporal.getState() directly is non-reactive. This hook makes
// pastStates / futureStates trigger re-renders when consumed in components.

type TemporalResumeState = TemporalState<
  Pick<ResumeState, "document" | "resumeContent">
>;

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
