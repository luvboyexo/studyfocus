"use client";

import { useState } from "react";

/* ui */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

/* icons */
import { PlayCircle, CheckCircle2, ListTodo, WifiOff } from "lucide-react";

/* local */
import { Spinner } from "@/components/Spinner";

/* types */
interface StudyData {
  topic: string;
  explanation: string;
  howToStart: string;
  prerequisites: string[];
  exercises: string[];
}

interface ApiResponse extends StudyData {
  mode?: "ai" | "fallback";
  warning?: string;
}

/* data */
const subjects = [
  "Matemática",
  "Biologia",
  "Química",
  "Física",
  "Programação",
  "Redes",
  "Cybersegurança",
  "Lógica",
  "Direito Constitucional",
];

const difs = ["Fácil", "Médio", "Difícil", "Profissional"];

export function StudyForm() {
  const [subject, setSubject] = useState(subjects[0]);
  const [difficulty, setDifficulty] = useState(difs[0]);
  const [data, setData] = useState<StudyData | null>(null);
  const [mode, setMode] = useState<"ai" | "fallback" | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setData(null);
    setMode(null);
    setWarning(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ subject, difficulty }),
      });

      if (!res.ok) {
        throw new Error("request failed");
      }

      const json: ApiResponse = await res.json();

      const normalizedData: StudyData = {
        topic: json.topic ?? "",
        explanation: json.explanation ?? "",
        howToStart: json.howToStart ?? "",
        prerequisites: Array.isArray(json.prerequisites)
          ? json.prerequisites
          : [],
        exercises: Array.isArray(json.exercises) ? json.exercises : [],
      };

      setData(normalizedData);
      setMode(json.mode ?? null);
      setWarning(json.warning ?? null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-3xl space-y-10">
      <Card className="border-muted/60">
        <CardHeader>
          <CardTitle className="text-xl tracking-tight">
            Plano de Estudo Personalizado
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-3">
            <Select value={subject} onValueChange={setSubject}>
              <SelectTrigger>
                <SelectValue placeholder="Matéria" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={difficulty} onValueChange={setDifficulty}>
              <SelectTrigger>
                <SelectValue placeholder="Dificuldade" />
              </SelectTrigger>
              <SelectContent>
                {difs.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button type="submit" disabled={loading}>
              Gerar plano
            </Button>
          </form>
        </CardContent>
      </Card>

      {loading && (
        <Card>
          <CardContent className="flex justify-center py-12">
            <Spinner />
          </CardContent>
        </Card>
      )}

      {data && (
        <Card className="animate-in fade-in slide-in-from-bottom-2 duration-300 border-muted/60">
          <CardHeader className="space-y-3">
            <div className="flex items-center justify-between gap-4">
              <CardTitle className="text-2xl font-semibold">
                {data.topic}
              </CardTitle>

              {mode === "fallback" && (
                <Badge
                  variant="outline"
                  className="flex items-center gap-2 border-amber-400/40 bg-amber-500/10 text-amber-600"
                >
                  <WifiOff className="h-4 w-4" />
                  modo offline
                </Badge>
              )}
            </div>

            {warning && (
              <p className="text-sm text-muted-foreground">{warning}</p>
            )}
          </CardHeader>

          <CardContent className="space-y-10">
            <p className="text-muted-foreground leading-relaxed text-base">
              {data.explanation}
            </p>

            <Separator />

            <div className="space-y-3">
              <div className="flex items-center gap-2 font-semibold text-primary">
                <PlayCircle className="h-5 w-5" />
                <span>Passo 1 — Como começar</span>
              </div>

              <div className="rounded-xl border bg-muted/40 p-5">
                <p className="leading-relaxed">{data.howToStart}</p>
              </div>
            </div>

            {data.prerequisites.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 font-semibold">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span>Pré-requisitos</span>
                </div>

                <ul className="space-y-2">
                  {data.prerequisites.map((p) => (
                    <li key={p} className="flex items-start gap-2">
                      <span className="mt-1 h-2 w-2 rounded-full bg-green-500" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {data.exercises.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 font-semibold">
                  <ListTodo className="h-5 w-5 text-blue-500" />
                  <span>Exercícios práticos</span>
                </div>

                <ol className="space-y-3">
                  {data.exercises.map((ex, index) => (
                    <li
                      key={`${ex}-${index}`}
                      className="flex gap-4 rounded-xl border p-5"
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-500 text-white text-sm font-bold">
                        {index + 1}
                      </span>
                      <p className="leading-relaxed">{ex}</p>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
