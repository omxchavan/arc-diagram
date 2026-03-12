export type DiagramType = "flowchart" | "architecture" | "er" | "mindmap";
export type DetailLevel = "simple" | "balanced" | "detailed";

export interface DiagramNode {
    id: string;
    label: string;
    type?: DiagramType;
    fields?: string[]; // For ER diagrams
}

export interface DiagramEdge {
    source: string;
    target: string;
    label?: string;
    type?: string;
}

export interface DiagramData {
    nodes: DiagramNode[];
    edges: DiagramEdge[];
    diagramType: DiagramType;
}
