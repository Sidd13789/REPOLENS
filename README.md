#REPOLENS

GitHub Repository Evolution & Analytics Platform — sign up, connect GitHub,
analyze any repository (including your own private ones), and explore its
commits, contributors, languages, activity heatmap, timeline, file history,
and travel back to any point in its past.

**Stack:** React (Vite) + Tailwind + Recharts + React Router · Node.js/Express
· MongoDB/Mongoose · GitHub REST API · GitHub OAuth · JWT + bcrypt · Swagger/OpenAPI

## Structure

```
CodeTimeMachine/
├── backend/
│   ├── config/            db.js, swagger.js
│   ├── models/            User, Repository, Commit, Contributor, SavedAnalysis, Share
│   ├── services/          githubService.js — all GitHub REST API calls (per-user token aware)
│   ├── controllers/       authController, repoController, shareController, healthController
│   ├── routes/            authRoutes, repoRoutes, shareRoutes, healthRoutes (with OpenAPI JSDoc)
│   ├── middleware/        errorHandler, auth (protect), optionalAuth, rateLimiter
│   ├── tests/             example Jest + Supertest tests
│   ├── Dockerfile, render.yaml
│   └── server.js
└── frontend/
    └── src/
        ├── pages/          Landing, Login, Signup, Forgot/Reset Password, OAuthSuccess,
        │                    DashboardHome, Analyze, Profile, Settings, Share, NotFound,
        │                    + per-repo pages: Overview, Commits, CommitDetail, Timeline,
        │                      Analytics, Files, Compare
        ├── layouts/         DashboardLayout (sidebar), RepoLayout (tab nav)
        ├── context/         AuthContext, ToastContext, ThemeContext, NotificationContext
        ├── components/      ProtectedRoute, Sidebar, CommandPalette, NotificationBell,
        │                    StatCard, LanguageBar, Heatmap, TimeTravelSlider (with playback),
        │                    LoadingSkeleton, EmptyState, ErrorState
        ├── vercel.json
        └── services/        api.js, authService.js, repoService.js
```

## Setup

### 1. Backend

```bash
cd backend
npm install
cp  .env
```

Fill in `.env` — see the table below. At minimum: `MONGO_URI` and `JWT_SECRET`.

```bash
npm run dev      # start the API on :7000
npm test         # run the example test suite
```

API docs (Swagger UI): `http://localhost:7000/api/docs`

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Open `http://localhost:5173`. Sign up with email/password (or GitHub), then
analyze a repo from the dashboard. Press **⌘K / Ctrl+K** anywhere in the
dashboard for the command palette.

### 3. GitHub OAuth + private repos (optional but recommended)

1. Create an OAuth app at https://github.com/settings/developers.
2. Callback URL: `http://localhost:7000/api/auth/github/callback`.
3. Put the client ID/secret in `backend/.env` (`GITHUB_CALLBACK_URL` must match
   exactly). The OAuth scope requested is `read:user user:email repo`, so a
   user who signs in with GitHub can analyze their own private repositories —
   the Analyze page will list their repos (with a "private" tag) once
   connected, and the backend transparently uses their token instead of the
   app-level `GITHUB_TOKEN` for any repo they can access.

### 4. Password resets in development

No email service is wired up. `POST /api/auth/forgot-password` logs the reset
link to the backend console and — outside `NODE_ENV=production` — also
returns it in the response body (`devResetUrl`), which the frontend displays
directly. Swap in a real provider (Resend, SendGrid, SES) before deploying.

## What's implemented

- **Auth:** email/password signup+login (bcrypt + JWT), GitHub OAuth login,
  forgot/reset password, protected frontend routes + `protect`/`optionalAuth`
  backend middleware.
- **Private repository support:** each user's GitHub access token (from
  OAuth) is used for their own requests, so private repos they can access on
  GitHub work here too; `GET /api/repos/meta/my-repos` lists their repos
  (public + private) for the Analyze page's picker.
- **Dashboard:** sidebar nav, stats, saved analyses (with remove), a
  notification bell, and a command palette (⌘K) for quick navigation +
  theme toggle + logout.
