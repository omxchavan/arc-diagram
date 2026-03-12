import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const SYSTEM_PROMPT = `You are an expert diagram generator. Convert the user's description into structured JSON for a {diagramType} diagram.

DETAIL LEVEL: {detailLevel}
- simple: 3-5 core nodes, high-level overview
- balanced: 6-8 nodes, standard detail
- detailed: 10-12 nodes, comprehensive breakdown

SUPPORTED DIAGRAM TYPES:
- flowchart: Process flows, logic, steps (Top -> Bottom)
- architecture: System components, services, cloud infra (Left -> Right)
- er: Database entities, relationships, fields (Clustered)
- mindmap: Topics, ideas, brainstorming (Radial/Centered)

RULES:
- Return ONLY valid JSON, no markdown, no extra text
- Adhere strictly to the requested DETAIL LEVEL for node count
- Use short, clean labels (2-4 words max)
- For "er" diagrams, include a "fields" array in each node (3-5 core fields)
- Create logical connections between nodes
- Use meaningful IDs

OUTPUT FORMAT:
{
  "diagramType": "{diagramType}",
  "nodes": [
    { "id": "id", "label": "Label", "fields": ["field1", "field2"] }
  ],
  "edges": [
    { "source": "s", "target": "t", "label": "relationship" }
  ]
}`;

const EDIT_PROMPT = `You are a diagram editor for {diagramType} diagrams. The user has an existing diagram and wants to modify it.

EXISTING DIAGRAM:
{existingDiagram}

USER INSTRUCTION: {userPrompt}
DETAIL LEVEL: {detailLevel}

RULES:
- Return ONLY valid JSON, no markdown, no extra text
- Modify based on instruction while keeping diagram type consistent
- Try to maintain the requested DETAIL LEVEL for complexity
- You can add, remove, or rename nodes/edges/fields
- Use short, clean labels

OUTPUT FORMAT:
{
  "diagramType": "{diagramType}",
  "nodes": [ { "id": "id", "label": "Label", "fields": [] } ],
  "edges": [ { "source": "s", "target": "t", "label": "rel" } ]
}`;

export async function POST(request: NextRequest) {
    try {
        const { prompt, diagramType, detailLevel, existingDiagram } = await request.json();

        if (!prompt || typeof prompt !== "string") {
            return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey || apiKey === "your_gemini_api_key_here") {
            return NextResponse.json(
                { error: "GEMINI_API_KEY is not configured. Please add it to .env.local" },
                { status: 500 }
            );
        }

        const ai = new GoogleGenAI({ apiKey });

        // Build the prompt based on whether we're editing or creating
        let fullPrompt: string;
        if (existingDiagram && existingDiagram.nodes && existingDiagram.nodes.length > 0) {
            fullPrompt = EDIT_PROMPT
                .replaceAll("{diagramType}", diagramType)
                .replaceAll("{detailLevel}", detailLevel || "balanced")
                .replace("{existingDiagram}", JSON.stringify(existingDiagram, null, 2))
                .replace("{userPrompt}", prompt);
        } else {
            fullPrompt = `${SYSTEM_PROMPT
                .replaceAll("{diagramType}", diagramType)
                .replaceAll("{detailLevel}", detailLevel || "balanced")
                }\n\nUser request: ${prompt}`;
        }

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: fullPrompt,
            config: {
                temperature: 0.7,
                responseMimeType: "application/json",
            },
        });

        const text = response.text ?? "";

        // Try to parse JSON
        let diagram;
        try {
            diagram = JSON.parse(text);
        } catch {
            // Try extracting JSON from markdown code block
            const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
            if (jsonMatch) {
                diagram = JSON.parse(jsonMatch[1].trim());
            } else {
                throw new Error("Failed to parse AI response as JSON");
            }
        }

        // Validate structure
        if (!diagram.nodes || !Array.isArray(diagram.nodes)) {
            throw new Error("Invalid diagram: missing nodes array");
        }
        if (!diagram.edges || !Array.isArray(diagram.edges)) {
            diagram.edges = [];
        }

        return NextResponse.json(diagram);
    } catch (error) {
        console.error("Generation error:", error);
        const message = error instanceof Error ? error.message : "Failed to generate diagram";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
