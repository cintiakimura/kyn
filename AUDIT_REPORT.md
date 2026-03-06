# kyn — Audit test report

**Date:** 2025-03-06  
**Branch:** main  
**Last commit:** 9f20e42 — feat: Stripe Checkout (Prototype/King Pro), upgrade-to-deploy flow, update-paid-status + Supabase

---

## 1. Git status

| Item | Result |
|------|--------|
| Branch | main |
| vs origin | **ahead 1** (1 commit not pushed) |
| Last commit | `9f20e42` feat: Stripe Checkout (Prototype/King Pro), upgrade-to-deploy flow, update-paid-status + Supabase |
| Uncommitted changes | None (clean working tree after fixes) |

**Action:** Run `git push origin main` to sync with remote.

---

## 2. npm audit (security)

| Severity | Count |
|----------|--------|
| Critical | 0 |
| High | 0 |
| Moderate | **3** |
| Low | 0 |

### 2.1 Vulnerabilities

| Package | Affected | Issue |
|---------|----------|--------|
| **dompurify** | 3.1.3 – 3.3.1 | Cross-site Scripting (XSS) — [GHSA-v2wj-7wpq-c8vv](https://github.com/advisories/GHSA-v2wj-7wpq-c8vv) |
| **monaco-editor** | ≥0.54.0-dev-20250909 | Depends on vulnerable dompurify |
| **electron** | &lt;35.7.5 | ASAR Integrity Bypass via resource modification — [GHSA-vmqv-hx8q-j7mg](https://github.com/advisories/GHSA-vmqv-hx8q-j7mg) |

### 2.2 Remediation

- **dompurify / monaco-editor:** `npm audit fix` (may update transitive deps).
- **electron:** `npm audit fix --force` will suggest electron@40.8.0 (breaking change). Prefer upgrading Electron in a dedicated pass and re-running audit.

---

## 3. Lint (TypeScript)

| Check | Result |
|-------|--------|
| `npm run lint` (tsc --noEmit) | **PASS** |

**Fixes applied during audit:**

- `src/api/create-checkout-session.ts`: use `success_url: successUrl` (no shorthand to avoid TS strict).
- `src/pages/Builder.tsx`: add `getPaidStatus`, `setPaidFromSuccess` to import from `../lib/auth`.

---

## 4. Build (production)

| Check | Result |
|-------|--------|
| `npm run build` (vite build) | **PASS** |

**Output:** 1941 modules transformed; assets under `dist/`. One Rollup warning: chunk size &gt; 500 kB (main app bundle); consider code-splitting or `build.rollupOptions.output.manualChunks` / `chunkSizeWarningLimit` if desired.

---

## 5. Backend API

| Endpoint | Method | Status | Notes |
|----------|--------|--------|------|
| `/api/auth/session` | POST | ✅ | Returns/create userId (mock auth). |
| `/api/users/:userId/projects` | GET | ✅ | List projects (SQLite). |
| `/api/users/:userId/projects` | POST | ✅ | Create project; body `{ name }`. |
| `/api/users/:userId/projects/:projectId` | GET | ✅ | Get project (code, package_json, chat_messages). |
| `/api/users/:userId/projects/:projectId` | PUT | ✅ | Update project. |
| `/api/agent/config` | GET | ✅ | agentId, systemPrompt, preCodeQuestions. |
| `/api/agent/chat` | POST | ✅ | Grok chat; body `{ messages }`. |
| `/api/create-checkout-session` | POST | ✅ | Stripe Checkout; body `{ plan: 'prototype'\|'king_pro' }`; returns `{ id, url }`. Env: STRIPE_SECRET_KEY, STRIPE_PROTOTYPE_PRICE_ID, STRIPE_KING_PRO_PRICE_ID. |
| `/api/update-paid-status` | POST | ✅ | Body `{ plan, userId }`; upserts Supabase `users` (paid, plan). Requires SUPABASE_URL, SUPABASE_ANON_KEY. |
| `/api/deploy` | POST | ✅ | Mock. |
| `/api/netlify/hook` | POST | ✅ | Mock. |
| `/api/stripe/checkout` | POST | ✅ | Legacy mock. |

---

## 6. Stripe & paid flow

| Item | Status |
|------|--------|
| Env vars | STRIPE_SECRET_KEY, STRIPE_PUBLIC_KEY, STRIPE_PROTOTYPE_PRICE_ID, STRIPE_KING_PRO_PRICE_ID (no hardcoding). |
| Create session | `src/api/create-checkout-session.ts`; mode subscription; success_url `/builder?paid=true&plan={plan}`; cancel_url `/builder`. |
| Builder: Upgrade to Deploy | Shown when `!user.paid`; opens modal. |
| Modal options | Prototype $5.99/mo, King Pro $19.99/mo → POST `/api/create-checkout-session` with `{ plan }` → redirect to `url`. |
| Success callback | Builder: on `?paid=true&plan=...` → POST `/api/update-paid-status` with `{ plan, userId }` → setPaidFromSuccess(plan) → clear query. |
| Deploy gate | If paid → deploy; else show upgrade modal. |
| Supabase | update-paid-status upserts `users` (id, paid, plan). Table must exist. |

---

## 7. Frontend (key areas)

| Area | Status |
|------|--------|
| Routes | /, /login, /pricing, /dashboard, /onboarding, /builder, /builder/:projectId, /setup, /settings. |
| Auth | getUserId(), getPaidStatus(), setPaidFromSuccess() in `src/lib/auth.ts`; session + Login. |
| Dashboard | Projects list/create, chat panel (no Grok), Open File / Open from GitHub. |
| Builder | Load/save by projectId, chat + Grok, voice (STT), TTS toggle, upgrade modal, deploy buttons gated by paid. |
| Agent config | AGENT_SYSTEM_PROMPT from UNBREAKABLE_RULES (markdown stripped). |

---

## 8. Summary

| Area | Result |
|------|--------|
| Git | Clean; 1 commit ahead of origin. |
| npm audit | 3 moderate (dompurify/monaco, electron). |
| Lint | Pass. |
| Build | Pass (chunk size warning only). |
| Backend API | All routes present; Stripe + update-paid-status implemented. |
| Stripe / paid | Env-only; checkout session + success → update-paid-status + local paid state. |
| Deploy gate | Paid users deploy; others see upgrade modal. |

---

## 9. Recommendations

1. **Push:** `git push origin main` to publish the latest commit.
2. **Security:** Run `npm audit fix`; consider Electron upgrade separately.
3. **Supabase:** Ensure `users` table exists with `id` (uuid), `paid` (boolean), `plan` (text); RLS/perms allow upsert from backend.
4. **Manual test:** Run app, click Upgrade to Deploy → pick plan → complete Stripe Checkout (test mode) → confirm redirect and paid state; then deploy.

---

*Report generated from workspace state. Lint fixes were applied during this audit.*
