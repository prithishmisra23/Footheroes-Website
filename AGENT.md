# AGENT.md — Foot Heroes

> Instructions for any AI coding agent (Claude Code, Cursor, Devin, etc.) working in this repository.
> Read this file in full before writing any code. It defines what we're building, the exact stack,
> naming conventions, file locations, design tokens, and the non-negotiable rules that must hold
> across every PR.

---

## 1. What This Project Is

**Foot Heroes** is India's football identity and scouting network — not a tournament app, not a
score tracker. It is the permanent digital identity layer ("the football graph") for every
grassroots football player in India.

**One-line pitch:** Transfermarkt + CricHeroes + LinkedIn, for grassroots Indian football.

The scoring screen is 5% of the product. The other 95% is the graph:

```
Player → Team → Match → Tournament → Venue → Stats
              → Rankings → Discovery → Scouting → Recruitment
```

A scout should be able to type "U17 striker, Uttar Pradesh, 20+ goals this season" and get back
verified players with full career records. That is the product.

**Tagline:** "Your game. Your record. Forever."

**Positioning table (do not blur these lines when building features):**

| Existing tool | What it does | Foot Heroes |
|---|---|---|
| Torneo | Fixtures | Player IDENTITY |
| TeamStats | Team admin | Permanent career record |
| Prematch | Transfers | Nationally searchable by scouts |
| Whistle | Community | Organizer-verified stats |
| PlayMatches | Booking | AI-generated reports & highlights |

---

## 2. Tech Stack (do not substitute without approval)

```yaml
frontend:
  framework: Next.js 14 (App Router), TypeScript strict (no `any`)
  animation: Framer Motion
  vector: SVG (hand-authored, no video files for the loading animation)
  styling: Tailwind CSS + custom design tokens
  charts: Recharts
  maps: Leaflet.js
  video: Video.js
  state: Zustand + React Query (TanStack)
  forms: React Hook Form + Zod
  realtime: Supabase Realtime
  pwa: next-pwa (mobile-first, offline support)

backend:
  api: Next.js API Routes (serverless)
  database: Supabase (PostgreSQL + Auth + Storage + Realtime)
  search: PostgreSQL full-text search + pgvector
  cache: Upstash Redis
  queue: Upstash QStash
  email: Resend
  sms_whatsapp: Twilio / Fast2SMS
  storage: Supabase Storage
  video_cdn: Cloudinary (free tier, 25GB)

ai_layer:
  reports: OpenRouter — Llama 3.3 70B (free tier)
  embeddings: OpenAI text-embedding (player search)
  highlights: FFmpeg (clip generation)

hosting:
  frontend: Vercel (free tier)
  database: Supabase (free, 500MB)
  storage: Supabase Storage + Cloudinary

target_launch_cost: "₹0/month"
```

---

## 3. Design System

Use these as literal Tailwind config values / CSS variables. Do not invent new colors.

```css
--bg:            #0A1628;  /* deep football night */
--surface:       #111D35;
--card:          #1A2B48;
--primary:       #22C55E;  /* grass green */
--primary-dark:  #16A34A;
--accent:        #F59E0B;  /* gold — trophies/achievements */
--secondary:     #3B82F6;  /* electric blue */
--danger:        #EF4444;  /* red card */
--warning:       #F97316;  /* yellow card */
--text:          #F1F5F9;
--text-muted:    #94A3B8;
--border:        #1E3A5F;
```

**Typography**

| Role | Font | Notes |
|---|---|---|
| Display | Bebas Neue | all-caps, sport-bold headlines |
| Headings | Exo 2 | semi-bold |
| Body | Inter | clean, readable |
| Stats/Numbers | JetBrains Mono | monospaced, used only for scores/stats |

**Visual language:** FIFA meets Transfermarkt meets ESPN FC. Dark, energetic, premium — not
startup-SaaS. Pitch-grid background pattern, hexagonal stat cards, trophy-shine on achievement
unlocks, green pulse on live indicators, gradient-filled stat bars. Every number should look like
it matters.

**Logo:** football icon with motion/speed lines (or boot kicking ball, mirroring the loading
animation) + "FOOT HEROES" in Bebas Neue, green circle + white text.

---

## 4. Repo / File Structure Convention

