"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ReactFlowProvider } from "@xyflow/react";
import { Toolbar } from "@/components/Toolbar";
import { PromptPanel } from "@/components/PromptPanel";
import { DiagramCanvas } from "@/components/DiagramCanvas";
import { useDiagramStore } from "@/store/diagramStore";

function DiagramApp() {
    const loadFromLocalStorage = useDiagramStore((s) => s.loadFromLocalStorage);
    const setPrompt = useDiagramStore((s) => s.setPrompt);
    const searchParams = useSearchParams();

    useEffect(() => {
        loadFromLocalStorage();
    }, [loadFromLocalStorage]);

    // Handle prompt from homepage links like /editor?prompt=...
    useEffect(() => {
        const promptParam = searchParams.get("prompt");
        if (promptParam) {
            setPrompt(promptParam);
        }
    }, [searchParams, setPrompt]);

    return (
        <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#0a0a10]">
            <Toolbar />
            <div className="flex flex-1 overflow-hidden">
                <PromptPanel />
                <DiagramCanvas />
            </div>
        </div>
    );
}

function EditorContent() {
    return (
        <ReactFlowProvider>
            <DiagramApp />
        </ReactFlowProvider>
    );
}

export default function EditorPage() {
    return (
        <Suspense fallback={
            <div className="h-screen w-screen bg-[#0a0a10] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center mx-auto mb-4 animate-pulse">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                    </div>
                    <p className="text-zinc-500 text-sm">Loading editor...</p>
                </div>
            </div>
        }>
            <EditorContent />
        </Suspense>
    );
}
