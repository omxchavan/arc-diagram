import dagre from "@dagrejs/dagre";
import { type Node, type Edge } from "@xyflow/react";
import type { DiagramType } from "./types";

const NODE_WIDTH = 220;
const NODE_HEIGHT = 80;

export function getLayoutedElements(
  nodes: Node[],
  edges: Edge[],
  diagramType: DiagramType = "flowchart"
): { nodes: Node[]; edges: Edge[] } {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  // Determine direction based on diagram type
  let direction: "TB" | "LR" = "TB";
  if (diagramType === "architecture") {
    direction = "LR";
  }

  dagreGraph.setGraph({
    rankdir: direction,
    nodesep: diagramType === "mindmap" ? 120 : 80,
    ranksep: diagramType === "mindmap" ? 150 : 100,
    edgesep: 40,
    marginx: 40,
    marginy: 100,
  });

  nodes.forEach((node) => {
    // ER nodes might be taller
    const height = diagramType === "er" ? 150 : NODE_HEIGHT;
    dagreGraph.setNode(node.id, { width: NODE_WIDTH, height });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    const height = diagramType === "er" ? 150 : NODE_HEIGHT;
    
    // Mind Map: Simulation of radial by adjusting positions slightly if needed
    // For now, TB/LR covers most cases, Dagre doesn't do true radial easily.
    
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - NODE_WIDTH / 2,
        y: nodeWithPosition.y - height / 2,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
}
