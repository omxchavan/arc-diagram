"use client";

import { useCallback, useRef } from "react";
import {
    ReactFlow,
    Background,
    BackgroundVariant,
    Controls,
    MiniMap,
    type NodeTypes,
} from "@xyflow/react";
import { motion, AnimatePresence } from "framer-motion";
import { useDiagramStore } from "@/store/diagramStore";
import { CustomNode } from "./CustomNode";

const nodeTypes: NodeTypes = {
    custom: CustomNode,
};

export function DiagramCanvas() {
    const { nodes, edges, onNodesChange, onEdgesChange, onConnect, isGenerating } =
        useDiagramStore();
    const reactFlowRef = useRef<HTMLDivElement>(null);
    const isEmpty = nodes.length === 0 && !isGenerating;

    const onDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
    }, []);

    return (
        <div ref={reactFlowRef} className="flex-1 relative" id="diagram-canvas">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onDragOver={onDragOver}
                nodeTypes={nodeTypes}
                fitView
                fitViewOptions={{ padding: 0.3 }}
                minZoom={0.1}
                maxZoom={2}
                deleteKeyCode={["Backspace", "Delete"]}
                className="bg-[#0a0a10]"
                proOptions={{ hideAttribution: true }}
                defaultEdgeOptions={{
                    type: "smoothstep",
                    animated: true,
                    style: { stroke: "#3b3b54", strokeWidth: 2 },
                    labelBgStyle: { fill: "#12121e", fillOpacity: 0.9 },
                    labelStyle: { fill: "#f4f4f5", fontWeight: 600, fontSize: "11.5px" },
                    labelBgPadding: [6, 4],
                    labelBgBorderRadius: 6,
                }}
            >
                <Background
                    variant={BackgroundVariant.Dots}
                    gap={24}
                    size={1}
                    color="#1a1a28"
                />
                <Controls
                    showInteractive={false}
                    position="bottom-right"
                />
                <MiniMap
                    position="bottom-left"
                    pannable
                    zoomable
                    nodeStrokeWidth={3}
                    style={{
                        width: 140,
                        height: 90,
                    }}
                />
            </ReactFlow>

            {/* Empty state */}
            <AnimatePresence>
                {isEmpty && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    >
                        <div className="text-center max-w-sm">
                            {/* Animated diagram icon */}
                            <motion.div
                                animate={{ y: [0, -8, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="mb-8 inline-block"
                            >
                                <div className="relative">
                                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500/8 to-purple-500/8 border border-indigo-500/10 flex items-center justify-center">
                                        <svg className="w-8 h-8 text-indigo-500/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                        </svg>
                                    </div>
                                    {/* Decorative orbiting dot */}
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                                        className="absolute inset-0"
                                    >
                                        <div className="absolute -top-1 left-1/2 w-2 h-2 rounded-full bg-indigo-500/30" />
                                    </motion.div>
                                </div>
                            </motion.div>

                            <h3 className="text-lg font-bold text-white/50 mb-2">
                                No Diagram Yet
                            </h3>
                            <p className="text-[13px] text-zinc-600 leading-relaxed mb-6">
                                Describe your system in the prompt panel to generate a diagram, or try one of the examples.
                            </p>
                            <div className="flex items-center justify-center gap-2 text-[11px] text-zinc-700">
                                <kbd className="px-2 py-1 rounded bg-[#12121a] border border-[#22222e] text-zinc-600">⌘</kbd>
                                <span>+</span>
                                <kbd className="px-2 py-1 rounded bg-[#12121a] border border-[#22222e] text-zinc-600">Enter</kbd>
                                <span className="ml-1">to generate</span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Loading overlay */}
            <AnimatePresence>
                {isGenerating && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-[#0a0a10]/80 backdrop-blur-md flex items-center justify-center z-50"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="text-center"
                        >
                            {/* Premium spinner */}
                            <div className="relative w-20 h-20 mx-auto mb-6">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-0 rounded-full border-2 border-transparent border-t-indigo-500 border-r-indigo-500/30"
                                />
                                <motion.div
                                    animate={{ rotate: -360 }}
                                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-2 rounded-full border-2 border-transparent border-b-purple-500 border-l-purple-500/30"
                                />
                                <div className="absolute inset-4 rounded-full bg-gradient-to-br from-indigo-500/10 to-purple-500/10 flex items-center justify-center">
                                    <motion.svg
                                        animate={{ scale: [1, 1.15, 1] }}
                                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                        className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                            d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </motion.svg>
                                </div>
                            </div>

                            <h3 className="text-base font-semibold text-white mb-1">
                                {nodes.length > 0 ? "Updating your diagram..." : "Creating your diagram..."}
                            </h3>
                            <p className="text-sm text-zinc-500">
                                AI is analyzing your description
                            </p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
