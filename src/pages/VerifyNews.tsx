import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { analysisAPI } from '../services/api.ts';
import { Input } from '../components/Input.tsx';
import { Button } from '../components/Button.tsx';
import { LoadingSpinner } from '../components/LoadingSpinner.tsx';
import {
  Search,
  Link as LinkIcon,
  FileText,
  AlertCircle,
  Sparkles,
  BookOpen,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

const SAMPLE_TEMPLATES = [
  {
    name: 'Credible Benchmark (Journalistic)',
    category: 'Credible',
    headline: 'International Climate Panel Approves Framework For Renewable Grid Integration',
    sourceUrl: 'https://reuters.com/sustainability/climate-panel-grid-framework-2026',
    content:
      'Delegates representing eighty-four nation states concluded four days of rigorous technical negotiations in Geneva this morning, establishing unified international standards for clean energy transmission corridors. The peer-reviewed framework, developed in collaboration with civil engineering institutes, specifies grid synchronization protocols designed to accommodate variable solar and wind outputs without destabilizing continental frequency bands. Official summaries released by the secretariat highlight independent biostatistical validation and transparent budget oversight.',
  },
  {
    name: 'Needs Verification (Speculative)',
    category: 'Needs Verification',
    headline: 'Internal Whistleblower Claims Major Semiconductor Firm Facing Hidden Yield Failures',
    sourceUrl: 'https://techrumors-insider.blog/semiconductor-yield-leak',
    content:
      'An uncorroborated report posted on an anonymous industry forum alleges that fabrication lines for upcoming next-generation microprocessors are experiencing wafer defect rates exceeding thirty-five percent. While several independent hardware analysts noted that supply chain lead times have recently lengthened, corporate spokespersons declined to comment on internal operational benchmarks, reiterating that production timelines remain consistent with prior investor guidance.',
  },
  {
    name: 'Misleading / Clickbait (Sensational)',
    category: 'Misleading',
    headline: 'SHOCKING SECRET: Mainstream Media Suppresses Miracle Herb That Completely Cures All Illnesses In 48 Hours!!!',
    sourceUrl: 'https://miracle-cures-revealed.freehost.xyz/urgent-post',
    content:
      'DO NOT LET THIS BE HIDDEN! The media won\'t tell you the secret information they don\'t want you to know! Big Pharma is terrified because this 100% guaranteed miracle plant wipes out every disease known to mankind in just two days. SHARE IMMEDIATELY before they delete this post forever! Insiders reveal doctors have been forbidden from speaking the truth! Wake up sheeple and buy the secret extract now before it gets banned by the government!',
  },
];

export const VerifyNews: React.FC = () => {
  const navigate = useNavigate();

  const [headline, setHeadline] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [content, setContent] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Compute live character and word counts
  const characterCount = content.length;
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;

  const validateForm = () => {
    const errs: Record<string, string> = {};

    if (!headline.trim()) {
      errs.headline = 'News headline is required.';
    } else if (headline.trim().length < 6) {
      errs.headline = 'Headline must be at least 6 characters.';
    }

    if (!content.trim()) {
      errs.content = 'News article content is required.';
    } else if (content.trim().length < 20) {
      errs.content = 'Content must be at least 20 characters for meaningful linguistic analysis.';
    }

    if (sourceUrl.trim()) {
      const urlStr = sourceUrl.trim();
      const formatted = urlStr.startsWith('http://') || urlStr.startsWith('https://') ? urlStr : `https://${urlStr}`;
      try {
        new URL(formatted);
      } catch {
        errs.sourceUrl = 'Please enter a valid URL (e.g. https://domain.com/article)';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!validateForm()) return;

    setIsAnalyzing(true);

    try {
      const res = await analysisAPI.create({
        headline: headline.trim(),
        content: content.trim(),
        sourceUrl: sourceUrl.trim() || undefined,
      });

      if (res.data.success && res.data.data) {
        // Direct transition to detailed analysis result
        navigate(`/analysis/${res.data.data._id}`);
      }
    } catch (err: any) {
      setServerError(
        err.response?.data?.message || 'Failed to complete news analysis. Please try again.'
      );
      setIsAnalyzing(false);
    }
  };

  const loadTemplate = (tmpl: (typeof SAMPLE_TEMPLATES)[0]) => {
    setHeadline(tmpl.headline);
    setSourceUrl(tmpl.sourceUrl);
    setContent(tmpl.content);
    setErrors({});
    setServerError(null);
  };

  if (isAnalyzing) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <LoadingSpinner headline={headline} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-950 border border-blue-800 text-blue-300 font-mono">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Rule-Based NLP Verification Engine</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Verify News Credibility
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
          Submit article text below to inspect linguistic patterns, evaluate emotional intensity, detect clickbait markers, and generate verification guidance.
        </p>
      </div>

      {/* Preset Benchmarks for Reviewers */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-blue-400" />
            <span>Load Sample Benchmark Articles (1-Click Test):</span>
          </span>
          <span className="text-[11px] text-slate-500 hidden sm:inline">
            Quickly test different linguistic registers
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {SAMPLE_TEMPLATES.map((tmpl, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => loadTemplate(tmpl)}
              className="p-3 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 text-left transition space-y-1 group cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200 group-hover:text-blue-400 transition-colors truncate">
                  {tmpl.name}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-1">"{tmpl.headline}"</p>
            </button>
          ))}
        </div>
      </div>

      {serverError && (
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-300 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <span>{serverError}</span>
        </div>
      )}

      {/* Main Submission Form */}
      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
        {/* Headline Input */}
        <div className="space-y-1.5">
          <Input
            label="News Headline"
            placeholder="e.g., Breakthrough in Solar Cell Efficiency Confirmed by National Lab"
            value={headline}
            onChange={e => setHeadline(e.target.value)}
            error={errors.headline}
            leftIcon={<FileText className="w-4 h-4" />}
            required
          />
        </div>

        {/* Source URL Input */}
        <div className="space-y-1.5">
          <Input
            label="Source URL (Optional)"
            placeholder="e.g., https://reuters.com/science/clean-energy-update"
            value={sourceUrl}
            onChange={e => setSourceUrl(e.target.value)}
            error={errors.sourceUrl}
            helperText="Providing a primary source link enables reference domain inspection"
            leftIcon={<LinkIcon className="w-4 h-4" />}
          />
        </div>

        {/* Content Textarea */}
        <div className="space-y-1.5 text-left">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              News Article Content <span className="text-rose-500">*</span>
            </label>
            <div className="text-xs font-mono text-slate-400 space-x-3">
              <span>
                Words: <strong className="text-white">{wordCount}</strong>
              </span>
              <span>
                Characters: <strong className="text-white">{characterCount}</strong>
              </span>
            </div>
          </div>

          <textarea
            rows={8}
            className={`w-full bg-slate-950 border rounded-xl p-4 text-slate-100 placeholder-slate-500 text-sm leading-relaxed transition-colors focus:outline-none focus:ring-2 ${
              errors.content
                ? 'border-rose-500 focus:ring-rose-500/20'
                : 'border-slate-800 hover:border-slate-700 focus:border-blue-500 focus:ring-blue-500/20'
            }`}
            placeholder="Paste the full article body or paragraph text here for complete linguistic analysis..."
            value={content}
            onChange={e => setContent(e.target.value)}
            required
          />

          {errors.content && (
            <p className="text-xs text-rose-400 font-medium">{errors.content}</p>
          )}
        </div>

        {/* System Guidance Note */}
        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 flex items-start gap-2.5">
          <HelpCircle className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            Submissions are processed by an in-memory Node.js natural language parser.
            Sentences are scanned for clickbait syntax, excessive exclamation or interrogation,
            hyperbolic sentiment, and viral distribution triggers. Original text is preserved unaltered.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2 border-t border-slate-800">
          <button
            type="button"
            onClick={() => {
              setHeadline('');
              setSourceUrl('');
              setContent('');
              setErrors({});
            }}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 text-xs font-medium transition cursor-pointer"
          >
            Clear Form
          </button>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full sm:w-auto"
            icon={<Search className="w-4 h-4" />}
          >
            Analyze News Content
          </Button>
        </div>
      </form>
    </div>
  );
};
