
import { GoogleGenAI, Type } from "@google/genai";
import { Question, QuizConfig } from "../types";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async generateQuiz(config: QuizConfig): Promise<Question[]> {
    const prompt = `Generate a ${config.count}-question multiple choice quiz about "${config.topic}" with ${config.difficulty} difficulty.
    For each question, provide 4 options, the correct answer index (0-3), and a clear, educational explanation.`;

    const response = await this.ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              question: { type: Type.STRING },
              options: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              correctAnswerIndex: { type: Type.INTEGER },
              explanation: { type: Type.STRING }
            },
            required: ["id", "question", "options", "correctAnswerIndex", "explanation"]
          }
        }
      }
    });

    try {
      const data = JSON.parse(response.text || '[]');
      return data as Question[];
    } catch (error) {
      console.error("Error parsing quiz data:", error);
      throw new Error("Failed to parse quiz data from AI.");
    }
  }

  async getPerformanceFeedback(score: number, total: number, topic: string): Promise<string> {
    const prompt = `The user scored ${score} out of ${total} on a quiz about "${topic}". Provide a very short, encouraging, and witty piece of feedback (max 2 sentences).`;
    const response = await this.ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt
    });
    return response.text || "Great job!";
  }
}

export const geminiService = new GeminiService();