- **Repository analysis:** analyze → cached in MongoDB → overview, commits
  (author filter + pagination), commit detail with file diffs, month-grouped
  timeline, analytics (Recharts: commits-over-time, additions/deletions,
  contributor activity), GitHub-style commit heatmap, file explorer +
  per-file history, structure-at-date, **time travel** with a manual slider
  *and* an auto-play "▶ Play Evolution" button, version comparison between
  two dates.
- **Sharing:** public `/share/:id` link, no login required to view.
- **Caching & sync:** repo metadata auto-refreshes hourly; `POST
  /api/repos/:owner/:repo/sync` incrementally pulls only new commits.
- **Rate limit awareness:** `GET /api/repos/meta/rate-limit` reflects the
  requesting user's own quota when they're signed in with GitHub.
- **API docs:** interactive Swagger UI at `/api/docs`, generated from JSDoc
  comments on the main routes (auth, analyze, commits, snapshot, compare —
  the rest of the routes are implemented but not yet individually annotated).
- **Hardening:** rate limiting (general + stricter on auth), consistent
  `{ success, message }` errors, structured logging that never logs secrets,
  indexes on the hot lookup fields, example Jest/Supertest tests.
- **Frontend polish:** dark/light theme toggle (Settings page or via the
  command palette) applied to the shell — sidebar, dashboard layout, repo
  tab layout, landing/login/signup; toast notifications; loading skeletons;
  empty/error states; 404 page.
- **Deployment configs:** `frontend/vercel.json`, `backend/render.yaml`,
  `backend/Dockerfile`.

## Known limitations / good next steps

- **Theme toggle coverage:** the light palette is wired up for the shell
  (sidebar, layouts, landing/login/signup) but the inner repository pages
  (Commits, Analytics, Files, Compare, etc.) still use hardcoded dark
  Tailwind classes — they'll look dark even when the theme is set to light.
  Retrofitting every page is mechanical (swap `bg-gray-900` → `bg-gray-50
  dark:bg-gray-900`-style pairs) but wasn't done for all ~15 of them yet.
- **Swagger annotations** cover the highest-traffic endpoints, not literally
  every route — the routes all work, just not all documented in `/api/docs`.
- **Test coverage** is example-level (`parseRepoUrl`, `/api/health`), not a
  full suite across every controller — most controllers need a test database
  to exercise meaningfully.
- **Language history in `/compare`** still reflects *current* language
  percentages (GitHub's API has no historical language endpoint).
- **Timeline** is derived by grouping commits into months rather than reading
  tags/releases — works for every repo, including ones with no releases.

## API Documentation

Once the backend is running: `http://localhost:7000/api/docs`

## Environment Variables

**backend/.env**

| Variable | Required for | Description |
|---|---|---|
| `PORT` | always | Backend port (default 7000) |
| `MONGO_URI` | always | MongoDB connection string |
| `CLIENT_URL` | always | Frontend origin — CORS + OAuth/reset-password redirects |
| `JWT_SECRET` | always | Signs auth tokens |
| `GITHUB_TOKEN` | recommended | App-level fallback token, raises anonymous rate limit to 7000/hr |
| `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` / `GITHUB_CALLBACK_URL` | GitHub login + private repos | From your GitHub OAuth App |

**frontend/.env**

| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend base URL (defaults to `/api`, proxied to `localhost:7000` in dev) |

## Deployment

- **Frontend → Vercel:** `frontend/vercel.json` handles SPA rewrites. Set
  `VITE_API_URL` to your deployed backend's URL in Vercel's env settings.
- **Backend → Render:** `backend/render.yaml` is a Render Blueprint — import
  the repo in Render and fill in the `sync: false` env vars in the dashboard.
- **Backend → Docker (Railway, Fly, anywhere):** `backend/Dockerfile` builds
  a production image; pass the same env vars as above at runtime.
- **Database → MongoDB Atlas:** create a free cluster, put its connection
  string in `MONGO_URI`.
- After deploying, update your GitHub OAuth app's callback URL to the
  production backend's `/api/auth/github/callback`.
