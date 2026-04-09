# Resume Builder Project Milestones

## Milestone 1: Project Foundation & State Management

- [ ] Initialize the Next.js application using `pnpm create next-app`.
- [ ] Install all explicitly defined dependencies for state, editor, database, and UI.
- [ ] Overwrite `app/globals.css` with the pastel `@theme` variables and strip out dark mode.
- [ ] Update `tsconfig.json` to enforce `strict: true`.
- [ ] Create `types/resume.types.ts` and define the strict interfaces for the resume document structure.
- [ ] Create `store/useResumeStore.ts` and initialize the Zustand store using the defined types.
- [ ] Integrate the `zundo` middleware into the Zustand store for session history tracking.
- [ ] Write Zustand setter functions to enforce strict immutable state updates.
- [ ] Create `lib/db.ts` to handle the MongoDB connection with global connection caching.
- [ ] Set up environment variables locally to securely hold the MongoDB connection string.

## Milestone 2: Database Schema & Permanent Versioning

- [ ] Create the `models` directory and define the `Resume.ts` Mongoose schema matching the TypeScript types.
- [ ] Install and configure the `mongoose-history-trace` plugin inside the Resume model.
- [ ] Create a Server Action or API route for fetching a user's list of past resume drafts.
- [ ] Create a Server Action or API route for loading the exact state of a specific draft.
- [ ] Create a Server Action or API route for processing manual saves.
- [ ] Implement guard clauses at the top of all save routes to validate incoming JSON payloads.
- [ ] Test the save endpoint to confirm it triggers the automatic creation of the `resume_history` collection.
- [ ] Build a Server Component dashboard page to fetch and display the saved drafts.
- [ ] Verify that all database fetching logic resides strictly within Server Components.
- [ ] Refactor any complex validation logic from the API routes into isolated utility functions.

## Milestone 3: The WYSIWYG Editor Integration

- [ ] Create `components/Editor/ResumeEditor.tsx` with the `'use client'` directive.
- [ ] Initialize the Tiptap `useEditor` hook with the `StarterKit` extension.
- [ ] Implement the synchronization logic to push Tiptap's `onUpdate` JSON directly to the Zustand store.
- [ ] Build the base React Aria components for the editor toolbar (buttons, dropdowns).
- [ ] Apply inline Tailwind utility classes to style the React Aria toolbar components.
- [ ] Connect the UI undo/redo buttons directly to the `zundo` state methods.
- [ ] Implement `sanitize-html` to clean any pasted content before it updates the editor state.
- [ ] Wrap the `ResumeEditor` component in a React Error Boundary to prevent session crashes.
- [ ] Extract toolbar action logic into explanatory variables rather than nesting logic inside click handlers.
- [ ] Verify that Tiptap is only outputting semantic nodes (paragraphs, lists, headings) without inline styles.

## Milestone 4: Live Preview & Semantic Layout

- [ ] Create `components/Preview/ResumePreview.tsx` with the `'use client'` directive.
- [ ] Connect the preview component to read from the live Zustand store.
- [ ] Map the Zustand JSON data strictly to semantic HTML tags (`<h1>`, `<h2>`, `<ul>`, `<li>`).
- [ ] Enforce a linear DOM source order (Header first, then Experience, then Education).
- [ ] Construct visual layouts (e.g., sidebars or columns) using only Tailwind Grid or Flexbox utilities.
- [ ] Ensure visual styling never alters the natural top-to-bottom HTML reading order.
- [ ] Test the real-time preview rendering speed while typing in the Tiptap editor.
- [ ] Apply the custom pastel theme variables to the preview layout using inline Tailwind.
- [ ] Abstract complex data mapping operations out of the main React render block into separate functions.
- [ ] Test keyboard navigation through the generated preview to ensure React Aria accessibility is intact.

## Milestone 5: PDF Engine & ATS Validation

- [ ] Create the hidden Next.js SSR route (`app/resume/print/[id]/page.tsx`).
- [ ] Configure the hidden route to fetch draft data directly from MongoDB on the server.
- [ ] Render the pure HTML/CSS preview component on this route without any editor UI wrappers.
- [ ] Create `lib/pdfService.ts` to isolate all Puppeteer initialization and capture logic.
- [ ] Write the Puppeteer script to target the hidden route and utilize `page.pdf()` for generation.
- [ ] Create the client-facing API endpoint that triggers the PDF generation and returns the file buffer.
- [ ] Integrate `pdf-parse` into the generation endpoint to read the newly created PDF buffer.
- [ ] Write an internal ATS check that compares the parsed text output against the expected document structure.
- [ ] Handle Puppeteer timeout or memory errors cleanly using early returns and proper error responses.
- [ ] Write the Dockerfile configuration to package the Next.js build alongside the required headless browser binaries.
