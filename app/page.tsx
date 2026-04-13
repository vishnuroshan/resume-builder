import ResumeEditor from "@/components/Editor/ResumeEditor";
import ResumePreview from "@/components/Preview/ResumePreview";
import EditorErrorBoundary from "@/components/Editor/EditorErrorBoundary";

export default function Home() {
  return (
    <div className="flex h-screen gap-4 bg-zinc-50 p-8">
      {/* Editor panel — scrollable */}
      <div className="flex-1 overflow-y-auto">
        <EditorErrorBoundary>
          <ResumeEditor />
        </EditorErrorBoundary>
      </div>
      {/* Preview panel — scrollable */}
      <div className="flex-1 overflow-y-auto">
        <ResumePreview />
      </div>
    </div>
  );
}
