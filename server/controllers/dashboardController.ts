import { Response } from 'express';
import { Types } from 'mongoose';
import { Analysis } from '../models/Analysis.ts';
import { AuthenticatedRequest } from '../middleware/authMiddleware.ts';

export async function getDashboardStats(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const userObjectId = new Types.ObjectId(req.user!.id);

    const [counts, averages, recentAnalyses] = await Promise.all([
      Analysis.aggregate([
        { $match: { userId: userObjectId } },
        {
          $group: {
            _id: '$prediction',
            count: { $sum: 1 },
          },
        },
      ]),
      Analysis.aggregate([
        { $match: { userId: userObjectId } },
        {
          $group: {
            _id: null,
            totalAnalyses: { $sum: 1 },
            avgScore: { $avg: '$credibilityScore' },
            avgConfidence: { $avg: '$confidenceScore' },
          },
        },
      ]),
      Analysis.find({ userId: userObjectId })
        .sort({ createdAt: -1 })
        .limit(5)
        .select('headline prediction credibilityScore confidenceScore createdAt sentiment')
        .lean(),
    ]);

    let credibleCount = 0;
    let verificationCount = 0;
    let misleadingCount = 0;

    for (const item of counts) {
      if (item._id === 'Likely Credible') credibleCount = item.count;
      else if (item._id === 'Needs Verification') verificationCount = item.count;
      else if (item._id === 'Potentially Misleading') misleadingCount = item.count;
    }

    const totalAnalyses = averages[0]?.totalAnalyses || 0;
    const averageScore = Math.round(averages[0]?.avgScore || 0);
    const averageConfidence = Math.round(averages[0]?.avgConfidence || 0);

    res.status(200).json({
      success: true,
      stats: {
        totalAnalyses,
        credibleCount,
        verificationCount,
        misleadingCount,
        averageScore,
        averageConfidence,
        recentAnalyses,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to compute dashboard metrics: ' + error.message,
    });
  }
}
