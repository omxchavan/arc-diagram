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
                className="!bg-indigo-500 !border-[#16161d] !w-2 !h-2 group-hover:!w-3 group-hover:!h-3 transition-all"
            />

            <div
                className={`
          relative min-w-[180px] px-5 py-4 rounded-2xl
          bg-gradient-to-br from-[#1e1e2a] to-[#16161d]
          border transition-all duration-300 cursor-grab active:cursor-grabbing
          ${selected
                        ? "border-indigo-500/60 shadow-[0_0_20px_rgba(99,102,241,0.3),0_8px_32px_rgba(0,0,0,0.4)]"
                        : "border-[#27272f] shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:border-[#3f3f50] hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)]"
                    }
        `}
                style={selected ? { animation: "nodeGlow 2s ease-in-out infinite" } : {}}
            >
                {/* Gradient accent line at top */}
                <div className="absolute top-0 left-4 right-4 h-[2px] rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 opacity-60" />

                {/* Icon area */}
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/20 flex items-center justify-center flex-shrink-0">
                        <svg
                            className="w-4 h-4 text-indigo-400"
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
                                className="w-full bg-transparent text-sm font-semibold text-white border-b border-indigo-500 outline-none py-0.5"
                            />
                        ) : (
                            <span className="text-sm font-semibold text-white/90 truncate block">
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
            flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 
            transition-opacity hover:bg-red-500 z-10"
                >
                    ×
                </button>
            </div>

            <Handle
                type="source"
                position={Position.Bottom}
                className="!bg-indigo-500 !border-[#16161d] !w-2 !h-2 group-hover:!w-3 group-hover:!h-3 transition-all"
            />
        </motion.div>
    );
}

export const CustomNode = memo(CustomNodeComponent);
