import { NextResponse } from "next/server";
import { ai } from "@/lib/gemini";
import { prisma } from "@/lib/prisma";

type GeneratedContent = {
  topic: string;
  explanation: string;
  howToStart: string;
  prerequisites: string[];
  exercises: string[];
};

function makeTopicKey(topic: string): string {
  return topic
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function isValidGeneratedContent(data: unknown): data is GeneratedContent {
  if (typeof data !== "object" || data === null) return false;

  const d = data as Record<string, unknown>;

  return (
    typeof d.topic === "string" &&
    typeof d.explanation === "string" &&
    typeof d.howToStart === "string" &&
    Array.isArray(d.prerequisites) &&
    d.prerequisites.every((p) => typeof p === "string") &&
    Array.isArray(d.exercises) &&
    d.exercises.every((e) => typeof e === "string")
  );
}

export async function POST(req: Request) {
  const { subject, difficulty } = await req.json();
  const MAX_ATTEMPTS = 3;
  const OFFLINE_EXCLUDE_LAST = 5;

  try {
    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      const prompt = `
Você é um professor especialista.

Matéria: ${subject}
Dificuldade: ${difficulty}

Escolha UM tópico específico, não introdutório e bem definido.
Varie o conteúdo e evite repetir ideias semelhantes.

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
      if (!text) continue;

      const cleaned = text.replace(/```json|```/g, "").trim();

      let parsed: unknown;
      try {
        parsed = JSON.parse(cleaned);
      } catch {
        continue;
      }

      if (!isValidGeneratedContent(parsed)) continue;

      const topicKey = makeTopicKey(parsed.topic);

      const exists = await prisma.generation.findUnique({
        where: {
          subject_difficulty_topicKey: {
            subject,
            difficulty,
            topicKey,
          },
        },
      });

      if (exists) continue;

      await prisma.generation.create({
        data: {
          subject,
          difficulty,
          topicKey,
          content: parsed,
        },
      });

      return NextResponse.json({ mode: "ai", ...parsed });
    }

    throw new Error("ai_failed_after_retries");
  } catch (error) {
    console.error("ai error:", error);

    /* 🔥 OFFLINE INTELIGENTE (SEM REPETIÇÃO RECENTE) */

    const recent = await prisma.generation.findMany({
      where: { subject, difficulty },
      orderBy: { createdAt: "desc" },
      take: OFFLINE_EXCLUDE_LAST,
      select: { topicKey: true, content: true },
    });

    const excludedKeys = recent.map((r) => r.topicKey);

    const available = await prisma.generation.findMany({
      where: {
        subject,
        difficulty,
        topicKey: excludedKeys.length > 0 ? { notIn: excludedKeys } : undefined,
      },
    });

    const pool = available.length > 0 ? available : recent;

    if (pool.length > 0) {
      const random = pool[Math.floor(Math.random() * pool.length)];

      return NextResponse.json({
        mode: "offline",
        warning: "conteudo similar (modo offline)",
        ...(random.content as GeneratedContent),
      });
    }

    return NextResponse.json(
      { error: "failed to generate study plan" },
      { status: 500 },
    );
  }
}
