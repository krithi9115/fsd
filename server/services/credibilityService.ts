import { PredictionCategory } from '../models/Analysis.ts';
import { NLPIndicatorResult, NLPPreprocessingResult } from './nlpService.ts';

export interface CredibilityResult {
  credibilityScore: number;
  confidenceScore: number;
  prediction: PredictionCategory;
  scoreBreakdown: {
    clickbaitPenalty: number;
    emotionalPenalty: number;
    suspiciousPenalty: number;
    capitalizationPenalty: number;
    punctuationPenalty: number;
    sourceAdjustment: number;
    repetitionPenalty: number;
  };
}

export class CredibilityService {
  // Configurable thresholds for categorization
  public static THRESHOLDS = {
    LIKELY_CREDIBLE: 80,
    NEEDS_VERIFICATION: 50,
  };

  /**
   * Computes multi-factor credibility score and confidence score.
   */
  public static calculate(
    nlp: NLPIndicatorResult & NLPPreprocessingResult
  ): CredibilityResult {
    let score = 100;

    // 1. Clickbait penalty (0 to 25 pts)
    const clickbaitPenalty = Math.round((nlp.clickbaitScore / 100) * 25);
    score -= clickbaitPenalty;

    // 2. Emotional language penalty (0 to 25 pts)
    const emotionalPenalty = Math.round((nlp.emotionalLanguageScore / 100) * 25);
    score -= emotionalPenalty;

    // 3. Suspicious / viral phrases penalty (12 pts per phrase, max 30)
    const suspiciousPenalty = Math.min(30, nlp.suspiciousPhraseCount * 12);
    score -= suspiciousPenalty;

    // 4. Capitalization penalty (0 to 10 pts)
    const capitalizationPenalty = Math.round((nlp.capitalizationScore / 100) * 10);
    score -= capitalizationPenalty;

    // 5. Punctuation anomalies penalty (0 to 10 pts)
    const punctuationPenalty = Math.round((nlp.punctuationScore / 100) * 10);
    score -= punctuationPenalty;

    // 6. Source information adjustment (+4 if source domain supplied, -5 if omitted)
    let sourceAdjustment = 0;
    if (nlp.sourceAnalysis.provided) {
      sourceAdjustment = 4;
      score += sourceAdjustment;
    } else {
      sourceAdjustment = -5;
      score += sourceAdjustment;
    }

    // 7. Repetitive wording / rhetorical redundancy penalty (0 to 8 pts)
    const repetitionPenalty = Math.min(8, nlp.repeatedWords.length * 2);
    score -= repetitionPenalty;

    // Clamp score strictly between 5 and 98:
    // (Never 0 or 100, adhering to the principle that automated linguistic heuristics
    // cannot determine absolute truth or absolute falsehood)
    const credibilityScore = Math.max(5, Math.min(98, Math.round(score)));

    // Categorization
    let prediction: PredictionCategory = 'Needs Verification';
    if (credibilityScore >= this.THRESHOLDS.LIKELY_CREDIBLE) {
      prediction = 'Likely Credible';
    } else if (credibilityScore < this.THRESHOLDS.NEEDS_VERIFICATION) {
      prediction = 'Potentially Misleading';
    } else {
      prediction = 'Needs Verification';
    }

    // Confidence Calculation:
    // Measures signal strength, sample size (word count), and metadata completeness
    let confidence = 50;

    // Text sample size factor
    if (nlp.wordCount >= 250) {
      confidence += 25;
    } else if (nlp.wordCount >= 100) {
      confidence += 18;
    } else if (nlp.wordCount >= 40) {
      confidence += 10;
    }

    // Source signal presence
    if (nlp.sourceAnalysis.provided) {
      confidence += 10;
    }

    // Indicator convergence factor (strong consistent signals raise confidence)
    const activeIndicators = [
      nlp.clickbaitScore > 40,
      nlp.emotionalLanguageScore > 40,
      nlp.suspiciousPhraseCount > 0,
      nlp.capitalizationScore > 40,
      nlp.punctuationScore > 40,
    ].filter(Boolean).length;

    if (activeIndicators >= 3 || activeIndicators === 0) {
      confidence += 10;
    }

    const confidenceScore = Math.max(45, Math.min(96, Math.round(confidence)));

    return {
      credibilityScore,
      confidenceScore,
      prediction,
      scoreBreakdown: {
        clickbaitPenalty,
        emotionalPenalty,
        suspiciousPenalty,
        capitalizationPenalty,
        punctuationPenalty,
        sourceAdjustment,
        repetitionPenalty,
      },
    };
  }
}
