import React from "react";
import {
  BookOpen,
  Eye,
  Cpu,
  ChevronRight,
  Brain,
  ListTodo,
} from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { lessons, Category, Level } from "../data/lessons";

interface SidebarProps {
  activeLessonId: string;
  onSelectLesson: (id: string) => void;
  currentView: "lessons" | "practice" | "theory" | "quiz";
  onSelectView: (view: "lessons" | "practice" | "theory" | "quiz") => void;
}

const categoryIcons: Record<Category, React.ReactNode> = {
  Geral: <BookOpen className="w-5 h-5 text-blue-400" />,
};

const levelColors: Record<Level, string> = {
  Básico: "bg-slate-800 text-slate-300 border-slate-700",
  Intermediário: "bg-indigo-900/40 text-indigo-300 border-indigo-800",
  Avançado: "bg-rose-900/40 text-rose-300 border-rose-800",
};

export function Sidebar({
  activeLessonId,
  onSelectLesson,
  currentView,
  onSelectView,
}: SidebarProps) {
  // Group lessons by category
  const groupedLessons = lessons.reduce(
    (acc, lesson) => {
      if (!acc[lesson.category]) {
        acc[lesson.category] = [];
      }
      acc[lesson.category].push(lesson);
      return acc;
    },
    {} as Record<Category, typeof lessons>,
  );

  return (
    <aside className="w-80 bg-black/50 backdrop-blur-xl border-r border-white/10 h-screen flex flex-col overflow-y-auto relative z-20">
      <div className="p-6 border-b border-white/10 sticky top-0 bg-black/50 backdrop-blur-xl z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-lg">
            <BookOpen className="w-5 h-5 text-black" />
          </div>
          <div>
            <h1 className="text-white font-bricolage font-bold text-lg leading-tight uppercase tracking-widest">
              Python Master
            </h1>
            <p className="text-white/40 text-[10px] font-mono tracking-[0.2em] uppercase">
              Data & AI Bootcamp
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 flex-1 space-y-8">
        <div className="space-y-3">
          <h2 className="text-white/20 font-mono text-[10px] uppercase tracking-[0.4em] px-2">
            Modos
          </h2>
          <button
            onClick={() => onSelectView("theory")}
            className={twMerge(
              clsx(
                "w-full text-left px-4 py-3 rounded-full flex items-center justify-between transition-all duration-300 border",
                currentView === "theory"
                  ? "bg-blue-500/10 border-blue-500/30 shadow-[0_0_20px_rgba(59,130,246,0.1)]"
                  : "bg-transparent border-transparent hover:bg-white/5",
              ),
            )}
          >
            <div className="flex items-center gap-3">
              <BookOpen
                className={clsx(
                  "w-5 h-5",
                  currentView === "theory" ? "text-blue-400" : "text-white/40",
                )}
              />
              <span
                className={clsx(
                  "text-sm font-medium font-bricolage tracking-wide",
                  currentView === "theory" ? "text-blue-300" : "text-white/60",
                )}
              >
                Modo Teoria
              </span>
            </div>
            {currentView === "theory" && (
              <ChevronRight className="w-4 h-4 text-blue-400/50" />
            )}
          </button>
          <button
            onClick={() => onSelectView("practice")}
            className={twMerge(
              clsx(
                "w-full text-left px-4 py-3 rounded-full flex items-center justify-between transition-all duration-300 border",
                currentView === "practice"
                  ? "bg-emerald-500/10 border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.1)]"
                  : "bg-transparent border-transparent hover:bg-white/5",
              ),
            )}
          >
            <div className="flex items-center gap-3">
              <Brain
                className={clsx(
                  "w-5 h-5",
                  currentView === "practice"
                    ? "text-emerald-400"
                    : "text-white/40",
                )}
              />
              <span
                className={clsx(
                  "text-sm font-medium font-bricolage tracking-wide",
                  currentView === "practice"
                    ? "text-emerald-300"
                    : "text-white/60",
                )}
              >
                Prática com IA
              </span>
            </div>
            {currentView === "practice" && (
              <ChevronRight className="w-4 h-4 text-emerald-400/50" />
            )}
          </button>
          <button
            onClick={() => onSelectView("quiz")}
            className={twMerge(
              clsx(
                "w-full text-left px-4 py-3 rounded-full flex items-center justify-between transition-all duration-300 border",
                currentView === "quiz"
                  ? "bg-purple-500/10 border-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.1)]"
                  : "bg-transparent border-transparent hover:bg-white/5",
              ),
            )}
          >
            <div className="flex items-center gap-3">
              <ListTodo
                className={clsx(
                  "w-5 h-5",
                  currentView === "quiz" ? "text-purple-400" : "text-white/40",
                )}
              />
              <span
                className={clsx(
                  "text-sm font-medium font-bricolage tracking-wide",
                  currentView === "quiz" ? "text-purple-300" : "text-white/60",
                )}
              >
                Modo Quiz
              </span>
            </div>
            {currentView === "quiz" && (
              <ChevronRight className="w-4 h-4 text-purple-400/50" />
            )}
          </button>
        </div>

        {(Object.keys(groupedLessons) as Category[]).map((category) => (
          <div key={category} className="space-y-3">
            <div className="flex items-center gap-2 px-2">
              {categoryIcons[category]}
              <h2 className="text-white/20 font-mono text-[10px] uppercase tracking-[0.4em]">
                {category}
              </h2>
            </div>

            <div className="space-y-1">
              {groupedLessons[category].map((lesson) => {
                const isActive =
                  currentView === "lessons" && activeLessonId === lesson.id;
                return (
                  <button
                    key={lesson.id}
                    onClick={() => {
                      onSelectLesson(lesson.id);
                      onSelectView("lessons");
                    }}
                    className={twMerge(
                      clsx(
                        "w-full text-left px-4 py-3 rounded-2xl flex flex-col gap-2 transition-all duration-300 border",
                        isActive
                          ? "bg-white/10 border-white/20 shadow-sm"
                          : "bg-transparent border-transparent hover:bg-white/5",
                      ),
                    )}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span
                        className={clsx(
                          "text-sm font-medium font-bricolage tracking-wide",
                          isActive ? "text-white" : "text-white/60",
                        )}
                      >
                        {lesson.title}
                      </span>
                      {isActive && (
                        <ChevronRight className="w-4 h-4 text-white/50" />
                      )}
                    </div>
                    <span
                      className={clsx(
                        "text-[9px] uppercase tracking-[0.2em] px-2 py-0.5 rounded-full border w-fit font-mono",
                        levelColors[lesson.level],
                      )}
                    >
                      {lesson.level}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