```
src/
  app/
    page.tsx                          # Homepage
    player/[slug]/page.tsx            # Player profile (public)
    player/[slug]/edit/page.tsx       # Player profile editor
    match/[id]/page.tsx               # Live match viewer
    match/[id]/score/page.tsx         # Scorer interface
    tournament/create/page.tsx        # Tournament creation wizard
    tournament/[slug]/page.tsx        # Public tournament page
    tournament/[slug]/manage/page.tsx # Organizer dashboard
    discover/page.tsx                 # Scout search
    discover/scout/dashboard/page.tsx # Scout personal dashboard
    venues/page.tsx                   # Venue map + list
    venues/[slug]/page.tsx            # Venue detail
    venues/add/page.tsx               # Add venue form
    analytics/[type]/[id]/page.tsx    # Player/team/tournament analytics
    settings/privacy/page.tsx         # Privacy controls
    api/
      match/events/route.ts
      discover/search/route.ts
      ai/generate/route.ts
      auth/verify-organizer/route.ts
      og/player/[slug]/route.tsx
  components/
    LoadingAnimation.tsx
    Navbar.tsx
    player/PlayerCard.tsx
  lib/
    offline/matchQueue.ts
    tournament/fixtureGenerator.ts
    ai/matchReport.ts
    ai/playerSeasonReview.ts
    ai/tournamentSummary.ts
    ai/scoutingReport.ts
    security/inputSanitizer.ts
    security/rateLimiter.ts
    security/auditLogger.ts
    security/csrfProtection.ts
    security/videoProcessor.ts
  middleware.ts
```

Use kebab-case for route segments, PascalCase for component files, camelCase for lib functions.

---

## 5. Standing Build Rules (apply to every PR, no exceptions)

1. Loading animation (the "kicking boy") plays on every cold page load; skipped on repeat visits
   within 24h via `localStorage`.
2. TypeScript strict everywhere — zero `any`.
3. Mobile-first: every page must work correctly at 375px width.
4. Match event scoring must round-trip in under ~200ms — real-time feel is a hard requirement.
5. Supabase Realtime must be used for live scores; no polling.
6. Row Level Security (RLS) must be active and tested on every table holding user data — never
   expose one user's private data to another.
7. Rate limiting on all API routes (see §9).
8. All file uploads: validate MIME type by magic bytes (not just header), enforce size limits,
   store under UUID filenames, never trust the original filename.
9. SEO: every player profile, tournament, and match page needs full `generateMetadata` + JSON-LD.
10. No mock data anywhere — every stat displayed must be derived from real recorded events.

---

## 6. Database Schema (Supabase / PostgreSQL)

Core entity tables — create in this order to satisfy FK dependencies: `profiles` → `venues` →
`teams` → `players` → `team_players` / `team_staff` → `tournaments` → `tournament_teams` →
`matches` → `match_events` → `player_match_stats` → `tournament_standings` →
`player_season_stats` → `scout_profiles` → `scout_watchlists` / `scout_contacts` → `media` →
`player_achievements` → `notifications` → `ai_content` → `audit_log`.

Key generated/computed columns:
- `players.age` — `GENERATED ALWAYS AS (DATE_PART('year', AGE(date_of_birth))) STORED`
- `tournament_standings.goal_difference` — `GENERATED ALWAYS AS (goals_for - goals_against) STORED`

Key constrained enums (`CHECK IN (...)`) to preserve exactly:
- `players.position`: goalkeeper, centre_back, right_back, left_back, defensive_midfielder,
  central_midfielder, attacking_midfielder, right_winger, left_winger, striker, centre_forward
- `teams.type`: club, academy, school, college, corporate, district, state, other
- `tournaments.format`: league, knockout, group_knockout, round_robin, hybrid
- `tournaments.level`: local, district, state, national, international
- `matches.status`: scheduled, live, half_time, completed, postponed, cancelled, abandoned
- `match_events.event_type`: goal, own_goal, penalty_scored, penalty_missed, yellow_card,
  second_yellow, red_card, substitution_on, substitution_off, injury, assist, save, corner,
  free_kick_goal, kickoff, halftime, fulltime, extratime_start, var_decision, goal_disallowed
- `profiles.role`: player, team_manager, tournament_organizer, scout, venue_owner, admin,
  super_admin
- `player_achievements.achievement_type`: golden_boot, golden_glove, best_player, mvp,
  top_scorer_season, most_assists, unbeaten_season, hat_trick, brace, clean_sheet_streak,
  tournament_winner, player_of_tournament, 100_goals, 50_goals, 10_goals, debut

