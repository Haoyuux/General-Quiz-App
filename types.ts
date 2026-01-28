
export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface QuizConfig {
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  count: number;
}

export type QuizStatus = 'idle' | 'loading' | 'playing' | 'review' | 'finished';

export interface UserAnswer {
  questionId: string;
  selectedOptionIndex: number;
  isCorrect: boolean;
}
