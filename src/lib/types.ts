export interface DiagramNode {
    id: string;
    label: string;
}

export interface DiagramEdge {
    source: string;
    target: string;
    label?: string;
}

export interface DiagramData {
    nodes: DiagramNode[];
    edges: DiagramEdge[];
}
