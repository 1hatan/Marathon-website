# MongoDB Conversion — Cleanup & Fix Plan

## Status: implementation-ready (static verification passed; primary admin bug located)

## Goal
Finalize the MySQL→MongoDB Atlas migration so the full stack runs end-to-end, fix the regressions/config drift introduced by the partial conversion, and add a validation checklist.

## Current state (verified read-only)
- `backend/db.js`: fully migrated to Mongoose. Exports `connectDB` + 8 models (`Participant`, `RaceCategory`, `Sponsor`, `GalleryItem`, `Faq`, `ContactMessage`, `EventSetting`, `Admin`). All models have full CRUD + aggregation. Lazy-connect (no network at require time).
- `backend/server.js`: uses `connectDB()`, port `5050`, CORS hardened (whitelist enforced in prod, open in dev). ✅
- All 8 controllers, 8 routes, `middleware/authMiddleware.js`, `api/index.js`: **parse with `node --check`**. ✅
- `backend/package.json`: `mongoose ^8.0.0`, `mysql2`/`sqlite3` removed. ✅
- `.env` / `backend/.env` / both `.env.example`: consistently migrated to `MONGODB_URI`, `PORT=5050`, `VITE_API_URL=http://localhost:5050`. ✅
- Fixes already applied (no action): `?admin=true` honored by race/sponsor/gallery/faq controllers; `dashboardController` now returns `tshirtMatrix`; `getById` projects safe fields for public lookups (PII no longer leaked); CORS no longer unconditionally permissive; `backend/test_db_flow.js` (broken mysql2 stub) deleted.

## Remaining gaps to fix

### R1 (PRIMARY — admin panel bug) — Sponsors / Gallery / FAQ edit & delete silently fail (500)
Confirmed by static trace + schema inspection. The three schemas (`sponsorSchema`, `gallerySchema`, `faqSchema`) each declare an explicit numeric path `id: { type: Number }` with **no default**. When Mongoose documents are created, that `id` is never set → it stays `undefined`. Because an explicit `id` path shadows Mongoose's default `id` virtual (which would otherwise return `_id.toString()`), `doc.id` is `undefined` for these collections.

The frontend admin pages reference `.id` on every document:
- `AdminSponsors.jsx` L95 `key={s.id}`, L114 `handleDelete(s.id)`, L67 `updateSponsor(editingSponsor.id, form)`
- `AdminGallery.jsx` L91 `key={item.id}`, L105 `handleDelete(item.id)`, L63 `updateGallery(editingPhoto.id, form)`
- `AdminFAQ.jsx` L91 `key={faq.id}`, L98 `handleDelete(faq.id)`, L63 `updateFaq(editingFaq.id, form)`

Meanwhile the controllers' `getAll` return **raw `.lean()` docs with no `_id→id` normalization**:
- `sponsorController.getAll` L8 `res.json({ success, sponsors })` ← sponsors have `id: undefined` (JSON omits it)
- `galleryController.getAll` L9
- `faqController.getAll` L9

Contrast with the two working controllers that DO normalize: `participantController.getAll` (`id: p._id.toString()`) and `contactController.getAll` (`id: m._id.toString()`). Races also work because `raceCategorySchema.id` is a seeded/populated number.

Trace of the failure: admin clicks Delete on a sponsor → `handleDelete(undefined)` → `api.delete('/sponsors/undefined')` → `sponsorController.delete` → `Sponsor.findByIdAndDelete('undefined')` → Mongoose `CastError: Cast to ObjectId failed for value "undefined"` → 500 → frontend `catch` logs to console and the item is left in the list (silent failure, no toast). Same 500 on Edit (PUT `/{model}/undefined`).

**Fix (minimal, matches existing pattern in participant/contact controllers):** normalize `_id`→`id` in each `getAll`:
```js
// sponsorController.js / galleryController.js / faqController.js getAll
const items = await <Model>.find(filter).sort({ created_at: -1 }).lean();
res.json({ success: true, <key>: items.map(d => ({ ...d, id: d._id.toString() })) });
```
This makes `.id` a 24-hex ObjectId string that Mongoose casts back correctly on the `findByIdAndUpdate`/`findByIdAndDelete` calls already used by the update/delete handlers — no route or frontend changes needed.

### R2 — `render.yaml` still references MySQL env vars (no `MONGODB_URI`)
Backend env vars are `DB_HOST/DB_PORT/DB_USER/DB_PASSWORD` (MySQL), which are meaningless now. `MONGODB_URI` is missing → on Render the app falls back to the hardcoded Atlas URI in `db.js` (works, but config is misleading and non-overridable from the Render UI).
- Replace the MySQL envVar block with: `MONGODB_URI` (`sync: false`), `FRONTEND_URL`, `JWT_SECRET` (`generateValue: true`), `ADMIN_DEFAULT_EMAIL`, `ADMIN_DEFAULT_PASS`, keep `PORT=5050`.

### R3 — `backend/test_db_flow.js` references uninstalled `mysql2` (RESOLVED)
Verified deleted from disk (`File not found` on re-read). The broken MySQL test stub from the prior conversion has already been removed — no action required.

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
- `backend/controllers/sponsorController.js`, `galleryController.js`, `faqController.js` (PRIMARY — `getAll` id normalization)
- `render.yaml` (R2 envVars)
- `frontend/src/index.css` (R4 `animate-fadeIn`)

## Out of scope
- No source schema changes (db.js models are correct as-is).
- No changes to controllers/routes/middleware (already migrated and verified).
- No Vercel config changes (vercel.json routing is agnostic; leave as-is).
