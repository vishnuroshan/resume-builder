# Resume Builder: Functional Product Milestones

## Milestone 1: Core Editing Experience

- [ ] User can type text into the main editor and see it appear instantly.
- [ ] User can apply bold, italic, and underline formatting to selected text.
- [ ] User can create bulleted lists.
- [ ] User can create numbered lists.
- [ ] User can format text into standard heading sizes (H1, H2, H3).
- [ ] User sees a live visual preview of the resume updating in real-time as they type.
- [ ] User can safely paste text from external sources without breaking the editor layout.
- [ ] User can highlight text and clear all formatting from it.
- [ ] User can use standard keyboard shortcuts (e.g., Ctrl+B, Ctrl+I) while editing.
- [ ] User is prevented from deleting core structural layout blocks by accident.

## Milestone 2: Content Modules & ATS Structure

- [ ] User can fill out a dedicated Contact Information block (Name, Email, Phone, Links).
- [ ] User can add multiple distinct "Work Experience" entries.
- [ ] User can add multiple distinct "Education" entries.
- [ ] User can add a dedicated "Skills" section.
- [ ] User can reorder individual job entries within the Work Experience section.
- [ ] User can reorder entire sections (e.g., move Education above Work Experience).
- [ ] User can delete an entire section if it is not relevant to them.
- [ ] User sees helpful placeholder text in empty fields guiding them on what to enter.
- [ ] User's generated preview strictly maintains a logical top-to-bottom reading order.
- [ ] User's section headers automatically default to ATS-standard naming conventions.

## Milestone 3: Session Management & Safety Net

- [ ] User can click an "Undo" button to revert their last edit.
- [ ] User can click a "Redo" button to re-apply an undone action.
- [ ] User can trigger undo/redo using standard keyboard shortcuts (Ctrl+Z, Ctrl+Y).
- [ ] User's undo history correctly tracks large actions, like deleting an entire job entry.
- [ ] User is prompted with a warning if they attempt to close the tab with unsaved changes.
- [ ] User can see a visual indicator confirming whether their current changes are saved or unsaved.
- [ ] User's active session is temporarily cached so an accidental page refresh does not clear the document.
- [ ] User is prevented from crashing the browser by holding down the undo button continuously.
- [ ] User's undo history clears cleanly when they start a completely new, blank resume.
- [ ] User does not experience a full app crash if a single text block encounters an error.

## Milestone 4: Draft Dashboard & Version Control

- [ ] User can manually click a "Save Draft" button to permanently store their resume.
- [ ] User can access a dashboard page displaying a list of all their saved drafts.
- [ ] User can see the exact date and time each draft was last modified.
- [ ] User can click on a past draft in the dashboard to open it and resume editing.
- [ ] User can assign a custom name to a specific draft (e.g., "Software Engineer - Google").
- [ ] User can duplicate an existing draft to create a tailored version without altering the original.
- [ ] User can permanently delete an old draft from their dashboard.
- [ ] User can see a small visual thumbnail or text snippet of the draft on the dashboard.
- [ ] User is prevented from saving a completely empty document to their dashboard.
- [ ] User can access a history menu to restore a previous version of their current draft.

## Milestone 5: PDF Export & ATS Validation

- [ ] User can click a "Download PDF" button directly from the editor view.
- [ ] User sees a loading state indicating the PDF is being generated.
- [ ] User receives a downloaded PDF that perfectly matches the visual layout of the live preview.
- [ ] User can open the PDF and successfully highlight and copy the text inside it.
- [ ] User's generated PDF utilizes standard, web-safe fonts that ATS parsers can read easily.
- [ ] User can click an "ATS Check" button prior to downloading.
- [ ] User receives a pass/fail notification confirming if the document text is extractable.
- [ ] User receives a warning if the ATS check detects non-standard section headers.
- [ ] User receives a graceful error message if the PDF generation fails, rather than a broken webpage.
- [ ] User's downloaded file has an automated, professional filename based on their inputted name.
