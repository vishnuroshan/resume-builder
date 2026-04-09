import ResumeEditor from "@/components/Editor/ResumeEditor";
import RawPreview from "@/components/Preview/RawPreview";

export default function Home() {
  return (
    <div className="flex min-h-screen gap-4 bg-zinc-50 p-8">
      <div className="flex-1">
        <ResumeEditor />
      </div>
      <div className="flex-1">
        <RawPreview />
      </div>
    </div>
  );
}
