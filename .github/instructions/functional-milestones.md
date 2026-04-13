# Resume Builder: Functional Product Milestones

## Milestone 1: Structured Section Editing

- [x] User sees a fixed set of resume sections in a defined order (Contact Info → Objective → Work Experience → Education → Skills → Projects → Certifications → Custom Sections).
- [x] User can fill out Contact Info fields: Name, Email, Phone, Location, LinkedIn, Website.
- [x] User can write free-form paragraphs in the Objective field; headings and bullet lists are not available in this section.
- [x] User can add multiple Work Experience entries, each with company, designation, start year, and end year.
- [x] User can toggle "Currently working here" on a Work Experience entry to leave the end year blank.
- [x] User can write a bullet list under each Work Experience entry.
- [x] User can add named Project sub-sections inside a Work Experience entry, each with its own bullet list.
- [x] User can add multiple Education entries with institution, programme, and year range.
- [x] User can optionally add a plain-text description to an Education entry.
- [x] User can add Skills with a name and a proficiency level (0–100) controlled by a slider.
- [x] User can add standalone Project entries with a name, optional subtitle, and a bullet list.
- [x] User can add Certification entries with a name, optional issuer, and optional year.
- [x] User can create Custom Sections with a user-defined title and choose a body type (bullets or paragraphs) that applies to all entries in that section.
- [x] User can add entries inside a Custom Section, each with an optional title, subtitle, and rich-text body.
- [ ] User can remove any Work Experience, Education, Skill, Project, Certification, or Custom Section entry they added.
- [ ] User sees helpful placeholder text in empty fields guiding them on what to enter.

## Milestone 2: Live Preview & ATS Compliance

- [x] User sees a live visual preview of the full resume updating in real-time as they type in any section.
- [x] User's preview renders Contact Info and all eight section types in strict fixed order.
- [x] User sees Skills displayed as visual progress bars in the preview.
- [x] User's exported PDF contains skill names and levels as readable text (not only graphical bars) so ATS parsers can extract them.
- [ ] User sees section headers that follow ATS-standard naming conventions in the preview.
- [ ] User can visually toggle between a single-column and two-column layout in the preview.
- [ ] User's preview renders cleanly without layout breaks across different content lengths.

## Milestone 3: Session Management & Safety Net

- [x] User can click an "Undo" button to revert their last edit across any section.
- [x] User can click a "Redo" button to re-apply an undone action.
- [ ] User can trigger undo/redo using standard keyboard shortcuts (Ctrl+Z / Ctrl+Y).
- [ ] User is prompted with a warning if they attempt to close the tab with unsaved changes.
- [ ] User can see a visual indicator confirming whether their current changes are saved or unsaved.
- [ ] User's active session is temporarily cached so an accidental page refresh does not clear the document.
- [ ] User does not experience a full app crash if a single section editor encounters an error.

## Milestone 4: Draft Dashboard & Version Control

- [ ] User can manually click a "Save Draft" button to permanently store their resume.
- [ ] User can access a dashboard page displaying a list of all their saved drafts.
- [ ] User can see the exact date and time each draft was last modified.
- [ ] User can click on a past draft to open it and resume editing.
- [ ] User can assign a custom name to a specific draft (e.g., "Software Engineer - Google").
- [ ] User can duplicate an existing draft to create a tailored version without altering the original.
- [ ] User can permanently delete an old draft from their dashboard.
- [ ] User can access a history menu to restore a previous version of their current draft.
- [ ] User is prevented from saving a completely empty document to their dashboard.

## Milestone 5: PDF Export & ATS Validation

- [ ] User can click a "Download PDF" button directly from the editor view.
- [ ] User sees a loading state indicating the PDF is being generated.
- [ ] User receives a downloaded PDF that matches the visual layout of the live preview.
- [ ] User can open the PDF and successfully highlight and copy all text inside it.
- [ ] User can click an "ATS Check" button prior to downloading.
- [ ] User receives a pass/fail notification confirming if the document text is fully extractable.
- [ ] User receives a warning if the ATS check detects potential parsing issues (e.g., wrong section order, non-extractable skills).
- [ ] User receives a graceful error message if PDF generation fails.
- [ ] User's downloaded file has an automated filename derived from their contact info name.
