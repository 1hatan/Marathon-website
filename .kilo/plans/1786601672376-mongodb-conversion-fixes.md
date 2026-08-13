# MongoDB Conversion — Cleanup & Fix Plan

## Status: implementation-ready (static verification passed; 4 remaining gaps)

## Goal
Finalize the MySQL→MongoDB Atlas migration so the full stack runs end-to-end, fix the regressions/config drift introduced by the partial conversion, and add a validation checklist.

## Current state (verified read-only)
- `backend/db.js`: fully migrated to Mongoose. Exports `connectDB` + 8 models (`Participant`, `RaceCategory`, `Sponsor`, `GalleryItem`, `Faq`, `ContactMessage`, `EventSetting`, `Admin`). All models have full CRUD + aggregation. Lazy-connect (no network at require time).
- `backend/server.js`: uses `connectDB()`, port `5050`, CORS hardened (whitelist enforced in prod, open in dev). ✅
- All 8 controllers, 8 routes, `middleware/authMiddleware.js`, `api/index.js`: **parse with `node --check`**. ✅
- `backend/package.json`: `mongoose ^8.0.0`, `mysql2`/`sqlite3` removed. ✅
- `.env` / `backend/.env` / both `.env.example`: consistently migrated to `MONGODB_URI`, `PORT=5050`, `VITE_API_URL=http://localhost:5050`. ✅
- Fixes already applied (no action): `?admin=true` honored by race/sponsor/gallery/faq controllers; `dashboardController` now returns `tshirtMatrix`; `getById` projects safe fields for public lookups (PII no longer leaked); CORS no longer unconditionally permissive.

## Remaining gaps to fix

### R1 — `fetchRaces` has no admin param; Admin races page can't see inactive races (regression)
After conversion, `raceController.getAll` filters `status='active'` unless `?admin=true` is sent. But the frontend `fetchRaces()` never sends it, so `AdminRaces` only lists active races → setting a race inactive makes it un-editable (same trap the user fixed for sponsors/gallery/faq).
- `frontend/src/services/api.js` (line 70): make `fetchRaces(isAdmin = false)` and append `?admin=true`.
- `frontend/src/pages/admin/AdminRaces.jsx` (line 27): call `fetchRaces(true)`.

### R2 — `render.yaml` still references MySQL env vars (no `MONGODB_URI`)
Backend env vars are `DB_HOST/DB_PORT/DB_USER/DB_PASSWORD` (MySQL), which are meaningless now. `MONGODB_URI` is missing → on Render the app falls back to the hardcoded Atlas URI in `db.js` (works, but config is misleading and non-overridable from the Render UI).
- Replace the MySQL envVar block with: `MONGODB_URI` (`sync: false`), `FRONTEND_URL`, `JWT_SECRET` (`generateValue: true`), `ADMIN_DEFAULT_EMAIL`, `ADMIN_DEFAULT_PASS`, keep `PORT=5050`.

### R3 — `backend/test_db_flow.js` references uninstalled `mysql2`
`require('mysql2/promise')` throws MODULE_NOT_FOUND (mysql2 was removed from deps). Dead/broken leftover. Running `node backend/test_db_flow.js` crashes.
- Delete `backend/test_db_flow.js`. (Optionally replace with a Mongo smoke test: connect → seed check → create test participant → assert dashboard stats → cleanup.)

### R4 — `animate-fadeIn` class used but never defined
Referenced in `Navbar.jsx`, `LightboxModal.jsx`, `ContactPage.jsx`, `RegisterPage.jsx` but `index.css` defines no `fadeIn` keyframe (Tailwind has no built-in). These transitions silently don't animate.
- Add to `frontend/src/index.css`:
  ```css
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  .animate-fadeIn { animation: fadeIn 0.25s ease-out both; }
  ```

## Optional hardening (deferred)
- `server.js` DB middleware swallows connection errors and calls `next()` → controllers run against a disconnected Mongoose (commands buffer, then 10s-timeout 500). Consider failing the request fast if `!mongoose.connection.readyState` in production.
- `db.js` hardcodes the Atlas URI as a fallback default; for production set `MONGODB_URI` via env only.
- JWT secret fallback differs from `.env.example`; align the code fallback or fail-fast in prod (authController already does fail-fast via `getJwtSecret` — acceptable).

## Validation plan (run as implementation-capable agent)
1. `node --check` all backend JS (already passing) — re-run after edits.
2. `node -e "require('./backend/db')` loads without throwing (already passing).
3. Local dev: `npm --prefix backend start` in one terminal, confirm logs `Connected successfully` + seeded counts; GET `http://localhost:5050/api/health` → `{status:'ok',...}`.
4. Frontend: `npm --prefix frontend run dev`, open `http://localhost:3000`:
   - Homepage loads settings + races (active only).
   - Register a runner → entry pass shows correct Registration ID.
   - Contact form submits → 201.
5. Admin: `http://localhost:3000/admin/login` (admin@infinityrun.com / admin123):
   - Dashboard renders KPI cards + category bar chart + gender pie + t-shirt matrix (non-zero).
   - Sponsors/Gallery/FAQ admin pages list ALL items incl. inactive (R1 verifies here for races).
   - Set a sponsor/gallery/FAQ to "Inactive" → remains visible and re-editable in admin list.
6. Regression: `GET /api/sponsors` (no token, no `?admin=true`) returns only `active`; `?admin=true` (with token) returns all.
7. Verify `animate-fadeIn` elements fade in (R4) and `node backend/test_db_flow.js` no longer exists (R3).

## Files in scope
- `frontend/src/services/api.js`
- `frontend/src/pages/admin/AdminRaces.jsx`
- `render.yaml`
- `backend/test_db_flow.js` (delete)
- `frontend/src/index.css`

## Out of scope
- No source schema changes (db.js models are correct as-is).
- No changes to controllers/routes/middleware (already migrated and verified).
- No Vercel config changes (vercel.json routing is agnostic; leave as-is).
