import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnalysisRecord } from '../services/api.ts';
import { CheckCircle2, AlertTriangle, XCircle, Trash2, ArrowUpRight, Calendar, ExternalLink } from 'lucide-react';

interface AnalysisCardProps {
  analysis: AnalysisRecord;
  onDelete?: (id: string) => void;
  showDelete?: boolean;
}

export const AnalysisCard: React.FC<AnalysisCardProps> = ({
  analysis,
  onDelete,
  showDelete = true,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const getPredictionBadge = () => {
    switch (analysis.prediction) {
      case 'Likely Credible':
        return {
          bg: 'bg-emerald-950/80 text-emerald-300 border-emerald-800/80',
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />,
        };
      case 'Needs Verification':
        return {
          bg: 'bg-amber-950/80 text-amber-300 border-amber-800/80',
          icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />,
        };
      case 'Potentially Misleading':
      default:
        return {
          bg: 'bg-rose-950/80 text-rose-300 border-rose-800/80',
          icon: <XCircle className="w-3.5 h-3.5 text-rose-400" />,
        };
    }
  };

  const badge = getPredictionBadge();
  const formattedDate = new Date(analysis.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const handleDelete = async () => {
    if (!onDelete) return;
    setIsDeleting(true);
    try {
      await onDelete(analysis._id);
    } finally {
      setIsDeleting(false);
      setShowConfirm(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-5 transition-all shadow-sm flex flex-col justify-between group">
      <div>
        <div className="flex items-center justify-between gap-3 mb-3">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${badge.bg}`}
          >
            {badge.icon}
            <span>{analysis.prediction}</span>
          </span>

          <div className="flex items-center gap-1.5 font-mono text-xs">
            <span className="text-slate-400">Score:</span>
            <span className="text-white font-bold px-2 py-0.5 rounded bg-slate-950 border border-slate-800">
              {analysis.credibilityScore} / 100
            </span>
          </div>
        </div>

        <Link
          to={`/analysis/${analysis._id}`}
          className="block group-hover:text-blue-400 text-slate-100 font-bold text-base leading-snug line-clamp-2 transition-colors mb-2"
        >
          {analysis.headline}
        </Link>

        {analysis.sourceName && (
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-3 font-mono">
            <ExternalLink className="w-3 h-3 text-slate-500" />
            <span className="truncate">Source: {analysis.sourceName}</span>
          </div>
        )}

        {/* Indicators snippet */}
        {analysis.detectedIndicators && analysis.detectedIndicators.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {analysis.detectedIndicators.slice(0, 2).map((ind, i) => (
              <span
                key={i}
                className="text-[11px] px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-400 truncate max-w-[220px]"
              >
                {ind}
              </span>
            ))}
            {analysis.detectedIndicators.length > 2 && (
              <span className="text-[11px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                +{analysis.detectedIndicators.length - 2}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs text-slate-400">
        <div className="flex items-center gap-1.5 font-mono">
          <Calendar className="w-3.5 h-3.5 text-slate-500" />
          <span>{formattedDate}</span>
        </div>

        <div className="flex items-center gap-2">
          {showDelete && onDelete && (
            <>
              {showConfirm ? (
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] text-rose-400 font-semibold">Delete?</span>
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="px-2 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded text-[11px] font-medium"
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => setShowConfirm(false)}
                    className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px]"
                  >
                    No
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowConfirm(true)}
                  className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition"
                  title="Delete analysis record"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </>
          )}

          <Link
            to={`/analysis/${analysis._id}`}
            className="flex items-center gap-1 px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-800/50 rounded-lg font-medium transition"
          >
            <span>Details</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
