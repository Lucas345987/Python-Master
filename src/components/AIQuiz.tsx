import React, { useState } from "react";
import { GoogleGenAI, Type } from "@google/genai";
import {
  ListTodo,
  Loader2,
  RefreshCw,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { clsx } from "clsx";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

type Topic = "Pandas" | "NumPy" | "OpenCV" | "Streamlit";
type Difficulty = "Básico" | "Intermediário" | "Avançado";

const topics: Topic[] = ["Pandas", "NumPy", "OpenCV", "Streamlit"];
const difficulties: Difficulty[] = ["Básico", "Intermediário", "Avançado"];

interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export function AIQuiz() {
  const [topic, setTopic] = useState<Topic>("Pandas");
  const [difficulty, setDifficulty] = useState<Difficulty>("Básico");
  const [quiz, setQuiz] = useState<QuizQuestion | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateQuiz = async () => {
    setLoading(true);
    setQuiz(null);
    setSelectedOption(null);
    setError(null);
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Gere uma questão de múltipla escolha sobre ${topic} com nível de dificuldade ${difficulty}. A questão deve ter 4 alternativas.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              question: {
                type: Type.STRING,
                description: "O enunciado da questão.",
              },
              options: {
                type: Type.ARRAY,
                items: {
                  type: Type.STRING,
                },
                description: "As 4 alternativas da questão.",
              },
              correctIndex: {
                type: Type.INTEGER,
                description: "O índice (0 a 3) da alternativa correta.",
              },
              explanation: {
                type: Type.STRING,
                description:
                  "A explicação do porquê a alternativa está correta.",
              },
            },
            required: ["question", "options", "correctIndex", "explanation"],
          },
        },
      });

      const jsonStr = response.text?.trim();
      if (jsonStr) {
        const parsed = JSON.parse(jsonStr) as QuizQuestion;
        setQuiz(parsed);
      } else {
        setError("Não foi possível gerar a questão.");
      }
    } catch (error) {
      console.error(error);
      setError(
        "Erro ao gerar questão. Verifique sua chave de API e tente novamente.",
      );
    } finally {
      setLoading(false);
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
            <ListTodo className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h1 className="text-4xl font-bricolage font-medium text-white tracking-tight">
              Modo Quiz
            </h1>
            <p className="text-white/40 text-lg">
              Teste seus conhecimentos com questões de múltipla escolha.
            </p>
          </div>
        </div>
      </header>

      <div className="bg-neutral-900 border border-white/10 rounded-[48px] p-12 space-y-8 shadow-xl relative overflow-hidden group">
        <div className="absolute -right-48 -top-48 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>

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
                      ? "bg-purple-500/20 text-purple-400 border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.2)]"
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
          onClick={generateQuiz}
          disabled={loading}
          className="w-full py-4 px-8 bg-white text-black font-bricolage font-bold rounded-full hover:bg-neutral-200 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 relative z-10"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <RefreshCw className="w-5 h-5" />
          )}
          {quiz ? "Gerar Nova Questão" : "Gerar Questão"}
        </button>

        {error && (
          <div className="text-rose-400 text-sm text-center relative z-10">
            {error}
          </div>
        )}
      </div>

      {quiz && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/[0.02] border border-white/10 rounded-[48px] p-12 space-y-8 shadow-2xl backdrop-blur-xl"
        >
          <div className="space-y-6">
            <h2 className="text-xl font-bricolage font-medium text-white flex items-center gap-3">
              <ListTodo className="w-6 h-6 text-purple-400" />
              Pergunta:
            </h2>
            <p className="text-white/70 leading-relaxed text-lg">
              {quiz.question}
            </p>
          </div>

          <div className="space-y-4">
            {quiz.options.map((option, index) => {
              const isSelected = selectedOption === index;
              const isCorrect = quiz.correctIndex === index;
              const showResult = selectedOption !== null;

              let buttonClass =
                "bg-white/5 border-white/10 text-white/70 hover:bg-white/10";

              if (showResult) {
                if (isCorrect) {
                  buttonClass =
                    "bg-emerald-500/20 border-emerald-500/50 text-emerald-400";
                } else if (isSelected) {
                  buttonClass =
                    "bg-rose-500/20 border-rose-500/50 text-rose-400";
                } else {
                  buttonClass =
                    "bg-white/5 border-white/10 text-white/30 opacity-50";
                }
              } else if (isSelected) {
                buttonClass =
                  "bg-purple-500/20 border-purple-500/50 text-purple-400";
              }

              return (
                <button
                  key={index}
                  onClick={() => !showResult && setSelectedOption(index)}
                  disabled={showResult}
                  className={clsx(
                    "w-full text-left p-6 rounded-2xl border transition-all duration-300 flex items-center justify-between",
                    buttonClass,
                  )}
                >
                  <span className="text-lg">{option}</span>
                  {showResult && isCorrect && (
                    <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                  )}
                  {showResult && isSelected && !isCorrect && (
                    <XCircle className="w-6 h-6 text-rose-400" />
                  )}
                </button>
              );
            })}
          </div>

          {selectedOption !== null && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={clsx(
                "p-8 rounded-3xl border mt-8",
                selectedOption === quiz.correctIndex
                  ? "bg-emerald-500/10 border-emerald-500/30"
                  : "bg-rose-500/10 border-rose-500/30",
              )}
            >
              <div className="flex items-start gap-4">
                {selectedOption === quiz.correctIndex ? (
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 shrink-0" />
                ) : (
                  <XCircle className="w-8 h-8 text-rose-400 shrink-0" />
                )}
                <div className="space-y-3">
                  <h3
                    className={clsx(
                      "font-bricolage font-medium text-xl",
                      selectedOption === quiz.correctIndex
                        ? "text-emerald-400"
                        : "text-rose-400",
                    )}
                  >
                    {selectedOption === quiz.correctIndex
                      ? "Correto!"
                      : "Incorreto"}
                  </h3>
                  <p className="text-white/70 leading-relaxed whitespace-pre-wrap text-lg">
                    {quiz.explanation}
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
