import { PredictionCategory } from '../models/Analysis.ts';
import { NLPIndicatorResult, NLPPreprocessingResult } from './nlpService.ts';

export class ExplanationService {
  public static readonly SYSTEM_LIMITATION_DISCLAIMER =
    'This system provides an automated linguistic credibility assessment. It does not establish the factual truth of an article. Users should independently verify important claims using reliable sources.';

  /**
   * Generates a context-aware human-readable explanation based on detected indicators.
   */
  public static generateExplanation(
    nlp: NLPIndicatorResult & NLPPreprocessingResult,
    prediction: PredictionCategory,
    score: number
  ): string {
    const observations: string[] = [];

    // Clickbait observation
    if (nlp.clickbaitScore >= 60) {
      observations.push('Headline structure exhibits pronounced clickbait characteristics designed to evoke curiosity or urge sharing.');
    } else if (nlp.clickbaitScore >= 35) {
      observations.push('Moderate sensationalism detected in the headline phrasing.');
    }

    // Emotional wording
    if (nlp.emotionalLanguageScore >= 60) {
      observations.push(
        `High density of emotionally charged or sensational vocabulary detected (${nlp.emotionalWordsFound.slice(0, 4).join(', ')}), which can heighten bias.`
      );
    } else if (nlp.emotionalLanguageScore >= 35) {
      observations.push('Occasional use of emotive descriptors rather than neutral factual exposition.');
    }

    // Suspicious phrases
    if (nlp.suspiciousPhraseCount > 0) {
      observations.push(
        `Contains ${nlp.suspiciousPhraseCount} viral manipulation phrase(s) commonly observed in unverified content ("${nlp.suspiciousPhrasesFound.slice(0, 2).join('", "')}").`
      );
    }

    // Capitalization & Punctuation
    if (nlp.capitalizationScore >= 50 && nlp.punctuationScore >= 45) {
      observations.push('Orthographic patterns reveal heightened capitalization emphasis and repeated punctuation (such as ! or ?), often used for artificial urgency.');
    } else if (nlp.capitalizationScore >= 50) {
      observations.push('Notable use of uppercase words indicates artificial typographical emphasis.');
    } else if (nlp.punctuationScore >= 45) {
      observations.push('Elevated frequency of exclamatory or question marks detected.');
    }

    // Source context
    if (!nlp.sourceAnalysis.provided) {
      observations.push('No verifiable primary source URL was provided alongside the submission.');
    } else {
      observations.push(`Source domain identified as "${nlp.sourceAnalysis.domain}".`);
    }

    // Sentiment context
    if (nlp.sentiment === 'Negative' && nlp.sentimentScore <= -0.4) {
      observations.push('The linguistic tone displays an intensely negative polarity.');
    }

    let summaryText = '';
    if (prediction === 'Likely Credible') {
      summaryText = `The article text displays a formal journalistic register with a credibility index of ${score}/100. Linguistic markers of sensationalism and clickbait remain minimal.`;
      if (observations.length > 0) {
        summaryText += ` Note that: ${observations.join(' ')}`;
      }
    } else if (prediction === 'Needs Verification') {
      summaryText = `The article receives an intermediate assessment of ${score}/100. While not overtly misleading across all indicators, notable linguistic characteristics suggest caution: ${observations.join(' ')}`;
    } else {
      summaryText = `The content demonstrates multiple linguistic flags associated with sensational or manipulative reporting (credibility score: ${score}/100): ${observations.join(' ')}`;
    }

    summaryText += `\n\nThese automated findings evaluate writing patterns, not factual verification. Readers should cross-check central claims with accredited newsrooms and primary documentation.`;

    return summaryText;
  }

  /**
   * Generates actionable recommendations according to prediction category.
   */
  public static generateRecommendation(prediction: PredictionCategory): string {
    switch (prediction) {
      case 'Likely Credible':
        return 'The content shows relatively few suspicious linguistic indicators. However, important claims should still be verified using reliable sources.';
      case 'Needs Verification':
        return 'The content contains some indicators that warrant additional verification. Consider checking the original source and comparing the claims with independent sources.';
      case 'Potentially Misleading':
      default:
        return 'The content contains multiple linguistic indicators commonly associated with misleading or sensational content. Verify the claims using independent and reliable sources before sharing.';
    }
  }
}
