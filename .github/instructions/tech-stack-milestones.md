# Resume Builder Project Milestones

## Milestone 1: Project Foundation & State Management

- [x] Initialize the Next.js application using `pnpm create next-app`.
- [x] Install all explicitly defined dependencies for state, editor, database, and UI.
- [x] Overwrite `app/globals.css` with the `@theme` variables and base styles.
- [x] Update `tsconfig.json` to enforce `strict: true`.
- [x] Create `types/resume.types.ts` with strict interfaces for all section types: `ContactInfo`, `ObjectiveSection`, `ExperienceEntry`, `ExperienceProject`, `EducationEntry`, `SkillEntry`, `ProjectEntry`, `CertificationEntry`, `CustomSection`, `ResumeDocument`, and store shape types.
- [x] Create `store/useResumeStore.ts` with Zustand and per-section setters (`setContactInfo`, `setObjective`, `setExperience`, `setEducation`, `setSkills`, `setProjects`, `setCertifications`, `setCustomSections`, `markDirty`, `markClean`).
- [x] Export `initBlankDocument()` from the store to initialize a fresh `ResumeDocument` with `crypto.randomUUID()`.
- [x] Integrate the `zundo` middleware and export `useTemporalStore` for undo/redo history.
- [x] Create `lib/db.ts` to handle the MongoDB connection with global connection caching.
- [ ] Set up environment variables locally to securely hold the MongoDB connection string.

## Milestone 2: Database Schema & Permanent Versioning

- [x] Create `models/Resume.ts` defining Mongoose sub-schemas for every section type mirroring the TypeScript interfaces.
- [x] Configure the `mongoose-history-trace` plugin inside the Resume model for full document snapshot on save.
- [ ] Create an API route for loading a specific saved draft into the editor state.
- [ ] Create an API route for processing manual saves (POST/PUT).
- [ ] Implement guard clauses at the top of all save routes to validate incoming JSON payloads.
- [ ] Test the save endpoint to confirm it triggers the `resume_history` collection.
- [ ] Build a Server Component dashboard page to fetch and render saved drafts.
- [ ] Verify that all database fetching logic resides strictly within Server Components.

## Milestone 3: Section-Based Editor Integration

- [x] Create `components/Editor/ResumeEditor.tsx` as an orchestrator that calls `initBlankDocument()` and renders all section editors in fixed DOM order.
- [x] Create `components/Editor/sections/ContactInfoEditor.tsx` — React Aria `TextField`/`Input` grid, calls `setContactInfo`.
- [x] Create `components/Editor/sections/ObjectiveEditor.tsx` — Tiptap `useEditor` with headings and lists disabled via StarterKit config; undo/redo sync `useEffect`; calls `setObjective`.
- [x] Create `components/Editor/sections/ExperienceEditor.tsx` — `useBulletEditor` custom hook, `ProjectSubEditor` sub-component, per-entry bullet editors, add/remove entries and project sub-sections; `endYear: null` toggle; calls `setExperience`.
- [x] Create `components/Editor/sections/EducationEditor.tsx` — grid inputs, optional description, add/remove entries; calls `setEducation`.
- [x] Create `components/Editor/sections/SkillsEditor.tsx` — `range` input + number input fallback; `handleLevelChange` guard; calls `setSkills`.
- [x] Create `components/Editor/sections/ProjectsEditor.tsx` — per-entry Tiptap bullet editors with undo/redo sync; calls `setProjects`.
- [x] Create `components/Editor/sections/CertificationsEditor.tsx` — 3-col grid inputs, add/remove entries; calls `setCertifications`.
- [x] Create `components/Editor/sections/CustomSectionEditor.tsx` — `CustomBodyEditor` with bodyType-conditional StarterKit config; `bodyType` toggle (bullets/paragraphs); add/remove sections and entries; calls `setCustomSections`.
- [x] Simplify `components/Editor/EditorToolbar.tsx` to only undo/redo; `onUndo`/`onRedo` props; `canUndo`/`canRedo` from `useTemporalStore`.
- [x] Wrap `ResumeEditor` in `EditorErrorBoundary` (class component) to prevent full app crash.
- [x] Add `sanitize-html` paste handlers to each Tiptap section editor to clean external content on paste.
- [x] Add keyboard shortcuts (Ctrl+Z / Ctrl+Y) wired to `useTemporalStore` undo/redo.

## Milestone 4: Live Preview & ATS Compliance

- [x] Create `components/Preview/ResumePreview.tsx` with one sub-component per section type.
- [x] Render sections in strict fixed DOM order matching the editor section order.
- [x] Render Skills as `<span>SkillName</span><span>N%</span>` text in the DOM alongside a CSS-only `div` bar — never `<progress>`.
- [x] Use stable `PARAGRAPH_EXTENSIONS` and `BULLET_EXTENSIONS` module-level constants; `toHtml()` pure utility for Tiptap JSON → HTML.
- [x] Render `null` for sections with empty entries to avoid blank section headers in the preview.
- [ ] Add a hidden Next.js SSR route (`app/resume/print/[id]/page.tsx`) that renders the resume as pure HTML/CSS without editor UI.
- [ ] Verify that `pdf-parse` can extract all text from the generated HTML in correct section order.
- [ ] Confirm Skills text (name + level) is present in the extracted `pdf-parse` output.

## Milestone 5: PDF Engine & ATS Validation

- [ ] Create the hidden print route for PDF rendering.
- [ ] Create `lib/pdfService.ts` to isolate all Puppeteer initialization and capture logic.
- [ ] Write the Puppeteer script to target the hidden route and use `page.pdf()` for generation.
- [ ] Create the client-facing API endpoint that triggers PDF generation and returns the file buffer.
- [ ] Integrate `pdf-parse` to run an ATS check on the generated PDF buffer.
- [ ] Return a structured ATS result (pass/fail + extracted text) to the client.
- [ ] Handle Puppeteer timeout/memory errors cleanly with early returns and proper error responses.
- [ ] Write the Dockerfile to package the Next.js build with the required headless browser binaries.
