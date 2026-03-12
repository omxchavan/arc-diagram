"use client";

import { useState } from "react";
import { Handle, Position } from "@xyflow/react";
import { useDiagramStore } from "@/store/diagramStore";

export default function ArchitectureNode({ data, selected }: { data: any; selected: boolean }) {
  const updateNodeData = useDiagramStore((s) => s.updateNodeData);
  const id = data.id || "";
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState(data.label as string);

  const handleBlur = () => {
    setIsEditing(false);
    updateNodeData(id, { label });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleBlur();
  };

  return (
    <div 
      className={`
        min-w-[180px] p-4 rounded-xl border transition-all duration-300
        bg-gradient-to-br from-[#1c1c28] to-[#111118]
        ${selected 
          ? "border-purple-500/50 shadow-[0_0_30px_rgba(168,85,247,0.3)]" 
          : "border-[#2e2e40] shadow-lg"}
      `}
      style={selected ? { animation: "glow-purple 2s ease-in-out infinite" } : {}}
      onDoubleClick={() => setIsEditing(true)}
    >
      <Handle type="target" position={Position.Left} className="!bg-purple-500 !border-[#0a0a10]" />
      
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-xl">
          ☁
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[10px] font-bold text-purple-400 uppercase tracking-wider mb-0.5">Component</div>
          {isEditing ? (
            <input
              autoFocus
              className="w-full bg-white/5 border border-purple-500/30 rounded px-1 py-0.5 text-sm font-bold text-white focus:outline-none"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
            />
          ) : (
            <div className="text-sm font-bold text-white truncate">{data.label as string}</div>
          )}
        </div>
      </div>

      <Handle type="source" position={Position.Right} className="!bg-purple-500 !border-[#0a0a10]" />
    </div>
  );
}
