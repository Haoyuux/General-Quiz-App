
import React, { useEffect, useState } from 'react';
import { UserAnswer, Question } from '../types';
import { geminiService } from '../services/geminiService';

interface QuizResultsProps {
  answers: UserAnswer[];
  questions: Question[];
  topic: string;
  onRestart: () => void;
}

const QuizResults: React.FC<QuizResultsProps> = ({ answers, questions, topic, onRestart }) => {
  const [feedback, setFeedback] = useState('Generating feedback...');
  const correctCount = answers.filter(a => a.isCorrect).length;
  const scorePercentage = Math.round((correctCount / questions.length) * 100);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const text = await geminiService.getPerformanceFeedback(correctCount, questions.length, topic);
        setFeedback(text);
      } catch (err) {
        setFeedback("You did it! Check your results below.");
      }
    };
    fetchFeedback();
  }, [correctCount, questions.length, topic]);

  const getRank = () => {
    if (scorePercentage >= 90) return { title: 'Grandmaster', icon: 'fa-crown', color: 'text-yellow-400' };
    if (scorePercentage >= 70) return { title: 'Scholar', icon: 'fa-medal', color: 'text-blue-400' };
    if (scorePercentage >= 50) return { title: 'Apprentice', icon: 'fa-star', color: 'text-purple-400' };
    return { title: 'Novice', icon: 'fa-seedling', color: 'text-slate-400' };
  };

  const rank = getRank();

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in zoom-in duration-700">
      <div className="text-center space-y-4">
        <div className="inline-block relative">
          <svg className="w-48 h-48 -rotate-90">
            <circle cx="96" cy="96" r="88" fill="none" stroke="currentColor" strokeWidth="8" className="text-slate-800" />
            <circle 
              cx="96" cy="96" r="88" fill="none" stroke="currentColor" strokeWidth="8" 
              strokeDasharray={552}
              strokeDashoffset={552 - (552 * scorePercentage) / 100}
              strokeLinecap="round"
              className="text-blue-500 transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-5xl font-black">{scorePercentage}%</span>
            <span className="text-slate-400 text-sm font-bold uppercase tracking-widest">Score</span>
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-4xl font-bold flex items-center justify-center gap-3">
            <i className={`fa-solid ${rank.icon} ${rank.color}`}></i>
            {rank.title}
          </h2>
          <p className="text-slate-400 italic text-lg px-8">"{feedback}"</p>
        </div>
      </div>

      <div className="glass p-8 rounded-3xl space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-900/50 p-4 rounded-2xl text-center">
            <p className="text-slate-500 text-xs font-bold uppercase mb-1">Correct</p>
            <p className="text-3xl font-bold text-green-500">{correctCount}</p>
          </div>
          <div className="bg-slate-900/50 p-4 rounded-2xl text-center">
            <p className="text-slate-500 text-xs font-bold uppercase mb-1">Total</p>
            <p className="text-3xl font-bold text-slate-300">{questions.length}</p>
          </div>
        </div>

        <button 
          onClick={onRestart}
          className="w-full bg-white text-slate-950 py-4 rounded-2xl font-bold text-lg hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
        >
          <i className="fa-solid fa-rotate-right"></i>
          Try New Quiz
        </button>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-xl font-bold px-4">Review Your Answers</h3>
        <div className="space-y-3">
          {questions.map((q, idx) => {
            const answer = answers.find(a => a.questionId === q.id);
            return (
              <div key={idx} className={`p-4 rounded-2xl glass border-l-4 ${answer?.isCorrect ? 'border-l-green-500' : 'border-l-red-500'}`}>
                <p className="text-sm font-semibold mb-2">{idx + 1}. {q.question}</p>
                <div className="flex gap-2 items-center">
                  <span className={`text-xs px-2 py-1 rounded ${answer?.isCorrect ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    {answer?.isCorrect ? 'Correct' : 'Incorrect'}
                  </span>
                  {!answer?.isCorrect && (
                    <span className="text-xs text-slate-400">Answer: {q.options[q.correctAnswerIndex]}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default QuizResults;
