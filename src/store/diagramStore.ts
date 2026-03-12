import { create } from "zustand";
import {
    type Node,
    type Edge,
    type OnNodesChange,
    type OnEdgesChange,
    type OnConnect,
    applyNodeChanges,
    applyEdgeChanges,
    addEdge,
    type Connection,
} from "@xyflow/react";
import { getLayoutedElements } from "@/lib/layout";
import type { DiagramData, DiagramType, DetailLevel } from "@/lib/types";

const STORAGE_KEY = "instant-ai-diagram";

interface HistoryEntry {
    nodes: Node[];
    edges: Edge[];
}

interface DiagramState {
    nodes: Node[];
    edges: Edge[];
    prompt: string;
    diagramType: DiagramType;
    detailLevel: DetailLevel;
    isGenerating: boolean;
    isInitialSetup: boolean;
    error: string | null;

    // History
    past: HistoryEntry[];
    future: HistoryEntry[];

    // Actions
    setPrompt: (prompt: string) => void;
    setDiagramType: (type: DiagramType) => void;
    setDetailLevel: (level: DetailLevel) => void;
    finishSetup: () => void;
    updateNodeData: (id: string, data: Partial<any>) => void;
    onNodesChange: OnNodesChange;
    onEdgesChange: OnEdgesChange;
    onConnect: OnConnect;
    updateNodeLabel: (nodeId: string, label: string) => void;
    deleteNode: (nodeId: string) => void;
    generateDiagram: () => Promise<void>;
    autoLayout: () => void;
    clearCanvas: () => void;
    exportJSON: () => void;
    exportPNG: () => Promise<void>;
    undo: () => void;
    redo: () => void;
    canUndo: () => boolean;
    canRedo: () => boolean;
    saveToLocalStorage: () => void;
    loadFromLocalStorage: () => void;
}

function pushHistory(state: DiagramState): Partial<DiagramState> {
    return {
        past: [
            ...state.past.slice(-30),
            { nodes: structuredClone(state.nodes), edges: structuredClone(state.edges) },
        ],
        future: [],
    };
}

function convertDiagramData(data: DiagramData): { nodes: Node[]; edges: Edge[] } {
    const nodes: Node[] = data.nodes.map((n) => ({
        id: n.id,
        type: data.diagramType, // Set the node type based on diagram type
        data: { 
          label: n.label,
          fields: n.fields || [],
          diagramType: data.diagramType
        },
        position: { x: 0, y: 0 },
    }));

    const edges: Edge[] = data.edges.map((e, i) => ({
        id: `e-${e.source}-${e.target}-${i}`,
        source: e.source,
        target: e.target,
        label: e.label || "",
        type: data.diagramType === "mindmap" ? "straight" : "smoothstep",
        animated: data.diagramType === "flowchart" || data.diagramType === "architecture",
        style: { stroke: "#4b5563", strokeWidth: 2 },
        labelBgStyle: { fill: "#12121e", fillOpacity: 0.8 },
        labelStyle: { fill: "#f4f4f5", fontWeight: 600 },
        labelBgPadding: [6, 4],
        labelBgBorderRadius: 6,
    }));

    return getLayoutedElements(nodes, edges, data.diagramType);
}

function downloadBlob(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    // Long delay to ensure the browser fully starts the download
    setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }, 10000);
}

