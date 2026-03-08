# kyn — Audit test report

**Date:** 2026-03-08  
**Branch:** main  
**Remediation applied:** Yes (see Section 5.2)

---

## 1. Audit run summary

| Check | Command | Result | Notes |
|-------|---------|--------|-------|
| **Security** | `npm audit` | ✅ 0 vulnerabilities | After overrides + electron bump |
| **Lint** | `npm run lint` (tsc --noEmit) | ✅ PASS | Exit code 0 |
| **Build** | `npm run build` (vite build) | ✅ PASS | ~21s, dist/ produced |
| **Tests** | — | ⚪ N/A | No test script in package.json |

---

## 2. npm audit (security) — remediation applied

**Current status:** `npm audit` reports **0 vulnerabilities**.

### Changes made

1. **package.json overrides**
   - Added `"overrides": { "dompurify": "3.3.2" }` so all consumers (including monaco-editor) use patched DOMPurify (XSS fix for 3.1.3–3.3.1).

2. **Electron**
   - Bumped `devDependencies.electron` from `^33.0.0` to `^35.7.5` (ASAR integrity bypass fix; no major upgrade to 40.x).

3. **Install**
   - Ran `npm install` to apply overrides and update lockfile.

### Previous audit output (for reference)

```
# npm audit report (before fix)

dompurify  3.1.3 - 3.3.1  → fixed via override 3.3.2
monaco-editor  (depends on dompurify)  → fixed by override
electron  <35.7.5  → fixed by upgrading to ^35.7.5

3 moderate severity vulnerabilities → 0 after remediation
```

---

## 3. Lint (TypeScript)

| Check | Result |
|-------|--------|
| `npm run lint` | ✅ PASS |
| Exit code | 0 |
| Tool | `tsc --noEmit` |

No type or emit errors reported.

---

## 4. Build (production)

| Check | Result |
|-------|--------|
| `npm run build` | ✅ PASS |
| Tool | Vite 6.x |
| Output | `dist/` |
| Duration | ~31s (typical) |

### Build artifacts (sample)

| File | Size (gzip) |
|------|-------------|
| dist/index.html | 0.55 kB (0.37 kB gzip) |
| dist/assets/index-*.css | 50.81 kB (9.52 kB gzip) |
| dist/assets/index-*-*.js (chunks) | Multiple; largest ~1,352 kB (437 kB gzip) |

---

## 5. Tests

| Item | Status |
|------|--------|
| Test script | None in `package.json` |
| Test framework | Not configured |
| Coverage | N/A |

Recommendation: Add a test script (e.g. Vitest or Jest) and basic smoke tests for API routes and critical UI flows.

---

## 6. Backend API endpoints

| Endpoint | Method | Status | Notes |
|----------|--------|--------|------|
| `/api/auth/session` | POST | ✅ | Returns/creates userId (mock auth). |
| `/api/users/:userId/projects` | GET | ✅ | List projects (SQLite). |
| `/api/users/:userId/limits` | GET | ✅ | Returns `{ projectLimit }` (FREE_PROJECT_LIMIT). |
| `/api/users/:userId/projects` | POST | ✅ | Create project; body `{ name }`; 403 when free limit reached. |
| `/api/users/:userId/projects/:projectId` | GET | ✅ | Get project (code, package_json, chat_messages). |
| `/api/users/:userId/projects/:projectId` | PUT | ✅ | Update project. |
| `/api/agent/config` | GET | ✅ | agentId, systemPrompt, preCodeQuestions. |
| `/api/agent/chat` | POST | ✅ | Grok chat; body `{ messages }`; GROK_API_KEY. |
| `/api/builder/generate` | POST | ✅ | Builder.io Visual Copilot; body `{ prompt, userId }`; BUILDER_PRIVATE_KEY. |
| `/api/create-checkout-session` | POST | ✅ | Stripe Checkout; body `{ plan }`. |
| `/api/update-paid-status` | POST | ✅ | Body `{ plan, userId }`; Supabase upsert. |
| `/api/deploy` | POST | ✅ | Mock. |
| `/api/netlify/hook` | POST | ✅ | Mock. |

---

## 7. Dev server & ports

| Item | Value |
|------|--------|
| Dev server port | `process.env.PORT` or **3000** |
| Start command | `npm run dev` (tsx server.ts → Express + Vite) |
| Preview (static only) | `npm run preview` → Vite default (e.g. 4173) |

---

## 8. Known npm warnings (safe to ignore)

- **npm warn Unknown env config "devdir"** — npm config; does not affect build or run.
- **prebuild-install** (better-sqlite3) — deprecation from transitive dep; still works.
- **intersection-observer** — from Sandpack dependency.
- **boolean** — optional dependency; no action needed.

---

## 9. Summary

| Area | Result |
|------|--------|
| Security (npm audit) | ✅ 0 vulnerabilities (remediation applied: dompurify override 3.3.2, electron ^35.7.5). |
| Lint | Pass. |
| Build | Pass. |
| Tests | No suite. |
| API | Endpoints present; free-tier limits and Builder.io proxy in place. |

---

## 10. Recommendations

1. ~~Run `npm audit fix`~~ **Done.** Overrides + electron bump applied; audit reports 0 vulnerabilities.
2. Add a test script and baseline tests for `/api/auth/session`, project CRUD, and critical UI (e.g. Dashboard create project).
3. Ensure `.env` has `GROK_API_KEY` for chat and `BUILDER_PRIVATE_KEY` for UI generation when using those features.
4. Manual test: Login → Dashboard → Plus (New Project) or Start with Grok → Builder → chat / UI generation.

---

*Report generated from audit run (npm audit, npm run lint, npm run build).*
