/**
 * NLP Analysis Service (Rule-based Natural Language Processing in Node.js)
 * Implements tokenization, linguistic pattern scanning, clickbait heuristics,
 * emotional language quantification, orthographic indicators, and lexicon-based sentiment.
 */

// Common English Stop Words
const STOP_WORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'aren\'t',
  'as', 'at', 'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by',
  'can', 'can\'t', 'cannot', 'could', 'couldn\'t', 'did', 'didn\'t', 'do', 'does', 'doesn\'t', 'doing',
  'don\'t', 'down', 'during', 'each', 'few', 'for', 'from', 'further', 'had', 'hadn\'t', 'has', 'hasn\'t',
  'have', 'haven\'t', 'having', 'he', 'he\'d', 'he\'ll', 'he\'s', 'her', 'here', 'here\'s', 'hers',
  'herself', 'him', 'himself', 'his', 'how', 'how\'s', 'i', 'i\'d', 'i\'ll', 'i\'m', 'i\'ve', 'if',
  'in', 'into', 'is', 'isn\'t', 'it', 'it\'s', 'its', 'itself', 'let\'s', 'me', 'more', 'most', 'mustn\'t',
  'my', 'myself', 'no', 'nor', 'not', 'of', 'off', 'on', 'once', 'only', 'or', 'other', 'ought', 'our',
  'ours', 'ourselves', 'out', 'over', 'own', 'same', 'shan\'t', 'she', 'she\'d', 'she\'ll', 'she\'s',
  'should', 'shouldn\'t', 'so', 'some', 'such', 'than', 'that', 'that\'s', 'the', 'their', 'theirs',
  'them', 'themselves', 'then', 'there', 'there\'s', 'these', 'they', 'they\'d', 'they\'ll', 'they\'re',
  'they\'ve', 'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was', 'wasn\'t',
  'we', 'we\'d', 'we\'ll', 'we\'re', 'we\'ve', 'were', 'weren\'t', 'what', 'what\'s', 'when', 'when\'s',
  'where', 'where\'s', 'which', 'while', 'who', 'who\'s', 'whom', 'why', 'why\'s', 'with', 'won\'t',
  'would', 'wouldn\'t', 'you', 'you\'d', 'you\'ll', 'you\'re', 'you\'ve', 'your', 'yours', 'yourself',
  'yourselves'
]);

// Emotional and Sensational Lexicon
const EMOTIONAL_WORDS = new Set([
  'shocking', 'terrifying', 'unbelievable', 'outrage', 'disaster', 'horrifying', 'scandal',
  'explosive', 'secret', 'danger', 'miracle', 'catastrophic', 'hysteria', 'treason',
  'devastating', 'chaos', 'alarming', 'furious', 'sinister', 'urgent', 'apocalyptic',
  'nightmare', 'disgraceful', 'insane', 'horrific', 'bloodbath', 'shameful', 'evil',
  'panic', 'monstrous', 'unforgivable', 'mind-boggling', 'cataclysmic', 'vicious',
  'scandalous', 'dreadful', 'jaw-dropping', 'frightening', 'atrocity', 'terrified',
  'unhinged', 'diabolical', 'colossal', 'frenzy', 'bombshell', 'carnage'
]);

// Clickbait Headline Patterns (RegEx)
const CLICKBAIT_PATTERNS = [
  /\byou won'?t believe\b/i,
  /\bshocking\b/i,
  /\bthis will change everything\b/i,
  /\bwhat happens next\b/i,
  /\bnumber \d+ will surprise you\b/i,
  /\bwill blow your mind\b/i,
  /\bmind blown\b/i,
  /\bsecret that\b/i,
  /\bthe truth about\b/i,
  /\bis this the end of\b/i,
  /\bunbelievable trick\b/i,
  /\bdoctors hate this\b/i,
  /\beveryone is talking about\b/i,
  /\bsee what happened\b/i,
  /\byou need to see this\b/i,
  /\bwill leave you speechless\b/i,
  /\bstop everything and\b/i,
  /\bbreaking:?\b/i
];

