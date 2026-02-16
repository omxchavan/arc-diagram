"use client";

import { useEffect } from "react";
import { ReactFlowProvider } from "@xyflow/react";
import { Toolbar } from "@/components/Toolbar";
import { PromptPanel } from "@/components/PromptPanel";
import { DiagramCanvas } from "@/components/DiagramCanvas";
import { useDiagramStore } from "@/store/diagramStore";

function DiagramApp() {
  const loadFromLocalStorage = useDiagramStore((s) => s.loadFromLocalStorage);

  useEffect(() => {
    loadFromLocalStorage();
  }, [loadFromLocalStorage]);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden">
      <Toolbar />
      <div className="flex flex-1 overflow-hidden">
        <PromptPanel />
        <DiagramCanvas />
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <ReactFlowProvider>
      <DiagramApp />
    </ReactFlowProvider>
  );
}
