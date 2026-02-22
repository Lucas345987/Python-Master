import React, { useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { LessonContent } from "./components/LessonContent";
import { AIPractice } from "./components/AIPractice";
import { AITeoria } from "./components/AITeoria";
import { AIQuiz } from "./components/AIQuiz";
import { lessons } from "./data/lessons";

export default function App() {
  const [activeLessonId, setActiveLessonId] = useState(lessons[0]?.id || "");
  const [currentView, setCurrentView] = useState<
    "lessons" | "practice" | "theory" | "quiz"
  >("theory");

  const activeLesson =
    lessons.find((l) => l.id === activeLessonId) || lessons[0];

  return (
    <div className="flex h-screen bg-black text-white font-sans overflow-hidden relative">
      <div className="grid-lines">
        <div className="grid-line"></div>
        <div className="grid-line"></div>
        <div className="grid-line"></div>
        <div className="grid-line"></div>
        <div className="grid-line"></div>
      </div>
      <div className="bg-grain"></div>

      <Sidebar
        activeLessonId={activeLessonId}
        onSelectLesson={setActiveLessonId}
        currentView={currentView}
        onSelectView={setCurrentView}
      />
      <main className="flex-1 overflow-y-auto relative z-10 hide-scrollbar">
        {currentView === "lessons" && activeLesson ? (
          <LessonContent lesson={activeLesson} />
        ) : currentView === "theory" ? (
          <AITeoria />
        ) : currentView === "quiz" ? (
          <AIQuiz />
        ) : (
          <AIPractice />
        )}
      </main>
    </div>
  );
}
