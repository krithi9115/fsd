import React from 'react';
import { ShieldAlert, BookOpen, Database, Server, Code, AlertTriangle } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 text-slate-400 py-10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Academic Limitation & Integrity Notice */}
        <div className="mb-8 p-4 rounded-xl bg-amber-950/20 border border-amber-800/40 text-amber-200/90 text-sm flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-amber-300 block mb-0.5">Automated Heuristic Limitation Notice</span>
            <p className="text-amber-200/80 text-xs sm:text-sm leading-relaxed">
              This system provides an automated linguistic credibility assessment. It does not establish the factual
              truth of an article. Users should independently verify important claims using reliable sources.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center space-x-2 text-slate-100 font-bold text-lg">
              <ShieldAlert className="w-6 h-6 text-blue-500" />
              <span>Misinformation Verification Platform</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-md">
              A full-stack MERN application dedicated to automated news credibility scoring, linguistic indicator
              detection, clickbait profiling, and open transparent verification guidance.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs font-mono text-slate-400">
              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 flex items-center gap-1">
                <Database className="w-3 h-3 text-emerald-400" /> MongoDB
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 flex items-center gap-1">
                <Server className="w-3 h-3 text-cyan-400" /> Express.js
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 flex items-center gap-1">
                <Code className="w-3 h-3 text-blue-400" /> React.js
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 flex items-center gap-1">
                <BookOpen className="w-3 h-3 text-violet-400" /> Node.js NLP Engine
              </span>
            </div>
          </div>

          {/* Core Modules */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-3">Linguistic Indicators</h4>
            <ul className="text-xs space-y-2">
              <li className="hover:text-slate-300">Clickbait Pattern Matching</li>
              <li className="hover:text-slate-300">Sensational &amp; Emotional Wording</li>
              <li className="hover:text-slate-300">Orthographic Capitalization</li>
              <li className="hover:text-slate-300">Punctuation Clustering (!, ?, repeated)</li>
              <li className="hover:text-slate-300">Lexicon Polarity Sentiment</li>
              <li className="hover:text-slate-300">Source Attribution Verification</li>
            </ul>
          </div>

          {/* Academic References */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-3">Classification Bounds</h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-1.5 rounded bg-slate-900 border border-slate-800">
                <span className="text-emerald-400 font-medium">Likely Credible</span>
                <span className="font-mono text-slate-400">80 – 100</span>
              </div>
              <div className="flex items-center justify-between p-1.5 rounded bg-slate-900 border border-slate-800">
                <span className="text-amber-400 font-medium">Needs Verification</span>
                <span className="font-mono text-slate-400">50 – 79</span>
              </div>
              <div className="flex items-center justify-between p-1.5 rounded bg-slate-900 border border-slate-800">
                <span className="text-rose-400 font-medium">Potentially Misleading</span>
                <span className="font-mono text-slate-400">0 – 49</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} News Credibility &amp; Misinformation Verification Platform (MERN Architecture).</p>
          <p className="mt-2 sm:mt-0 font-mono">Academic Project Demonstration</p>
        </div>
      </div>
    </footer>
  );
};
