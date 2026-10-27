import bcrypt from 'bcryptjs';
import { User } from './models/User.ts';
import { Analysis } from './models/Analysis.ts';
import { Feedback } from './models/Feedback.ts';
import { NLPService } from './services/nlpService.ts';
import { CredibilityService } from './services/credibilityService.ts';
import { ExplanationService } from './services/explanationService.ts';

export async function seedDatabase(): Promise<void> {
  const userCount = await User.countDocuments();
  if (userCount > 0) {
    console.log(`Database already initialized with ${userCount} users. Skipping seed.`);
    return;
  }

  console.log('Seeding initial MERN database with demo accounts and benchmark analyses...');

  const salt = await bcrypt.genSalt(10);
  const adminPassword = await bcrypt.hash('AdminPass123!', salt);
  const userPassword = await bcrypt.hash('UserPass123!', salt);

  const admin = await User.create({
    name: 'Dr. Eleanor Vance (Chief Verifier)',
    email: 'admin@credibility.org',
    password: adminPassword,
    role: 'admin',
  });

  const userJane = await User.create({
    name: 'Jane Doe',
    email: 'jane.doe@university.edu',
    password: userPassword,
    role: 'user',
  });

  const userMarcus = await User.create({
    name: 'Marcus Reed',
    email: 'marcus.reed@presswatch.org',
    password: userPassword,
    role: 'user',
  });

  const sampleArticles = [
    {
      user: userJane,
      headline: 'Global Climate Summit Concludes With Multilateral Accord on Renewable Energy Grid Modernization',
      content:
        'Delegates from eighty-four participating nations concluded five days of intensive diplomatic discussions in Geneva this afternoon, finalizing a binding protocol aimed at accelerating clean energy transmission across international borders. The agreement establishes shared technical standards for high-voltage direct current lines and creates a monitored transparent financing mechanism for emerging economies. Scientific panels convened alongside ministerial sessions presented peer-reviewed datasets indicating that coordinated grid modernization could reduce curtailment losses by upwards of twenty-two percent over the coming decade.',
      sourceUrl: 'https://reuters.com/sustainability/geneva-climate-summit-grid-accord-2026',
    },
    {
      user: userJane,
      headline: 'Clinical Trial Phase III Results Confirm Efficacy and Safety Profile of Novel Pediatric Vaccine',
      content:
        'A comprehensive double-blind randomized clinical trial involving over twelve thousand pediatric participants across sixteen academic medical centers has demonstrated ninety-four percent efficacy against seasonal respiratory infections. The peer-reviewed findings, published this morning in the Journal of Medical Science, report no severe unexpected adverse events during the nine-month observational follow-up. Independent biostatistical reviewers confirmed that the observed immune response met all predetermined non-inferiority endpoints.',
      sourceUrl: 'https://nih.gov/news-events/clinical-trial-pediatric-respiratory-2026',
    },
    {
      user: userJane,
      headline: 'Central Bank Announces Modest Interest Rate Adjustment Amid Easing Inflationary Pressures',
      content:
        'The monetary policy committee voted six to three today to reduce the benchmark interest rate by twenty-five basis points, bringing the target corridor to four point two five percent. The governor emphasized in a formal press conference that while core consumer price inflation has moderated steadily over three consecutive quarters, ongoing labor market strength warrants a measured, data-dependent trajectory for future adjustments.',
      sourceUrl: 'https://ft.com/economy/central-bank-rate-decision-june',
    },
    {
      user: userMarcus,
      headline: 'Leaked Internal Memo Claims Tech Giant Planning Unprecedented Layoffs Next Quarter',
      content:
        'An unverified internal memorandum allegedly circulating among mid-level engineering managers suggests that senior corporate executives are evaluating restructuring proposals that could impact several thousand positions. While multiple unnamed industry commentators shared snippets on professional forums, official representatives for the firm declined to corroborate the document, maintaining that workforce resource allocations are continually assessed based on market conditions.',
      sourceUrl: 'https://techinsider-rumors.blog/leaked-restructuring-memo',
    },
    {
      user: userMarcus,
      headline: 'Local Municipal Council Questioned Regarding Campaign Expenditures in City Infrastructure Project',
      content:
        'Civic watchdog organizations have submitted formal inquiries concerning procurement contracts awarded during the municipal waterfront revitalization initiative. Documents obtained through public records requests highlight disparities between preliminary budget estimates and subsequent subcontractor disbursements. Council leadership issued a statement welcoming independent audit review to verify regulatory compliance.',
      sourceUrl: 'https://cityherald-dispatch.net/local-government/council-audit-waterfront',
    },
    {
      user: userMarcus,
      headline: 'Mysterious Deep-Sea Geological Formations Discovered Off Coast of Portugal',
      content:
        'Marine geologists conducting high-resolution acoustic bathymetry mapping approximately two hundred nautical miles west of Lisbon identified unusual concentric basalt mounds at depths exceeding three thousand meters. While preliminary acoustic scans sparked speculative theories across social media forums regarding sunken ancient civilisations, researchers stressed that hydrothermal volcanic activity remains the most probable scientific explanation pending core sample extraction.',
      sourceUrl: '',
    },
    {
      user: userMarcus,
      headline: 'SHOCKING SECRET: Mainstream Media Suppresses Miracle Herb That Completely Cures All Illnesses In 48 Hours!!!',
      content:
        'DO NOT LET THIS BE HIDDEN! The media won\'t tell you the secret information they don\'t want you to know! Big Pharma is terrified because this 100% guaranteed miracle plant wipes out every disease known to mankind in just two days. SHARE IMMEDIATELY before they delete this post forever! Insiders reveal doctors have been forbidden from speaking the truth! Wake up sheeple and buy the secret extract now!',
      sourceUrl: 'https://miracle-cure-secrets-now.freeblog.xyz/urgent',
    },
    {
      user: admin,
      headline: 'THEY DON\'T WANT YOU TO KNOW: Government Secretly Installing Mind Control Frequencies In Streetlights - SHARE IMMEDIATELY!!!',
      content:
        'CENSORED BY THE DEEP STATE! Secret leaked confidential blueprints prove that local authorities are replacing standard city illumination with sinister microwave transmitters! Mainstream media is lying to you! Forward to everyone right now! If you see workers on your street, do not let this be hidden! 100% guaranteed proof they lied to the entire nation!',
      sourceUrl: '',
    },
    {
      user: admin,
      headline: 'You Won\'t Believe What This Politician Was Caught Doing On Private Yacht - Number 5 Will Blow Your Mind!',
      content:
        'Explosive scandal rocks the capital! What happens next is totally unbelievable! Pictures have leaked showing what really went down behind closed doors, and it will leave you speechless! Stop everything and see what happened! Number 5 will surprise you more than anything you have ever seen in politics!',
      sourceUrl: 'https://viral-buzz-clicker.info/shocking-yacht-photos',
    },
  ];

  const createdAnalyses = [];

  for (const article of sampleArticles) {
    const nlp = NLPService.analyze(article.headline, article.content, article.sourceUrl);
    const credibility = CredibilityService.calculate(nlp);
    const explanation = ExplanationService.generateExplanation(nlp, credibility.prediction, credibility.credibilityScore);
    const recommendation = ExplanationService.generateRecommendation(credibility.prediction);

    const doc = await Analysis.create({
      userId: article.user._id,
      headline: article.headline,
      content: article.content,
      sourceUrl: article.sourceUrl,
      sourceName: nlp.sourceAnalysis.sourceName || '',
      prediction: credibility.prediction,
      credibilityScore: credibility.credibilityScore,
      confidenceScore: credibility.confidenceScore,
      sentiment: nlp.sentiment,
      sentimentScore: nlp.sentimentScore,
      wordCount: nlp.wordCount,
      characterCount: nlp.characterCount,
      clickbaitScore: nlp.clickbaitScore,
      emotionalLanguageScore: nlp.emotionalLanguageScore,
      suspiciousPhraseCount: nlp.suspiciousPhraseCount,
      capitalizationScore: nlp.capitalizationScore,
      punctuationScore: nlp.punctuationScore,
      detectedIndicators: nlp.detectedIndicators,
      keyPhrases: nlp.keyPhrases,
      explanation,
      recommendation,
    });
    createdAnalyses.push(doc);
  }

  // Create sample feedback
  if (createdAnalyses.length >= 3) {
    await Feedback.create({
      userId: userJane._id,
      analysisId: createdAnalyses[0]._id,
      isAccurate: true,
      comment: 'Accurately reflected the neutral tone and verified scientific context of the Reuters dispatch.',
    });

    await Feedback.create({
      userId: userMarcus._id,
      analysisId: createdAnalyses[6]._id, // The miracle cure article
      isAccurate: true,
      comment: 'Correctly flagged as Potentially Misleading with 100% accurate clickbait and suspicious phrase detection.',
    });

    await Feedback.create({
      userId: userJane._id,
      analysisId: createdAnalyses[3]._id, // Leaked memo
      isAccurate: true,
      comment: 'Fair assessment classifying as Needs Verification since source was an unverified internal document.',
    });
  }

  console.log(`Database seeded successfully! Created 1 admin, 2 users, ${createdAnalyses.length} analyses, and feedback samples.`);
}

// Standalone execution support
if (process.argv[1]?.endsWith('seed.ts')) {
  import('./config/db.ts').then(async ({ connectDB, disconnectDB }) => {
    try {
      await connectDB();
      await seedDatabase();
    } catch (e: any) {
      console.error('Seed error:', e);
    } finally {
      await disconnectDB();
      process.exit(0);
    }
  });
}
