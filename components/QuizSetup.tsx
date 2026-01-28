
import React, { useState } from 'react';
import { QuizConfig } from '../types';

interface QuizSetupProps {
  onStart: (config: QuizConfig) => void;
}

const PRESET_TOPICS = [
  { name: 'JavaScript', icon: 'fa-brands fa-js' },
  { name: 'Space Exploration', icon: 'fa-solid fa-rocket' },
  { name: 'World History', icon: 'fa-solid fa-monument' },
  { name: 'Animal Kingdom', icon: 'fa-solid fa-paw' },
  { name: 'Pop Culture', icon: 'fa-solid fa-music' },
  { name: 'Artificial Intelligence', icon: 'fa-solid fa-brain' }
];

const QuizSetup: React.FC<QuizSetupProps> = ({ onStart }) => {
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [count, setCount] = useState(5);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;
    onStart({ topic, difficulty, count });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-700">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-extrabold tracking-tight">
          GenQuiz <span className="gradient-text">AI</span>
        </h1>
        <p className="text-slate-400 text-lg">Challenge yourself with quizzes generated in seconds.</p>
      </div>

      <div className="glass p-8 rounded-3xl shadow-2xl border border-slate-700/50">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Quiz Topic</label>
            <input 
              type="text"
              placeholder="e.g. Ancient Rome, Quantum Physics, Taylor Swift..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
              required
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {PRESET_TOPICS.map((t) => (
              <button
                key={t.name}
                type="button"
                onClick={() => setTopic(t.name)}
                className={`p-4 rounded-xl border transition-all flex flex-col items-center gap-2 hover:scale-105 ${
                  topic === t.name 
                    ? 'bg-blue-600/20 border-blue-500 text-blue-400' 
                    : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-500'
                }`}
              >
                <i className={`${t.icon} text-xl`}></i>
                <span className="text-xs font-medium">{t.name}</span>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Difficulty</label>
              <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-700">
                {(['easy', 'medium', 'hard'] as const).map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDifficulty(d)}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                      difficulty === d ? 'bg-slate-800 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Questions: {count}</label>
              <input 
                type="range"
                min="3"
                max="15"
                value={count}
                onChange={(e) => setCount(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 py-4 rounded-xl font-bold text-lg shadow-xl shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            Generate Quiz
          </button>
        </form>
      </div>
    </div>
  );
};

export default QuizSetup;
