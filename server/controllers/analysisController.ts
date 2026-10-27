import { Response } from 'express';
import { Analysis } from '../models/Analysis.ts';
import { Feedback } from '../models/Feedback.ts';
import { NLPService } from '../services/nlpService.ts';
import { CredibilityService } from '../services/credibilityService.ts';
import { ExplanationService } from '../services/explanationService.ts';
import { validateNewsSubmission } from '../utils/validators.ts';
import { AuthenticatedRequest } from '../middleware/authMiddleware.ts';

export async function createAnalysis(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { headline, content, sourceUrl } = req.body;

    const validation = validateNewsSubmission({ headline, content, sourceUrl });
    if (!validation.isValid) {
      res.status(400).json({
        success: false,
        message: 'Content validation failed. Please check the submission criteria.',
        errors: validation.errors,
      });
      return;
    }

    // Run Node.js NLP Engine
    const nlpResult = NLPService.analyze(headline, content, sourceUrl);

    // Calculate Credibility & Confidence Scores
    const credibilityResult = CredibilityService.calculate(nlpResult);

    // Generate Dynamic Explanations & Recommendations
    const explanation = ExplanationService.generateExplanation(
      nlpResult,
      credibilityResult.prediction,
      credibilityResult.credibilityScore
    );
    const recommendation = ExplanationService.generateRecommendation(credibilityResult.prediction);

    // Save to MongoDB Analysis Collection
    const newAnalysis = await Analysis.create({
      userId: req.user!.id,
      headline: headline.trim(),
      content: content.trim(),
      sourceUrl: sourceUrl?.trim() || '',
      sourceName: nlpResult.sourceAnalysis.sourceName || '',
      prediction: credibilityResult.prediction,
      credibilityScore: credibilityResult.credibilityScore,
      confidenceScore: credibilityResult.confidenceScore,
      sentiment: nlpResult.sentiment,
      sentimentScore: nlpResult.sentimentScore,
      wordCount: nlpResult.wordCount,
      characterCount: nlpResult.characterCount,
      clickbaitScore: nlpResult.clickbaitScore,
      emotionalLanguageScore: nlpResult.emotionalLanguageScore,
      suspiciousPhraseCount: nlpResult.suspiciousPhraseCount,
      capitalizationScore: nlpResult.capitalizationScore,
      punctuationScore: nlpResult.punctuationScore,
      detectedIndicators: nlpResult.detectedIndicators,
      keyPhrases: nlpResult.keyPhrases,
      explanation,
      recommendation,
    });

    res.status(201).json({
      success: true,
      message: 'News credibility assessment completed successfully.',
      data: newAnalysis,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to analyze news content: ' + error.message,
    });
  }
}

export async function getAnalysisById(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;

    const analysis = await Analysis.findById(id).populate('userId', 'name email');
    if (!analysis) {
      res.status(404).json({
        success: false,
        message: 'Analysis record not found.',
      });
      return;
    }

    // Access check: User must own the analysis, or be an admin
    const isOwner = (analysis.userId as any)._id?.toString() === req.user!.id || (analysis.userId as any).toString() === req.user!.id;
    if (!isOwner && req.user!.role !== 'admin') {
      res.status(403).json({
        success: false,
        message: 'Access denied: You can only view your own analyses.',
      });
      return;
    }

    // Fetch existing feedback if any
    const feedback = await Feedback.findOne({
      analysisId: analysis._id,
      userId: req.user!.id,
    });

    res.status(200).json({
      success: true,
      data: analysis,
      userFeedback: feedback || null,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving analysis: ' + error.message,
    });
  }
}

export async function deleteAnalysis(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;

    const analysis = await Analysis.findById(id);
    if (!analysis) {
      res.status(404).json({
        success: false,
        message: 'Analysis record not found.',
      });
      return;
    }

    const isOwner = analysis.userId.toString() === req.user!.id;
    if (!isOwner && req.user!.role !== 'admin') {
      res.status(403).json({
        success: false,
        message: 'Access denied: You cannot delete another user\'s analysis record.',
      });
      return;
    }

    await Analysis.findByIdAndDelete(id);
    await Feedback.deleteMany({ analysisId: id });

    res.status(200).json({
      success: true,
      message: 'Analysis record deleted successfully from your history.',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error deleting analysis: ' + error.message,
    });
  }
}

export async function getHistory(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
    const limit = Math.max(1, Math.min(50, parseInt(req.query.limit as string, 10) || 10));
    const skip = (page - 1) * limit;

    const { prediction, search } = req.query;

    const query: any = { userId: req.user!.id };

    if (prediction && typeof prediction === 'string' && prediction !== 'All') {
      query.prediction = prediction;
    }

    if (search && typeof search === 'string' && search.trim()) {
      query.$or = [
        { headline: { $regex: search.trim(), $options: 'i' } },
        { content: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    const [analyses, totalCount] = await Promise.all([
      Analysis.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('-content') // Exclude full content in table list for lighter payload
        .lean(),
      Analysis.countDocuments(query),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    res.status(200).json({
      success: true,
      data: analyses,
      pagination: {
        totalItems: totalCount,
        totalPages: totalPages || 1,
        currentPage: page,
        limit,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve analysis history: ' + error.message,
    });
  }
}