**Score integrity rule:** `matches.home_score` / `away_score` must never be written directly by a
client. Scores are derived only from `match_events` via a DB trigger/function.

**Required indexes:**
```sql
CREATE INDEX idx_players_state ON players(state, position, age);
CREATE INDEX idx_players_goals ON players(career_goals DESC);
CREATE INDEX idx_players_search ON players USING GIN(search_vector);
CREATE INDEX idx_players_embedding ON players USING ivfflat(embedding vector_cosine_ops);
CREATE INDEX idx_matches_tournament ON matches(tournament_id, status);
CREATE INDEX idx_match_events_match ON match_events(match_id, minute);
CREATE INDEX idx_player_match_stats ON player_match_stats(player_id, match_id);
CREATE INDEX idx_standings_tournament ON tournament_standings(tournament_id, points DESC);
CREATE INDEX idx_notifications_user ON notifications(user_id, is_read, created_at DESC);
```

**RLS — minimum required policies:**
```sql
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE match_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE scout_contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public player profiles" ON players
  FOR SELECT TO anon, authenticated USING (profile_visibility = 'public');
CREATE POLICY "Players edit own profile" ON players
  FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Scout contact privacy" ON scout_contacts FOR SELECT
  USING (scout_id IN (SELECT id FROM scout_profiles WHERE user_id = auth.uid())
     OR player_id IN (SELECT id FROM players WHERE user_id = auth.uid()));
CREATE POLICY "Scorer inserts events" ON match_events FOR INSERT
  WITH CHECK (created_by = auth.uid());
```
Write a test that creates two dummy users and asserts neither can read the other's private data
before this is considered "done."

---

## 7. Feature Modules

### 7.1 `components/LoadingAnimation.tsx` — the kicking-boy intro

Full-screen overlay, `background: var(--bg)`.

- **Boy**: SVG side-profile silhouette, 4-frame running-and-kick cycle (approach → plant →
  kick → follow-through), looping 0.6s, white/light-green fill, positioned at left 30% of
  viewport, vertically centered.
- **Ball**: launches from the boy's foot at the kick frame. Framer Motion tween: `x` from boy
  position to `100vw + 100px`; `y` keyframes `[0, -40px, 0]` for a natural arc; `rotate` 0→720°;
  slight `scale` bump at arc peak. Duration 0.9s, custom cubic-bezier (fast start, slight
  deceleration). 3 ghost-ball trail elements at opacity 0.6 / 0.3 / 0.1 with staggered delay.
- **Wordmark**: after the ball exits (t=0.9s), "FOOT" then "HEROES" slide/bounce in from below
  letter by letter (0.05s stagger), Bebas Neue 72px white (48px mobile).
- **Tagline**: "Your game. Your record. Forever." fades in at t≈1.6s, Inter 16px `--text-muted`.
- **Timing table**: 0.0s screen in → 0.1s boy runs → 0.5s ball launches → 0.9s ball off-screen →
  1.0s letters start → 1.8s letters + tagline done → 2.6s complete → 2.8s crossfade to homepage.
- **Skip**: tap anywhere after 0.5s jumps straight to homepage.
- **Persistence**: `localStorage['ft_intro_shown']`, 24h TTL — replay once per day, not every visit.
- **Mobile**: same choreography, boy+ball at 60% scale, letters at 48px.
- **Fallback**: if the animation throws, render the homepage immediately — never block on it.

### 7.2 `app/page.tsx` — Homepage

Sections in order, each its own component under `components/home/`:

1. **Navbar** (see 7.1b) — transparent over hero, solid `--surface` on scroll.
2. **Hero** — 3-line stacked heading "YOUR GAME." / "YOUR RECORD." / "FOREVER." (Bebas Neue 80px
   desktop / 48px mobile, staggered slide-up 0.2s apart), subheading, two CTAs
   (`Create Your Profile →` filled green / `Explore Players` outline), trust bar
   ("12,847 players | 342 tournaments | 18 states" — wire to live counts once DB is seeded).
3. **LiveMatchTicker** — auto-scrolling horizontal strip of in-progress matches with a pulsing
   green live dot; falls back to "No live matches right now — Upcoming: …" when empty.
