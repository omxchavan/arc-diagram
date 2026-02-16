"use client";

import { memo, useState, useCallback, useRef, useEffect } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { motion } from "framer-motion";
import { useDiagramStore } from "@/store/diagramStore";

function CustomNodeComponent({ id, data, selected }: NodeProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(data.label as string);
    const inputRef = useRef<HTMLInputElement>(null);
    const updateNodeLabel = useDiagramStore((s) => s.updateNodeLabel);
    const deleteNode = useDiagramStore((s) => s.deleteNode);

    const handleDoubleClick = useCallback(() => {
        setEditValue(data.label as string);
        setIsEditing(true);
    }, [data.label]);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [isEditing]);

    const handleSubmit = useCallback(() => {
        if (editValue.trim()) {
            updateNodeLabel(id, editValue.trim());
        }
        setIsEditing(false);
    }, [id, editValue, updateNodeLabel]);

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            if (e.key === "Enter") handleSubmit();
            if (e.key === "Escape") {
                setEditValue(data.label as string);
                setIsEditing(false);
            }
        },
        [handleSubmit, data.label]
    );

    return (
        <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            onDoubleClick={handleDoubleClick}
            className="group relative"
        >
            <Handle
                type="target"
                position={Position.Top}
                className="!bg-indigo-500 !border-[#0a0a10] !w-2 !h-2 group-hover:!w-3 group-hover:!h-3 transition-all"
            />

            <div
                className={`
          relative min-w-[170px] max-w-[220px] px-4 py-3.5 rounded-xl
          bg-gradient-to-br from-[#16161f] to-[#111118]
          border transition-all duration-300 cursor-grab active:cursor-grabbing
          ${selected
                        ? "border-indigo-500/50 shadow-[0_0_25px_rgba(99,102,241,0.2),0_8px_32px_rgba(0,0,0,0.5)]"
                        : "border-[#22222e] shadow-[0_4px_24px_rgba(0,0,0,0.4)] hover:border-[#2e2e40] hover:shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
                    }
        `}
                style={selected ? { animation: "nodeGlow 2s ease-in-out infinite" } : {}}
            >
                {/* Accent line */}
                <div className={`absolute top-0 left-3 right-3 h-[1.5px] rounded-full bg-gradient-to-r 
          ${selected ? "from-indigo-400 via-purple-400 to-indigo-400 opacity-80" : "from-indigo-500 via-purple-500 to-indigo-500 opacity-30"} transition-opacity`} />

                {/* Content */}
                <div className="flex items-center gap-2.5">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all
            ${selected
                            ? "bg-indigo-500/20 border border-indigo-500/30"
                            : "bg-indigo-500/10 border border-indigo-500/10"
                        }`}>
                        <svg
                            className="w-3.5 h-3.5 text-indigo-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                            />
                        </svg>
                    </div>

                    <div className="flex-1 min-w-0">
                        {isEditing ? (
                            <input
                                ref={inputRef}
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                onBlur={handleSubmit}
                                onKeyDown={handleKeyDown}
                                className="w-full bg-transparent text-[13px] font-semibold text-white border-b border-indigo-500/50 outline-none py-0.5"
                            />
                        ) : (
                            <span className="text-[13px] font-semibold text-white/85 truncate block leading-snug">
                                {data.label as string}
                            </span>
                        )}
                    </div>
                </div>

                {/* Delete button */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        deleteNode(id);
                    }}
                    className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500/80 text-white 
            flex items-center justify-center text-[10px] opacity-0 group-hover:opacity-100 
            transition-all hover:bg-red-500 hover:scale-110 z-10 cursor-pointer shadow-lg shadow-red-500/20"
                >
                    ✕
                </button>
            </div>

            <Handle
                type="source"
                position={Position.Bottom}
                className="!bg-indigo-500 !border-[#0a0a10] !w-2 !h-2 group-hover:!w-3 group-hover:!h-3 transition-all"
            />
        </motion.div>
    );
}

export const CustomNode = memo(CustomNodeComponent);
