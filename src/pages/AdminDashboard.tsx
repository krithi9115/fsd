import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI, AdminStats, AnalysisRecord, FeedbackRecord, UserData } from '../services/api.ts';
import {
  ShieldCheck,
  Users,
  FileText,
  MessageSquare,
  Trash2,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ThumbsUp,
  ThumbsDown,
  Loader2,
  Search,
  ArrowUpRight,
  TrendingUp,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<(UserData & { analysesCount: number })[]>([]);
  const [analyses, setAnalyses] = useState<AnalysisRecord[]>([]);
  const [feedback, setFeedback] = useState<FeedbackRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Tab state
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'analyses' | 'feedback'>('overview');

  // Deletion state
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [statsRes, usersRes, analysesRes, feedbackRes] = await Promise.all([
        adminAPI.getStats(),
        adminAPI.getUsers(),
        adminAPI.getAnalyses({ limit: 50 }),
        adminAPI.getFeedback(),
      ]);

      if (statsRes.data.success) setStats(statsRes.data.stats);
      if (usersRes.data.success) setUsers(usersRes.data.users);
      if (analysesRes.data.success) setAnalyses(analysesRes.data.data);
      if (feedbackRes.data.success) setFeedback(feedbackRes.data.feedback);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to retrieve administrative datasets.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleDeleteAnalysis = async (id: string) => {
    if (!confirm('Are you sure you want to delete this analysis record as an administrator?')) return;
    setDeletingId(id);
    try {
      const res = await adminAPI.deleteAnalysis(id);
      if (res.data.success) {
        setAnalyses(prev => prev.filter(a => a._id !== id));
        fetchAdminData();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete record.');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
        <p className="text-xs font-mono text-slate-400">Loading administrative control telemetry...</p>
      </div>
    );
  }

  const crediblePct =
    stats && stats.totalAnalyses > 0 ? Math.round((stats.credibleCount / stats.totalAnalyses) * 100) : 0;
  const verificationPct =
    stats && stats.totalAnalyses > 0 ? Math.round((stats.verificationCount / stats.totalAnalyses) * 100) : 0;
  const misleadingPct =
    stats && stats.totalAnalyses > 0 ? Math.round((stats.misleadingCount / stats.totalAnalyses) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-slate-900 border border-amber-900/40 p-6 sm:p-8 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-950 text-amber-400 border border-amber-800 text-xs font-mono uppercase font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Administrative Portal</span>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            System Moderation &amp; Telemetry
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Audit registered users, review all submitted analyses, track feedback accuracy, and moderate records.
          </p>
        </div>

        <div className="text-right">
          <span className="text-[11px] font-mono text-slate-500 block">Total Database Records</span>
          <span className="text-2xl font-black font-mono text-amber-400">
            {(stats?.totalAnalyses || 0) + (stats?.totalUsers || 0)}
          </span>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-300 text-xs">
          {error}
        </div>
      )}

      {/* Primary KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase">
            <span>Users</span>
            <Users className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">{stats?.totalUsers || 0}</div>
          <p className="text-[10px] text-slate-500">Accounts</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase">
            <span>Analyses</span>
            <FileText className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">{stats?.totalAnalyses || 0}</div>
          <p className="text-[10px] text-slate-500">Submissions</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase">
            <span className="text-emerald-400">Credible</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400">{stats?.credibleCount || 0}</div>
          <p className="text-[10px] text-slate-500">{crediblePct}% of total</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase">
            <span className="text-amber-400">Verify</span>
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-400">{stats?.verificationCount || 0}</div>
          <p className="text-[10px] text-slate-500">{verificationPct}% of total</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase">
            <span className="text-rose-400">Misleading</span>
            <XCircle className="w-3.5 h-3.5 text-rose-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-rose-400">{stats?.misleadingCount || 0}</div>
          <p className="text-[10px] text-slate-500">{misleadingPct}% of total</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase">
            <span>Feedback</span>
            <MessageSquare className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-purple-400">{stats?.totalFeedback || 0}</div>
          <p className="text-[10px] text-slate-500">{stats?.feedbackAccuracyRate || 0}% reported accurate</p>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="border-b border-slate-800 flex items-center space-x-2 text-xs font-medium">
        <button
          onClick={() => setActiveTab('overview')}
          className={`py-3 px-4 border-b-2 transition cursor-pointer ${
            activeTab === 'overview'
              ? 'border-amber-400 text-amber-300 font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          System Overview
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`py-3 px-4 border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'users'
              ? 'border-amber-400 text-amber-300 font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>User Directory ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('analyses')}
          className={`py-3 px-4 border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'analyses'
              ? 'border-amber-400 text-amber-300 font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>All Analyses ({analyses.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('feedback')}
          className={`py-3 px-4 border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'feedback'
              ? 'border-amber-400 text-amber-300 font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Feedback Stream ({feedback.length})</span>
        </button>
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white">Aggregated Prediction Distribution</h3>
            <p className="text-xs text-slate-400">
              System-wide classification distribution across all verifier submissions:
            </p>

            <div className="w-full h-4 rounded-full bg-slate-950 flex overflow-hidden border border-slate-800">
              <div
                className="bg-emerald-500 transition-all duration-700"
                style={{ width: `${crediblePct}%` }}
              />
              <div
                className="bg-amber-500 transition-all duration-700"
                style={{ width: `${verificationPct}%` }}
              />
              <div
                className="bg-rose-500 transition-all duration-700"
                style={{ width: `${misleadingPct}%` }}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                <span className="text-emerald-400 font-semibold">Likely Credible:</span>
                <span className="font-mono text-white font-bold">{stats?.credibleCount || 0}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                <span className="text-amber-400 font-semibold">Needs Verification:</span>
                <span className="font-mono text-white font-bold">{stats?.verificationCount || 0}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                <span className="text-rose-400 font-semibold">Potentially Misleading:</span>
                <span className="font-mono text-white font-bold">{stats?.misleadingCount || 0}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
              <h3 className="text-base font-bold text-white">Architecture &amp; Engine Status</h3>
              <ul className="text-xs text-slate-300 space-y-2">
                <li className="flex items-center justify-between">
                  <span className="text-slate-400">Database Engine:</span>
                  <span className="font-mono text-emerald-400">MongoDB / Mongoose</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-slate-400">Authentication:</span>
                  <span className="font-mono text-blue-400">JWT (HMAC-SHA256) + bcryptjs</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-slate-400">NLP Processor:</span>
                  <span className="font-mono text-cyan-400">Node.js Rule-Based Pipeline</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-slate-400">Client Runtime:</span>
                  <span className="font-mono text-purple-400">React.js 19 + Tailwind CSS</span>
                </li>
              </ul>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
              <h3 className="text-base font-bold text-white">Feedback Health Metric</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                User feedback evaluates rule calibration against subjective human editorial checks.
              </p>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-300">Accuracy Agreement:</span>
                <span className="font-mono font-bold text-amber-400 text-lg">
                  {stats?.feedbackAccuracyRate || 0}%
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Users */}
      {activeTab === 'users' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-semibold uppercase">
                  <th className="py-3.5 px-4 sm:px-6">Name</th>
                  <th className="py-3.5 px-4">Email</th>
                  <th className="py-3.5 px-4">Role</th>
                  <th className="py-3.5 px-4 font-mono">Analyses</th>
                  <th className="py-3.5 px-4">Joined Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-slate-800/30 transition">
                    <td className="py-3.5 px-4 sm:px-6 font-bold text-white">{u.name}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-300">{u.email}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                          u.role === 'admin'
                            ? 'bg-amber-950 text-amber-300 border border-amber-800'
                            : 'bg-blue-950 text-blue-300 border border-blue-800'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-100">
                      {u.analysesCount}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 font-mono">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Analyses */}
      {activeTab === 'analyses' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-semibold uppercase">
                  <th className="py-3.5 px-4 sm:px-6">Headline</th>
                  <th className="py-3.5 px-4">User</th>
                  <th className="py-3.5 px-4">Prediction</th>
                  <th className="py-3.5 px-4 font-mono">Score</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4 text-right">Moderation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {analyses.map(item => (
                  <tr key={item._id} className="hover:bg-slate-800/30 transition">
                    <td className="py-3.5 px-4 sm:px-6 max-w-sm">
                      <Link
                        to={`/analysis/${item._id}`}
                        className="font-bold text-white hover:text-blue-400 transition line-clamp-1"
                      >
                        {item.headline}
                      </Link>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">
                      {typeof item.userId === 'object' && item.userId !== null
                        ? (item.userId as any).name || 'User'
                        : 'User'}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-200">{item.prediction}</span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-100">
                      {item.credibilityScore} / 100
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 font-mono">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/analysis/${item._id}`}
                          className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-slate-800 rounded transition"
                          title="Open Details"
                        >
                          <ArrowUpRight className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDeleteAnalysis(item._id)}
                          disabled={deletingId === item._id}
                          className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded transition cursor-pointer"
                          title="Delete as Administrator"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Feedback */}
      {activeTab === 'feedback' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          {feedback.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">No user feedback logged yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-semibold uppercase">
                    <th className="py-3.5 px-4 sm:px-6">Verifier</th>
                    <th className="py-3.5 px-4">Article</th>
                    <th className="py-3.5 px-4">User Rating</th>
                    <th className="py-3.5 px-4">Comment</th>
                    <th className="py-3.5 px-4">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {feedback.map(fb => (
                    <tr key={fb._id} className="hover:bg-slate-800/30 transition">
                      <td className="py-3.5 px-4 sm:px-6 font-bold text-white whitespace-nowrap">
                        {typeof fb.userId === 'object' && fb.userId !== null
                          ? (fb.userId as any).name
                          : 'Verifier'}
                      </td>
                      <td className="py-3.5 px-4 max-w-xs truncate text-slate-300">
                        {typeof fb.analysisId === 'object' && fb.analysisId !== null
                          ? (fb.analysisId as any).headline
                          : 'Analysis'}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {fb.isAccurate ? (
                          <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
                            <ThumbsUp className="w-3.5 h-3.5" /> Accurate
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-rose-400 font-semibold">
                            <ThumbsDown className="w-3.5 h-3.5" /> Needs Adjustment
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 max-w-sm italic">
                        {fb.comment || 'No comment attached'}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 font-mono whitespace-nowrap">
                        {new Date(fb.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
