"use client";

import { useMemo } from "react";
import { generateHTML } from "@tiptap/html";
import StarterKit from "@tiptap/starter-kit";
import type { JSONContent } from "@tiptap/react";
import { useResumeStore } from "@/store/useResumeStore";

function contentToHtml(content: Record<string, unknown> | null): string {
  if (content === null) return "";
  return generateHTML(content as JSONContent, [StarterKit]);
}

export default function ResumePreview() {
  const content = useResumeStore((state) => state.resumeContent.content);
  const html = useMemo(() => contentToHtml(content), [content]);

  return (
    <article
      className="mx-auto max-w-198.5 bg-white p-10 shadow-md
        [&_h1]:mb-2 [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:text-zinc-900
        [&_h2]:mb-1 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-zinc-800
        [&_h3]:mb-1 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-zinc-800
        [&_p]:mb-2 [&_p]:text-zinc-700
        [&_ul]:list-disc [&_ul]:pl-5
        [&_ol]:list-decimal [&_ol]:pl-5
        [&_li]:mb-1 [&_li]:text-zinc-700
        [&_strong]:font-semibold [&_em]:italic"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
