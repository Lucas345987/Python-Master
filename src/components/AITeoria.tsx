import React, { useState } from "react";
import { GoogleGenAI } from "@google/genai";
import { BookOpen, Loader2, RefreshCw } from "lucide-react";
import { motion } from "motion/react";
import { clsx } from "clsx";
import Markdown from "react-markdown";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

type Topic = "Pandas" | "NumPy" | "OpenCV" | "Streamlit";
type Difficulty = "Básico" | "Intermediário" | "Avançado";

const topics: Topic[] = ["Pandas", "NumPy", "OpenCV", "Streamlit"];
const difficulties: Difficulty[] = ["Básico", "Intermediário", "Avançado"];

export function AITeoria() {
  const [topic, setTopic] = useState<Topic>("Pandas");
  const [difficulty, setDifficulty] = useState<Difficulty>("Básico");
  const [theory, setTheory] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const generateTheory = async () => {
    setLoading(true);
    setTheory("");
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Gere uma explicação teórica sobre ${topic} com nível de dificuldade ${difficulty}. A explicação deve ser clara, didática e incluir exemplos práticos de código se aplicável. Formate a resposta em Markdown.`,
      });
      setTheory(response.text || "Não foi possível gerar a teoria.");
    } catch (error) {
      console.error(error);
      setTheory(
        "Erro ao gerar teoria. Verifique sua chave de API e tente novamente.",
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
            <BookOpen className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h1 className="text-4xl font-bricolage font-medium text-white tracking-tight">
              Modo Teoria
            </h1>
            <p className="text-white/40 text-lg">
              Aprenda os conceitos fundamentais com explicações geradas por IA.
            </p>
          </div>
        </div>
      </header>

      <div className="bg-neutral-900 border border-white/10 rounded-[48px] p-12 space-y-8 shadow-xl relative overflow-hidden group">
        <div className="absolute -right-48 -top-48 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>

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
                      ? "bg-blue-500/20 text-blue-400 border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.2)]"
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
                      ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
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
          onClick={generateTheory}
          disabled={loading}
          className="w-full py-4 px-8 bg-white text-black font-bricolage font-bold rounded-full hover:bg-neutral-200 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 relative z-10"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <RefreshCw className="w-5 h-5" />
          )}
          {theory ? "Gerar Nova Explicação" : "Gerar Explicação"}
        </button>
      </div>

      {theory && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/[0.02] border border-white/10 rounded-[48px] p-12 space-y-6 shadow-2xl backdrop-blur-xl"
        >
          <div className="prose prose-invert prose-blue max-w-none prose-headings:font-bricolage prose-headings:font-medium prose-p:text-white/70 prose-p:leading-relaxed prose-pre:bg-black/50 prose-pre:border prose-pre:border-white/10">
            <Markdown>{theory}</Markdown>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
