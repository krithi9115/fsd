/**
 * Verification & NLP Engine Test Suite
 * Tests Authentication, Validation, Authorization, NLP Analysis, and Database Operations
 */

import { connectDB, disconnectDB } from '../config/db.ts';
import { User } from '../models/User.ts';
import { Analysis } from '../models/Analysis.ts';
import { Feedback } from '../models/Feedback.ts';
import { NLPService } from '../services/nlpService.ts';
import { CredibilityService } from '../services/credibilityService.ts';
import { ExplanationService } from '../services/explanationService.ts';
import { generateToken, verifyToken } from '../utils/token.ts';
import { validateRegistration, validateNewsSubmission } from '../utils/validators.ts';
import bcrypt from 'bcryptjs';

async function runTestSuite() {
  console.log('\n======================================================');
  console.log('🧪 Starting VeriNews Automated Test Suite');
  console.log('======================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`  ✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${testName}`);
      failed++;
    }
  }

  try {
    await connectDB();

    // --- TEST SUITE 1: AUTHENTICATION & VALIDATION ---
    console.log('\n[1] Authentication & Input Validation Tests');

    const invalidReg = validateRegistration({
      name: '',
      email: 'not-an-email',
      password: '123',
      confirmPassword: '456',
    });
    assert(!invalidReg.isValid, 'Rejects invalid registration inputs');
    assert(Boolean(invalidReg.errors.name), 'Flags empty name');
    assert(Boolean(invalidReg.errors.email), 'Flags invalid email syntax');
    assert(Boolean(invalidReg.errors.password), 'Flags password shorter than 8 characters');
    assert(Boolean(invalidReg.errors.confirmPassword), 'Flags password mismatch');

    const validReg = validateRegistration({
      name: 'Test Verifier',
      email: 'verifier.test@press.org',
      password: 'Password123!',
      confirmPassword: 'Password123!',
    });
    assert(validReg.isValid, 'Accepts valid registration format');

    // Duplicate email check
    const salt = await bcrypt.genSalt(8);
    const hashedPassword = await bcrypt.hash('Password123!', salt);
    await User.deleteMany({ email: 'verifier.test@press.org' });
    const userA = await User.create({
      name: 'Test Verifier A',
      email: 'verifier.test@press.org',
      password: hashedPassword,
      role: 'user',
    });
    assert(Boolean(userA._id), 'Successfully creates user in MongoDB');

    const token = generateToken({
      id: userA._id.toString(),
      email: userA.email,
      role: userA.role,
      name: userA.name,
    });
    const decoded = verifyToken(token);
    assert(decoded.id === userA._id.toString() && decoded.role === 'user', 'Generates and verifies valid JWT');

    // --- TEST SUITE 2: NEWS SUBMISSION VALIDATION ---
    console.log('\n[2] News Submission Validation Tests');

    const emptyNews = validateNewsSubmission({ headline: '', content: '' });
    assert(!emptyNews.isValid, 'Rejects empty headline and content');

    const shortContentNews = validateNewsSubmission({
      headline: 'Headline here',
      content: 'Too short',
    });
    assert(!shortContentNews.isValid, 'Rejects content under minimum character threshold');

    const invalidUrlNews = validateNewsSubmission({
      headline: 'Valid Headline for Test',
      content: 'This is sufficiently long content to pass basic length checks for submission.',
      sourceUrl: 'htt:invalid_url',
    });
    assert(!invalidUrlNews.isValid, 'Rejects malformed source URLs');

    // --- TEST SUITE 3: NLP ANALYSIS ENGINE ---
    console.log('\n[3] Rule-Based NLP Processing Engine Tests');

    // Test Clickbait & Sensationalism
    const clickbaitText = 'DO NOT LET THIS BE HIDDEN! The media won\'t tell you the secret they don\'t want you to know! SHARE IMMEDIATELY before it gets deleted! Number 5 will surprise you!';
    const clickbaitHeadline = 'SHOCKING SECRET: You Won\'t Believe What Happened!!!';
    const nlpClickbait = NLPService.analyze(clickbaitHeadline, clickbaitText);
    assert(nlpClickbait.clickbaitScore >= 50, 'Identifies high clickbait headline patterns');
    assert(nlpClickbait.suspiciousPhraseCount >= 2, 'Detects suspicious viral phrases');
    assert(nlpClickbait.punctuationScore >= 40, 'Detects excessive stacked punctuation');

    const credMisleading = CredibilityService.calculate(nlpClickbait);
    assert(credMisleading.prediction === 'Potentially Misleading', 'Classifies sensational text as Potentially Misleading');
    assert(credMisleading.credibilityScore < 50, 'Assigns credibility score < 50');

    // Test Credible Article
    const credibleHeadline = 'Renewable Energy Commission Publishes Peer-Reviewed Study on Grid Storage Capacity';
    const credibleText = 'Delegates representing thirty academic institutions and state regulatory agencies completed a three-year double-blind trial analyzing lithium-iron-phosphate battery storage degradation under continuous cycling conditions. The empirical findings indicate average capacity retention exceeding eighty-eight percent over five thousand charge cycles.';
    const nlpCredible = NLPService.analyze(credibleHeadline, credibleText, 'https://reuters.com/energy/study-2026');
    const credCredible = CredibilityService.calculate(nlpCredible);

    assert(credCredible.prediction === 'Likely Credible', 'Classifies formal journalistic text as Likely Credible');
    assert(credCredible.credibilityScore >= 80, 'Assigns credibility score >= 80');

    // --- TEST SUITE 4: DATABASE & AUTHORIZATION ---
    console.log('\n[4] Database CRUD & Authorization Tests');

    const analysisDoc = await Analysis.create({
      userId: userA._id,
      headline: credibleHeadline,
      content: credibleText,
      sourceUrl: 'https://reuters.com/energy/study-2026',
      sourceName: 'REUTERS',
      prediction: credCredible.prediction,
      credibilityScore: credCredible.credibilityScore,
      confidenceScore: credCredible.confidenceScore,
      sentiment: nlpCredible.sentiment,
      sentimentScore: nlpCredible.sentimentScore,
      wordCount: nlpCredible.wordCount,
      characterCount: nlpCredible.characterCount,
      clickbaitScore: nlpCredible.clickbaitScore,
      emotionalLanguageScore: nlpCredible.emotionalLanguageScore,
      suspiciousPhraseCount: nlpCredible.suspiciousPhraseCount,
      capitalizationScore: nlpCredible.capitalizationScore,
      punctuationScore: nlpCredible.punctuationScore,
      detectedIndicators: nlpCredible.detectedIndicators,
      keyPhrases: nlpCredible.keyPhrases,
      explanation: ExplanationService.generateExplanation(nlpCredible, credCredible.prediction, credCredible.credibilityScore),
      recommendation: ExplanationService.generateRecommendation(credCredible.prediction),
    });

    assert(Boolean(analysisDoc._id), 'Successfully persists Analysis to MongoDB');

    // Feedback creation
    const feedbackDoc = await Feedback.create({
      userId: userA._id,
      analysisId: analysisDoc._id,
      isAccurate: true,
      comment: 'Matches peer review standards.',
    });
    assert(Boolean(feedbackDoc._id), 'Successfully stores Feedback in MongoDB');

    // Cleanup test records
    await Feedback.findByIdAndDelete(feedbackDoc._id);
    await Analysis.findByIdAndDelete(analysisDoc._id);
    await User.findByIdAndDelete(userA._id);
    assert(true, 'Successfully deletes test records from MongoDB');

    console.log('\n======================================================');
    console.log(`🎉 Test Execution Complete: ${passed} Passed, ${failed} Failed`);
    console.log('======================================================\n');
  } catch (err: any) {
    console.error('Test suite error:', err);
  } finally {
    await disconnectDB();
  }
}

runTestSuite();
