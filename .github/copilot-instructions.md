# System Instructions: ATS-Compatible Resume Builder

## Project Context

You are assisting a senior engineer in building a production-grade, ATS-compatible resume builder. The application is a **structured, section-based form editor** synced to a live semantic preview, supported by session-based state management and permanent database versioning.

The editor is **not** a single free-form Tiptap canvas. It is composed of fixed, typed sections — each with its own schema, UI controls, and Tiptap configuration. The fixed section order (never reorderable in the current scope) is:

1. **Contact Info** — always present, never removable; plain structured inputs
2. **Objective** — paragraphs and inline marks only; no headings, no lists
3. **Work Experience** — per entry: company/designation + years + top-level bullet list + optional named project sub-sections (each with their own bullet list)
4. **Education** — per entry: institution/programme + years + optional plain-text description
5. **Skills** — per entry: name + numeric level (0–100), edited via slider with number-input fallback; rendered in preview as a CSS-only progress bar with the skill name in the DOM for ATS
6. **Projects** — per entry: name + optional subtitle + Tiptap bullet list
7. **Certifications** — per entry: name + optional issuer + optional year; plain inputs only
8. **Custom Sections** — user-defined; each has a section title, a `bodyType` of `'bullets'` or `'paragraphs'` (set once per section, applies to all entries), and an array of entries (optional title, optional subtitle, Tiptap body restricted to the section's `bodyType`)

## Technology Stack

- Frontend & API: Next.js
- WYSIWYG Editor: Tiptap (Headless setup)
- Active State Management: Zustand with `zundo` (Undo/Redo)
- Database & ORM: MongoDB with Mongoose
- Database Versioning: `mongoose-history-trace`
- PDF Generation: Puppeteer
- ATS Validation: `pdf-parse`
- Security: `sanitize-html`
- Deployment Target: Docker container (Non-serverless to support Puppeteer)

## File Naming Conventions

- Components: PascalCase (e.g., `ResumePreview.tsx`)
- Hooks: camelCase with `use` prefix (e.g., `useResumeStore.ts`)
- Types: descriptive with `.types.ts` suffix (e.g., `resume.types.ts`). Types must be explicitly exported and imported to prevent global namespace pollution.
- Section editor components live under `components/Editor/sections/` (e.g., `ExperienceEditor.tsx`)

## Architecture & Implementation Rules

### 1. Section-Based Data Model

- Every section has a strict TypeScript interface stored in `types/resume.types.ts` and shared across Zustand, Mongoose models, and API routes.
- The Zustand store holds a single `ResumeDocument | null`. There is one targeted setter per section (e.g., `setObjective`, `setExperience`). There is no generic `setContent` action.
- `ResumeEditor.tsx` is a pure orchestrator: it renders section editor components in fixed DOM order and holds no Tiptap instance of its own.

### 2. Tiptap & State Integration

- Each section that requires rich text gets its own `useEditor` instance with the minimum set of extensions needed for that section's constraints.
- **Objective**: disable `Heading`, `BulletList`, `OrderedList`, `ListItem`, `Blockquote`, `CodeBlock`, `HorizontalRule` in StarterKit.
- **Experience / Projects / Custom (bullets)**: enable bullet lists; disable headings, ordered lists.
- **Custom (paragraphs)**: disable all list and heading nodes.
- Sync each editor's `onUpdate` JSON directly to its section setter. Do not mutate Zustand state directly.
- The global undo/redo bar (`EditorToolbar.tsx`) calls `useResumeStore.temporal.getState().undo/redo()`. Each section editor's `useEffect` listens to its slice of the store and calls `editor.commands.setContent(...)` only when the stored JSON diverges from the editor's current JSON (undo/redo sync guard).

### 3. PDF Generation & ATS Compliance

- PDF rendering must be isolated to a hidden Next.js route that renders pure HTML and CSS without the builder UI.
- The HTML source order on the render route must strictly follow the fixed section order above to guarantee `pdf-parse` extracts text correctly for ATS.
- Skills must be rendered as `<span>SkillName – 80%</span>` text in the DOM with a separate CSS-only visual bar; never use `<progress>` (ATS-unfriendly).
- Achieve visual layouts using CSS Grid or Flexbox only — never alter DOM order.
- Puppeteer logic must be isolated in `lib/pdfService.ts`.

### 4. Database & Versioning

- Manual save actions trigger a database update.
- Map every section interface to strict Mongoose schemas.
- Ensure `mongoose-history-trace` captures a full document snapshot on every manual save.

### 5. UI & Styling

- **Component Abstraction:** Build base UI elements by wrapping React Aria headless primitives with inline Tailwind classes.
- **No `@apply` Directive:** Do not use Tailwind's `@apply`. Styling must remain exclusively as inline utility classes.
- **Accessibility:** Rely entirely on React Aria for complex DOM attributes, focus management, and keyboard navigation.
- **Theming:** Utilize Tailwind's `@theme` directive in CSS to configure global design tokens (colors, fonts, breakpoints).

### 6. Clean Code & Engineering Principles

- **YAGNI:** Do not preemptively build abstractions for hypothetical future use cases.
- **KISS:** Prioritize readability. Do not over-engineer.
- **Guard Clauses & Early Returns:** Handle errors and invalid states at the top of functions.
- **Single Level of Abstraction (SLA):** Functions must do one thing at one level of abstraction. Extract lower-level operations into well-named utilities.
- **Explanatory Variables:** Extract complex conditions into named booleans (e.g., `const isCurrentRole = entry.endYear === null`).

### 7. Code Quality & Type Safety

- Enforce strict TypeScript. The `any` type is strictly forbidden. Use `unknown` and type narrowing.
- Types in `types/resume.types.ts` are the single source of truth shared across Zustand, Mongoose, and API routes.
- React components must remain primarily presentational. Offload data transformations to Zustand actions or isolated utility functions.