import { NextResponse } from "next/server";
import { ai } from "@/lib/gemini";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { subject, difficulty } = await req.json();

  // tenta buscar algo salvo antes
  const cached = await prisma.generation.findFirst({
    where: {
      subject,
      difficulty,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  try {
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
    if (!text) throw new Error("Empty AI response");

    const cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const parsed = JSON.parse(cleaned);

    // salvou? então agora o sistema fica mais forte
    await prisma.generation.create({
      data: {
        subject,
        difficulty,
        content: parsed,
      },
    });

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("AI error:", error);

    // fallback: devolve algo do banco
    if (cached) {
      return NextResponse.json(cached.content);
    }

    return NextResponse.json(
      { error: "Failed to generate study plan" },
      { status: 500 },
    );
  }
}
