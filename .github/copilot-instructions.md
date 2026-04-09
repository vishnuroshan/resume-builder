# System Instructions: ATS-Compatible Resume Builder

## Project Context

You are assisting a senior engineer in building a production-grade, ATS-compatible resume builder. The application features a live WYSIWYG editor synced to a visual preview, supported by session-based state management and permanent database versioning.

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

## Architecture & Implementation Rules

### 1. Tiptap & State Integration

- Use the Tiptap React `useEditor` hook.
- Stick to standard extensions to ensure the editor outputs clean, structured JSON. Avoid complex custom ProseMirror Node Views unless absolutely necessary.
- Sync Tiptap's JSON output directly with the Zustand store.
- Do not mutate Zustand state directly. Use setter functions to ensure the `zundo` middleware correctly tracks the undo/redo history tree.

### 2. PDF Generation & ATS Compliance

- PDF rendering must be isolated to a hidden Next.js route that renders pure HTML and CSS without the builder UI.
- The HTML source order on the render route must strictly follow a logical, linear reading order (Top to bottom: Header, Experience, Education) to guarantee `pdf-parse` extracts text correctly for ATS compatibility.
- Achieve visual layouts (e.g., sidebars) using CSS Grid or Flexbox, not by altering the DOM order.
- Puppeteer logic must be isolated in a dedicated service file, taking a URL and returning a PDF buffer.

### 3. Database & Versioning

- Manual save actions trigger a database update.
- Map the Tiptap JSON output to strict Mongoose schemas.
- Ensure `mongoose-history-trace` is configured to capture a full document snapshot upon manual save.

### 4. UI & Styling

- **Component Abstraction:** Build base UI elements by wrapping React Aria headless primitives with inline Tailwind classes.
- **No `@apply` Directive:** Do not use Tailwind's `@apply` to create custom CSS classes. Styling must remain exclusively as inline utility classes to avoid bundle bloat and maintain colocation.
- **Accessibility:** Rely entirely on React Aria for complex DOM attributes, focus management, and keyboard navigation.
- **Theming:** Utilize Tailwind's `@theme` directive in CSS to configure global design tokens (colors, fonts, breakpoints) for easy future UI upgrades.

### 5. Clean Code & Engineering Principles

- **YAGNI (You Aren't Gonna Need It):** Do not preemptively build abstractions, generic wrappers, or features for hypothetical future use cases. Write code strictly for the exact requirements requested.
- **KISS (Keep It Simple, Stupid):** Prioritize readability and straightforward logic. Do not over-engineer solutions or use obscure language features when a standard approach works.
- **Guard Clauses & Early Returns:** Handle errors, edge cases, and invalid states at the top of functions and return early. Keep the "happy path" un-indented at the bottom of the function.
- **Single Level of Abstraction (SLA):** Functions must do one thing at one level of abstraction. Do not mix high-level business logic with low-level data parsing or DOM manipulation in the same block. Extract lower-level operations into well-named utility functions.
- **Explanatory Variables & Decomposing Conditionals:** Do not write complex, multi-condition logic directly inside `if()` statements. Extract the logic into well-named, explanatory boolean variables (e.g., `const isValidWorkExperience = hasTitle && hasCompany && hasDates;`).

### 6. Code Quality & Type Safety

- Enforce strict TypeScript. The `any` type is strictly forbidden. Use `unknown` and apply type narrowing.
- Create a shared `types` directory. Core data structures (e.g., ResumeDocument, WorkExperience) must share interfaces across Zustand, Mongoose models, and API routes.
- React components must remain primarily presentational. Offload complex data transformations to Zustand actions or isolated utility functions.
