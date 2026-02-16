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
                className="bg-[#0d0d12]"
                proOptions={{ hideAttribution: true }}
                defaultEdgeOptions={{
                    type: "smoothstep",
                    animated: true,
                    style: { stroke: "#4b5563", strokeWidth: 2 },
                }}
            >
                <Background
                    variant={BackgroundVariant.Dots}
                    gap={24}
                    size={1}
                    color="#1e1e28"
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
                        width: 150,
                        height: 100,
                    }}
                />
            </ReactFlow>

            {/* Empty state */}
            <AnimatePresence>
                {isEmpty && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    >
                        <div className="text-center">
                            {/* Animated icon */}
                            <motion.div
                                animate={{
                                    y: [0, -8, 0],
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                                className="mb-6 inline-block"
                            >
                                <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 flex items-center justify-center">
                                    <svg
                                        className="w-10 h-10 text-indigo-500/60"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1.5}
                                            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                                        />
                                    </svg>
                                </div>
                            </motion.div>

                            <h3 className="text-xl font-bold text-white/60 mb-2">
                                No Diagram Yet
                            </h3>
                            <p className="text-sm text-zinc-600 max-w-xs">
                                Describe your system or idea in the prompt panel to generate a beautiful diagram instantly
                            </p>
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
                        className="absolute inset-0 bg-[#0d0d12]/70 backdrop-blur-sm flex items-center justify-center z-50"
                    >
                        <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            className="text-center"
                        >
                            {/* Animated spinner */}
                            <div className="relative w-16 h-16 mx-auto mb-4">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-0 rounded-full border-2 border-transparent border-t-indigo-500 border-r-purple-500"
                                />
                                <motion.div
                                    animate={{ rotate: -360 }}
                                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-1 rounded-full border-2 border-transparent border-b-indigo-400 border-l-purple-400"
                                />
                                <div className="absolute inset-3 rounded-full bg-indigo-500/10 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                            d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                            </div>

                            <h3 className="text-lg font-semibold text-white mb-1">
                                Designing your diagram...
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
