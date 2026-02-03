import { NextResponse } from "next/server";
import { ai } from "../../../lib/gemini";

export async function POST(req: Request) {
  try {
    const { subject, difficulty } = await req.json();

    const prompt = `
Você é um professor especialista.

Matéria: ${subject}
Dificuldade: ${difficulty}

Escolha UM tópico aleatório dessa matéria.

Retorne APENAS um JSON válido, sem markdown, sem texto extra, no formato:
{
  "topic": "",
  "explanation": "",
  "howToStart": "",
  "prerequisites": [],
  "exercises": ["", "", "", "", ""]
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    const text = response.text?.trim();

    if (!text) {
      throw new Error("Empty AI response");
    }

    const cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const parsed = JSON.parse(cleaned);

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("API error:", error);

    return NextResponse.json(
      { error: "Failed to generate study plan" },
      { status: 500 },
    );
  }
}
