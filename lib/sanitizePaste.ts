import sanitizeHtml from "sanitize-html";

/**
 * Strips dangerous HTML from pasted content, keeping only the semantic
 * inline and block elements that Tiptap StarterKit can render. Used as the
 * `transformPastedHTML` option on every section Tiptap editor.
 *
 * Content-type restrictions (e.g. no bullet lists in Objective) are enforced
 * separately by each editor's StarterKit extension configuration.
 */
export function sanitizePastedHtml(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: ["p", "strong", "em", "b", "i", "ul", "ol", "li", "br"],
    allowedAttributes: {},
    disallowedTagsMode: "discard",
  });
}
