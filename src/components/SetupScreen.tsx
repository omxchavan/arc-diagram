"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDiagramStore } from "@/store/diagramStore";
import type { DiagramType, DetailLevel } from "@/lib/types";

const DIAGRAM_TYPES: { id: DiagramType; label: string; icon: string; description: string }[] = [
  { id: "flowchart", label: "Flowchart", icon: "⎇", description: "Processes, logic, and step-by-step flows" },
  { id: "architecture", label: "Architecture", icon: "☁", description: "System components, services, and infrastructure" },
  { id: "er", label: "ER Diagram", icon: "田", description: "Database schemas, entities, and relationships" },
  { id: "mindmap", label: "Mind Map", icon: "💮", description: "Ideas, brainstorming, and concept mapping" },
];

const DETAIL_LEVELS: { id: DetailLevel; label: string; description: string }[] = [
  { id: "simple", label: "Simple", description: "Clean and high-level (3-5 nodes)" },
  { id: "balanced", label: "Balanced", description: "Standard detail (6-8 nodes)" },
  { id: "detailed", label: "Detailed", description: "Comprehensive view (10-12 nodes)" },
];

export default function SetupScreen() {
  const { 
    diagramType, setDiagramType, 
    detailLevel, setDetailLevel,
    prompt, setPrompt,
    generateDiagram, finishSetup 
  } = useDiagramStore();

  const [step, setStep] = useState(1);

  const handleStart = async () => {
    if (!prompt.trim()) return;
    finishSetup();
    generateDiagram();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#07070a] overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-2xl px-6"
      >
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="inline-block p-3 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 mb-6"
          >
            <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </motion.div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight mb-3">
            What are we building today?
          </h1>
          <p className="text-slate-400 text-lg">Set your preferences and AI will craft a detailed diagram for you.</p>
        </div>

        <div className="glass-island p-8 rounded-[32px] border border-white/5 shadow-2xl">
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <label className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4 block">Select Diagram Type</label>
                  <div className="grid grid-cols-2 gap-3">
                    {DIAGRAM_TYPES.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => setDiagramType(type.id)}
                        className={`
                          p-4 rounded-2xl border text-left transition-all duration-200 group
                          ${diagramType === type.id 
                            ? "bg-indigo-500/10 border-indigo-500/50 shadow-[0_0_20px_rgba(99,102,241,0.1)]" 
                            : "bg-white/5 border-white/5 hover:border-white/10 hover:bg-white/[0.08]"}
                        `}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`text-xl ${diagramType === type.id ? "text-indigo-400" : "text-slate-500"}`}>{type.icon}</span>
                          <span className={`font-bold ${diagramType === type.id ? "text-white" : "text-slate-300"}`}>{type.label}</span>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed font-medium">{type.description}</p>
                      </button>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => setStep(2)}
                  className="w-full py-4 rounded-2xl bg-white text-black font-bold text-lg hover:bg-slate-200 transition-all shadow-xl shadow-white/10"
                >
                  Continue
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <label className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4 block">Detail Level</label>
                  <div className="flex gap-2 p-1.5 bg-black/40 rounded-2xl border border-white/5">
                    {DETAIL_LEVELS.map((level) => (
                      <button
                        key={level.id}
                        onClick={() => setDetailLevel(level.id)}
                        className={`
                          flex-1 p-3 rounded-xl text-center transition-all
                          ${detailLevel === level.id 
                            ? "bg-white text-black font-bold shadow-lg" 
                            : "text-slate-400 font-bold hover:text-white"}
                        `}
                      >
                        <div className="text-sm">{level.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4 block">Initial Prompt</label>
                  <textarea
                    autoFocus
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g. 'Highly scalable e-commerce platform architecture with AWS services'"
                    className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 text-white placeholder-slate-600 resize-none focus:outline-none focus:border-indigo-500/50 min-h-[120px] font-medium leading-relaxed"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 py-4 rounded-2xl bg-white/5 text-slate-300 font-bold hover:bg-white/10 transition-all border border-white/5"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleStart}
                    disabled={!prompt.trim()}
                    className="flex-[2] py-4 rounded-2xl bg-indigo-600 text-white font-bold text-lg hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Generate Diagram
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
