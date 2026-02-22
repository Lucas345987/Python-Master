export type Level = "Básico" | "Intermediário" | "Avançado";
export type Category = "Geral";

export interface Lesson {
  id: string;
  title: string;
  category: Category;
  level: Level;
  description: string;
  code: string;
  outputType: "text" | "table" | "image" | "ui";
  outputData: any;
  explanation: string;
}

export const lessons: Lesson[] = [];
