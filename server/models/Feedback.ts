import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IFeedback extends Document {
  userId: Types.ObjectId;
  analysisId: Types.ObjectId;
  isAccurate: boolean;
  comment?: string;
  createdAt: Date;
}

const feedbackSchema = new Schema<IFeedback>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    analysisId: {
      type: Schema.Types.ObjectId,
      ref: 'Analysis',
      required: true,
      index: true,
    },
    isAccurate: {
      type: Boolean,
      required: true,
    },
    comment: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

// Prevent duplicate feedback by same user on same analysis
feedbackSchema.index({ userId: 1, analysisId: 1 }, { unique: true });

export const Feedback = mongoose.model<IFeedback>('Feedback', feedbackSchema);
