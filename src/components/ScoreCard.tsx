import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Shield, Info } from 'lucide-react';

interface ScoreCardProps {
  score: number;
  prediction: 'Likely Credible' | 'Needs Verification' | 'Potentially Misleading';
  confidenceScore: number;
}

export const ScoreCard: React.FC<ScoreCardProps> = ({ score, prediction, confidenceScore }) => {
  const getBadgeConfig = () => {
    switch (prediction) {
      case 'Likely Credible':
        return {
          icon: <CheckCircle2 className="w-8 h-8 text-emerald-400" />,
          colorText: 'text-emerald-400',
          bgGradient: 'from-emerald-950/40 via-slate-900 to-slate-900',
          borderColor: 'border-emerald-600/40',
          ringColor: 'stroke-emerald-500',
          pillBg: 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60',
          label: 'Likely Credible',
          description: 'Linguistic heuristics reflect high objective neutrality and standard reporting conventions.',
        };
      case 'Needs Verification':
        return {
          icon: <AlertTriangle className="w-8 h-8 text-amber-400" />,
          colorText: 'text-amber-400',
          bgGradient: 'from-amber-950/40 via-slate-900 to-slate-900',
          borderColor: 'border-amber-600/40',
          ringColor: 'stroke-amber-500',
          pillBg: 'bg-amber-950/80 text-amber-300 border-amber-700/60',
          label: 'Needs Verification',
          description: 'Contains mixed indicators or sensational traits that necessitate independent corroboration.',
        };
      case 'Potentially Misleading':
      default:
        return {
          icon: <XCircle className="w-8 h-8 text-rose-400" />,
          colorText: 'text-rose-400',
          bgGradient: 'from-rose-950/40 via-slate-900 to-slate-900',
          borderColor: 'border-rose-600/40',
          ringColor: 'stroke-rose-500',
          pillBg: 'bg-rose-950/80 text-rose-300 border-rose-700/60',
          label: 'Potentially Misleading',
          description: 'High concentration of clickbait phrasing, emotional manipulation, or viral rhetoric detected.',
        };
    }
  };

  const config = getBadgeConfig();
  const circumference = 2 * Math.PI * 46;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border ${config.borderColor} bg-gradient-to-br ${config.bgGradient} p-6 sm:p-8 shadow-xl transition-all`}
    >
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left: Classification & Assessment */}
        <div className="space-y-4 text-center md:text-left flex-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase border font-mono shadow-sm">
            <Shield className="w-3.5 h-3.5" />
            <span>Automated Credibility Assessment</span>
          </div>

          <div>
            <div className="flex items-center justify-center md:justify-start gap-3">
              {config.icon}
              <h2 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${config.colorText}`}>
                {config.label}
              </h2>
            </div>
            <p className="text-sm text-slate-300 mt-2 max-w-lg leading-relaxed">
              {config.description}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
            <div className="px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
              <span className="text-slate-400">Signal Confidence:</span>
              <span className="font-mono font-bold text-blue-400">{confidenceScore}%</span>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-slate-400 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-slate-400" />
              <span>Multi-signal linguistic index</span>
            </div>
          </div>
        </div>

        {/* Right: Circular Score Gauge */}
        <div className="relative shrink-0 flex flex-col items-center">
          <div className="relative w-36 h-36 flex items-center justify-center">
            {/* Background SVG Ring */}
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="46"
                className="stroke-slate-800"
                strokeWidth="7"
                fill="none"
              />
              <circle
                cx="50"
                cy="50"
                r="46"
                className={`${config.ringColor} transition-all duration-1000 ease-out`}
                strokeWidth="7"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="none"
              />
            </svg>
            {/* Score Text in Center */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-black tracking-tight text-white font-mono">
                {score}
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 font-mono">
                / 100
              </span>
            </div>
          </div>
          <span className="mt-2 text-xs font-mono font-semibold uppercase tracking-wider text-slate-400">
            Credibility Index
          </span>
        </div>
      </div>
    </div>
  );
};
