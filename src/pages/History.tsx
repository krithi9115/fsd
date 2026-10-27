import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { analysisAPI, AnalysisRecord } from '../services/api.ts';
import { Pagination } from '../components/Pagination.tsx';
import {
  History as HistoryIcon,
  Search,
  Filter,
  Trash2,
  ExternalLink,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Loader2,
  ArrowUpRight,
} from 'lucide-react';

const CATEGORIES = ['All', 'Likely Credible', 'Needs Verification', 'Potentially Misleading'];

export const History: React.FC = () => {
  const [analyses, setAnalyses] = useState<AnalysisRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter & Search states
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    totalItems: 0,
    totalPages: 1,
    currentPage: 1,
    limit: 10,
  });

  // Delete state
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await analysisAPI.getHistory({
        page,
        limit: 10,
        prediction: selectedCategory !== 'All' ? selectedCategory : undefined,
        search: searchQuery.trim() || undefined,
      });

      if (res.data.success) {
        setAnalyses(res.data.data);
        setPagination(res.data.pagination);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to retrieve analysis history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [page, selectedCategory]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchHistory();
  };

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    try {
      const res = await analysisAPI.delete(id);
      if (res.data.success) {
        setAnalyses(prev => prev.filter(item => item._id !== id));
        setPagination(prev => ({
          ...prev,
          totalItems: Math.max(0, prev.totalItems - 1),
        }));
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete record.');
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  const getPredictionBadge = (prediction: string) => {
    switch (prediction) {
      case 'Likely Credible':
        return {
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />,
          classes: 'bg-emerald-950/80 text-emerald-300 border-emerald-800/80',
        };
      case 'Needs Verification':
        return {
          icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />,
          classes: 'bg-amber-950/80 text-amber-300 border-amber-800/80',
        };
      case 'Potentially Misleading':
      default:
        return {
          icon: <XCircle className="w-3.5 h-3.5 text-rose-400" />,
          classes: 'bg-rose-950/80 text-rose-300 border-rose-800/80',
        };
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-blue-400 font-semibold mb-1">
            <HistoryIcon className="w-4 h-4" />
            <span>Verification Archives</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Analysis History
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Review, filter, inspect, and manage your previous news credibility assessments
          </p>
        </div>

        <Link
          to="/verify"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-sm transition"
        >
          <Search className="w-4 h-4" />
          <span>New Analysis</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 w-full md:w-80">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search headline keywords..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 pl-9 pr-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium border border-slate-700 transition"
          >
            Find
          </button>
        </form>
      </div>

      {/* Table / List View */}
      {loading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          <p className="text-xs font-mono text-slate-400">Loading historical records...</p>
        </div>
      ) : analyses.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-xl bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
            <HistoryIcon className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">No analysis records found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {searchQuery || selectedCategory !== 'All'
              ? 'No articles matched your filter criteria. Try adjusting your query or category selection.'
              : 'You have not submitted any articles for analysis yet.'}
          </p>
          <Link
            to="/verify"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold"
          >
            <span>Analyze News Article Now</span>
          </Link>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-semibold uppercase tracking-wider">
                  <th className="py-3.5 px-4 sm:px-6">Article Headline</th>
                  <th className="py-3.5 px-4">Prediction</th>
                  <th className="py-3.5 px-4 font-mono">Credibility Score</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {analyses.map(item => {
                  const badge = getPredictionBadge(item.prediction);
                  const itemDate = new Date(item.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  });

                  return (
                    <tr
                      key={item._id}
                      className="hover:bg-slate-800/30 transition-colors group"
                    >
                      <td className="py-4 px-4 sm:px-6 max-w-md">
                        <Link
                          to={`/analysis/${item._id}`}
                          className="font-bold text-slate-100 group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug"
                        >
                          {item.headline}
                        </Link>
                        {item.sourceName && (
                          <span className="text-[11px] text-slate-500 block truncate mt-0.5 font-mono">
                            Source: {item.sourceName}
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${badge.classes}`}
                        >
                          {badge.icon}
                          <span>{item.prediction}</span>
                        </span>
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap font-mono">
                        <span className="font-bold text-slate-100 text-sm">
                          {item.credibilityScore}
                        </span>
                        <span className="text-slate-500 text-[11px]"> / 100</span>
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap text-slate-400 font-mono">
                        {itemDate}
                      </td>

                      <td className="py-4 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/analysis/${item._id}`}
                            className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-slate-800 rounded-lg transition"
                            title="View Analysis Details"
                          >
                            <ArrowUpRight className="w-4 h-4" />
                          </Link>

                          {deleteId === item._id ? (
                            <div className="inline-flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-rose-900/50">
                              <span className="text-[10px] text-rose-400 font-bold">Delete?</span>
                              <button
                                onClick={() => handleDelete(item._id)}
                                disabled={isDeleting}
                                className="px-1.5 py-0.5 bg-rose-600 hover:bg-rose-500 text-white rounded text-[10px] font-bold"
                              >
                                Yes
                              </button>
                              <button
                                onClick={() => setDeleteId(null)}
                                className="px-1.5 py-0.5 bg-slate-800 text-slate-300 rounded text-[10px]"
                              >
                                No
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeleteId(item._id)}
                              className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition"
                              title="Delete Analysis"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination Component */}
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            totalItems={pagination.totalItems}
            limit={pagination.limit}
            onPageChange={newPage => setPage(newPage)}
          />
        </div>
      )}
    </div>
  );
};
