# Vercel Deployment Guide

This project is configured to deploy **both the React frontend and the Express REST API backend** together as a single unified deployment on **Vercel**.

---

## Architecture Overview on Vercel

```text
               ┌────────────────────────────────────────────────────────┐
               │                     Vercel Cloud                       │
               ├────────────────────────────┬───────────────────────────┤
               │   React Frontend (SPA)     │    Serverless API Engine  │
               │   Served from `dist/`      │    Runs `api/index.ts`    │
               │   Via Global Edge CDN      │    Express REST Endpoints │
               └─────────────┬──────────────┴─────────────┬─────────────┘
                             │                            │
                      Browser Traffic             Queries & Persists
                             │                            │
                             ▼                            ▼
                      End Users / Verifiers         MongoDB Atlas (Cloud)
```

1. **Frontend**: Vite compiles the React TypeScript client into `dist/`. Vercel distributes this statically across its global Edge CDN.
2. **Backend**: Express routes are served via the Serverless Function at `api/index.ts`. All `/api/*` endpoints are automatically routed here via `vercel.json`.
3. **Database**: Because serverless functions are ephemeral, production requires a cloud-hosted MongoDB cluster (e.g., **MongoDB Atlas Free M0 Tier**).

---

## Step 1: Set Up Free Cloud MongoDB (MongoDB Atlas)

*(Skip this step if you already have a MongoDB connection string).*

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) and create a free account.
2. Create a free **M0 Shared Cluster**.
3. Under **Security > Database Access**, create a database user (e.g., `app_user` with a secure password).
4. Under **Security > Network Access**, click **Add IP Address** and select **Allow Access from Anywhere (`0.0.0.0/0`)** so Vercel serverless functions can connect.
5. Click **Connect > Drivers**, and copy your connection string:
   ```text
   mongodb+srv://app_user:<password>@cluster0.abcde.mongodb.net/misinformation_db?retryWrites=true&w=majority
   ```
   *(Replace `<password>` with your database user password).*

---

## Step 2: Deploy to Vercel

You can deploy using either **Method A (GitHub Integration - Recommended)** or **Method B (Terminal / CLI)**.

### Method A: Deploy via GitHub (Recommended)

1. **Initialize Git and Commit**:
   ```powershell
   git init
   git add .
   git commit -m "Prepare for Vercel deployment"
   ```

2. **Push to GitHub**:
   - Create a new repository on [GitHub](https://github.com/new).
   - Link and push:
     ```powershell
     git remote add origin https://github.com/<your-username>/<repo-name>.git
     git branch -M main
     git push -u origin main
     ```

3. **Import into Vercel**:
   - Go to [vercel.com/new](https://vercel.com/new).
   - Select your GitHub repository.
   - Under **Framework Preset**, select **Vite**.
   - Under **Environment Variables**, add:
     - `MONGO_URI`: `mongodb+srv://app_user:<password>@cluster0.abcde.mongodb.net/misinformation_db?retryWrites=true&w=majority`
     - `JWT_SECRET`: `news_credibility_jwt_secret_token_key_production_2026`
   - Click **Deploy**.

---

### Method B: Deploy Directly via Vercel CLI

If you prefer deploying straight from your terminal:

1. In your project root, run:
   ```powershell
   npx vercel
   ```
2. Log in and confirm the project settings:
   - **Link to existing project?**: No
   - **Project name**: (Press Enter or customize)
   - **In which directory is your code located?**: `./`
3. Add your production environment variables:
   ```powershell
   npx vercel env add MONGO_URI production
   npx vercel env add JWT_SECRET production
   ```
4. Deploy to production:
   ```powershell
   npx vercel --prod
   ```

---

## Step 3: Verification & Initial Seed

1. Once deployment finishes, Vercel will provide your live URL (e.g., `https://your-project.vercel.app`).
2. Visit `https://your-project.vercel.app/api/health` to confirm the backend API is live:
   ```json
   {
     "status": "healthy",
     "service": "Misinformation Verification Platform API",
     "environment": "vercel-serverless"
   }
   ```
3. The platform automatically seeds your demo admin and user accounts on the first database connection.
   - **Admin**: `admin@credibility.org` / `AdminPass123!`
   - **User**: `jane.doe@university.edu` / `UserPass123!`
   - **User**: `marcus.reed@presswatch.org` / `UserPass123!`
