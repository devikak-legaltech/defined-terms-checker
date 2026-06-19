# Defined Terms Checker

AI-powered legal contract analyzer. Paste any contract and instantly get:
- **Inconsistencies** — defined terms used with wrong capitalisation
- **Undefined Usages** — terms like "Party", "Fees", "Commencement Date" used as defined but never defined
- **Unused Definitions** — formally defined terms that never appear in operative clauses
- **Missing Attachments** — Schedules/Annexures referenced but not present

Built with React + Vite + Claude AI (claude-sonnet-4-6).

---

## Deploy to Vercel (5 minutes)

### Step 1 — Push to GitHub
```bash
git init
git add .
git commit -m "initial commit"
# Create a new repo on github.com, then:
git remote add origin https://github.com/YOUR_USERNAME/defined-terms-checker.git
git push -u origin main
```

### Step 2 — Deploy on Vercel
1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import your GitHub repo
3. Framework: **Vite** (auto-detected)
4. Click **Deploy**

### Step 3 — Add API Key
1. In Vercel dashboard → your project → **Settings → Environment Variables**
2. Add: `ANTHROPIC_API_KEY` = your key from [console.anthropic.com](https://console.anthropic.com)
3. Click **Save** → go to **Deployments** → **Redeploy**

Your live link will be: `https://defined-terms-checker.vercel.app`

---

## Run locally
```bash
npm install
cp .env.example .env       # add your API key to .env
npm run dev
```
