import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { analysisAPI, feedbackAPI, AnalysisRecord, FeedbackRecord } from '../services/api.ts';
import { ScoreCard } from '../components/ScoreCard.tsx';
import { IndicatorCard } from '../components/IndicatorCard.tsx';
import { SentimentCard } from '../components/SentimentCard.tsx';
import { Button } from '../components/Button.tsx';
import {
  Search,
  ExternalLink,
  Calendar,
  User,
  Share2,
  ThumbsUp,
  ThumbsDown,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  FileText,
  Tag,
  Lightbulb,
  ShieldAlert,
  Loader2,
  Compass,
} from 'lucide-react';

export const AnalysisResult: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [analysis, setAnalysis] = useState<AnalysisRecord | null>(null);
  const [feedback, setFeedback] = useState<FeedbackRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Feedback form state
  const [isAccurate, setIsAccurate] = useState<boolean | null>(null);
  const [comment, setComment] = useState('');
  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);

  useEffect(() => {
    async function loadData() {
      if (!id) return;
      try {
        setLoading(true);
        const res = await analysisAPI.getById(id);
        if (res.data.success && res.data.data) {
          setAnalysis(res.data.data);
          if (res.data.userFeedback) {
            setFeedback(res.data.userFeedback);
            setIsAccurate(res.data.userFeedback.isAccurate);
            setComment(res.data.userFeedback.comment || '');
          }
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load analysis results.');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id]);

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!analysis || isAccurate === null) return;

    setFeedbackSubmitting(true);
    try {
      const res = await feedbackAPI.submit({
        analysisId: analysis._id,
        isAccurate,
        comment,
      });
      if (res.data.success) {
        setFeedback(res.data.data);
        setFeedbackSuccess(true);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error submitting feedback.');
    } finally {
      setFeedbackSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        <p className="text-sm font-mono text-slate-400">Loading analysis telemetry...</p>
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center space-y-4">
        <div className="w-12 h-12 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-400 mx-auto flex items-center justify-center">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-white">Analysis Record Unavailable</h2>
        <p className="text-sm text-slate-400">{error || 'Record does not exist or access is restricted.'}</p>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Dashboard</span>
        </Link>
      </div>
    );
  }

  const formattedDate = new Date(analysis.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Navigation bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          to="/history"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-slate-200 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Analysis History</span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            to="/verify"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-sm transition"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Verify Another Article</span>
          </Link>
        </div>
      </div>

      {/* Main Headline & Metadata Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 font-mono">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span>{formattedDate}</span>
          </span>
          <span>•</span>
          <span>{analysis.wordCount} words analyzed</span>
          {analysis.sourceName && (
            <>
              <span>•</span>
              <span className="text-blue-400 font-bold">Source: {analysis.sourceName}</span>
            </>
          )}
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
          {analysis.headline}
        </h1>

        {analysis.sourceUrl && (
          <div className="pt-2">
            <a
              href={analysis.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 font-mono break-all hover:underline"
            >
              <ExternalLink className="w-3.5 h-3.5 shrink-0" />
              <span>{analysis.sourceUrl}</span>
            </a>
          </div>
        )}
      </div>

      {/* Primary Credibility Score Card */}
      <ScoreCard
        score={analysis.credibilityScore}
        prediction={analysis.prediction}
        confidenceScore={analysis.confidenceScore}
      />

      {/* Linguistic Indicators Breakdown Grid */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
          Detected Linguistic Heuristics
        </h3>
        <IndicatorCard
          clickbaitScore={analysis.clickbaitScore}
          emotionalLanguageScore={analysis.emotionalLanguageScore}
          suspiciousPhraseCount={analysis.suspiciousPhraseCount}
          capitalizationScore={analysis.capitalizationScore}
          punctuationScore={analysis.punctuationScore}
          wordCount={analysis.wordCount}
          characterCount={analysis.characterCount}
        />
      </div>

      {/* Sentiment & Key Phrases row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sentiment Card */}
        <SentimentCard
          sentiment={analysis.sentiment}
          score={analysis.sentimentScore}
        />

        {/* Key Phrases & Terms Extracted */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-slate-300 font-semibold text-sm mb-3">
              <Tag className="w-4 h-4 text-blue-400" />
              <span>Extracted Key Topical Terms</span>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Significant recurring content tokens extracted after stop-word filtering:
            </p>
            <div className="flex flex-wrap gap-2">
              {analysis.keyPhrases && analysis.keyPhrases.length > 0 ? (
                analysis.keyPhrases.map((phrase, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-blue-300"
                  >
                    #{phrase}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-500 italic">No salient key phrases extracted</span>
              )}
            </div>
          </div>

          {/* Source Attribution Note */}
          <div className="pt-3 border-t border-slate-800/80 text-xs text-slate-400 flex items-center justify-between">
            <span>Primary Reference:</span>
            <span className="font-mono text-slate-300">
              {analysis.sourceUrl ? 'Supplied' : 'Not provided (Assessment Limitation)'}
            </span>
          </div>
        </div>
      </div>

      {/* Detected Indicators List */}
      {analysis.detectedIndicators && analysis.detectedIndicators.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-slate-300">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>Identified Content Patterns</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            {analysis.detectedIndicators.map((indicator, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-xs text-slate-300"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                <span className="leading-relaxed">{indicator}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Detailed Dynamic Explanation */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4 shadow-sm">
        <div className="flex items-center gap-2 text-base font-bold text-white">
          <FileText className="w-5 h-5 text-blue-400" />
          <span>Algorithmic Explanation of Credibility Assessment</span>
        </div>
        <div className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line bg-slate-950 p-5 rounded-xl border border-slate-800/80 font-sans">
          {analysis.explanation}
        </div>
      </div>

      {/* Verification Recommendation */}
      <div className="bg-slate-900 border border-blue-900/40 rounded-2xl p-6 sm:p-8 space-y-3 shadow-sm">
        <div className="flex items-center gap-2 text-base font-bold text-blue-300">
          <Lightbulb className="w-5 h-5 text-blue-400" />
          <span>Verification Recommendation</span>
        </div>
        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed bg-blue-950/30 p-4 rounded-xl border border-blue-800/40">
          {analysis.recommendation}
        </p>
      </div>

      {/* Original News Content (Unmodified) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-3 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Original News Content (Unmodified)
          </span>
          <span className="text-xs font-mono text-slate-500">
            {analysis.characterCount} characters
          </span>
        </div>
        <div className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-wrap font-sans bg-slate-950 p-5 rounded-xl border border-slate-800/80">
          {analysis.content}
        </div>
      </div>

      {/* Feedback Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-5 shadow-sm">
        <div>
          <h3 className="text-base font-bold text-white">Provide Verification Feedback</h3>
          <p className="text-xs text-slate-400">
            Help refine heuristic weights by rating whether this linguistic assessment aligned with your manual inspection.
          </p>
        </div>

        {feedbackSuccess && (
          <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Thank you! Your feedback has been recorded into the MongoDB evaluation collection.</span>
          </div>
        )}

        <form onSubmit={handleFeedbackSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 block">
              Was this credibility assessment accurate and useful?
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsAccurate(true)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                  isAccurate === true
                    ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                    : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                }`}
              >
                <ThumbsUp className="w-4 h-4" />
                <span>Yes, Assessment Was Accurate</span>
              </button>

              <button
                type="button"
                onClick={() => setIsAccurate(false)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                  isAccurate === false
                    ? 'bg-rose-600 text-white border-rose-500 shadow-sm'
                    : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                }`}
              >
                <ThumbsDown className="w-4 h-4" />
                <span>No, Needed Adjustment</span>
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 block">
              Additional Notes or Corrections (Optional)
            </label>
            <textarea
              rows={3}
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="e.g., Headline is satire; emotional phrasing is actually quoted directly from an eyewitness interview..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={isAccurate === null}
            isLoading={feedbackSubmitting}
          >
            {feedback ? 'Update Feedback' : 'Submit Feedback'}
          </Button>
        </form>
      </div>
    </div>
  );
};
