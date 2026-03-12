"use client";

import { useDiagramStore } from "@/store/diagramStore";
import type { DiagramType } from "@/lib/types";

const DIAGRAM_TYPES: { id: DiagramType; label: string; icon: string }[] = [
  { id: "flowchart", label: "Flowchart", icon: "⎇" },
  { id: "architecture", label: "Architecture", icon: "☁" },
  { id: "er", label: "ER Diagram", icon: "田" },
  { id: "mindmap", label: "Mind Map", icon: "💮" },
];

export default function DiagramTypeSelector() {
  const { diagramType, setDiagramType } = useDiagramStore();

  return (
    <div className="flex gap-1 p-1 bg-white/5 order border-white/5 rounded-xl self-start">
      {DIAGRAM_TYPES.map((type) => (
        <button
          key={type.id}
          onClick={() => setDiagramType(type.id)}
          title={type.label}
          className={`
            w-10 h-10 flex items-center justify-center rounded-lg text-lg transition-all duration-200
            ${diagramType === type.id 
              ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30" 
              : "text-slate-500 hover:text-slate-300 hover:bg-white/5 border border-transparent"}
          `}
        >
          {type.icon}
        </button>
      ))}
    </div>
  );
}
