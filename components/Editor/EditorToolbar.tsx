"use client";

import { Button } from "react-aria-components";
import { useTemporalStore } from "@/store/useResumeStore";

interface EditorToolbarProps {
  onUndo: () => void;
  onRedo: () => void;
}

export default function EditorToolbar({ onUndo, onRedo }: EditorToolbarProps) {
  const canUndo = useTemporalStore((state) => state.pastStates.length > 0);
  const canRedo = useTemporalStore((state) => state.futureStates.length > 0);

  return (
    <div className="flex gap-2">
      <Button
        onPress={onUndo}
        isDisabled={!canUndo}
        className="cursor-pointer rounded bg-zinc-100 px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-200 data-disabled:cursor-not-allowed data-disabled:opacity-50"
      >
        Undo
      </Button>
      <Button
        onPress={onRedo}
        isDisabled={!canRedo}
        className="cursor-pointer rounded bg-zinc-100 px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-200 data-disabled:cursor-not-allowed data-disabled:opacity-50"
      >
        Redo
      </Button>
    </div>
  );
}
