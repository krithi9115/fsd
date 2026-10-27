import React from 'react';
import {
  Flame,
  Zap,
  AlertOctagon,
  CaseUpper,
  Quote,
  FileText,
  HelpCircle,
} from 'lucide-react';

interface IndicatorCardProps {
  clickbaitScore: number;
  emotionalLanguageScore: number;
  suspiciousPhraseCount: number;
  capitalizationScore: number;
  punctuationScore: number;
  wordCount: number;
  characterCount: number;
}

export const IndicatorCard: React.FC<IndicatorCardProps> = ({
  clickbaitScore,
  emotionalLanguageScore,
  suspiciousPhraseCount,
  capitalizationScore,
  punctuationScore,
  wordCount,
  characterCount,
}) => {
  const getLevel = (score: number) => {
    if (score >= 60) return { label: 'High', color: 'text-rose-400', bar: 'bg-rose-500' };
    if (score >= 35) return { label: 'Moderate', color: 'text-amber-400', bar: 'bg-amber-500' };
    return { label: 'Low', color: 'text-emerald-400', bar: 'bg-emerald-500' };
  };

  const clickbaitLevel = getLevel(clickbaitScore);
  const emotionalLevel = getLevel(emotionalLanguageScore);
  const capitalizationLevel = getLevel(capitalizationScore);
  const punctuationLevel = getLevel(punctuationScore);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Clickbait Indicator */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-300 text-xs font-semibold uppercase tracking-wider">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Clickbait Indicator</span>
          </div>
          <span className={`text-xs font-mono font-bold ${clickbaitLevel.color}`}>
            {clickbaitLevel.label}
          </span>
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-2xl font-bold font-mono text-white">{clickbaitScore}</span>
          <span className="text-xs font-mono text-slate-500">/ 100</span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${clickbaitLevel.bar}`}
            style={{ width: `${clickbaitScore}%` }}
          />
        </div>
        <p className="text-[11px] text-slate-400">
          Headline curiosity gaps, sensational triggers &amp; hype patterns.
        </p>
      </div>

      {/* Emotional Language */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-300 text-xs font-semibold uppercase tracking-wider">
            <Flame className="w-4 h-4 text-rose-400" />
            <span>Emotional Language</span>
          </div>
          <span className={`text-xs font-mono font-bold ${emotionalLevel.color}`}>
            {emotionalLevel.label}
          </span>
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-2xl font-bold font-mono text-white">{emotionalLanguageScore}</span>
          <span className="text-xs font-mono text-slate-500">/ 100</span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${emotionalLevel.bar}`}
            style={{ width: `${emotionalLanguageScore}%` }}
          />
        </div>
        <p className="text-[11px] text-slate-400">
          Concentration of hyperbolic, fear-inducing, or outrage adjectives.
        </p>
      </div>

      {/* Suspicious Phrases */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-300 text-xs font-semibold uppercase tracking-wider">
            <AlertOctagon className="w-4 h-4 text-purple-400" />
            <span>Suspicious Phrases</span>
          </div>
          <span
            className={`text-xs font-mono font-bold ${
              suspiciousPhraseCount > 0 ? 'text-rose-400' : 'text-emerald-400'
            }`}
          >
            {suspiciousPhraseCount > 0 ? `${suspiciousPhraseCount} Detected` : 'None'}
          </span>
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-2xl font-bold font-mono text-white">{suspiciousPhraseCount}</span>
          <span className="text-xs font-mono text-slate-500">viral patterns</span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              suspiciousPhraseCount > 0 ? 'bg-purple-500' : 'bg-emerald-500'
            }`}
            style={{ width: `${Math.min(100, suspiciousPhraseCount * 33)}%` }}
          />
        </div>
        <p className="text-[11px] text-slate-400">
          Viral distribution requests ("share immediately", "censored truth").
        </p>
      </div>

      {/* Capitalization */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-300 text-xs font-semibold uppercase tracking-wider">
            <CaseUpper className="w-4 h-4 text-cyan-400" />
            <span>Capitalization Pattern</span>
          </div>
          <span className={`text-xs font-mono font-bold ${capitalizationLevel.color}`}>
            {capitalizationLevel.label}
          </span>
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-2xl font-bold font-mono text-white">{capitalizationScore}</span>
          <span className="text-xs font-mono text-slate-500">/ 100</span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${capitalizationLevel.bar}`}
            style={{ width: `${capitalizationScore}%` }}
          />
        </div>
        <p className="text-[11px] text-slate-400">
          Ratio of uppercase characters and non-acronym ALL CAPS emphasis.
        </p>
      </div>

      {/* Punctuation Pattern */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-300 text-xs font-semibold uppercase tracking-wider">
            <Quote className="w-4 h-4 text-blue-400" />
            <span>Punctuation Pattern</span>
          </div>
          <span className={`text-xs font-mono font-bold ${punctuationLevel.color}`}>
            {punctuationLevel.label}
          </span>
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-2xl font-bold font-mono text-white">{punctuationScore}</span>
          <span className="text-xs font-mono text-slate-500">/ 100</span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${punctuationLevel.bar}`}
            style={{ width: `${punctuationScore}%` }}
          />
        </div>
        <p className="text-[11px] text-slate-400">
          Excessive exclamations, question marks, and stacked (!? or !!!).
        </p>
      </div>

      {/* Text Corpus Volume */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-300 text-xs font-semibold uppercase tracking-wider">
            <FileText className="w-4 h-4 text-emerald-400" />
            <span>Text Volume</span>
          </div>
          <span className="text-xs font-mono font-bold text-slate-400">Corpus</span>
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-2xl font-bold font-mono text-white">{wordCount}</span>
          <span className="text-xs font-mono text-slate-500">words</span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
          <div
            className="h-full rounded-full bg-blue-500 transition-all duration-700"
            style={{ width: `${Math.min(100, (wordCount / 300) * 100)}%` }}
          />
        </div>
        <p className="text-[11px] text-slate-400">
          {characterCount} characters analyzed across headline and body.
        </p>
      </div>
    </div>
  );
};
