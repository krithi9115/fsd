import React, { useEffect, useState } from 'react';
import { ShieldAlert, Cpu, Sparkles, CheckCircle2, Search } from 'lucide-react';

interface LoadingSpinnerProps {
  headline?: string;
}

const STEPS = [
  'Tokenizing article & calculating sentence metrics...',
  'Scanning headline for clickbait and sensational patterns...',
  'Evaluating emotional language density and lexicon polarity...',
  'Analyzing orthographic capitalization & punctuation anomalies...',
  'Verifying source attribution and reference domain...',
  'Synthesizing multi-factor credibility score & verification guidance...',
];

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ headline }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStepIndex(prev => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, 700);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="py-12 px-6 max-w-xl mx-auto text-center space-y-6 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-2xl backdrop-blur-sm">
      <div className="relative w-20 h-20 mx-auto">
        <div className="absolute inset-0 rounded-full border-4 border-blue-500/20 animate-ping"></div>
        <div className="w-20 h-20 rounded-full border-4 border-t-blue-500 border-r-blue-400 border-b-transparent border-l-transparent animate-spin flex items-center justify-center bg-slate-950">
          <Cpu className="w-8 h-8 text-blue-400 animate-pulse" />
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-xl font-bold text-white tracking-tight flex items-center justify-center gap-2">
          <span>Analyzing Content</span>
          <span className="inline-block w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
        </h3>
        {headline && (
          <p className="text-xs text-slate-400 italic line-clamp-1 max-w-md mx-auto">
            "{headline}"
          </p>
        )}
      </div>

      {/* Dynamic step checklist */}
      <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-800/80 text-left space-y-2.5 max-w-md mx-auto">
        {STEPS.map((step, idx) => {
          const isDone = idx < currentStepIndex;
          const isCurrent = idx === currentStepIndex;

          return (
            <div
              key={idx}
              className={`flex items-center gap-3 text-xs transition-opacity duration-300 ${
                isCurrent
                  ? 'text-blue-400 font-semibold'
                  : isDone
                  ? 'text-slate-400 line-through opacity-70'
                  : 'text-slate-600 opacity-40'
              }`}
            >
              {isDone ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : isCurrent ? (
                <div className="w-4 h-4 rounded-full border-2 border-blue-400 border-t-transparent animate-spin shrink-0" />
              ) : (
                <div className="w-4 h-4 rounded-full border border-slate-700 shrink-0" />
              )}
              <span className="truncate">{step}</span>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-slate-500 font-mono">
        Executing Node.js Linguistic Rule Pipeline • MERN Stack
      </p>
    </div>
  );
};
