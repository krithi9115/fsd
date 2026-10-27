import mongoose, { Document, Schema, Types } from 'mongoose';

export type PredictionCategory = 'Likely Credible' | 'Needs Verification' | 'Potentially Misleading';
export type SentimentCategory = 'Positive' | 'Negative' | 'Neutral';

export interface IAnalysis extends Document {
  userId: Types.ObjectId;
  headline: string;
  content: string;
  sourceUrl?: string;
  sourceName?: string;
  prediction: PredictionCategory;
  credibilityScore: number;
  confidenceScore: number;
  sentiment: SentimentCategory;
  sentimentScore: number;
  wordCount: number;
  characterCount: number;
  clickbaitScore: number;
  emotionalLanguageScore: number;
  suspiciousPhraseCount: number;
  capitalizationScore: number;
  punctuationScore: number;
  detectedIndicators: string[];
  keyPhrases: string[];
  explanation: string;
  recommendation: string;
  createdAt: Date;
  updatedAt: Date;
}

const analysisSchema = new Schema<IAnalysis>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    headline: {
      type: String,
      required: [true, 'Headline is required'],
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'News article content is required'],
      trim: true,
    },
    sourceUrl: {
      type: String,
      default: '',
      trim: true,
    },
    sourceName: {
      type: String,
      default: '',
      trim: true,
    },
    prediction: {
      type: String,
      enum: ['Likely Credible', 'Needs Verification', 'Potentially Misleading'],
      required: true,
      index: true,
    },
    credibilityScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    confidenceScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    sentiment: {
      type: String,
      enum: ['Positive', 'Negative', 'Neutral'],
      default: 'Neutral',
    },
    sentimentScore: {
      type: Number,
      default: 0,
    },
    wordCount: {
      type: Number,
      default: 0,
    },
    characterCount: {
      type: Number,
      default: 0,
    },
    clickbaitScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    emotionalLanguageScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    suspiciousPhraseCount: {
      type: Number,
      default: 0,
    },
    capitalizationScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    punctuationScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    detectedIndicators: {
      type: [String],
      default: [],
    },
    keyPhrases: {
      type: [String],
      default: [],
    },
    explanation: {
      type: String,
      required: true,
    },
    recommendation: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for fast history queries and dashboard aggregations
analysisSchema.index({ userId: 1, createdAt: -1 });
analysisSchema.index({ prediction: 1, createdAt: -1 });

export const Analysis = mongoose.model<IAnalysis>('Analysis', analysisSchema);
