"use client";

import { useEffect } from "react";
import { initBlankDocument, useResumeStore } from "@/store/useResumeStore";
import EditorToolbar from "./EditorToolbar";
import ContactInfoEditor from "./sections/ContactInfoEditor";
import ObjectiveEditor from "./sections/ObjectiveEditor";
import ExperienceEditor from "./sections/ExperienceEditor";
import EducationEditor from "./sections/EducationEditor";
import SkillsEditor from "./sections/SkillsEditor";
import ProjectsEditor from "./sections/ProjectsEditor";
import CertificationsEditor from "./sections/CertificationsEditor";
import CustomSectionEditor from "./sections/CustomSectionEditor";

function handleUndo() {
  useResumeStore.temporal.getState().undo();
}

function handleRedo() {
  useResumeStore.temporal.getState().redo();
}

export default function ResumeEditor() {
  const document = useResumeStore((state) => state.document);

  // Hydrate a blank document on first render if the store is empty.
  useEffect(() => {
    if (document === null) {
      initBlankDocument();
    }
  }, [document]);

  if (document === null) return null;

  return (
    <div className="flex flex-col gap-4">
      <EditorToolbar onUndo={handleUndo} onRedo={handleRedo} />
      {/* Section order is fixed and must mirror the ATS-compliant preview order. */}
      <ContactInfoEditor />
      <ObjectiveEditor />
      <ExperienceEditor />
      <EducationEditor />
      <SkillsEditor />
      <ProjectsEditor />
      <CertificationsEditor />
      <CustomSectionEditor />
    </div>
  );
}
