import { Response } from 'express';
import { User } from '../models/User.ts';
import { Analysis } from '../models/Analysis.ts';
import { Feedback } from '../models/Feedback.ts';
import { AuthenticatedRequest } from '../middleware/authMiddleware.ts';

export async function getAdminStats(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const [
      totalUsers,
      totalAnalyses,
      categoryCounts,
      totalFeedback,
      accurateFeedbackCount,
    ] = await Promise.all([
      User.countDocuments(),
      Analysis.countDocuments(),
      Analysis.aggregate([
        {
          $group: {
            _id: '$prediction',
            count: { $sum: 1 },
          },
        },
      ]),
      Feedback.countDocuments(),
      Feedback.countDocuments({ isAccurate: true }),
    ]);

    let credibleCount = 0;
    let verificationCount = 0;
    let misleadingCount = 0;

    for (const item of categoryCounts) {
      if (item._id === 'Likely Credible') credibleCount = item.count;
      else if (item._id === 'Needs Verification') verificationCount = item.count;
      else if (item._id === 'Potentially Misleading') misleadingCount = item.count;
    }

    const feedbackAccuracyRate = totalFeedback > 0 ? Math.round((accurateFeedbackCount / totalFeedback) * 100) : 0;

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalAnalyses,
        credibleCount,
        verificationCount,
        misleadingCount,
        totalFeedback,
        feedbackAccuracyRate,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve admin statistics: ' + error.message,
    });
  }
}

export async function getAdminUsers(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 }).lean();

    // Map analysis count per user
    const userIds = users.map(u => u._id);
    const analysisCounts = await Analysis.aggregate([
      { $match: { userId: { $in: userIds } } },
      { $group: { _id: '$userId', count: { $sum: 1 } } },
    ]);

    const countsMap = new Map<string, number>();
    for (const ac of analysisCounts) {
      countsMap.set(ac._id.toString(), ac.count);
    }

    const enhancedUsers = users.map(u => ({
      ...u,
      analysesCount: countsMap.get(u._id.toString()) || 0,
    }));

    res.status(200).json({
      success: true,
      users: enhancedUsers,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve user directory: ' + error.message,
    });
  }
}

export async function getAdminAnalyses(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit as string, 10) || 15));
    const skip = (page - 1) * limit;

    const { prediction, search } = req.query;
    const query: any = {};

    if (prediction && typeof prediction === 'string' && prediction !== 'All') {
      query.prediction = prediction;
    }

    if (search && typeof search === 'string' && search.trim()) {
      query.$or = [
        { headline: { $regex: search.trim(), $options: 'i' } },
        { sourceName: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    const [analyses, totalCount] = await Promise.all([
      Analysis.find(query)
        .populate('userId', 'name email role')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Analysis.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      data: analyses,
      pagination: {
        totalItems: totalCount,
        totalPages: Math.ceil(totalCount / limit) || 1,
        currentPage: page,
        limit,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve admin analyses: ' + error.message,
    });
  }
}

export async function getAdminFeedback(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const feedbackList = await Feedback.find()
      .populate('userId', 'name email')
      .populate('analysisId', 'headline prediction credibilityScore')
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    res.status(200).json({
      success: true,
      feedback: feedbackList,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve feedback list: ' + error.message,
    });
  }
}

export async function adminDeleteAnalysis(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;

    const analysis = await Analysis.findById(id);
    if (!analysis) {
      res.status(404).json({ success: false, message: 'Analysis not found.' });
      return;
    }

    await Analysis.findByIdAndDelete(id);
    await Feedback.deleteMany({ analysisId: id });

    res.status(200).json({
      success: true,
      message: 'Analysis record and associated feedback removed by Administrator.',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error executing admin deletion: ' + error.message,
    });
  }
}
