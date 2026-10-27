# Misinformation Verification and News Credibility Analysis Platform

A complete, production-grade, full-stack web application built **exclusively using the MERN stack** (MongoDB, Express.js, React.js, Node.js). The platform analyzes news articles using rule-based natural language processing (NLP) techniques implemented in Node.js, computes a multi-factor credibility score (0–100), classifies content into transparency categories, and provides human-readable verification recommendations.

---

## ⚠️ Important System Limitation & Academic Ethics Notice

> **"This system provides an automated linguistic credibility assessment. It does not establish the factual truth of an article. Users should independently verify important claims using reliable sources."**
>
> The scoring engine relies entirely on deterministic, explainable, rule-based NLP techniques (syntactic parsing, clickbait heuristics, lexical emotion quantification, orthographic indicators, and dictionary sentiment). It does **not** claim to be an ungrounded or deceptive machine-learning black box.

---

## 1. Project Overview

Digital misinformation frequently exhibits distinct linguistic artifacts: forward-referencing clickbait headlines, extreme emotional or sensational vocabulary, excessive capitalization and exclamation marks, repeated viral distribution directives, and lack of primary source attribution.

This platform empowers students, journalists, and researchers to:
1. Submit news headlines and full article texts (with optional reference URLs).
2. Execute a multi-stage linguistic evaluation pipeline in real time.
3. Inspect granular indicators (Clickbait Score, Emotional Language Density, Suspicious Phrase Matches, Capitalization Anomaly, Punctuation Pattern, and Sentiment Polarity).
4. Receive a calibrated Credibility Index (0–100) and actionable classification:
   - **Likely Credible** (80–100)
   - **Needs Verification** (50–79)
   - **Potentially Misleading** (0–49)
5. Review automated, context-specific explanations and investigative recommendations.
6. Persist every analysis into MongoDB with full pagination, filtering, search, and deletion controls.
7. Submit feedback to evaluate heuristic performance.
8. Access personal verifier dashboards and administrative audit oversight panels.

---

## 2. Key Features

- **JWT Authentication & Authorization**:
  - Secure registration, password hashing with `bcryptjs`, and role-based access control (`user` vs `admin`).
- **Node.js NLP Engine (`services/nlpService.ts`)**:
  - Text preprocessing: lowercase normalization, tokenization, stop-word elimination, sentence parsing, and TF-IDF style key phrase extraction.
  - Rule-based clickbait detection with regular expression patterns and interrogative headline heuristics.
  - Emotional and sensational lexicon quantification (frequency per 100 words).
  - Suspicious viral manipulation detection ("share immediately", "censored by the media", "hidden cure").
  - Orthographic capitalization and exclamation/question mark density scoring.
  - Lexicon-based polarity sentiment scoring from -1.00 to +1.00.
  - Source domain attribution analysis.
- **Credibility Scoring Engine (`services/credibilityService.ts`)**:
  - Multi-factor weighted deductions capped within explainable boundaries (5–98).
  - Confidence calculation reflecting signal strength and text length.
- **Dynamic Explanation Generator (`services/explanationService.ts`)**:
  - Synthesizes clear, readable justifications tailored to the specific indicators detected.
- **Full Historical Persistence**:
  - MongoDB collections for `User`, `Analysis`, and `Feedback`.
  - Pagination, category filtering, keyword search, and deletion.
- **Interactive User Dashboard**:
  - Visual distribution metrics, classification breakdown progress bars, average signal confidence, and recent analysis feeds.
- **Comprehensive Admin Panel**:
  - System-wide KPIs, registered user directory with analysis counts, system-wide analysis moderation, and feedback evaluation stream.
- **Developer & Reviewer Utilities**:
  - Pre-seeded accounts (1 Admin, 2 Users, 9 benchmark articles).
  - 1-click sample article loaders in the verification interface.
  - Automated integration test suite (`npm run test`).

---

## 3. Technology Stack

