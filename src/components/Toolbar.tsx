"use client";

import { motion } from "framer-motion";
import { useDiagramStore } from "@/store/diagramStore";

export function Toolbar() {
    const { autoLayout, clearCanvas, exportJSON, exportPNG, undo, redo, nodes, past, future } =
        useDiagramStore();

    const hasNodes = nodes.length > 0;
    const canUndo = past.length > 0;
    const canRedo = future.length > 0;

    return (
        <motion.header
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
            className="h-14 bg-[#111118]/80 backdrop-blur-xl border-b border-[#27272f] 
        flex items-center justify-between px-5 z-50 flex-shrink-0"
        >
            {/* Left: App name */}
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                </div>
                <div>
                    <h1 className="text-sm font-bold text-white tracking-tight">Instant AI Diagram</h1>
                    <p className="text-[10px] text-zinc-600 -mt-0.5">AI-powered architecture diagrams</p>
                </div>
            </div>

            {/* Center: Actions */}
            <div className="flex items-center gap-1">
                {/* Undo / Redo */}
                <ToolbarButton
                    onClick={undo}
                    disabled={!canUndo}
                    tooltip="Undo"
                    icon={
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M3 10h10a5 5 0 0 1 5 5v2M3 10l4-4m-4 4l4 4" />
                        </svg>
                    }
                />
                <ToolbarButton
                    onClick={redo}
                    disabled={!canRedo}
                    tooltip="Redo"
                    icon={
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M21 10H11a5 5 0 0 0-5 5v2m15-7l-4-4m4 4l-4 4" />
                        </svg>
                    }
                />

                <div className="w-px h-5 bg-[#27272f] mx-1.5" />

                {/* Auto Layout */}
                <ToolbarButton
                    onClick={autoLayout}
                    disabled={!hasNodes}
                    tooltip="Auto Layout"
                    icon={
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M4 5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5zm10 0a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1V5zM7 14a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1v-4z" />
                        </svg>
                    }
                />

                <div className="w-px h-5 bg-[#27272f] mx-1.5" />

                {/* Export PNG */}
                <ToolbarButton
                    onClick={() => exportPNG()}
                    disabled={!hasNodes}
                    tooltip="Export PNG"
                    label="PNG"
                    icon={
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                    }
                />
                {/* Export JSON */}
                <ToolbarButton
                    onClick={exportJSON}
                    disabled={!hasNodes}
                    tooltip="Export JSON"
                    label="JSON"
                    icon={
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                        </svg>
                    }
                />

                <div className="w-px h-5 bg-[#27272f] mx-1.5" />

                {/* Clear */}
                <ToolbarButton
                    onClick={clearCanvas}
                    disabled={!hasNodes}
                    tooltip="Clear Canvas"
                    variant="danger"
                    icon={
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    }
                />
            </div>

            {/* Right: badge */}
            <div className="flex items-center gap-2">
                {hasNodes && (
                    <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="text-[10px] px-2 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400"
                    >
                        {nodes.length} nodes
                    </motion.span>
                )}
            </div>
        </motion.header>
    );
}

function ToolbarButton({
    onClick,
    disabled,
    tooltip,
    icon,
    label,
    variant = "default",
}: {
    onClick: () => void;
    disabled?: boolean;
    tooltip: string;
    icon: React.ReactNode;
    label?: string;
    variant?: "default" | "danger";
}) {
    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            disabled={disabled}
            title={tooltip}
            className={`
        h-8 rounded-lg flex items-center justify-center gap-1.5 transition-all
        disabled:opacity-30 disabled:cursor-not-allowed
        ${label ? "px-2.5" : "w-8"}
        ${variant === "danger"
                    ? "text-zinc-400 hover:text-red-400 hover:bg-red-500/10"
                    : "text-zinc-400 hover:text-white hover:bg-[#1e1e28]"
                }
      `}
        >
            {icon}
            {label && <span className="text-[10px] font-medium">{label}</span>}
        </motion.button>
    );
}
