import { Response } from 'express';
import { Types } from 'mongoose';
import { Feedback } from '../models/Feedback.ts';
import { Analysis } from '../models/Analysis.ts';
import { AuthenticatedRequest } from '../middleware/authMiddleware.ts';

export async function submitFeedback(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { analysisId, isAccurate, comment } = req.body;

    if (!analysisId) {
      res.status(400).json({ success: false, message: 'Analysis ID is required.' });
      return;
    }

    if (typeof isAccurate !== 'boolean') {
      res.status(400).json({ success: false, message: 'Rating selection (isAccurate: boolean) is required.' });
      return;
    }

    // Verify analysis exists
    const analysis = await Analysis.findById(analysisId);
    if (!analysis) {
      res.status(404).json({ success: false, message: 'Analysis not found.' });
      return;
    }

    // Upsert feedback
    const feedback = await Feedback.findOneAndUpdate(
      {
        userId: new Types.ObjectId(req.user!.id),
        analysisId: new Types.ObjectId(analysisId),
      },
      {
        userId: new Types.ObjectId(req.user!.id),
        analysisId: new Types.ObjectId(analysisId),
        isAccurate,
        comment: (comment || '').trim(),
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    );

    res.status(200).json({
      success: true,
      message: 'Feedback submitted successfully. Thank you for helping refine credibility heuristics.',
      data: feedback,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to submit feedback: ' + error.message,
    });
  }
}

export async function getFeedback(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { analysisId } = req.params;

    const feedback = await Feedback.findOne({
      analysisId: new Types.ObjectId(analysisId),
      userId: new Types.ObjectId(req.user!.id),
    });

    res.status(200).json({
      success: true,
      data: feedback || null,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve feedback: ' + error.message,
    });
  }
}
