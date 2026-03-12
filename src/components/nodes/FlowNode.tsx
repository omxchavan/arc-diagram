"use client";

import { useState } from "react";
import { Handle, Position } from "@xyflow/react";
import { useDiagramStore } from "@/store/diagramStore";

export default function FlowNode({ data, selected }: { data: any; selected: boolean }) {
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
        px-6 py-3 rounded-2xl border-2 transition-all duration-300
        ${selected 
          ? "bg-blue-500/20 border-blue-400 shadow-[0_0_25px_rgba(96,165,250,0.4)]" 
          : "bg-[#16161f] border-slate-700 shadow-xl group-hover:border-slate-500"}
      `}
      style={selected ? { animation: "glow-blue 2s ease-in-out infinite" } : {}}
      onDoubleClick={() => setIsEditing(true)}
    >
      <Handle type="target" position={Position.Top} className="!bg-blue-400 !border-[#0a0a10]" />
      <div className="text-sm font-bold text-white tracking-wide uppercase opacity-90 mb-1">
        Process
      </div>
      {isEditing ? (
        <input
          autoFocus
          className="w-full bg-white/5 border border-blue-500/30 rounded px-1 py-0.5 text-sm font-bold text-white focus:outline-none text-center"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
        />
      ) : (
        <div className="text-sm font-bold text-white text-center">{data.label as string}</div>
      )}
      <Handle type="source" position={Position.Bottom} className="!bg-blue-400 !border-[#0a0a10]" />
    </div>
  );
}
