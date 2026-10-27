import React from 'react';
import { Smile, Frown, Minus, BarChart3 } from 'lucide-react';

interface SentimentCardProps {
  sentiment: 'Positive' | 'Negative' | 'Neutral';
  score: number;
}

export const SentimentCard: React.FC<SentimentCardProps> = ({ sentiment, score }) => {
  const getConfig = () => {
    switch (sentiment) {
      case 'Positive':
        return {
          icon: <Smile className="w-6 h-6 text-emerald-400" />,
          textColor: 'text-emerald-400',
          badgeBg: 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60',
          desc: 'Tone predominantly features constructive, affirmative or corroborative terminology.',
        };
      case 'Negative':
        return {
          icon: <Frown className="w-6 h-6 text-rose-400" />,
          textColor: 'text-rose-400',
          badgeBg: 'bg-rose-950/60 text-rose-300 border-rose-800/60',
          desc: 'Tone contains heightened frequency of conflict, threat, or accusatory vocabulary.',
        };
      case 'Neutral':
      default:
        return {
          icon: <Minus className="w-6 h-6 text-blue-400" />,
          textColor: 'text-blue-400',
          badgeBg: 'bg-blue-950/60 text-blue-300 border-blue-800/60',
          desc: 'Balanced sentiment profile typical of factual reporting or neutral summaries.',
        };
    }
  };

  const config = getConfig();

  // Normalize score from -1.0..+1.0 to 0%..100% for progress bar
  const sliderPosition = Math.min(100, Math.max(0, ((score + 1) / 2) * 100));

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-300 font-semibold text-sm">
          <BarChart3 className="w-4 h-4 text-blue-400" />
          <span>Linguistic Sentiment Polarity</span>
        </div>
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${config.badgeBg}`}>
          {sentiment}
        </span>
      </div>

      <div className="flex items-center gap-4">
        <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
          {config.icon}
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-baseline mb-1">
            <span className="text-xs text-slate-400">Lexicon Polarity Score</span>
            <span className="font-mono text-sm font-bold text-white">
              {score > 0 ? `+${score}` : score}
            </span>
          </div>
          {/* Sentiment Axis slider */}
          <div className="relative w-full h-2 rounded-full bg-slate-800 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-rose-500 via-blue-400 to-emerald-500 opacity-60"></div>
            <div
              className="absolute top-0 bottom-0 w-2 bg-white rounded-full shadow ring-2 ring-slate-900 transform -translate-x-1/2"
              style={{ left: `${sliderPosition}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
            <span>Negative (-1.0)</span>
            <span>Neutral (0.0)</span>
            <span>Positive (+1.0)</span>
          </div>
        </div>
      </div>

      <p className="text-xs text-slate-400 leading-relaxed border-t border-slate-800/80 pt-3">
        {config.desc}
      </p>
    </div>
  );
};
