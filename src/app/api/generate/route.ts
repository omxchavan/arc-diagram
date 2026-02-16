import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const SYSTEM_PROMPT = `You are a system architecture diagram generator. Given a description of a system or idea, generate a diagram as JSON.

RULES:
- Return ONLY valid JSON, no markdown, no extra text
- Maximum 10-12 nodes
- Use short, clean labels (2-4 words max)
- Create logical connections between nodes
- Use meaningful IDs (e.g., "frontend", "api", "db")
- Think about real architectures and create accurate relationships

OUTPUT FORMAT:
{
  "nodes": [
    { "id": "unique_id", "label": "Short Label" }
  ],
  "edges": [
    { "source": "source_id", "target": "target_id", "label": "optional relationship" }
  ]
}`;

const EDIT_PROMPT = `You are a system architecture diagram editor. The user has an existing diagram and wants to modify it based on their instruction.

EXISTING DIAGRAM:
{existingDiagram}

USER INSTRUCTION: {userPrompt}

RULES:
- Return ONLY valid JSON, no markdown, no extra text
- Modify the existing diagram based on the user's instruction
- You can add, remove, or rename nodes and edges
- Keep IDs consistent for unchanged nodes
- Maximum 10-12 nodes
- Use short, clean labels (2-4 words max)

OUTPUT FORMAT:
{
  "nodes": [
    { "id": "unique_id", "label": "Short Label" }
  ],
  "edges": [
    { "source": "source_id", "target": "target_id", "label": "optional relationship" }
  ]
}`;

export async function POST(request: NextRequest) {
    try {
        const { prompt, existingDiagram } = await request.json();

        if (!prompt || typeof prompt !== "string") {
            return NextResponse.json(
                { error: "Prompt is required" },
                { status: 400 }
            );
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
                .replace("{existingDiagram}", JSON.stringify(existingDiagram, null, 2))
                .replace("{userPrompt}", prompt);
        } else {
            fullPrompt = `${SYSTEM_PROMPT}\n\nUser request: ${prompt}`;
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
