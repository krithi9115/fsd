import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.ts';
import {
  ShieldAlert,
  Search,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Flame,
  Scale,
  ArrowRight,
  Database,
  Server,
  Code2,
  FileCheck,
  Users,
  Compass,
} from 'lucide-react';

export const Home: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24 border-b border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(59,130,246,0.15),rgba(255,255,255,0))]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-950/80 border border-blue-800 text-blue-300 font-mono shadow-inner">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
            <span>MERN Full-Stack • Node.js Linguistic Rule Pipeline</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white max-w-4xl mx-auto leading-tight sm:leading-tight">
            Misinformation Verification &amp;{' '}
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">
              News Credibility
            </span>{' '}
            Platform
          </h1>

          <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            An automated, rule-based natural language processing system that evaluates journalistic content,
            identifies clickbait heuristics, detects sensational framing, and yields transparent credibility guidance.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to={isAuthenticated ? '/verify' : '/register'}
              className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-base rounded-xl shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <Search className="w-5 h-5" />
              <span>Verify News Content</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>

            <Link
              to={isAuthenticated ? '/dashboard' : '/login'}
              className="w-full sm:w-auto px-8 py-4 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-base rounded-xl flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <span>{isAuthenticated ? 'Open Dashboard' : 'Sign In to Platform'}</span>
            </Link>
          </div>

          {/* Academic Transparency Callout */}
          <div className="pt-6">
            <p className="text-xs text-slate-400 max-w-xl mx-auto italic">
              "This platform computes linguistic credibility indicators to assist human verification.
              It does not declare absolute factual truth; always compare claims against primary sources."
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <h2 className="text-xs font-mono uppercase tracking-widest text-blue-400 font-semibold">
            System Workflow
          </h2>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
            From Raw News Text to Multi-Factor Analysis
          </h3>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            Our pipeline executes transparent algorithmic checks on sentence structure, lexical indicators, and source metadata.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-3 relative group hover:border-blue-500/50 transition">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-mono font-bold">
              01
            </div>
            <h4 className="text-base font-bold text-white">Input Submission</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Submit any headline and article excerpt, with optional source URL attribution.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-3 relative group hover:border-blue-500/50 transition">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-mono font-bold">
              02
            </div>
            <h4 className="text-base font-bold text-white">NLP Engine Analysis</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Node.js scans clickbait patterns, emotional adjectives, punctuation anomalies, and sentiment polarity.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-3 relative group hover:border-blue-500/50 transition">
            <div className="w-10 h-10 rounded-xl bg-cyan-600/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-mono font-bold">
              03
            </div>
            <h4 className="text-base font-bold text-white">Scoring &amp; Category</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Synthesizes a credibility index (0–100) and categorizes as Credible, Needs Verification, or Misleading.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-3 relative group hover:border-blue-500/50 transition">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-mono font-bold">
              04
            </div>
            <h4 className="text-base font-bold text-white">Actionable Guidance</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Generates context explanations, specific warnings, and step-by-step verification recommendations.
            </p>
          </div>
        </div>
      </section>

      {/* Key Features & Indicators */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <h2 className="text-xs font-mono uppercase tracking-widest text-blue-400 font-semibold">
            Diagnostic Indicators
          </h2>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
            Comprehensive Linguistic Signals
          </h3>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            Instead of opaque black-box outputs, VeriNews surfaces every diagnostic factor influencing the score.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-3">
            <div className="p-3 w-fit rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Zap className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-white">Clickbait Pattern Recognition</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Detects curiosity hooks, forward-referencing phrases ("You won't believe", "Number 5 will surprise you"),
              and sensational rhetorical questions.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-3">
            <div className="p-3 w-fit rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <Flame className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-white">Emotional &amp; Outrage Quantification</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Measures the density of hyperbolic alarmist adjectives ("shocking", "disaster", "horrifying", "miracle")
              against standard neutral journalistic registers.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-3">
            <div className="p-3 w-fit rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-white">Viral Distribution Triggers</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Scans for conspiratorial urgency phrases such as "share immediately", "censored by the media",
              and "they don't want you to know".
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-3">
            <div className="p-3 w-fit rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <FileCheck className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-white">Orthographic Punctuation &amp; Caps</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Analyzes uppercase character ratios, ALL CAPS shouting tokens, and stacked punctuation marks
              (such as "?!" or "!!!").
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-3">
            <div className="p-3 w-fit rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Scale className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-white">Lexicon Sentiment Polarity</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Calculates positive vs negative polarity distribution from -1.00 to +1.00 to evaluate neutrality and tone.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-3">
            <div className="p-3 w-fit rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Compass className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-white">Source Attribution Inspection</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Extracts hostname and protocol from submitted references to highlight whether primary documentation is included.
            </p>
          </div>
        </div>
      </section>

      {/* Demo Credentials Quick Switcher for Reviewers */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xl">
          <div className="flex items-center gap-3">
            <Users className="w-6 h-6 text-blue-400" />
            <div>
              <h3 className="text-base font-bold text-white">Pre-Configured Demo Accounts</h3>
              <p className="text-xs text-slate-400">
                Instantly explore normal user and administrative role workflows:
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-200">Administrator Account</span>
                <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 font-mono text-[10px]">
                  role: admin
                </span>
              </div>
              <p className="text-slate-400 font-mono">Email: admin@credibility.org</p>
              <p className="text-slate-400 font-mono">Password: AdminPass123!</p>
              <p className="text-[11px] text-slate-500 pt-1">
                Full access to Admin Statistics, user directory, system-wide audits &amp; moderation.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-200">Standard Verifier Account</span>
                <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 font-mono text-[10px]">
                  role: user
                </span>
              </div>
              <p className="text-slate-400 font-mono">Email: jane.doe@university.edu</p>
              <p className="text-slate-400 font-mono">Password: UserPass123!</p>
              <p className="text-[11px] text-slate-500 pt-1">
                Personal news verification, history logs, feedback submission &amp; analytics dashboard.
              </p>
            </div>
          </div>

          <div className="text-center pt-2">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300"
            >
              <span>Click here to go to the Login Page</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
