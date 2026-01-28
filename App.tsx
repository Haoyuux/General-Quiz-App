
import React, { useState } from 'react';
import QuizSetup from './components/QuizSetup';
import QuizPlay from './components/QuizPlay';
import QuizResults from './components/QuizResults';
import { QuizConfig, Question, QuizStatus, UserAnswer } from './types';
import { geminiService } from './services/geminiService';

const App: React.FC = () => {
  const [status, setStatus] = useState<QuizStatus>('idle');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [config, setConfig] = useState<QuizConfig | null>(null);
  const [answers, setAnswers] = useState<UserAnswer[]>([]);
  const [error, setError] = useState<string | null>(null);

  const startQuiz = async (quizConfig: QuizConfig) => {
    setStatus('loading');
    setConfig(quizConfig);
    setError(null);
    try {
      const generatedQuestions = await geminiService.generateQuiz(quizConfig);
      if (generatedQuestions.length === 0) throw new Error("No questions returned.");
      setQuestions(generatedQuestions);
      setStatus('playing');
    } catch (err: any) {
      console.error(err);
      setError("Failed to generate quiz. Please try a different topic or try again.");
      setStatus('idle');
    }
  };

  const handleQuizFinish = (quizAnswers: UserAnswer[]) => {
    setAnswers(quizAnswers);
    setStatus('finished');
  };

  const resetQuiz = () => {
    setStatus('idle');
    setQuestions([]);
    setConfig(null);
    setAnswers([]);
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col p-4 md:p-8 overflow-x-hidden">
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/10 blur-[120px] rounded-full"></div>
      </div>

      <header className="flex justify-between items-center max-w-7xl mx-auto w-full mb-12">
        <div className="flex items-center gap-3 group cursor-pointer" onClick={resetQuiz}>
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform">
            <i className="fa-solid fa-bolt-lightning text-white"></i>
          </div>
          <span className="font-black text-2xl tracking-tight hidden sm:inline">GenQuiz AI</span>
        </div>
        
        {status === 'playing' && (
          <div className="glass px-4 py-2 rounded-full border border-slate-700">
            <span className="text-slate-400 text-sm font-bold tracking-widest uppercase">
              Topic: <span className="text-white">{config?.topic}</span>
            </span>
          </div>
        )}
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto py-4">
        {error && (
          <div className="max-w-md mx-auto mb-8 bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-xl flex items-center gap-3 animate-in slide-in-from-top duration-300">
            <i className="fa-solid fa-circle-exclamation"></i>
            <p className="text-sm font-medium">{error}</p>
            <button onClick={() => setError(null)} className="ml-auto opacity-70 hover:opacity-100">
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
        )}

        {status === 'idle' && <QuizSetup onStart={startQuiz} />}

        {status === 'loading' && (
          <div className="flex flex-col items-center justify-center py-20 space-y-8">
            <div className="relative">
              <div className="w-24 h-24 border-4 border-slate-800 rounded-full"></div>
              <div className="absolute inset-0 w-24 h-24 border-4 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-bold animate-pulse">Consulting the AI...</h3>
              <p className="text-slate-400">Synthesizing questions for "{config?.topic}"</p>
            </div>
          </div>
        )}

        {status === 'playing' && questions.length > 0 && (
          <QuizPlay 
            questions={questions} 
            onFinish={handleQuizFinish} 
          />
        )}

        {status === 'finished' && config && (
          <QuizResults 
            answers={answers} 
            questions={questions} 
            topic={config.topic}
            onRestart={resetQuiz}
          />
        )}
      </main>

      <footer className="max-w-7xl mx-auto w-full py-8 text-center border-t border-slate-800/50 mt-12">
        <p className="text-slate-500 text-xs">Powered by Gemini 3 Flash &copy; 2024 GenQuiz AI. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;
