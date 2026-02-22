import React from "react";
import { motion } from "motion/react";
import { CodeBlock } from "./CodeBlock";
import { Lesson } from "../data/lessons";
import { Terminal, Image as ImageIcon, Layout, PlayCircle } from "lucide-react";

interface LessonContentProps {
  lesson: Lesson;
}

export function LessonContent({ lesson }: LessonContentProps) {
  const renderOutput = () => {
    switch (lesson.outputType) {
      case "text":
        return (
          <div className="bg-neutral-900 border border-white/10 rounded-3xl p-8 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-400" />
            <div className="flex items-center gap-3 mb-6">
              <Terminal className="w-5 h-5 text-emerald-400" />
              <span className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em]">
                Terminal Output
              </span>
            </div>
            <pre className="font-mono text-sm text-emerald-300/80 whitespace-pre-wrap leading-relaxed">
              {lesson.outputData}
            </pre>
          </div>
        );
      case "image":
        return (
          <div className="bg-neutral-900 border border-white/10 rounded-3xl p-8 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <ImageIcon className="w-5 h-5 text-blue-400" />
              <span className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em]">
                Image Output
              </span>
            </div>
            <div className="relative rounded-2xl overflow-hidden border border-white/5">
              <img
                src={lesson.outputData}
                alt="Output"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        );
      case "ui":
        const uiData = lesson.outputData as any;
        return (
          <div className="bg-white rounded-xl p-6 shadow-xl border border-slate-200">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-100">
              <Layout className="w-5 h-5 text-rose-500" />
              <span className="text-sm font-mono text-slate-500">
                Streamlit UI Simulation
              </span>
            </div>
            <div className="space-y-6">
              <h1 className="text-3xl font-bold text-slate-800">
                {uiData.title}
              </h1>
              <p className="text-slate-600 text-lg">{uiData.text}</p>

              {uiData.type === "chart" && (
                <div className="w-full h-64 bg-slate-50 rounded-lg border border-slate-200 flex items-end p-4 gap-2">
                  {[40, 70, 45, 90, 65, 85, 55, 100, 75, 60].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-blue-500/80 rounded-t-sm transition-all duration-500 hover:bg-blue-600"
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
              )}

              {uiData.type === "upload" && (
                <div className="w-full p-8 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 flex flex-col items-center justify-center text-slate-500 gap-4 hover:bg-slate-100 transition-colors cursor-pointer">
                  <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center">
                    <span className="text-2xl">📄</span>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-slate-700">
                      Drag and drop file here
                    </p>
                    <p className="text-sm">Limit 200MB per file • CSV</p>
                  </div>
                  <button className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50">
                    Browse files
                  </button>
                </div>
              )}

              {uiData.type === "cv_app" && (
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="w-full aspect-video bg-slate-200 rounded-lg overflow-hidden relative">
                      <img
                        src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80"
                        alt="Original"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                        Original
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700">
                        Filtro
                      </label>
                      <div className="space-y-2">
                        {["Tons de Cinza", "Bordas (Canny)", "Desfoque"].map(
                          (f) => (
                            <label
                              key={f}
                              className="flex items-center gap-2 text-slate-600 cursor-pointer"
                            >
                              <input
                                type="radio"
                                name="filtro"
                                className="w-4 h-4 text-blue-600"
                                defaultChecked={f === "Bordas (Canny)"}
                              />
                              {f}
                            </label>
                          ),
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="w-full aspect-video bg-slate-900 rounded-lg overflow-hidden relative border-4 border-slate-800">
                    <img
                      src="https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=800&q=80"
                      alt="Resultado"
                      className="w-full h-full object-cover grayscale contrast-150"
                    />
                    <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                      Resultado (Canny)
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      key={lesson.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="max-w-5xl mx-auto p-8 space-y-12"
    >
      <header className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 bg-white/5 text-white/60 text-[10px] font-mono uppercase tracking-[0.2em] rounded-full border border-white/10">
            {lesson.category}
          </span>
          <span className="text-white/20 text-sm font-mono">•</span>
          <span className="text-white/40 text-[10px] font-mono uppercase tracking-widest">
            {lesson.level}
          </span>
        </div>
        <h1 className="text-5xl md:text-6xl font-bricolage font-medium text-white tracking-tight leading-tight">
          {lesson.title}
        </h1>
        <p className="text-xl text-white/40 max-w-3xl leading-relaxed">
          {lesson.description}
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bricolage font-medium text-white flex items-center gap-3">
              <PlayCircle className="w-6 h-6 text-emerald-400" />
              Código Fonte
            </h2>
          </div>
          <div className="bg-neutral-900 border border-white/10 rounded-3xl p-6 shadow-xl relative overflow-hidden group">
            <div className="absolute -right-24 -top-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
            <div className="relative z-10">
              <CodeBlock code={lesson.code} />
            </div>
          </div>

          <div className="bg-blue-500/5 border border-blue-500/20 rounded-3xl p-8 backdrop-blur-xl">
            <h3 className="text-blue-400 font-bricolage font-medium text-lg mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]"></span>
              Entendendo o Código
            </h3>
            <p className="text-white/60 leading-relaxed">
              {lesson.explanation}
            </p>
          </div>
        </div>

        <div className="space-y-8">
          <h2 className="text-2xl font-bricolage font-medium text-white flex items-center gap-3">
            <Layout className="w-6 h-6 text-blue-400" />
            Resultado Esperado
          </h2>
          {renderOutput()}
        </div>
      </div>
    </motion.div>
  );
}