export const useDiagramStore = create<DiagramState>((set, get) => ({
    nodes: [],
    edges: [],
    prompt: "",
    diagramType: "flowchart",
    detailLevel: "balanced",
    isGenerating: false,
    isInitialSetup: true,
    error: null,
    past: [],
    future: [],

    setPrompt: (prompt: string) => set({ prompt }),
    setDiagramType: (diagramType: DiagramType) => set({ diagramType }),
    setDetailLevel: (detailLevel: DetailLevel) => set({ detailLevel }),
    finishSetup: () => set({ isInitialSetup: false }),
    
    updateNodeData: (id, data) => {
        const hist = { nodes: get().nodes, edges: get().edges };
        set((state) => ({
            past: [...state.past, hist].slice(-50),
            future: [],
            nodes: state.nodes.map((node) => {
                if (node.id === id) {
                    return { ...node, data: { ...node.data, ...data } };
                }
                return node;
            }),
        }));
    },

    onNodesChange: (changes) => {
        set((state) => ({
            nodes: applyNodeChanges(changes, state.nodes),
        }));
        setTimeout(() => get().saveToLocalStorage(), 500);
    },

    onEdgesChange: (changes) => {
        set((state) => ({
            edges: applyEdgeChanges(changes, state.edges),
        }));
        setTimeout(() => get().saveToLocalStorage(), 500);
    },

    onConnect: (connection: Connection) => {
        const state = get();
        const hist = pushHistory(state);
        set((s) => ({
            ...hist,
            edges: addEdge(
                {
                    ...connection,
                    type: s.diagramType === "mindmap" ? "straight" : "smoothstep",
                    animated: s.diagramType === "flowchart" || s.diagramType === "architecture",
                    style: { stroke: "#4b5563", strokeWidth: 2 },
                    labelBgStyle: { fill: "#12121e", fillOpacity: 0.8 },
                    labelStyle: { fill: "#f4f4f5", fontWeight: 600 },
                    labelBgPadding: [6, 4],
                    labelBgBorderRadius: 6,
                },
                s.edges
            ),
        }));
        setTimeout(() => get().saveToLocalStorage(), 500);
    },

    updateNodeLabel: (nodeId: string, label: string) => {
        const state = get();
        const hist = pushHistory(state);
        set({
            ...hist,
            nodes: state.nodes.map((n) =>
                n.id === nodeId ? { ...n, data: { ...n.data, label } } : n
            ),
        });
        get().saveToLocalStorage();
    },

    deleteNode: (nodeId: string) => {
        const state = get();
        const hist = pushHistory(state);
        set({
            ...hist,
            nodes: state.nodes.filter((n) => n.id !== nodeId),
            edges: state.edges.filter(
                (e) => e.source !== nodeId && e.target !== nodeId
            ),
        });
        get().saveToLocalStorage();
    },

    generateDiagram: async () => {
        const state = get();
        if (!state.prompt.trim()) return;

        const hist = pushHistory(state);
        set({ ...hist, isGenerating: true, error: null });

        try {
            // Build existing diagram context for AI editing
            const existingDiagram =
                state.nodes.length > 0
                    ? {
                        nodes: state.nodes.map((n) => ({
                            id: n.id,
                            label: n.data.label as string,
                        })),
                        edges: state.edges.map((e) => ({
                            source: e.source,
                            target: e.target,
                            label: e.label || "",
                        })),
                    }
                    : null;

            const res = await fetch("/api/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    prompt: state.prompt,
                    diagramType: state.diagramType,
                    detailLevel: state.detailLevel,
                    existingDiagram,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to generate diagram");
            }

            const { nodes, edges } = convertDiagramData(data);
            set({ nodes, edges, isGenerating: false });
            get().saveToLocalStorage();
        } catch (error) {
            set({
                isGenerating: false,
                error: error instanceof Error ? error.message : "Something went wrong",
            });
        }
    },

    autoLayout: () => {
        const state = get();
        if (state.nodes.length === 0) return;
        const hist = pushHistory(state);
        const { nodes, edges } = getLayoutedElements(state.nodes, state.edges, state.diagramType);
        set({ ...hist, nodes, edges });
        get().saveToLocalStorage();
    },

    clearCanvas: () => {
        const state = get();
        const hist = pushHistory(state);
        set({ ...hist, nodes: [], edges: [], prompt: "" });
        if (typeof window !== "undefined") {
            localStorage.removeItem(STORAGE_KEY);
        }
    },

    exportJSON: () => {
        const state = get();
        if (state.nodes.length === 0) return;
        const data = {
            nodes: state.nodes.map((n) => ({
                id: n.id,
                label: n.data.label as string,
            })),
            edges: state.edges.map((e) => ({
                source: e.source,
                target: e.target,
                label: e.label,
            })),
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], {
            type: "application/json",
        });
        downloadBlob(blob, "diagram.json");
    },

    exportPNG: async () => {
        const state = get();
        if (state.nodes.length === 0) return;

        try {
            const { toPng } = await import("html-to-image");

            // Target the React Flow wrapper div that has all visible elements
            const el = document.querySelector(".react-flow") as HTMLElement;
            if (!el) {
                throw new Error("Diagram canvas not found");
            }

            const dataUrl = await toPng(el, {
                backgroundColor: "#0a0a10",
                quality: 1,
                pixelRatio: 2,
                filter: (node: HTMLElement) => {
                    // Exclude controls, minimap, and attribution from export
                    const exclude = [
                        "react-flow__controls",
                        "react-flow__minimap",
                        "react-flow__attribution",
                        "react-flow__panel",
                    ];
                    if (node.classList) {
                        return !exclude.some((cls) => node.classList.contains(cls));
                    }
                    return true;
                },
            });

            // Convert data URL to blob — browsers ignore the download attribute on data URLs
            const res = await fetch(dataUrl);
            const blob = await res.blob();
            downloadBlob(blob, "diagram.png");
        } catch (err) {
            console.error("Failed to export PNG:", err);
            set({ error: "Failed to export PNG. Please try again." });
        }
    },

    undo: () => {
        const state = get();
        if (state.past.length === 0) return;
        const previous = state.past[state.past.length - 1];
        set({
            nodes: previous.nodes,
            edges: previous.edges,
            past: state.past.slice(0, -1),
            future: [
                { nodes: structuredClone(state.nodes), edges: structuredClone(state.edges) },
                ...state.future,
            ],
        });
        get().saveToLocalStorage();
    },

    redo: () => {
        const state = get();
        if (state.future.length === 0) return;
        const next = state.future[0];
        set({
            nodes: next.nodes,
            edges: next.edges,
            past: [
                ...state.past,
                { nodes: structuredClone(state.nodes), edges: structuredClone(state.edges) },
            ],
            future: state.future.slice(1),
        });
        get().saveToLocalStorage();
    },

    canUndo: () => get().past.length > 0,
    canRedo: () => get().future.length > 0,

    saveToLocalStorage: () => {
        if (typeof window === "undefined") return;
        const state = get();
        const data = {
            nodes: state.nodes,
            edges: state.edges,
        };
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch {
            // Storage full or unavailable
        }
    },

    loadFromLocalStorage: () => {
        if (typeof window === "undefined") return;
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) {
                const data = JSON.parse(raw);
                if (data.nodes && data.edges) {
                    set({ nodes: data.nodes, edges: data.edges, isInitialSetup: false });
                }
            }
        } catch {
            // Corrupted data
        }
    },
}));
