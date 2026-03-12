"use client";

import { useState } from "react";
import { Handle, Position } from "@xyflow/react";
import { useDiagramStore } from "@/store/diagramStore";

export default function MindMapNode({ data, selected }: { data: any; selected: boolean }) {
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
        px-6 py-4 rounded-full border-2 transition-all duration-300 cursor-pointer
        ${selected 
          ? "bg-orange-500 border-white shadow-[0_0_30px_rgba(249,115,22,0.5)]" 
          : "bg-orange-500/10 border-orange-500/50 hover:bg-orange-500/20"}
      `}
      style={selected ? { animation: "glow-orange 2s ease-in-out infinite" } : {}}
      onDoubleClick={() => setIsEditing(true)}
    >
      <div className={`text-sm font-bold transition-colors ${selected ? "text-white" : "text-orange-400"}`}>
        {isEditing ? (
          <input
            autoFocus
            className="bg-transparent border-none text-center text-sm font-bold text-white focus:outline-none"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
          />
        ) : (
          data.label as string
        )}
      </div>
      
      {/* Mind map nodes often have handles on all sides for radial growth */}
      <Handle type="target" position={Position.Top} className="!opacity-0" />
      <Handle type="source" position={Position.Bottom} className="!opacity-0" />
      <Handle type="target" position={Position.Left} className="!opacity-0" />
      <Handle type="source" position={Position.Right} className="!opacity-0" />
    </div>
  );
}
