"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDiagramStore } from "@/store/diagramStore";
import DiagramTypeSelector from "./DiagramTypeSelector";
import type { DiagramType, DetailLevel } from "@/lib/types";

const DETAIL_LEVELS: { id: DetailLevel; icon: string; label: string }[] = [
    { id: "simple", icon: "●", label: "Simple" },
    { id: "balanced", icon: "●●", label: "Balanced" },
    { id: "detailed", icon: "●●●", label: "Detailed" },
];

export function PromptPanel() {
    const { 
        prompt, setPrompt, 
        generateDiagram, isGenerating, 
        nodes, diagramType, 
        detailLevel, setDetailLevel 
    } = useDiagramStore();
    
    const [isCollapsed, setIsCollapsed] = useState(false);
    const hasExistingDiagram = nodes.length > 0;

    const getPlaceholder = (type: DiagramType) => {
        if (hasExistingDiagram) return "Describe changes to update your diagram...";
        switch (type) {
            case "flowchart": return "User login flow or checkout process...";
            case "architecture": return "Microservices or cloud infrastructure...";
            case "er": return "Database entities and relationships...";
            case "mindmap": return "Brainstorm ideas or concepts...";
            default: return "Describe your idea...";
        }
    };

    return (
        <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className={`
                fixed left-8 top-1/2 -translate-y-1/2 z-40 transition-all duration-500
                flex flex-col gap-6 w-[360px]
                ${isCollapsed ? "translate-x-[-340px]" : ""}
            `}
        >
            {/* Minimal Header Control */}
            <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center">
                        <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-sm font-bold text-white tracking-wide uppercase">AI Architect</h2>
                        {hasExistingDiagram && (
                            <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest">{nodes.length} Nodes</span>
                        )}
                    </div>
                </div>
                
                <button 
                   onClick={() => setIsCollapsed(!isCollapsed)}
                   className="w-8 h-8 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-slate-500 hover:text-white transition-colors"
                >
                    <motion.svg animate={{ rotate: isCollapsed ? 180 : 0 }} className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                    </motion.svg>
                </button>
            </div>

            {/* Main Prompt Card */}
            <div className="glass-island p-6 rounded-[28px] border border-white/5 shadow-2xl space-y-5">
                {/* Mode Selector (Diagram Type) */}
                <div className="space-y-3">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Diagram Type</label>
                    <DiagramTypeSelector />
                </div>

                {/* Prompt Input Area */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Describe Idea</label>
                        {/* Detail Level Micro-Picker */}
                        <div className="flex gap-2">
                            {DETAIL_LEVELS.map(level => (
                                <button
                                    key={level.id}
                                    onClick={() => setDetailLevel(level.id)}
                                    title={level.label}
                                    className={`text-[8px] transition-colors ${detailLevel === level.id ? "text-indigo-400" : "text-slate-600 hover:text-slate-400"}`}
                                >
                                    {level.icon}
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    <div className="relative">
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                                    generateDiagram();
                                }
                            }}
                            placeholder={getPlaceholder(diagramType)}
                            className="w-full bg-black/40 border border-white/5 rounded-2xl px-4 py-3.5 text-[13px] text-white 
                                placeholder-slate-700 resize-none focus:outline-none focus:border-indigo-500/30 
                                transition-all duration-200 min-h-[110px] leading-relaxed"
                        />
                        <div className="absolute bottom-3 right-3 flex items-center gap-1 opacity-20 hover:opacity-100 transition-opacity">
                            <kbd className="text-[8px] text-zinc-400 px-1 py-0.5 rounded border border-white/10 uppercase font-bold tracking-tighter">Enter</kbd>
                        </div>
                    </div>
                </div>

                {/* Action button */}
                <button
                    onClick={() => generateDiagram()}
                    disabled={!prompt.trim() || isGenerating}
                    className="w-full h-12 rounded-2xl bg-white text-black font-bold text-xs uppercase tracking-widest
                        hover:bg-slate-200 disabled:opacity-30 transition-all flex items-center justify-center gap-2"
                >
                    {isGenerating ? (
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-3.5 h-3.5 border-2 border-black/20 border-t-black rounded-full"
                        />
                    ) : (
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    )}
                    <span>{hasExistingDiagram ? "Update" : "Generate"}</span>
                </button>
            </div>
            
            {/* Subtle Guide Footer */}
            <div className={`px-2 transition-opacity duration-300 ${isGenerating ? "opacity-0" : "opacity-40"}`}>
                <p className="text-[9px] text-slate-500 font-medium leading-relaxed">
                    AI intelligently {hasExistingDiagram ? "refines your architecture" : "creates structural depth"} based on {detailLevel} detail level.
                </p>
            </div>
        </motion.div>
    );
}
