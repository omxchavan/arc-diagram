"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDiagramStore } from "@/store/diagramStore";

const EXAMPLE_PROMPTS = [
    { label: "💬 Chat App", prompt: "Real-time chat application with WebSocket, message queues, and user auth" },
    { label: "🛒 E-commerce", prompt: "E-commerce platform with product catalog, shopping cart, payment, and order management" },
    { label: "🔗 Microservices", prompt: "Microservices architecture with API gateway, service discovery, and event bus" },
    { label: "🤖 AI Pipeline", prompt: "AI/ML pipeline with data ingestion, preprocessing, model training, and deployment" },
    { label: "📱 Social Media", prompt: "Social media platform with feed, notifications, messaging, and content moderation" },
    { label: "🚀 CI/CD", prompt: "CI/CD pipeline with source control, build, test, staging, and production deployment" },
];

const EDIT_SUGGESTIONS = [
    "Add a caching layer",
    "Add authentication service",
    "Add monitoring & logging",
    "Split into microservices",
    "Add a CDN",
    "Add load balancer",
    "Add message queue",
    "Add API rate limiting",
];

export function PromptPanel() {
    const { prompt, setPrompt, generateDiagram, isGenerating, error, nodes } = useDiagramStore();
    const [isCollapsed, setIsCollapsed] = useState(false);

    const hasExistingDiagram = nodes.length > 0;

    const handleGenerate = () => {
        if (prompt.trim() && !isGenerating) {
            generateDiagram();
        }
    };

    const handleExampleClick = (examplePrompt: string) => {
        setPrompt(examplePrompt);
    };

    return (
        <motion.div
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
            className={`
        relative flex flex-col h-full
        bg-[#0e0e16]/95 backdrop-blur-2xl border-r border-[#1e1e2a]
        transition-all duration-300
        ${isCollapsed ? "w-12" : "w-[340px]"}
      `}
        >
            {/* Collapse toggle */}
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="absolute -right-3 top-4 z-10 w-6 h-6 rounded-full bg-[#16161d] border border-[#22222e] 
          flex items-center justify-center text-xs text-zinc-500 hover:text-white hover:border-indigo-500 
          transition-all shadow-lg shadow-black/20 cursor-pointer"
            >
                {isCollapsed ? "›" : "‹"}
            </button>

            {isCollapsed ? (
                <div className="flex items-center justify-center h-full">
                    <span className="text-zinc-600 text-[10px] [writing-mode:vertical-lr] rotate-180 tracking-[0.2em] uppercase font-semibold">
                        Prompt
                    </span>
                </div>
            ) : (
                <div className="flex flex-col h-full p-5 overflow-y-auto">
                    {/* Header */}
                    <div className="mb-5">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-5 h-5 rounded-md bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/20 flex items-center justify-center">
                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                            </div>
                            <span className="text-[10px] font-semibold text-indigo-400 uppercase tracking-[0.15em]">
                                {hasExistingDiagram ? "Edit Mode" : "AI Powered"}
                            </span>
                        </div>
                        <h2 className="text-lg font-bold text-white leading-tight">
                            {hasExistingDiagram ? "Edit with AI" : "Create Diagram"}
                        </h2>
                        <p className="text-[11px] text-zinc-500 mt-1 leading-relaxed">
                            {hasExistingDiagram
                                ? "Describe changes — AI will intelligently update your diagram"
                                : "Describe your system architecture or idea"}
                        </p>
                    </div>

                    {/* Edit mode indicator */}
                    <AnimatePresence>
                        {hasExistingDiagram && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mb-4"
                            >
                                <div className="px-3 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500/8 to-purple-500/8 border border-indigo-500/15">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-lg bg-indigo-500/15 flex items-center justify-center flex-shrink-0">
                                            <svg className="w-3 h-3 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <span className="text-[11px] text-indigo-300 font-medium">
                                                {nodes.length} nodes on canvas
                                            </span>
                                            <p className="text-[9px] text-zinc-600">AI will modify your existing diagram</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Prompt input */}
                    <div className="relative mb-4">
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                                    handleGenerate();
                                }
                            }}
                            rows={4}
                            placeholder={
                                hasExistingDiagram
                                    ? "e.g. 'Add a caching layer between API and database'"
                                    : "e.g. 'E-commerce platform with microservices...'"
                            }
                            className="w-full bg-[#0a0a10] border border-[#22222e] rounded-xl px-4 py-3 text-sm text-white 
                placeholder-zinc-700 resize-none focus:outline-none focus:border-indigo-500/40 
                focus:shadow-[0_0_0_3px_rgba(99,102,241,0.08)] transition-all duration-200
                leading-relaxed"
                        />
                        <div className="absolute bottom-2.5 right-3 flex items-center gap-1.5">
                            <kbd className="text-[9px] text-zinc-700 px-1.5 py-0.5 rounded bg-[#16161d] border border-[#22222e]">⌘</kbd>
                            <kbd className="text-[9px] text-zinc-700 px-1.5 py-0.5 rounded bg-[#16161d] border border-[#22222e]">↵</kbd>
                        </div>
                    </div>

                    {/* Generate / Edit button */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleGenerate}
                        disabled={!prompt.trim() || isGenerating}
                        className="w-full py-3 rounded-xl font-semibold text-sm text-white cursor-pointer
              bg-gradient-to-r from-indigo-600 to-purple-600
              hover:from-indigo-500 hover:to-purple-500
              disabled:opacity-30 disabled:cursor-not-allowed
              shadow-[0_4px_20px_rgba(99,102,241,0.25)]
              hover:shadow-[0_6px_25px_rgba(99,102,241,0.35)]
              transition-all duration-300 flex items-center justify-center gap-2"
                    >
                        {isGenerating ? (
                            <>
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full"
                                />
                                <span>{hasExistingDiagram ? "Updating..." : "Generating..."}</span>
                            </>
                        ) : (
                            <>
                                {hasExistingDiagram ? (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                ) : (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                            d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                )}
                                <span>{hasExistingDiagram ? "Update Diagram" : "Generate Diagram"}</span>
                            </>
                        )}
                    </motion.button>

                    {/* Error display */}
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10, height: 0 }}
                                animate={{ opacity: 1, y: 0, height: "auto" }}
                                exit={{ opacity: 0, y: -10, height: 0 }}
                                className="mt-3 p-3 rounded-xl bg-red-500/8 border border-red-500/15 text-red-400 text-xs flex items-start gap-2"
                            >
                                <svg className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>{error}</span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Divider */}
                    <div className="flex items-center gap-3 my-5">
                        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#22222e] to-transparent" />
                        <span className="text-[9px] text-zinc-600 uppercase tracking-[0.2em] font-semibold">
                            {hasExistingDiagram ? "Quick Edits" : "Try These"}
                        </span>
                        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#22222e] to-transparent" />
                    </div>

                    {/* Suggestions or examples */}
                    <div className="space-y-1.5">
                        {hasExistingDiagram ? (
                            /* Edit suggestion chips */
                            <div className="flex flex-wrap gap-1.5">
                                {EDIT_SUGGESTIONS.map((suggestion, i) => (
                                    <motion.button
                                        key={i}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.04 * i }}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setPrompt(suggestion)}
                                        className="px-3 py-1.5 rounded-lg text-[11px] font-medium cursor-pointer
                      bg-[#12121a] border border-[#22222e] text-zinc-500
                      hover:bg-indigo-500/8 hover:border-indigo-500/25 hover:text-indigo-300
                      transition-all duration-150"
                                    >
                                        {suggestion}
                                    </motion.button>
                                ))}
                            </div>
                        ) : (
                            /* Example prompts */
                            EXAMPLE_PROMPTS.map((example, i) => (
                                <motion.button
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.06 * i }}
                                    whileHover={{ x: 4 }}
                                    onClick={() => handleExampleClick(example.prompt)}
                                    className="w-full text-left px-3 py-2.5 rounded-xl bg-transparent border border-transparent
                    hover:bg-[#12121a] hover:border-[#22222e] transition-all group cursor-pointer"
                                >
                                    <span className="text-xs font-medium text-zinc-400 group-hover:text-white transition-colors">
                                        {example.label}
                                    </span>
                                    <p className="text-[10px] text-zinc-700 mt-0.5 truncate group-hover:text-zinc-500 transition-colors">
                                        {example.prompt}
                                    </p>
                                </motion.button>
                            ))
                        )}
                    </div>

                    {/* Spacer */}
                    <div className="flex-1" />

                    {/* Footer */}
                    <div className="pt-4 border-t border-[#1a1a24] mt-4">
                        <div className="flex items-center justify-center gap-1.5">
                            <svg className="w-3 h-3 text-zinc-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            <p className="text-[10px] text-zinc-700 font-medium">
                                Powered by Google Gemini
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </motion.div>
    );
}