4. **HowItWorks** — 3 cards: ⚽ Play / 📊 Track / 🔍 Get Found.
5. **RecentChampions** — horizontal scroll of last 5 completed tournaments.
6. **FeaturedPlayers** — 6-card grid, stat-heavy, golden-boot badge on this week's top scorer.
7. **DiscoverPreview** — non-functional filter mockup (position/age/state/min-goals) that routes
   to `/discover` on submit (auth-gated there, not here).
8. **StatesMap** — static SVG India map, highlighted dots on Kerala, West Bengal, Goa, Manipur,
   Mizoram, Meghalaya; hover shows a per-state player count tooltip.
9. **Testimonials** — 3 cards.
10. **FinalCTA** — "Stop Playing in the Shadows" + large `Create Free Profile` button.
11. **Footer** — logo, About/Privacy/Terms/Contact, social links, copyright line.

### 7.1b `components/Navbar.tsx`

Desktop: logo left, `Live | Tournaments | Players | Teams | Venues | Discover` center,
`Sign In` / `Join Free` right. Mobile: hamburger → right-side slide-in drawer. Active link gets a
green underline. Authenticated state swaps Sign In/Join Free for an avatar menu.

### 7.3 Player Profile — the core product

**`app/player/[slug]/page.tsx`** (public view)

- Hero: cover photo w/ dark gradient, 120px circular avatar w/ white border, name (Bebas Neue),
  position pill (GK=yellow, DEF=blue, MID=green, FWD=red), blue verified checkmark if
  organizer-verified, city/state with pin icon, current team (clickable logo+name).
- Quick-stats row (6 live-updating tiles): Matches, Goals, Assists, Cards, Rating, Season Goals.
- Actions: `Follow` / `Contact Player` (scouts) / `Edit Profile` (owner) / `Share Profile`.
- **CareerRadarChart** — spider chart: Goals, Assists, Discipline, Consistency, Experience,
  Rating, each 0–100 normalized, overlaid faintly against the position average.
- **SeasonVsCareer** table — side-by-side current season vs all-time.
- **FormGuide** — last 5 matches as colored dots (G/A/W/D/L).
- **GoalsByTypeChart** — donut: right foot / left foot / header / penalty / free kick.
- **MatchHistoryTable** — last 20 matches, expandable rows → full event timeline, filterable by
  season/tournament/team.
- **TournamentHistory** — cards per tournament with trophy icons for wins/runner-up, golden-boot
  badge where earned.
- **TeamHistoryTimeline** — vertical timeline, most recent team first.
- **AchievementsWall** — badge grid, unearned badges rendered greyed out.
- **MediaGallery** — 3-col photo grid + separate video-highlights tab (thumbnail, title, date,
  views).
- **ScoutingReport** — AI-generated (Strengths / Areas for Improvement / Similar Players /
  Potential / Last-30-days trend), visible only to verified scout accounts.
- Scout-only actions: `Add to Watchlist`, `Send Contact Request`, `Generate Report PDF`.

**`app/player/[slug]/edit/page.tsx`** — tabs: Basic Info, Stats & Positions, Media, Privacy.
Privacy tab exposes: profile visibility (`public`/`private`/`scouts_only`), show phone to scouts,
allow scout contact (`yes`/`no`/`verified scouts only`), show in discovery toggle.

**`components/player/PlayerCard.tsx`** — reusable compact card used in search/discovery/team
rosters: round 60px photo, name, position pill, city, Goals/Assists/Matches/Rating, 5-dot mini
form guide, verified badge, click → full profile.

**SEO** — `generateMetadata` per player: title
`"[Name] — Football Stats, Profile & Career | Foot Heroes"`, description built from position/city/
stats, OG image from `/api/og/player/[slug]`, JSON-LD `Person` schema with sports stats.

### 7.4 Live Match Scoring — the data engine

This is the highest-priority UX in the product. It must be usable one-thumb, in direct sunlight,
on patchy stadium wifi, by a non-technical team manager.

**`app/match/[id]/score/page.tsx`**

- Header: team names, giant "1 — 0" score, running clock "67'" with blinking green dot,
  half badge, `END MATCH` button (danger color, top-right).
- **QuickEventGrid** — large thumb-sized buttons. Home column / Away column, each with:
  🟨 Yellow, 🟥 Red, ↔️ Sub, 🥅 Save, 📍 Corner, ⚠️ Injury. A single centered ⚽ **GOAL** button
  spans both columns and is the largest, greenest element on the screen.