| Layer | Technology | Role |
|---|---|---|
| **Database** | MongoDB / Mongoose ODM | Document persistence for users, analyses, and feedback |
| **Backend** | Node.js + Express.js | REST APIs, JWT authentication, rule-based NLP pipeline |
| **Frontend** | React 19 + TypeScript | Single Page Application, component lifecycle & state |
| **Styling** | Tailwind CSS v4 | Academic/modern responsive layout with zero UI slop |
| **Routing** | React Router DOM v7 | Client-side routing with protected and role-gated routes |
| **HTTP Client** | Axios | REST communication with authorization interceptors |
| **Security** | `jsonwebtoken` & `bcryptjs` | Token issuance, verification, and password salt hashing |

---

## 4. System Architecture

```text
                   ┌─────────────────────────────────────────┐
                   │             React Frontend              │
                   │   Tailwind CSS • React Router • Axios   │
                   └────────────────────┬────────────────────┘
                                        │ REST APIs (/api/*)
                                        │ Bearer JWT Auth
                                        ▼
                   ┌─────────────────────────────────────────┐
                   │          Express.js HTTP Server         │
                   ├─────────────────────────────────────────┤
                   │  • authRoutes & middleware              │
                   │  • analysisRoutes & controllers         │
                   │  • dashboardRoutes                      │
                   │  • feedbackRoutes & userRoutes          │
                   │  • adminRoutes & adminMiddleware        │
                   └───────┬─────────────────────────┬───────┘
                           │                         │
            Invokes Pipeline                         │ Queries & Writes
                           ▼                         ▼
            ┌────────────────────────────┐    ┌─────────────────────┐
            │     Node.js NLP Engine     │    │   MongoDB Database  │
            ├────────────────────────────┤    ├─────────────────────┤
            │ • Tokenizer & Preprocessor │    │ • users collection  │
            │ • Clickbait Pattern Match  │    │ • analyses coll.    │
            │ • Emotional Lexicon Scan   │    │ • feedback coll.    │
            │ • Suspicious Phrase Filter │    └─────────────────────┘
            │ • Orthographic Caps & Punc │
            │ • Sentiment Polarity       │
            │ • Credibility Synthesizer  │
            │ • Explanation Generator    │
            └────────────────────────────┘
```

---

## 5. Folder Structure

