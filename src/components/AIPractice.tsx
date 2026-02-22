import React, { useState } from "react";
import { GoogleGenAI, Type } from "@google/genai";
import {
  Brain,
  Send,
  Loader2,
  CheckCircle2,
  XCircle,
  RefreshCw,
} from "lucide-react";
import { motion } from "motion/react";
import { clsx } from "clsx";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

type Topic = "Pandas" | "NumPy" | "OpenCV" | "Streamlit";
type Difficulty = "Básico" | "Intermediário" | "Avançado";

const topics: Topic[] = ["Pandas", "NumPy", "OpenCV", "Streamlit"];
const difficulties: Difficulty[] = ["Básico", "Intermediário", "Avançado"];

export function AIPractice() {
  const [topic, setTopic] = useState<Topic>("Pandas");
  const [difficulty, setDifficulty] = useState<Difficulty>("Básico");
  const [question, setQuestion] = useState<string>("");
  const [userAnswer, setUserAnswer] = useState<string>("");
  const [evaluation, setEvaluation] = useState<{
    isCorrect: boolean;
    feedback: string;
  } | null>(null);
  const [loadingQuestion, setLoadingQuestion] = useState(false);
  const [loadingEvaluation, setLoadingEvaluation] = useState(false);

  const generateQuestion = async () => {
    setLoadingQuestion(true);
    setQuestion("");
    setUserAnswer("");
    setEvaluation(null);
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Gere uma pergunta de programação sobre ${topic} com nível de dificuldade ${difficulty}. A pergunta deve ser prática, pedindo para o usuário explicar um conceito ou escrever um pequeno trecho de código. Retorne apenas a pergunta, sem a resposta.`,
      });
      setQuestion(response.text || "Não foi possível gerar a pergunta.");
    } catch (error) {
      console.error(error);
      setQuestion(
        "Erro ao gerar pergunta. Verifique sua chave de API e tente novamente.",
      );
    } finally {
      setLoadingQuestion(false);
    }
  };

  const evaluateAnswer = async () => {
    if (!userAnswer.trim()) return;
    setLoadingEvaluation(true);
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Você é um professor de programação avaliando a resposta de um aluno.
Pergunta: ${question}
Resposta do aluno: ${userAnswer}

Avalie se a resposta está correta ou errada. Forneça um feedback construtivo.
Responda no formato JSON com as propriedades:
- isCorrect: boolean (true se estiver correta ou parcialmente correta e aceitável, false caso contrário)
- feedback: string (sua explicação e correção)`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              isCorrect: {
                type: Type.BOOLEAN,
                description:
                  "True if the answer is correct or partially correct, false otherwise.",
              },
              feedback: {
                type: Type.STRING,
                description: "Constructive feedback explaining the evaluation.",
              },
            },
            required: ["isCorrect", "feedback"],
          },
        },
      });

      const result = JSON.parse(response.text || "{}");
      setEvaluation(result);
    } catch (error) {
      console.error(error);
      setEvaluation({
        isCorrect: false,
        feedback: "Erro ao avaliar a resposta. Tente novamente.",
      });
    } finally {
      setLoadingEvaluation(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto p-8 space-y-8"
    >
      <header className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shadow-lg">
            <Brain className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-4xl font-bricolage font-medium text-white tracking-tight">
              Prática com IA
            </h1>
            <p className="text-white/40 text-lg">
              Gere questões aleatórias e teste seus conhecimentos.
            </p>
          </div>
        </div>
      </header>

      <div className="bg-neutral-900 border border-white/10 rounded-[48px] p-12 space-y-8 shadow-xl relative overflow-hidden group">
        <div className="absolute -right-48 -top-48 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
          <div className="space-y-4">
            <label className="text-xs font-mono text-white/30 uppercase tracking-widest">
              Tópico
            </label>
            <div className="flex flex-wrap gap-3">
              {topics.map((t) => (
                <button
                  key={t}
                  onClick={() => setTopic(t)}
                  className={clsx(
                    "px-6 py-3 rounded-full text-sm font-medium transition-all border",
                    topic === t
                      ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                      : "bg-white/5 text-white/60 border-transparent hover:bg-white/10",
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <label className="text-xs font-mono text-white/30 uppercase tracking-widest">
              Dificuldade
            </label>
            <div className="flex flex-wrap gap-3">
              {difficulties.map((d) => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={clsx(
                    "px-6 py-3 rounded-full text-sm font-medium transition-all border",
                    difficulty === d
                      ? "bg-blue-500/20 text-blue-400 border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.2)]"
                      : "bg-white/5 text-white/60 border-transparent hover:bg-white/10",
                  )}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={generateQuestion}
          disabled={loadingQuestion}
          className="w-full py-4 px-8 bg-white text-black font-bricolage font-bold rounded-full hover:bg-neutral-200 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 relative z-10"
        >
          {loadingQuestion ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <RefreshCw className="w-5 h-5" />
          )}
          {question ? "Gerar Nova Pergunta" : "Gerar Pergunta"}
        </button>
      </div>

      {question && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/[0.02] border border-white/10 rounded-[48px] p-12 space-y-8 shadow-2xl backdrop-blur-xl"
        >
          <div className="space-y-6">
            <h2 className="text-xl font-bricolage font-medium text-white flex items-center gap-3">
              <Brain className="w-6 h-6 text-emerald-400" />
              Pergunta:
            </h2>
            <p className="text-white/70 leading-relaxed text-lg">{question}</p>
          </div>

          <div className="space-y-6">
            <textarea
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Digite sua resposta aqui... (Pode incluir código se necessário)"
              className="w-full h-48 bg-black/50 border border-white/10 rounded-3xl p-6 text-white/90 placeholder:text-white/30 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 resize-none font-mono text-sm transition-all"
            />

            <button
              onClick={evaluateAnswer}
              disabled={!userAnswer.trim() || loadingEvaluation || !!evaluation}
              className="px-8 py-4 bg-emerald-500 text-black font-bricolage font-bold rounded-full hover:bg-emerald-400 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 ml-auto shadow-[0_0_20px_rgba(16,185,129,0.3)]"
            >
              {loadingEvaluation ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
              Enviar Resposta
            </button>
          </div>

          {evaluation && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={clsx(
                "p-8 rounded-3xl border",
                evaluation.isCorrect
                  ? "bg-emerald-500/10 border-emerald-500/30"
                  : "bg-rose-500/10 border-rose-500/30",
              )}
            >
              <div className="flex items-start gap-4">
                {evaluation.isCorrect ? (
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 shrink-0" />
                ) : (
                  <XCircle className="w-8 h-8 text-rose-400 shrink-0" />
                )}
                <div className="space-y-3">
                  <h3
                    className={clsx(
                      "font-bricolage font-medium text-xl",
                      evaluation.isCorrect
                        ? "text-emerald-400"
                        : "text-rose-400",
                    )}
                  >
                    {evaluation.isCorrect
                      ? "Correto!"
                      : "Incorreto ou Incompleto"}
                  </h3>
                  <p className="text-white/70 leading-relaxed whitespace-pre-wrap text-lg">
                    {evaluation.feedback}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
