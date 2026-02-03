"use client";

import { useState } from "react";

/* UI */
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

/* Icons */
import { PlayCircle, CheckCircle2, ListTodo } from "lucide-react";

/* Local */
import { Spinner } from "@/components/Spinner";

/* Types */
interface StudyData {
  topic: string;
  explanation: string;
  howToStart: string;
  prerequisites: string[];
  exercises: string[];
}

/* Data */
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
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setData(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ subject, difficulty }),
      });

      if (!res.ok) {
        throw new Error("Request failed");
      }

      const json = await res.json();

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
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-3xl space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Plano de Estudo Personalizado</CardTitle>
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
          <CardContent className="flex justify-center py-10">
            <Spinner />
          </CardContent>
        </Card>
      )}

      {data && (
        <Card className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          <CardHeader>
            <CardTitle className="text-2xl">{data.topic}</CardTitle>
          </CardHeader>

          <CardContent className="space-y-8">
            <p className="text-muted-foreground leading-relaxed">
              {data.explanation}
            </p>

            <Separator />

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-primary font-semibold">
                <PlayCircle className="h-5 w-5" />
                <span>Passo 1 — Como começar</span>
              </div>

              <div className="rounded-lg border p-4 bg-muted/40">
                <p className="leading-relaxed">{data.howToStart}</p>
              </div>
            </div>

            {data.prerequisites.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 font-semibold">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span>Antes de avançar, confira se você já sabe:</span>
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
              <div className="space-y-3">
                <div className="flex items-center gap-2 font-semibold">
                  <ListTodo className="h-5 w-5 text-blue-500" />
                  <span>Exercícios práticos</span>
                </div>

                <ol className="space-y-3">
                  {data.exercises.map((ex, index) => (
                    <li key={ex} className="flex gap-3 rounded-lg border p-4">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-500 text-white text-sm font-bold">
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