```text
/
├── server/
│   ├── config/
│   │   └── db.ts                   # MongoDB connection & MongoMemoryServer fallback
│   ├── controllers/
│   │   ├── authController.ts       # Registration, login, profile validation
│   │   ├── analysisController.ts   # NLP execution, persistence, history & deletion
│   │   ├── dashboardController.ts  # Aggregate metrics and breakdown calculations
│   │   ├── feedbackController.ts   # User accuracy rating submissions
│   │   ├── userController.ts       # Profile inspection and password updates
│   │   └── adminController.ts      # Administrative telemetry and record moderation
│   ├── middleware/
│   │   ├── authMiddleware.ts       # JWT Bearer token verification
│   │   ├── adminMiddleware.ts      # Role === 'admin' verification
│   │   └── errorMiddleware.ts      # Centralized error handler
│   ├── models/
│   │   ├── User.ts                 # Mongoose User schema & indexes
│   │   ├── Analysis.ts             # Mongoose Analysis schema & indicators
│   │   └── Feedback.ts             # Mongoose Feedback schema
│   ├── routes/
│   │   ├── authRoutes.ts           # /api/auth routes
│   │   ├── analysisRoutes.ts       # /api/analysis routes
│   │   ├── dashboardRoutes.ts      # /api/dashboard routes
│   │   ├── feedbackRoutes.ts       # /api/feedback routes
│   │   ├── userRoutes.ts           # /api/users routes
│   │   └── adminRoutes.ts          # /api/admin routes
│   ├── services/
│   │   ├── nlpService.ts           # Deterministic NLP linguistic scanning engine
│   │   ├── credibilityService.ts   # Multi-factor score & confidence calculation
│   │   └── explanationService.ts   # Dynamic explanation & recommendation builder
│   ├── utils/
│   │   ├── token.ts                # JWT creation and decoding
│   │   └── validators.ts           # Input sanitization and format validators
│   ├── seed.ts                     # Pre-populates accounts & benchmark analyses
│   └── tests/
│       └── api.test.ts             # Automated integration test suite
├── src/
│   ├── components/
│   │   ├── Navbar.tsx              # Brand header with role indicator & mobile menu
│   │   ├── Footer.tsx              # Integrity notice & architecture reference
│   │   ├── Button.tsx              # Reusable button with spinner states
│   │   ├── Input.tsx               # Reusable input with validation feedback
│   │   ├── LoadingSpinner.tsx      # Step-by-step NLP analysis animation
│   │   ├── ProtectedRoute.tsx      # Authentication & role guard
│   │   ├── ScoreCard.tsx           # Circular gauge score card (0-100)
│   │   ├── IndicatorCard.tsx       # Detailed breakdown of linguistic metrics
│   │   ├── SentimentCard.tsx       # Polarity meter (-1.0 to +1.0)
│   │   ├── AnalysisCard.tsx        # Card display with confirmation deletion
│   │   └── Pagination.tsx          # Numerical page navigation component
│   ├── pages/
│   │   ├── Home.tsx                # Landing presentation & workflow overview
│   │   ├── Login.tsx               # Login with 1-click demo buttons
│   │   ├── Register.tsx            # Verifier account registration
│   │   ├── Dashboard.tsx           # Personal metrics, breakdown & recent analyses
│   │   ├── VerifyNews.tsx          # Article submission form with live counters
│   │   ├── AnalysisResult.tsx      # Deep dive result, indicators & feedback form
│   │   ├── History.tsx             # Paginated searchable evaluation archive
│   │   ├── Profile.tsx             # Profile info and password update
│   │   └── AdminDashboard.tsx      # System moderation, users, analyses & feedback
│   ├── services/
│   │   └── api.ts                  # Axios client with JWT interceptor
│   ├── context/
│   │   └── AuthContext.tsx         # Global session state & tokens
│   ├── hooks/
│   │   └── useAuth.ts              # Custom hook for authentication context
│   ├── App.tsx                     # Main layout & route definitions
│   └── main.tsx                    # React DOM client entry
├── server.ts                       # Root Express entry mounting Vite middleware
├── .env.example                    # Environment variable template
├── package.json                    # Scripts and dependencies
└── tsconfig.json                   # TypeScript configuration
```

---

## 6. Installation & Local Setup

### Prerequisites
- Node.js v18 or higher (v20+ recommended)
- npm or yarn

### 1. Clone & Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Default variables:
```env
PORT=3000
MONGO_URI="mongodb://localhost:27017/misinformation_db"
JWT_SECRET="news_credibility_jwt_secret_token_key_academic_2026"
CLIENT_URL="http://localhost:3000"
```

> **Zero-Config Embedded MongoDB**: If no external MongoDB daemon is active at `MONGO_URI`, the server will automatically launch an in-memory `MongoMemoryServer` instance. All Mongoose models, queries, and persistence function seamlessly without requiring a local MongoDB installation!

### 3. Start the Development Server
```bash
npm run dev
```
Open `http://localhost:3000` in your web browser.

### 4. Run the Automated Test Suite
```bash
npm run test
```
Executes all 21 automated integration and unit test scenarios:
- Registration validation and duplicate email rejection
- Password length and matching enforcement
- News input length and URL format verification
- Clickbait and emotional language score computation
- Database CRUD and authorization checks

---

## 7. Pre-Configured Demo Accounts

For instant review and academic grading, the following demo accounts are seeded automatically on first launch:

