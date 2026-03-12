"use client";

import { useState } from "react";
import { Handle, Position } from "@xyflow/react";
import { useDiagramStore } from "@/store/diagramStore";

export default function ERNode({ data, selected }: { data: any; selected: boolean }) {
  const updateNodeData = useDiagramStore((s) => s.updateNodeData);
  const id = data.id || "";
  
  const [isEditingLabel, setIsEditingLabel] = useState(false);
  const [label, setLabel] = useState(data.label as string);
  
  const [editingFieldIndex, setEditingFieldIndex] = useState<number | null>(null);
  const [editingFieldValue, setEditingFieldValue] = useState("");

  const fields = (data.fields as string[]) || [];

  const handleLabelBlur = () => {
    setIsEditingLabel(false);
    updateNodeData(id, { label });
  };

  const handleFieldBlur = (index: number) => {
    const newFields = [...fields];
    if (editingFieldValue.trim() === "") {
        newFields.splice(index, 1);
    } else {
        newFields[index] = editingFieldValue;
    }
    setEditingFieldIndex(null);
    updateNodeData(id, { fields: newFields });
  };

  const addField = () => {
    const newFields = [...fields, "new_field"];
    updateNodeData(id, { fields: newFields });
    setEditingFieldIndex(newFields.length - 1);
    setEditingFieldValue("new_field");
  };

  const removeField = (index: number) => {
    const newFields = fields.filter((_, i) => i !== index);
    updateNodeData(id, { fields: newFields });
  };

  return (
    <div 
      className={`
        min-w-[200px] rounded-lg overflow-hidden border transition-all duration-300
        bg-[#12121e]
        ${selected 
          ? "border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.3)]" 
          : "border-slate-800 shadow-md"}
      `}
      style={selected ? { animation: "glow-emerald 2s ease-in-out infinite" } : {}}
    >
      <div className="bg-emerald-500/10 border-b border-emerald-500/20 px-4 py-2 flex items-center justify-between group">
        {isEditingLabel ? (
          <input
            autoFocus
            className="bg-white/5 border border-emerald-500/30 rounded px-1 py-0.5 text-xs font-bold text-emerald-400 focus:outline-none w-full"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            onBlur={handleLabelBlur}
            onKeyDown={(e) => e.key === "Enter" && handleLabelBlur()}
          />
        ) : (
          <span 
            className="text-xs font-bold text-emerald-400 uppercase tracking-wider cursor-text"
            onDoubleClick={() => setIsEditingLabel(true)}
          >
            {label}
          </span>
        )}
        <button 
            onClick={addField}
            className="text-emerald-500/50 hover:text-emerald-400 text-lg leading-none transition-colors"
            title="Add field"
        >
            +
        </button>
      </div>
      
      <div className="p-1">
        <div className="space-y-0.5">
          {fields.map((field, index) => (
            <div 
              key={`${index}-${field}`} 
              className="flex items-center justify-between px-3 py-1.5 rounded hover:bg-white/5 group transition-colors"
              onDoubleClick={() => {
                setEditingFieldIndex(index);
                setEditingFieldValue(field);
              }}
            >
              {editingFieldIndex === index ? (
                <input
                  autoFocus
                  className="bg-white/5 border border-emerald-500/20 rounded px-1 py-0.5 text-[13px] text-slate-300 focus:outline-none w-full"
                  value={editingFieldValue}
                  onChange={(e) => setEditingFieldValue(e.target.value)}
                  onBlur={() => handleFieldBlur(index)}
                  onKeyDown={(e) => e.key === "Enter" && handleFieldBlur(index)}
                />
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/30" />
                    <span className="text-[13px] text-slate-300">{field}</span>
                  </div>
                  <button 
                    onClick={() => removeField(index)}
                    className="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-red-400 transition-all text-xs"
                  >
                    ×
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {fields.length === 0 && (
        <div className="p-4 text-center">
            <p className="text-[10px] text-slate-600 italic">No fields defined</p>
        </div>
      )}

      {/* ER diagrams usually connect to the sides of the "table" */}
      <Handle type="target" position={Position.Left} className="!bg-emerald-500 !border-[#0a0a10]" />
      <Handle type="source" position={Position.Right} className="!bg-emerald-500 !border-[#0a0a10]" />
    </div>
  );
}