// Suspicious / Conspiratorial Phrases
const SUSPICIOUS_PHRASES = [
  'share immediately',
  'do not let this be hidden',
  'the media won\'t tell you',
  'the media won’t tell you',
  '100% guaranteed',
  'secret information',
  'they don\'t want you to know',
  'they don’t want you to know',
  'wake up sheeple',
  'wake up people',
  'mainstream media is lying',
  'hidden cure',
  'miracle cure',
  'insider reveals',
  'leaked confidential',
  'before it gets deleted',
  'before they delete this',
  'banned by the government',
  'suppressed by big pharma',
  'deep state',
  'what they are hiding',
  'forward to everyone',
  'proof they lied',
  'exposed once and for all'
];

// Sentiment Lexicon
const POSITIVE_WORDS = new Set([
  'credible', 'verified', 'confirmed', 'progress', 'success', 'effective', 'safe',
  'approved', 'transparent', 'robust', 'integrity', 'reliable', 'accurate', 'constructive',
  'breakthrough', 'improved', 'beneficial', 'positive', 'agreement', 'peace', 'scientific',
  'peer-reviewed', 'evidence', 'authenticated', 'consensus', 'honorable', 'triumph', 'hope'
]);

const NEGATIVE_WORDS = new Set([
  'fraud', 'corrupt', 'dangerous', 'death', 'fatal', 'hoax', 'conspiracy', 'failure',
  'toxic', 'crisis', 'threat', 'arrested', 'ruin', 'illegal', 'collusion', 'deceptive',
  'fake', 'counterfeit', 'malicious', 'sabotage', 'harmful', 'collapse', 'violent',
  'victim', 'disease', 'outbreak', 'scam', 'bribe', 'guilty', 'criminal', 'corrupted'
]);

export interface NLPPreprocessingResult {
  tokens: string[];
  cleanTokens: string[];
  wordCount: number;
  characterCount: number;
  sentenceCount: number;
  repeatedWords: { word: string; count: number }[];
  keyPhrases: string[];
}

export interface NLPIndicatorResult {
  clickbaitScore: number;
  emotionalLanguageScore: number;
  emotionalWordsFound: string[];
  suspiciousPhraseCount: number;
  suspiciousPhrasesFound: string[];
  capitalizationScore: number;
  allCapsWordsCount: number;
  punctuationScore: number;
  excessivePunctuationCount: number;
  sentiment: 'Positive' | 'Negative' | 'Neutral';
  sentimentScore: number;
  detectedIndicators: string[];
  sourceAnalysis: {
    provided: boolean;
    domain?: string;
    sourceName?: string;
    note: string;
  };
}