| Role | Email | Password | Permissions |
|---|---|---|---|
| **Admin** | `admin@credibility.org` | `AdminPass123!` | Full access: View all users, moderate analyses, review feedback stream, system KPIs |
| **Standard User** | `jane.doe@university.edu` | `UserPass123!` | News verification, personal dashboard, history logs, feedback submission |
| **Standard User** | `marcus.reed@presswatch.org` | `UserPass123!` | News verification, personal dashboard, history logs |

*(Quick-fill buttons are also available directly on the `/login` screen).*

---

## 8. REST API Documentation

All protected endpoints require an `Authorization: Bearer <TOKEN>` header.

### Authentication Endpoints
- `POST /api/auth/register` — Create a new user account.
- `POST /api/auth/login` — Authenticate and receive a JWT.
- `GET /api/auth/me` — Retrieve the currently authenticated user profile.
- `POST /api/auth/logout` — Invalidate client-side session.

### Analysis Endpoints
- `POST /api/analysis` — Submit headline, content, and optional URL for NLP processing. Returns the full analysis document.
- `GET /api/analysis/:id` — Retrieve an individual analysis with its feedback.
- `DELETE /api/analysis/:id` — Remove an analysis from history (owner or admin).
- `GET /api/analysis/history` — Paginated history with `?page=1&limit=10&prediction=...&search=...`.

### Dashboard Endpoints
- `GET /api/dashboard/stats` — User metrics: total analyses, counts by category, average score, signal confidence, and recent items.

### Feedback Endpoints
- `POST /api/feedback` — Submit feedback (`{ analysisId, isAccurate, comment }`).
- `GET /api/feedback/:analysisId` — Retrieve feedback for a specific analysis.

### User Endpoints
- `GET /api/users/profile` — User profile details with analysis count.
- `PUT /api/users/profile` — Update name or change password.

### Admin Endpoints (Requires `role === 'admin'`)
- `GET /api/admin/stats` — System-wide counts, category ratios, and feedback accuracy rate.
- `GET /api/admin/users` — Directory of all registered accounts and submission counts.
- `GET /api/admin/analyses` — Master table of all submitted analyses across users.
- `GET /api/admin/feedback` — Stream of all submitted verifier feedback.
- `DELETE /api/admin/analysis/:id` — Administrative removal of inappropriate records.

---

## 9. NLP Heuristic Formulations

1. **Clickbait Indicator ($S_{\text{clickbait}} \in [0, 100]$)**:
   - Evaluates headline forward-reference tropes, curiosity gaps, exclamations, and interrogatives.
2. **Emotional Language Score ($S_{\text{emotion}} \in [0, 100]$)**:
   - Calculates density of hyperbolic terms ($D_{\text{emotion}} = \frac{N_{\text{emotion}}}{N_{\text{tokens}}} \times 100$).
3. **Orthographic Anomaly ($S_{\text{caps}}, S_{\text{punc}} \in [0, 100]$)**:
   - Scans uppercase character ratios and stacked punctuation marks (`?!`, `!!!`).
4. **Overall Credibility Index ($C \in [5, 98]$)**:
   $$C = \text{clamp}\Big(100 - P_{\text{clickbait}} - P_{\text{emotion}} - P_{\text{suspicious}} - P_{\text{caps}} - P_{\text{punc}} \pm \Delta_{\text{source}}, 5, 98\Big)$$
5. **Confidence Score ($\text{Conf} \in [45, 96]\%$)**:
   - Reflects corpus volume ($N_{\text{words}}$), source URL availability, and indicator consensus.

---

## 10. Future Enhancements

- **Cross-Lingual Tokenization**: Multilingual stop-word dictionaries and internationalization.
- **Automated Domain Credibility Registries**: Integration with accredited open newsroom registries.
- **Export Formats**: PDF / JSON-LD structured report downloads for academic citation.
- **Collaborative Fact-Checking Workspaces**: Team-based review annotations.

---

## 11. License & Academic Disclaimer

This project is developed as an academic and demonstration platform. All rule-based scoring outputs represent automated heuristic evaluations and should not be cited as definitive factual verdicts. Always verify news claims through multiple primary journalistic sources.
