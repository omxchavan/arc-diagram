"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDiagramStore } from "@/store/diagramStore";

const EXAMPLE_PROMPTS = [
    { label: "Chat App Architecture", prompt: "Real-time chat application with WebSocket, message queues, and user auth" },
    { label: "E-commerce System", prompt: "E-commerce platform with product catalog, shopping cart, payment, and order management" },
    { label: "Microservices Architecture", prompt: "Microservices architecture with API gateway, service discovery, and event bus" },
    { label: "AI Pipeline", prompt: "AI/ML pipeline with data ingestion, preprocessing, model training, and deployment" },
    { label: "Social Media Platform", prompt: "Social media platform with feed, notifications, messaging, and content moderation" },
    { label: "CI/CD Pipeline", prompt: "CI/CD pipeline with source control, build, test, staging, and production deployment" },
];

const EDIT_SUGGESTIONS = [
    "Add a caching layer",
    "Add authentication service",
    "Add monitoring & logging",
    "Split into microservices",
    "Add a CDN",
    "Add load balancer",
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
        bg-[#111118]/80 backdrop-blur-xl border-r border-[#27272f]
        transition-all duration-300
        ${isCollapsed ? "w-12" : "w-[340px]"}
      `}
        >
            {/* Collapse toggle */}
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="absolute -right-3 top-4 z-10 w-6 h-6 rounded-full bg-[#1e1e28] border border-[#27272f] 
          flex items-center justify-center text-xs text-zinc-400 hover:text-white hover:border-indigo-500 transition-all"
            >
                {isCollapsed ? "→" : "←"}
            </button>

            {isCollapsed ? (
                <div className="flex items-center justify-center h-full">
                    <span className="text-zinc-500 text-xs [writing-mode:vertical-lr] rotate-180 tracking-widest uppercase">
                        Prompt
                    </span>
                </div>
            ) : (
                <div className="flex flex-col h-full p-5 overflow-y-auto">
                    {/* Header */}
                    <div className="mb-5">
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                            <span className="text-xs font-medium text-indigo-400 uppercase tracking-wider">AI Powered</span>
                        </div>
                        <h2 className="text-lg font-bold text-white">
                            {hasExistingDiagram ? "Edit with AI" : "Create a Diagram"}
                        </h2>
                        <p className="text-xs text-zinc-500 mt-1">
                            {hasExistingDiagram
                                ? "Describe what to change — AI will update your diagram"
                                : "Describe your system and let AI generate it instantly"}
                        </p>
                    </div>

                    {/* Edit mode badge */}
                    <AnimatePresence>
                        {hasExistingDiagram && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mb-3 px-3 py-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20"
                            >
                                <div className="flex items-center gap-2">
                                    <svg className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    <span className="text-[11px] text-indigo-300">
                                        Editing mode — {nodes.length} nodes on canvas
                                    </span>
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
                                    ? "Describe what to change... e.g. 'Add a caching layer between API and DB'"
                                    : "Describe your system or idea..."
                            }
                            className="w-full bg-[#0d0d14] border border-[#27272f] rounded-xl px-4 py-3 text-sm text-white 
                placeholder-zinc-600 resize-none focus:outline-none focus:border-indigo-500/50 
                focus:shadow-[0_0_0_3px_rgba(99,102,241,0.1)] transition-all"
                        />
                        <span className="absolute bottom-2 right-3 text-[10px] text-zinc-600">
                            ⌘ + Enter
                        </span>
                    </div>

                    {/* Generate / Edit button */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleGenerate}
                        disabled={!prompt.trim() || isGenerating}
                        className="w-full py-3 rounded-xl font-semibold text-sm text-white
              bg-gradient-to-r from-indigo-600 to-purple-600
              hover:from-indigo-500 hover:to-purple-500
              disabled:opacity-40 disabled:cursor-not-allowed
              shadow-[0_4px_15px_rgba(99,102,241,0.3)]
              hover:shadow-[0_6px_20px_rgba(99,102,241,0.4)]
              transition-all duration-300 flex items-center justify-center gap-2"
                    >
                        {isGenerating ? (
                            <>
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                                />
                                {hasExistingDiagram ? "Updating diagram..." : "Designing your diagram..."}
                            </>
                        ) : (
                            <>
                                {hasExistingDiagram ? (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                ) : (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                            d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                )}
                                {hasExistingDiagram ? "Update Diagram" : "Generate Diagram"}
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
                                className="mt-3 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs"
                            >
                                {error}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Divider */}
                    <div className="flex items-center gap-3 my-5">
                        <div className="flex-1 h-px bg-[#27272f]" />
                        <span className="text-[10px] text-zinc-600 uppercase tracking-wider">
                            {hasExistingDiagram ? "Quick Edits" : "Examples"}
                        </span>
                        <div className="flex-1 h-px bg-[#27272f]" />
                    </div>

                    {/* Suggestions or examples based on mode */}
                    <div className="space-y-2">
                        {hasExistingDiagram ? (
                            /* Edit suggestions as chips */
                            <div className="flex flex-wrap gap-2">
                                {EDIT_SUGGESTIONS.map((suggestion, i) => (
                                    <motion.button
                                        key={i}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.05 * i }}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setPrompt(suggestion)}
                                        className="px-3 py-1.5 rounded-full text-[11px] font-medium
                      bg-[#16161d]/80 border border-[#27272f] text-zinc-400
                      hover:bg-indigo-500/10 hover:border-indigo-500/30 hover:text-indigo-300
                      transition-all"
                                    >
                                        {suggestion}
                                    </motion.button>
                                ))}
                            </div>
                        ) : (
                            /* Example prompts for new diagram */
                            EXAMPLE_PROMPTS.map((example, i) => (
                                <motion.button
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 * i }}
                                    whileHover={{ x: 4 }}
                                    onClick={() => handleExampleClick(example.prompt)}
                                    className="w-full text-left px-3 py-2.5 rounded-lg bg-[#16161d]/50 border border-transparent
                    hover:bg-[#1e1e28] hover:border-[#27272f] transition-all group"
                                >
                                    <span className="text-xs font-medium text-zinc-300 group-hover:text-white transition-colors">
                                        {example.label}
                                    </span>
                                    <p className="text-[10px] text-zinc-600 mt-0.5 truncate">{example.prompt}</p>
                                </motion.button>
                            ))
                        )}
                    </div>

                    {/* Bottom spacer */}
                    <div className="flex-1" />

                    {/* Footer */}
                    <div className="pt-4 border-t border-[#27272f] mt-4">
                        <p className="text-[10px] text-zinc-600 text-center">
                            Powered by Google Gemini AI
                        </p>
                    </div>
                </div>
            )}
        </motion.div>
    );
}