export class NLPService {
  /**
   * Preprocesses text into linguistic tokens, counts sentences and extracts key phrases.
   */
  public static preprocess(headline: string, content: string): NLPPreprocessingResult {
    const fullText = `${headline} ${content}`;
    const characterCount = fullText.length;

    // Sentence splitting (periods, exclamation, question marks)
    const sentences = fullText
      .split(/(?<=[.?!])\s+/)
      .map(s => s.trim())
      .filter(s => s.length > 0);
    const sentenceCount = Math.max(1, sentences.length);

    // Word tokenization
    const rawTokens = fullText
      .replace(/[\n\r\t]+/g, ' ')
      .trim()
      .split(/\s+/)
      .filter(Boolean);
    const wordCount = rawTokens.length;

    // Lowercased, clean alphanumeric tokens
    const cleanTokens = rawTokens
      .map(w => w.toLowerCase().replace(/[^a-z0-9'-]/g, ''))
      .filter(w => w.length > 1);

    // Word frequency & repeated words (excluding stop words)
    const frequencyMap = new Map<string, number>();
    for (const token of cleanTokens) {
      if (!STOP_WORDS.has(token) && token.length > 2) {
        frequencyMap.set(token, (frequencyMap.get(token) || 0) + 1);
      }
    }

    // Repeated words with high relative frequency
    const repeatedWords: { word: string; count: number }[] = [];
    frequencyMap.forEach((count, word) => {
      if (count >= 3 && count / Math.max(1, cleanTokens.length) > 0.015) {
        repeatedWords.push({ word, count });
      }
    });
    repeatedWords.sort((a, b) => b.count - a.count);

    // Key Phrases extraction (top meaningful terms)
    const sortedTerms = Array.from(frequencyMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([word]) => word);

    return {
      tokens: rawTokens,
      cleanTokens,
      wordCount,
      characterCount,
      sentenceCount,
      repeatedWords,
      keyPhrases: sortedTerms,
    };
  }

  /**
   * Evaluates Clickbait patterns primarily in the headline and first paragraphs.
   */
  public static evaluateClickbait(headline: string, content: string): { score: number; patterns: string[] } {
    let score = 0;
    const detectedPatterns: string[] = [];

    // Headline regex pattern matching
    for (const pattern of CLICKBAIT_PATTERNS) {
      if (pattern.test(headline)) {
        score += 25;
        const match = headline.match(pattern);
        if (match && !detectedPatterns.includes(match[0].toLowerCase())) {
          detectedPatterns.push(match[0].toLowerCase());
        }
      }
    }

    // Headline question mark patterns
    if (headline.includes('?')) {
      score += 15;
      if (headline.includes('??') || headline.includes('???')) {
        score += 15;
        detectedPatterns.push('multiple question marks');
      } else {
        detectedPatterns.push('interrogative headline phrasing');
      }
    }

    // Headline exclamation mark patterns
    if (headline.includes('!')) {
      score += 15;
      if (headline.includes('!!') || headline.includes('!!!')) {
        score += 15;
        detectedPatterns.push('excessive exclamation marks');
      } else {
        detectedPatterns.push('exclamatory headline');
      }
    }

    // ALL CAPS words in headline
    const headlineWords = headline.split(/\s+/);
    const upperWords = headlineWords.filter(w => w.length > 2 && w === w.toUpperCase() && /^[A-Z]+$/.test(w));
    if (upperWords.length >= 2) {
      score += 25;
      detectedPatterns.push(`headline uppercase emphasis (${upperWords.slice(0, 3).join(', ')})`);
    } else if (upperWords.length === 1 && !['USA', 'FBI', 'CIA', 'WHO', 'UN', 'NATO', 'EU', 'CEO', 'NASA', 'CDC'].includes(upperWords[0])) {
      score += 10;
    }

    return {
      score: Math.min(100, score),
      patterns: detectedPatterns,
    };
  }

  /**
   * Scans text for sensational and emotionally charged language.
   */
  public static evaluateEmotionalLanguage(cleanTokens: string[]): { score: number; wordsFound: string[] } {
    const wordsFound: string[] = [];
    let count = 0;

    for (const token of cleanTokens) {
      if (EMOTIONAL_WORDS.has(token)) {
        count++;
        if (!wordsFound.includes(token)) {
          wordsFound.push(token);
        }
      }
    }

    // Rate per 100 words
    const rate = (count / Math.max(1, cleanTokens.length)) * 100;
    let score = Math.round(rate * 18); // e.g. 3% emotional words = ~54/100

    if (wordsFound.length >= 5) {
      score += 20;
    }

    return {
      score: Math.min(100, Math.max(0, score)),
      wordsFound: wordsFound.slice(0, 10),
    };
  }

  /**
   * Measures capitalization anomalies (ALL CAPS words, upper character percentage).
   */
  public static evaluateCapitalization(text: string, rawTokens: string[]): { score: number; count: number } {
    const letters = text.replace(/[^a-zA-Z]/g, '');
    if (letters.length === 0) return { score: 0, count: 0 };

    const upperLetters = text.replace(/[^A-Z]/g, '').length;
    const ratio = upperLetters / letters.length;

    // Filter ALL CAPS words longer than 2 characters excluding common acronyms
    const acronyms = new Set(['USA', 'UK', 'UN', 'EU', 'FBI', 'CIA', 'NASA', 'CDC', 'WHO', 'NATO', 'CEO', 'CFO', 'CTO', 'AI', 'NLP', 'GOP', 'IMF']);
    const allCapsWords = rawTokens.filter(t => {
      const clean = t.replace(/[^a-zA-Z]/g, '');
      return clean.length >= 3 && clean === clean.toUpperCase() && !acronyms.has(clean);
    });

    let score = 0;
    // Normal English has 3-8% uppercase. Above 12% is elevated, above 25% is extreme.
    if (ratio > 0.35) {
      score = 95;
    } else if (ratio > 0.20) {
      score = 70;
    } else if (ratio > 0.12) {
      score = 40;
    } else {
      score = 10;
    }

    if (allCapsWords.length >= 4) {
      score = Math.max(score, 80);
    } else if (allCapsWords.length >= 2) {
      score = Math.max(score, 50);
    }

    return {
      score: Math.min(100, score),
      count: allCapsWords.length,
    };
  }

  /**
   * Scans for punctuation anomalies (!, ?, !!!, ???, !?, repeated ellipses).
   */
  public static evaluatePunctuation(text: string): { score: number; count: number } {
    const exclamations = (text.match(/!/g) || []).length;
    const questions = (text.match(/\?/g) || []).length;
    const repeatedMarks = (text.match(/([!?]{2,})/g) || []).length;
    const ellipses = (text.match(/\.{3,}/g) || []).length;

    const totalAnomalies = repeatedMarks * 3 + (exclamations > 2 ? exclamations * 1.5 : 0) + (questions > 3 ? questions : 0) + (ellipses > 3 ? ellipses : 0);

    let score = 0;
    if (repeatedMarks >= 2 || totalAnomalies > 10) {
      score = 85;
    } else if (repeatedMarks === 1 || totalAnomalies > 5) {
      score = 55;
    } else if (totalAnomalies > 2) {
      score = 30;
    } else {
      score = 8;
    }

    return {
      score: Math.min(100, Math.round(score)),
      count: repeatedMarks + (exclamations > 1 ? exclamations : 0),
    };
  }

  /**
   * Scans for known conspiratorial, click-to-share, or sensational phrases.
   */
  public static evaluateSuspiciousPhrases(text: string): { count: number; phrasesFound: string[] } {
    const lower = text.toLowerCase();
    const found: string[] = [];

    for (const phrase of SUSPICIOUS_PHRASES) {
      if (lower.includes(phrase)) {
        found.push(phrase);
      }
    }

    return {
      count: found.length,
      phrasesFound: found,
    };
  }

  /**
   * Lightweight lexicon-based sentiment analysis with polarity scoring.
   */
  public static evaluateSentiment(cleanTokens: string[]): {
    sentiment: 'Positive' | 'Negative' | 'Neutral';
    score: number;
    posCount: number;
    negCount: number;
  } {
    let posCount = 0;
    let negCount = 0;

    for (const token of cleanTokens) {
      if (POSITIVE_WORDS.has(token)) posCount++;
      if (NEGATIVE_WORDS.has(token)) negCount++;
    }

    const total = posCount + negCount;
    let score = 0;
    if (total > 0) {
      score = Number(((posCount - negCount) / total).toFixed(2));
    }

    let sentiment: 'Positive' | 'Negative' | 'Neutral' = 'Neutral';
    if (score >= 0.20) sentiment = 'Positive';
    else if (score <= -0.20) sentiment = 'Negative';

    return { sentiment, score, posCount, negCount };
  }

  /**
   * Analyzes source URL metadata.
   */
  public static evaluateSource(sourceUrl?: string): {
    provided: boolean;
    domain?: string;
    sourceName?: string;
    note: string;
  } {
    if (!sourceUrl || !sourceUrl.trim()) {
      return {
        provided: false,
        note: 'Not provided (Treated as an evaluation limitation; verification requires comparing claims with independent primary sources).',
      };
    }

    try {
      let urlStr = sourceUrl.trim();
      if (!urlStr.startsWith('http://') && !urlStr.startsWith('https://')) {
        urlStr = 'https://' + urlStr;
      }
      const parsed = new URL(urlStr);
      const domain = parsed.hostname.replace(/^www\./, '');
      
      // Extract human-friendly name from domain
      const parts = domain.split('.');
      const sourceName = parts.length > 1 ? parts[parts.length - 2].toUpperCase() : domain;

      return {
        provided: true,
        domain,
        sourceName,
        note: `Source domain detected: ${domain}. Remember that domain reputation should be verified directly.`,
      };
    } catch {
      return {
        provided: false,
        note: 'Invalid URL format provided. Treated as unverified source.',
      };
    }
  }

  /**
   * Executes the full NLP pipeline.
   */
  public static analyze(headline: string, content: string, sourceUrl?: string): NLPIndicatorResult & NLPPreprocessingResult {
    const preprocessed = this.preprocess(headline, content);
    const clickbait = this.evaluateClickbait(headline, content);
    const emotional = this.evaluateEmotionalLanguage(preprocessed.cleanTokens);
    const fullText = `${headline}\n${content}`;
    const capitalization = this.evaluateCapitalization(fullText, preprocessed.tokens);
    const punctuation = this.evaluatePunctuation(fullText);
    const suspicious = this.evaluateSuspiciousPhrases(fullText);
    const sentiment = this.evaluateSentiment(preprocessed.cleanTokens);
    const source = this.evaluateSource(sourceUrl);

    // Aggregate detected indicators
    const detectedIndicators: string[] = [];

    if (clickbait.score >= 50) {
      detectedIndicators.push(`Clickbait phrasing detected in headline (${clickbait.patterns.slice(0, 2).join(', ') || 'sensational framing'})`);
    }
    if (emotional.score >= 45) {
      detectedIndicators.push(`Elevated emotional and sensational wording (${emotional.wordsFound.slice(0, 3).join(', ')})`);
    }
    if (suspicious.count > 0) {
      detectedIndicators.push(`Suspicious viral distribution phrasing ("${suspicious.phrasesFound[0]}")`);
    }
    if (capitalization.score >= 50) {
      detectedIndicators.push('Excessive uppercase emphasis and capitalized wording');
    }
    if (punctuation.score >= 45) {
      detectedIndicators.push('Repeated punctuation patterns (!, ?, or multiple marks)');
    }
    if (!source.provided) {
      detectedIndicators.push('Lack of reference or primary source URL');
    }
    if (preprocessed.repeatedWords.length >= 3) {
      detectedIndicators.push(`Repetitive claim framing on key terms (${preprocessed.repeatedWords.slice(0, 2).map(r => r.word).join(', ')})`);
    }

    return {
      ...preprocessed,
      clickbaitScore: clickbait.score,
      emotionalLanguageScore: emotional.score,
      emotionalWordsFound: emotional.wordsFound,
      suspiciousPhraseCount: suspicious.count,
      suspiciousPhrasesFound: suspicious.phrasesFound,
      capitalizationScore: capitalization.score,
      allCapsWordsCount: capitalization.count,
      punctuationScore: punctuation.score,
      excessivePunctuationCount: punctuation.count,
      sentiment: sentiment.sentiment,
      sentimentScore: sentiment.score,
      detectedIndicators,
      sourceAnalysis: source,
    };
  }
}
