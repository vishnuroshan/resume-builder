"use client";

import { useResumeStore } from "@/store/useResumeStore";

export default function RawPreview() {
  const content = useResumeStore((state) => state.resumeContent.content);

  return (
    <pre className="overflow-auto rounded-lg bg-gray-100 p-4 text-xs">
      <code>{JSON.stringify(content, null, 2)}</code>
    </pre>
  );
}
