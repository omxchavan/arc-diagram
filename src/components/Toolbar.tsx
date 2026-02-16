"use client";

import { motion } from "framer-motion";
import Link from "next/link";
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
            className="h-14 bg-[#0e0e16]/90 backdrop-blur-2xl border-b border-[#1e1e2a] 
        flex items-center justify-between px-4 z-50 flex-shrink-0"
        >
            {/* Left: Logo + Name */}
            <Link href="/" className="flex items-center gap-3 group">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center 
          shadow-lg shadow-indigo-500/25 group-hover:shadow-indigo-500/40 transition-all">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                </div>
                <div className="leading-tight">
                    <h1 className="text-sm font-bold tracking-tight">
                        <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Arc</span>
                        <span className="text-white ml-1">Diagram</span>
                    </h1>
                    <p className="text-[10px] text-zinc-600 font-medium">AI Architecture Editor</p>
                </div>
            </Link>

            {/* Center: Actions */}
            <div className="flex items-center gap-0.5 bg-[#12121a]/80 rounded-xl p-1 border border-[#1e1e2a]">
                {/* Undo / Redo */}
                <ToolbarButton
                    onClick={undo}
                    disabled={!canUndo}
                    tooltip="Undo (⌘Z)"
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
                    tooltip="Redo (⌘⇧Z)"
                    icon={
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M21 10H11a5 5 0 0 0-5 5v2m15-7l-4-4m4 4l-4 4" />
                        </svg>
                    }
                />

                <div className="w-px h-5 bg-[#22222e] mx-0.5" />

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

                <div className="w-px h-5 bg-[#22222e] mx-0.5" />

                {/* Export PNG */}
                <ToolbarButton
                    onClick={() => exportPNG()}
                    disabled={!hasNodes}
                    tooltip="Export as PNG"
                    label="PNG"
                    icon={
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    }
                />
                {/* Export JSON */}
                <ToolbarButton
                    onClick={exportJSON}
                    disabled={!hasNodes}
                    tooltip="Export as JSON"
                    label="JSON"
                    icon={
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                        </svg>
                    }
                />

                <div className="w-px h-5 bg-[#22222e] mx-0.5" />

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

            {/* Right: Status badge */}
            <div className="flex items-center gap-3 min-w-[100px] justify-end">
                {hasNodes && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="flex items-center gap-2"
                    >
                        <span className="text-[10px] px-2.5 py-1 rounded-lg bg-indigo-500/8 border border-indigo-500/15 text-indigo-400 font-medium">
                            {nodes.length} nodes
                        </span>
                    </motion.div>
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
        h-8 rounded-lg flex items-center justify-center gap-1.5 transition-all duration-150
        disabled:opacity-25 disabled:cursor-not-allowed cursor-pointer
        ${label ? "px-3" : "w-8"}
        ${variant === "danger"
                    ? "text-zinc-500 hover:text-red-400 hover:bg-red-500/10"
                    : "text-zinc-500 hover:text-white hover:bg-white/5"
                }
      `}
        >
            {icon}
            {label && <span className="text-[10px] font-semibold tracking-wide">{label}</span>}
        </motion.button>
    );
}