- **GoalEventModal** (slides up on GOAL tap): "Who scored? (TEAM)" → tap player from preloaded
  roster → "Assist?" (same roster + "No Assist") → Penalty / Own Goal toggles → minute field
  (pre-filled, editable) → `SUBMIT EVENT` (large green) / Back to cancel.
- Card/sub modals follow the same team → player → minute pattern; red card adds a
  "Second Yellow" option; sub asks who's off then who's on.
- Half-time controls: `HALF TIME` → summary view → `START 2ND HALF`.
- **EventsTicker** — scrollable log of recorded events ("45' ⚽ GOAL — Rahul K. (Assist: Priya M.)
  [1-0]"); tap any entry to Edit or Delete (with confirm) for correcting mistakes.
- **Realtime sync**: every POST updates the UI optimistically, then broadcasts via Supabase
  Realtime. If offline, events are queued in IndexedDB (`lib/offline/matchQueue.ts`,
  `QueuedEvent { localId, matchId, eventData, timestamp, synced }`) with a visible
  "Offline — will sync when connected" banner; `syncQueue()` drains the queue in order on
  `navigator.onLine`.

**`app/match/[id]/page.tsx`** (public live viewer) — realtime score with a subtle goal-celebration
burst, vertical event timeline, lineups/formations, live-updating stats (possession, shots,
corners, cards), post-match 1–10 rating sliders and MOTM voting.

**`app/api/match/events/route.ts`** — `POST`. Auth: caller must be the scorer assigned to this
match. Validates `match.status === 'live'`, validates payload with Zod, rate-limited to 30
events/min, inserts into `match_events`, triggers DB functions to update
`player_match_stats`/`tournament_standings`, broadcasts via Realtime, queues follower
notifications. Score is **never** accepted directly from the client — always derived from events.
Every write goes to `audit_log`.

### 7.5 Tournament OS

**`app/tournament/create/page.tsx`** — 4-step wizard:
1. Basics (name, edition, sport, format, age group, gender, level, cover image)
2. Schedule + Venue (dates, registration deadline, venue picker/creator, max teams, entry fee,
   prize pool)
3. Match Settings (duration, extra time, penalties, sub limits, points system)
4. Review + Publish (`Save as Draft` / `Publish Tournament`)

**`app/tournament/[slug]/page.tsx`** — header with status badge
(`UPCOMING`/`REGISTRATION OPEN`/`ONGOING`/`COMPLETED`), quick stats strip, tabs: Overview, Teams,
Fixtures, Standings, Stats, Media. Fixtures show live pulse badges; Standings render
P/W/D/L/GF/GA/GD/Pts/Form; Stats tab covers Top Scorers, Top Assists, Clean Sheets, Fair Play.
Post-tournament: 🥇 Winners, 🥈 Runners-up, 🥇 Golden Boot, 🧤 Golden Glove, ⭐ Best Player.

**`app/tournament/[slug]/manage/page.tsx`** (organizer-only) — Registrations (approve/reject/
waitlist), Fixture Generation (`Generate Fixtures` button + manual drag-reorder + venue/scorer
assignment), Live Match Management, Standings override (for walkovers/disputes), Awards
assignment (system-suggested, organizer-confirmed), Settings.

**`lib/tournament/fixtureGenerator.ts`**
```ts
generateRoundRobinFixtures(teams: Team[]): Match[]
generateKnockoutFixtures(teams: Team[], rounds: string[]): Match[]
generateGroupStageKnockout(teams: Team[], numGroups: number): { groups, knockout }
generateSchedule(matches: Match[], startDate: Date, matchesPerDay: number): Match[]
```

### 7.6 Discovery Engine — the scout portal (most defensible feature)

**`app/discover/page.tsx`** — filter panel: Position, Age Group, State, City, Min Goals This
Season, Min Matches, Min Rating, Tournament Level, Preferred Foot → `SEARCH`. Results as compact
data-rich rows (photo, name, position, age, city/state, goals, assists, matches, rating, verified
badge), sortable, 20/page with infinite scroll on mobile, optional India-map cluster view. Quick
presets above the search: "🥅 U17 Goalkeepers in Kerala", "⚽ U21 Strikers with 20+ goals",
"🛡️ Defenders in West Bengal", "⚡ Top Rated Midfielders". Basic identity fields are public; full
stats + contact require a verified scout account.

**`app/discover/scout/dashboard/page.tsx`** — My Watchlist, Recent Activity, Saved Searches
(with match notifications), Contact Requests (sent + status), AI Scouting Reports (generate →
branded PDF).

**`app/api/discover/search/route.ts`** — `GET`, dynamic Supabase query built from query params,
tsvector full-text name search, rate-limited 20/min, paginated 20/page, excludes
`profile_visibility='private'`, includes only `is_scoutable=true`.

**`lib/ai/scoutingReport.ts`** — `generateScoutingReport(playerId): Promise<string>`. System
prompt instructs the model to act as an experienced scout, cite the real numbers, be honest about
weaknesses, and output sections: Overview / Strengths / Areas for Improvement / Potential /
Similar Players / Recommendation. Cache in `ai_content`, regenerate only if stale (>7 days).

### 7.7 Security Layer

**`src/middleware.ts`** — auth gate on `/dashboard/*`, `/player/*/edit`, `/tournament/*/manage`,
`/discover/scout/*`, `/match/*/score`, most of `/api/*`; public on `/`, `/player/*`,
`/tournament/*`, `/teams`, `/venues`, `/api/public/*`, `/api/webhooks/*`. Attach on every response:

```
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=(self)
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline';
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data: https://*.supabase.co https://res.cloudinary.com;
  connect-src 'self' https://*.supabase.co wss://*.supabase.co;
  media-src 'self' https://res.cloudinary.com; frame-src 'none';
```

Rate limits (Upstash `@upstash/ratelimit`, sliding window):

| Route | Limit |
|---|---|
| `/api/match/events` | 30 / min / user |
| `/api/discover/search` | 20 / min / user |
| `/api/ai/*` | 5 / min / user |
| `/auth/*` | 5 / 15 min / IP |
| everything else `/api/*` | 60 / min / user |

Return `429` with `Retry-After` on breach.

Other required modules:
- `lib/security/inputSanitizer.ts` — `sanitizeText`, `sanitizeSearchQuery`,
  `validateFileUpload(file, type)` (magic-byte checks: JPEG `FF D8 FF`, PNG `89 50 4E 47`, MP4
  `ftyp` box at offset 4; size caps: profile photo 5MB, cover 10MB, video 200MB). Never execute
  uploaded files; store under UUID filenames in a private bucket, serve via signed URLs.
- `lib/security/rateLimiter.ts` — named limiters per table above.
- `lib/security/auditLogger.ts` — logs login/logout/profile_update/match_event_add/
  match_event_delete/tournament_create/scout_contact/report_generate/file_upload/account_delete;
  never logs passwords/tokens/OTPs; masks phone to last 4 digits, hashes email before logging.
- `lib/security/csrfProtection.ts` — token per session, validated on POST/PUT/DELETE, rotated
  after use.
- `app/api/auth/verify-organizer/route.ts` — manual-review organizer verification gate; only
  verified organizers can be assigned as match scorers, and only for matches they're assigned to.
- `lib/security/videoProcessor.ts` — malware scan (or explicitly flagged as deferred post-MVP),
  EXIF/metadata strip, FFmpeg re-encode to a standard format before storage, signed URLs expiring
  in 1 hour, every access logged.
- `app/settings/privacy/page.tsx` — visibility, search inclusion, contact permission, phone
  visibility, age visibility, "Download my data" export, "Delete my account" with a 30-day cooling
  period (data anonymized after, not deleted — match events are shared records with other
  players' stats).

### 7.8 AI Reports + Analytics

- `lib/ai/matchReport.ts` — `generateMatchReport(matchId)`: 200–250 word journalist-style recap,
  scoreline/scorers/turning points/MOTM, explicitly instructed not to hallucinate names/events.
- `lib/ai/playerSeasonReview.ts` — `generateSeasonReview(playerId, season)`: 200-word end-of-season
  review, shareable as a card.
- `lib/ai/tournamentSummary.ts` — `generateTournamentSummary(tournamentId)`: 300-word recap with
  winners/golden boot/standout moments, WhatsApp-broadcast to registered teams.
- `app/analytics/[type]/[id]/page.tsx` — Player: goals-per-month bar, rating trend line, position
  heatmap, goals-by-opponent, tournament comparison, last-10 form. Team: W/D/L donut, goals
  for/against area chart, top scorers bar, squad depth. Tournament: goals/cards leaderboards,
  results timeline, team-form spider chart.
- `app/api/ai/generate/route.ts` — `POST { type, id }` (type ∈ match_report/season_review/
  tournament_summary), organizer/admin-only, 10/hour/user, checks cache before regenerating,
  queues via QStash, returns `{ queued: true, estimatedTime }`.
- `app/api/og/player/[slug]/route.tsx` — `@vercel/og` dynamic share card: circular photo, name,
  position badge, Goals/Assists/Rating, Foot Heroes branding — this is the organic-growth loop
  every time a profile link is shared on WhatsApp/Twitter.

### 7.9 Venue System

- `app/venues/page.tsx` — dark Leaflet map of India (green pin = verified, gray = unverified,
  clustered on zoom), list-view toggle, filters (state/city/type/facilities).
- `app/venues/[slug]/page.tsx` — photo gallery, facility badges, embedded map, tournaments-hosted/
  matches-played/teams-using stats, recent tournament history, "Register tournament here" CTA.
- `app/venues/add/page.tsx` — form with map-click lat/lng capture, facility checkboxes, up to 10
  photos; submissions default `is_verified=false` pending admin review.

---

## 8. Growth & Launch Plan (context for prioritization, not a build task)

**Do not launch nationwide first.** Start in one ecosystem: SRM + Anna University + Chennai
football leagues.

- **Phase 1 (Month 1–2):** 5 Chennai tournament organizers onboarded in person, target ~500
  players from 3 tournaments (8–12 teams × 15 players each).
- **Phase 2 (Month 3–4):** Kerala (Santosh Trophy circuits), West Bengal (Kolkata clubs), Goa
  (I-League feeder clubs).
- **Phase 3 (Month 5+):** national expansion via football-association contacts and college
  programs.

**Growth loop:** organizer creates tournament → teams register → players create profiles →
players share to Instagram → new players join → scouts join for the data → organizers see scout
interest → organizers run more tournaments → loop repeats.

**Monetization (do not build paywalls before ~10K players):**

| Tier | Price | Includes |
|---|---|---|
| Scout Premium | ₹999/mo | Full stats, direct contact, watchlists, AI reports (PDF), advanced filters |
| Tournament Pro | ₹499/tournament | Custom subdomain, embeddable standings widget, AI reports, WhatsApp broadcast, certificate generation |
| Venue Featured Listing | ₹299/mo | Top placement, "Premium Venue" badge, booking inquiry form, view analytics |
| Academy Subscription | ₹2,999/mo | Multi-team management, recruitment pipeline, academy dashboard, verified badge |

---

## 9. Definition of Done (pre-launch checklist)

- [ ] Loading animation plays on cold load, skips on repeat visits within 24h
- [ ] Player profile renders correctly on Android Chrome at 375px
- [ ] A match event round-trips in under ~1s
- [ ] Two browser tabs on the same match: score updates instantly on goal (Realtime verified)
- [ ] Offline scoring: airplane-mode test, events queue and sync correctly on reconnect
- [ ] 8-team knockout fixture generation produces a correct bracket
- [ ] Discovery filters all function and return correct result sets
- [ ] Security headers score an A on securityheaders.com
- [ ] RLS manually verified: player A cannot read player B's private data
- [ ] File upload rejects a renamed `.exe` disguised as `.jpg` (magic-byte check)
- [ ] Rate limiting: 31st match event within 1 minute returns 429
- [ ] Sharing a player profile link on WhatsApp renders the OG stats card
- [ ] Player profile pages carry correct meta tags for SEO
- [ ] PWA "Add to Home Screen" works on Android Chrome
- [ ] Homepage Lighthouse score > 85
- [ ] All core flows manually tested on a real Android device, not just DevTools emulation
- [ ] Scoring page works fully offline once cached

---

## 10. The One Thing That Matters Most

The hard part of Foot Heroes is not the code — it's distribution. CricHeroes worked because
cricket already had someone scoring every ball; Foot Heroes has to **create** that behavior for
football, where currently nobody officially records match events.

**Design mandate:** a team manager must be able to score their own match, one-thumbed, while
watching it. Goal → tap GOAL → tap scorer → tap assist → done, in under 5 seconds per event. If it
takes 15 seconds, organizers will not adopt it.

**Acceptance test for the scoring UI specifically:** hand it to a non-technical person watching a
football match on YouTube. If they can keep up and score accurately in real time, the UI is
correct. If they fall behind, it is not — rebuild before touching anything else in this repo.
