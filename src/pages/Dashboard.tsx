import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.ts';
import { dashboardAPI, DashboardStats } from '../services/api.ts';
import { AnalysisCard } from '../components/AnalysisCard.tsx';
import {
  FileText,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Search,
  History,
  TrendingUp,
  Percent,
  Sparkles,
  Loader2,
  ArrowRight,
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await dashboardAPI.getStats();
      if (res.data.success) {
        setStats(res.data.stats);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load dashboard metrics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        <p className="text-sm font-mono text-slate-400">Loading analysis telemetry...</p>
      </div>
    );
  }

  const crediblePct =
    stats && stats.totalAnalyses > 0
      ? Math.round((stats.credibleCount / stats.totalAnalyses) * 100)
      : 0;
  const verificationPct =
    stats && stats.totalAnalyses > 0
      ? Math.round((stats.verificationCount / stats.totalAnalyses) * 100)
      : 0;
  const misleadingPct =
    stats && stats.totalAnalyses > 0
      ? Math.round((stats.misleadingCount / stats.totalAnalyses) * 100)
      : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-2xl shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-blue-400 font-semibold">
              Verifier Overview
            </span>
            <span className="px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-[10px] font-mono text-slate-300">
              Role: {user?.role}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Welcome back, {user?.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Monitor news verification heuristics, view past analyses, or submit a new article for assessment.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/verify"
            className="px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold text-sm shadow-md shadow-blue-500/20 flex items-center gap-2 transition cursor-pointer"
          >
            <Search className="w-4 h-4" />
            <span>Analyze News</span>
          </Link>
          <Link
            to="/history"
            className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium text-sm border border-slate-700 flex items-center gap-2 transition cursor-pointer"
          >
            <History className="w-4 h-4" />
            <span>History</span>
          </Link>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-300 text-xs">
          {error}
        </div>
      )}

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Analyzed */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span>Total Analyses</span>
            <FileText className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-white">
            {stats?.totalAnalyses || 0}
          </div>
          <p className="text-[11px] text-slate-500">
            Articles evaluated across your account
          </p>
        </div>

        {/* Likely Credible */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span className="text-emerald-400">Likely Credible</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold font-mono text-emerald-400">
              {stats?.credibleCount || 0}
            </span>
            <span className="text-xs font-mono text-emerald-500/80 font-bold">{crediblePct}%</span>
          </div>
          <p className="text-[11px] text-slate-500">
            Credibility score 80–100 with low sensationalism
          </p>
        </div>

        {/* Needs Verification */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span className="text-amber-400">Needs Verification</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold font-mono text-amber-400">
              {stats?.verificationCount || 0}
            </span>
            <span className="text-xs font-mono text-amber-500/80 font-bold">{verificationPct}%</span>
          </div>
          <p className="text-[11px] text-slate-500">
            Score 50–79 with mixed or ambiguous indicators
          </p>
        </div>

        {/* Potentially Misleading */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span className="text-rose-400">Misleading</span>
            <XCircle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold font-mono text-rose-400">
              {stats?.misleadingCount || 0}
            </span>
            <span className="text-xs font-mono text-rose-500/80 font-bold">{misleadingPct}%</span>
          </div>
          <p className="text-[11px] text-slate-500">
            Score 0–49 with high clickbait / emotional rhetoric
          </p>
        </div>
      </div>

      {/* Visual Distribution & Heuristic Averages */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Breakdown Progress & Chart */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Analysis Overview &amp; Distribution</h3>
              <p className="text-xs text-slate-400">
                Classification breakdown across all submitted articles
              </p>
            </div>
            <div className="text-right font-mono text-xs">
              <span className="text-slate-400">Mean Score: </span>
              <span className="font-bold text-blue-400 text-sm">
                {stats?.averageScore || 0}/100
              </span>
            </div>
          </div>

          {/* Segmented Progress Bar */}
          <div className="space-y-2">
            <div className="w-full h-4 rounded-full bg-slate-950 flex overflow-hidden border border-slate-800">
              <div
                className="bg-emerald-500 transition-all duration-700"
                style={{ width: `${crediblePct}%` }}
                title={`Likely Credible: ${stats?.credibleCount || 0}`}
              />
              <div
                className="bg-amber-500 transition-all duration-700"
                style={{ width: `${verificationPct}%` }}
                title={`Needs Verification: ${stats?.verificationCount || 0}`}
              />
              <div
                className="bg-rose-500 transition-all duration-700"
                style={{ width: `${misleadingPct}%` }}
                title={`Potentially Misleading: ${stats?.misleadingCount || 0}`}
              />
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs pt-2">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-slate-300">Credible</span>
                </div>
                <span className="font-mono font-bold text-emerald-400">
                  {stats?.credibleCount || 0}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <span className="text-slate-300">Verify</span>
                </div>
                <span className="font-mono font-bold text-amber-400">
                  {stats?.verificationCount || 0}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500" />
                  <span className="text-slate-300">Misleading</span>
                </div>
                <span className="font-mono font-bold text-rose-400">
                  {stats?.misleadingCount || 0}
                </span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">Average NLP Confidence Calibration:</span>
            <span className="font-mono font-bold text-blue-400">
              {stats?.averageConfidence || 0}% Signal Strength
            </span>
          </div>
        </div>

        {/* Quick Action & Guidance Panel */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-sm flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Verification Best Practices</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              When encountering articles flagged with low scores:
            </p>
            <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside">
              <li>Check if credible wire services (Reuters, AP) corroborate the central claim.</li>
              <li>Inspect whether primary quotes link to verified audio, video, or official records.</li>
              <li>Examine if the author has established subject-matter domain expertise.</li>
            </ul>
          </div>

          <Link
            to="/verify"
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold text-xs text-center flex items-center justify-center gap-2 transition"
          >
            <span>Analyze New Article</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Recent Analyses List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">Recent Analyses</h2>
            <p className="text-xs text-slate-400">
              Latest articles analyzed on this account
            </p>
          </div>
          <Link
            to="/history"
            className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"
          >
            <span>View All History</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {stats?.recentAnalyses && stats.recentAnalyses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stats.recentAnalyses.map(analysis => (
              <AnalysisCard
                key={analysis._id}
                analysis={analysis}
                showDelete={false}
              />
            ))}
          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-4">
            <div className="w-12 h-12 rounded-xl bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">No analyses recorded yet</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Submit your first news article or headline to review linguistic indicators and credibility scoring.
            </p>
            <Link
              to="/verify"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl"
            >
              <Search className="w-4 h-4" />
              <span>Verify First Article</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
