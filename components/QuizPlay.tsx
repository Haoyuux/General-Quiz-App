
import React, { useState, useEffect } from 'react';
import { Question, UserAnswer } from '../types';
import ProgressBar from './ProgressBar';

interface QuizPlayProps {
  questions: Question[];
  onFinish: (answers: UserAnswer[]) => void;
}

const QuizPlay: React.FC<QuizPlayProps> = ({ questions, onFinish }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [answers, setAnswers] = useState<UserAnswer[]>([]);
  const [timeLeft, setTimeLeft] = useState(30);

  const currentQuestion = questions[currentIndex];

  useEffect(() => {
    if (isAnswered) return;
    
    if (timeLeft === 0) {
      handleAnswer(-1); // Auto-fail on timeout
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isAnswered]);

  const handleAnswer = (optionIndex: number) => {
    if (isAnswered) return;

    setSelectedOption(optionIndex);
    setIsAnswered(true);

    const isCorrect = optionIndex === currentQuestion.correctAnswerIndex;
    const newAnswer: UserAnswer = {
      questionId: currentQuestion.id,
      selectedOptionIndex: optionIndex,
      isCorrect
    };

    setAnswers((prev) => [...prev, newAnswer]);
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setTimeLeft(30);
    } else {
      onFinish(answers);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex justify-between items-end mb-2">
        <div className="space-y-1">
          <p className="text-slate-400 text-sm font-medium uppercase tracking-widest">Question {currentIndex + 1} of {questions.length}</p>
          <h2 className="text-2xl font-bold leading-tight">{currentQuestion.question}</h2>
        </div>
        <div className={`w-14 h-14 rounded-full border-4 flex items-center justify-center font-bold text-xl transition-colors ${
          timeLeft <= 5 ? 'border-red-500 text-red-500 animate-pulse' : 'border-blue-500 text-blue-400'
        }`}>
          {timeLeft}
        </div>
      </div>

      <ProgressBar current={currentIndex + 1} total={questions.length} />

      <div className="grid grid-cols-1 gap-4">
        {currentQuestion.options.map((option, idx) => {
          let stateStyles = "border-slate-700 hover:border-slate-500 bg-slate-800/50";
          if (isAnswered) {
            if (idx === currentQuestion.correctAnswerIndex) {
              stateStyles = "border-green-500 bg-green-500/20 text-green-400";
            } else if (idx === selectedOption) {
              stateStyles = "border-red-500 bg-red-500/20 text-red-400";
            } else {
              stateStyles = "border-slate-800 bg-slate-900/30 text-slate-600 opacity-50";
            }
          }

          return (
            <button
              key={idx}
              onClick={() => handleAnswer(idx)}
              disabled={isAnswered}
              className={`p-5 rounded-2xl border text-left transition-all text-lg font-medium relative overflow-hidden group ${stateStyles}`}
            >
              <div className="flex items-center gap-4 relative z-10">
                <span className={`w-8 h-8 rounded-lg flex items-center justify-center border text-sm ${
                  isAnswered && idx === currentQuestion.correctAnswerIndex ? 'bg-green-500 border-green-500 text-white' : 'border-slate-600 bg-slate-900'
                }`}>
                  {String.fromCharCode(65 + idx)}
                </span>
                {option}
              </div>
            </button>
          );
        })}
      </div>

      {isAnswered && (
        <div className="animate-in slide-in-from-bottom duration-500 space-y-4">
          <div className="glass p-6 rounded-2xl border-l-4 border-l-blue-500">
            <h4 className="text-blue-400 font-bold mb-1 flex items-center gap-2">
              <i className="fa-solid fa-lightbulb"></i> Explanation
            </h4>
            <p className="text-slate-300 leading-relaxed">{currentQuestion.explanation}</p>
          </div>
          
          <button 
            onClick={nextQuestion}
            className="w-full bg-slate-700 hover:bg-slate-600 py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2"
          >
            {currentIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
            <i className="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizPlay;
