# Foot Heroes — Complete Product Bible
## India's Football Identity & Scouting Network
### Senior CTO + Game Designer + Growth Architect Master Document

---

# PART 0: THE VISION

## What Foot Heroes Actually Is

Foot Heroes is not a tournament management app.
It is not a score tracker.
It is not another Torneo clone.

It is **India's football data infrastructure** — the permanent
digital identity layer for every grassroots football player
in the country, from a 12-year-old in Manipur to a college
striker in Kerala, from a Sunday league player in Mumbai to
an academy graduate in Kolkata.

The scoring screen is 5% of the product.
The remaining 95% is the football graph.

```
THE GRAPH:
Player → Team → Match → Tournament → Venue → Stats
     → Rankings → Discovery → Scouting → Recruitment

Every goal scored. Every card. Every tournament won.
Every match played. Permanently. Verifiably. Searchable.

A scout types: "U17 striker, Uttar Pradesh, 20+ goals this season"
Foot Heroes returns: 3 verified players with full career records.

That does not exist in India today.
We build it.
```

---

## The Loading Animation (First Impression)

```
ON FIRST VISIT TO footheroes.in:

Full dark screen → pitch green gradient fades in

A silhouette of a boy (vector illustration, side profile)
runs in from the left side of screen.

He reaches center screen.
Kicks the ball.

The football launches RIGHT (physics-based arc):
  Flies fast across the screen
  Motion blur trail behind it (green-gold)
  Slight spin animation on the ball (rotation)
  Ball goes off-screen right

From left: letters appear one by one following the ball's path:
  F-O-O-T  H-E-R-O-E-S

Each letter "kicks in" from below with a bounce

Tagline fades in below: "Your game. Your record. Forever."

Duration: 2.8 seconds
After: transition to homepage content

On page reload / fast subsequent visits: skip animation
Cache: localStorage flag "hasSeenIntro = true"
If flag set: show homepage directly, no animation

TECHNICAL:
  Built with: Framer Motion + CSS transforms + SVG animation
  The boy: SVG path animation (running cycle, 8-frame loop)
  Football: CSS animation with cubic-bezier for natural arc
  Letters: staggered Framer Motion animation
  No video files: pure CSS/SVG for performance
  Fallback: if animation fails → homepage loads immediately
```

---

## Competitive Positioning

```
WHAT EXISTS:           WHAT FOOT HEROES IS:
Torneo = fixtures      Foot Heroes = player IDENTITY
TeamStats = team admin Player's permanent career record
Prematch = transfers   Searchable by scouts nationally
Whistle = community    Verified stats (organizer-confirmed)
PlayMatches = booking  AI-generated reports and highlights

Nobody in India has built:
Transfermarkt + CricHeroes + LinkedIn
for grassroots football.

We are building exactly that.
```

---

## The Six Core Entities (The Football Graph)

```
1. PLAYER PROFILE (permanent identity)
   Name, DOB, position, preferred foot, height, city, state
   Stats: goals, assists, cards, matches, ratings, clean sheets
   History: every team played for, every tournament, every match
   Media: profile photo, highlight videos, action shots
   Badges: MVP, Golden Boot, Top Scorer, etc.
   Visibility: searchable by scouts based on stats + location

2. TEAM PROFILE (club/academy/school)
   Name, type (club/academy/school/college/corporate)
   Squad roster (current + historical)
   Coaching staff, kits, founded year
   Trophy cabinet, tournament history, head-to-head records
   Home venue, training venue

3. MATCH ENGINE (data collection)
   Every football event recorded:
   Goals, assists, yellow cards, red cards, substitutions,
   penalties scored/missed, saves, corners, fouls, possession %
   Player ratings (1-10 per player), MOTM selection
   After match: all stats auto-update player profiles

4. TOURNAMENT OS (organizer tools)
   Create: leagues, knockouts, group stages, hybrid formats
   Auto-generate: fixtures, standings, brackets, schedules
   Manage: registrations, payments, referees, venues
   Publish: live scores, results, highlights
   Award: trophies, golden boot, golden glove automatically

5. VENUE DATABASE (India's football ground map)
   Every turf, ground, stadium, academy field
   Location, facilities, photos, capacity, pricing
   Tournament history at each venue
   Booking availability (future feature)

6. DISCOVERY ENGINE (the real product)
   Scout/coach search interface:
   Filter by: position, age, city, state, goals, assists, rating
   Sort by: recent form, career stats, tournament level
   Contact: request to connect (player must accept)
   Save: watchlists, shortlists, scouting reports
```

---

# PART 1: COMPLETE TECHNICAL ARCHITECTURE

## Tech Stack

```
FRONTEND (Website — Phase 1):
  Framework:    Next.js 14 (App Router) + TypeScript
  Animation:    Framer Motion (loading animation + page transitions)
  3D/SVG:       SVG animations for loading screen
  Styling:      Tailwind CSS + custom design tokens
  Charts:       Recharts (stats visualization)
  Maps:         Leaflet.js (venue map of India)
  Video:        Video.js (highlight player)
  State:        Zustand + React Query (TanStack)
  Forms:        React Hook Form + Zod
  Real-time:    Supabase Realtime (live match scores)
  PWA:          next-pwa (mobile-first, offline support)

BACKEND:
  API:          Next.js API Routes (serverless)
  Database:     Supabase (PostgreSQL + Auth + Storage + Realtime)
  Search:       PostgreSQL full-text search + pgvector (AI search)
  Cache:        Upstash Redis
  Queue:        Upstash QStash (notifications, AI generation)
  Email:        Resend
  SMS/WhatsApp: Twilio / Fast2SMS
  Storage:      Supabase Storage (videos, photos)
  Video CDN:    Cloudinary (free: 25GB)

AI LAYER:
  Reports:      OpenRouter (Llama 3.3 70B — free)
  Embeddings:   OpenAI text-embedding (player search)
  Highlights:   FFmpeg (clip generation from uploaded videos)

SECURITY:
  Auth:         Supabase Auth (phone OTP + Google OAuth)
  Rate limiting: Upstash Redis rate limiter
  CORS:         strict origin whitelist
  Input:        Zod validation on all inputs
  SQL:          Supabase parameterized queries (no raw SQL from client)
  Files:        MIME type validation, size limits, virus scan
  HTTPS:        enforced everywhere
  Headers:      CSP, HSTS, X-Frame-Options, etc.
  Audit log:    every admin action logged

HOSTING:
  Frontend:     Vercel (free tier)
  Database:     Supabase (free: 500MB)
  Storage:      Supabase Storage + Cloudinary

COST AT LAUNCH: ₹0/month
```

## Database Schema

```sql
-- ═══════════════════════════════════════
-- PLAYERS (the core identity)
-- ═══════════════════════════════════════

CREATE TABLE players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES auth.users(id),
  slug TEXT UNIQUE NOT NULL,            -- "rahul-sharma-kanpur" for URL
  full_name TEXT NOT NULL,
  date_of_birth DATE,
  age INTEGER GENERATED ALWAYS AS (
    DATE_PART('year', AGE(date_of_birth))
  ) STORED,
  gender TEXT DEFAULT 'male' CHECK (gender IN ('male', 'female', 'other')),
  position TEXT NOT NULL CHECK (position IN (
    'goalkeeper', 'centre_back', 'right_back', 'left_back',
    'defensive_midfielder', 'central_midfielder', 'attacking_midfielder',
    'right_winger', 'left_winger', 'striker', 'centre_forward'
  )),
  secondary_position TEXT,
  preferred_foot TEXT DEFAULT 'right' CHECK (preferred_foot IN ('left', 'right', 'both')),
  height_cm INTEGER,
  weight_kg INTEGER,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  country TEXT DEFAULT 'India',
  bio TEXT,
  jersey_number INTEGER,
  playing_style TEXT,
  profile_photo_url TEXT,
  cover_photo_url TEXT,
  phone TEXT,
  email TEXT,
  instagram_url TEXT,
  -- CAREER STATS (auto-computed, stored for performance)
  career_matches INTEGER DEFAULT 0,
  career_goals INTEGER DEFAULT 0,
  career_assists INTEGER DEFAULT 0,
  career_yellow_cards INTEGER DEFAULT 0,
  career_red_cards INTEGER DEFAULT 0,
  career_clean_sheets INTEGER DEFAULT 0,    -- for GKs
  career_saves INTEGER DEFAULT 0,           -- for GKs
  career_motm_awards INTEGER DEFAULT 0,
  career_tournaments INTEGER DEFAULT 0,
  career_rating DECIMAL DEFAULT 0,          -- avg rating across all matches
  -- RANKINGS
  national_rank INTEGER,
  state_rank INTEGER,
  position_rank INTEGER,                    -- rank among same position in state
  -- PROFILE STATUS
  is_verified BOOLEAN DEFAULT FALSE,       -- organizer-verified their stats
  is_scoutable BOOLEAN DEFAULT TRUE,       -- appears in scout search
  profile_visibility TEXT DEFAULT 'public' CHECK (
    profile_visibility IN ('public', 'private', 'scouts_only')
  ),
  search_vector tsvector,                  -- for full-text search
  embedding vector(1536),                  -- for AI-powered search
  profile_views INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════
-- TEAMS
-- ═══════════════════════════════════════

CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  short_name TEXT,                         -- "MCFC" for Manchester City FC
  type TEXT NOT NULL CHECK (type IN (
    'club', 'academy', 'school', 'college', 'corporate', 'district', 'state', 'other'
  )),
  founded_year INTEGER,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  logo_url TEXT,
  cover_photo_url TEXT,
  home_venue_id UUID,                      -- REFERENCES venues(id)
  primary_kit_color TEXT,
  secondary_kit_color TEXT,
  bio TEXT,
  instagram_url TEXT,
  website_url TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  -- STATS (auto-computed)
  career_matches INTEGER DEFAULT 0,
  career_wins INTEGER DEFAULT 0,
  career_draws INTEGER DEFAULT 0,
  career_losses INTEGER DEFAULT 0,
  career_goals_for INTEGER DEFAULT 0,
  career_goals_against INTEGER DEFAULT 0,
  career_tournaments INTEGER DEFAULT 0,
  career_trophies INTEGER DEFAULT 0,
  -- ADMIN
  manager_user_id UUID REFERENCES auth.users(id),
  is_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE team_players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES teams(id),
  player_id UUID NOT NULL REFERENCES players(id),
  jersey_number INTEGER,
  position TEXT,
  role TEXT DEFAULT 'player' CHECK (role IN ('player', 'captain', 'vice_captain', 'goalkeeper_captain')),
  joined_date DATE,
  left_date DATE,                          -- NULL = current
  is_current BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(team_id, player_id, joined_date)
);

CREATE TABLE team_staff (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES teams(id),
  user_id UUID REFERENCES auth.users(id),
  name TEXT NOT NULL,
  role TEXT CHECK (role IN ('head_coach', 'assistant_coach', 'goalkeeper_coach', 'fitness_trainer', 'physio', 'manager', 'other')),
  photo_url TEXT,
  since_date DATE,
  is_current BOOLEAN DEFAULT TRUE
);

-- ═══════════════════════════════════════
-- VENUES
-- ═══════════════════════════════════════

CREATE TABLE venues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('natural_grass', 'artificial_turf', 'futsal_court', 'indoor', 'beach')),
  address TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  latitude DECIMAL,
  longitude DECIMAL,
  capacity INTEGER,
  has_floodlights BOOLEAN DEFAULT FALSE,
  has_changing_rooms BOOLEAN DEFAULT FALSE,
  has_parking BOOLEAN DEFAULT FALSE,
  has_canteen BOOLEAN DEFAULT FALSE,
  photos TEXT[] DEFAULT '{}',
  contact_phone TEXT,
  booking_info TEXT,
  tournaments_hosted INTEGER DEFAULT 0,
  matches_hosted INTEGER DEFAULT 0,
  owner_user_id UUID REFERENCES auth.users(id),
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════
-- TOURNAMENTS
-- ═══════════════════════════════════════

CREATE TABLE tournaments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  edition TEXT,                            -- "2024", "Season 3"
  format TEXT NOT NULL CHECK (format IN (
    'league', 'knockout', 'group_knockout', 'round_robin', 'hybrid'
  )),
  sport_category TEXT DEFAULT 'football' CHECK (sport_category IN ('football', 'futsal')),
  age_group TEXT,                          -- "U17", "U21", "Open", "35+"
  gender TEXT DEFAULT 'male',
  level TEXT CHECK (level IN ('local', 'district', 'state', 'national', 'international')),
  start_date DATE,
  end_date DATE,
  registration_deadline DATE,
  venue_id UUID REFERENCES venues(id),
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  organizer_id UUID NOT NULL REFERENCES auth.users(id),
  -- STRUCTURE
  max_teams INTEGER,
  teams_registered INTEGER DEFAULT 0,
  prize_money TEXT,                        -- "₹50,000 total prize"
  entry_fee DECIMAL DEFAULT 0,
  rules_url TEXT,
  -- SETTINGS
  match_duration_minutes INTEGER DEFAULT 90,
  extra_time BOOLEAN DEFAULT FALSE,
  penalty_shootout BOOLEAN DEFAULT TRUE,
  substitutions_allowed INTEGER DEFAULT 5,
  -- STATUS
  status TEXT DEFAULT 'upcoming' CHECK (status IN (
    'upcoming', 'registration_open', 'registration_closed',
    'ongoing', 'completed', 'cancelled'
  )),
  cover_image_url TEXT,
  description TEXT,
  sponsors JSONB DEFAULT '[]',
  -- AWARDS (set at end of tournament)
  golden_boot_player_id UUID REFERENCES players(id),
  golden_glove_player_id UUID REFERENCES players(id),
  best_player_player_id UUID REFERENCES players(id),
  winning_team_id UUID REFERENCES teams(id),
  runner_up_team_id UUID REFERENCES teams(id),
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE tournament_teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id UUID NOT NULL REFERENCES tournaments(id),
  team_id UUID NOT NULL REFERENCES teams(id),
  registered_at TIMESTAMPTZ DEFAULT NOW(),
  registration_fee_paid BOOLEAN DEFAULT FALSE,
  group_name TEXT,                         -- "Group A", "Group B"
  seed_number INTEGER,
  is_confirmed BOOLEAN DEFAULT FALSE,
  UNIQUE(tournament_id, team_id)
);

-- ═══════════════════════════════════════
-- MATCHES
-- ═══════════════════════════════════════

CREATE TABLE matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id UUID REFERENCES tournaments(id),
  home_team_id UUID NOT NULL REFERENCES teams(id),
  away_team_id UUID NOT NULL REFERENCES teams(id),
  venue_id UUID REFERENCES venues(id),
  scheduled_at TIMESTAMPTZ,
  match_type TEXT CHECK (match_type IN (
    'group', 'round_of_16', 'quarter_final', 'semi_final', 'final',
    'third_place', 'friendly', 'league'
  )),
  match_week INTEGER,                      -- for league matches
  round_number INTEGER,
  -- RESULT
  status TEXT DEFAULT 'scheduled' CHECK (status IN (
    'scheduled', 'live', 'half_time', 'completed', 'postponed', 'cancelled', 'abandoned'
  )),
  home_score INTEGER DEFAULT 0,
  away_score INTEGER DEFAULT 0,
  home_score_ht INTEGER,                   -- half-time score
  away_score_ht INTEGER,
  home_score_et INTEGER,                   -- extra time
  away_score_et INTEGER,
  home_penalties INTEGER,
  away_penalties INTEGER,
  winner_team_id UUID REFERENCES teams(id),
  -- MATCH STATS
  home_possession DECIMAL,
  away_possession DECIMAL,
  home_shots INTEGER DEFAULT 0,
  away_shots INTEGER DEFAULT 0,
  home_shots_on_target INTEGER DEFAULT 0,
  away_shots_on_target INTEGER DEFAULT 0,
  home_corners INTEGER DEFAULT 0,
  away_corners INTEGER DEFAULT 0,
  home_fouls INTEGER DEFAULT 0,
  away_fouls INTEGER DEFAULT 0,
  home_offsides INTEGER DEFAULT 0,
  away_offsides INTEGER DEFAULT 0,
  -- SCORING
  scorer_user_id UUID REFERENCES auth.users(id),
  scoring_started_at TIMESTAMPTZ,
  -- CONTENT
  match_report TEXT,                       -- AI or manual match report
  highlights_url TEXT,
  crowd_size INTEGER,
  referee_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════
-- MATCH EVENTS (every event in the game)
-- ═══════════════════════════════════════

CREATE TABLE match_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN (
    'goal', 'own_goal', 'penalty_scored', 'penalty_missed',
    'yellow_card', 'second_yellow', 'red_card',
    'substitution_on', 'substitution_off',
    'injury', 'assist',
    'save', 'corner', 'free_kick_goal',
    'kickoff', 'halftime', 'fulltime', 'extratime_start',
    'var_decision', 'goal_disallowed'
  )),
  team_id UUID NOT NULL REFERENCES teams(id),
  player_id UUID REFERENCES players(id),          -- main player for event
  secondary_player_id UUID REFERENCES players(id), -- assist or sub coming on
  minute INTEGER NOT NULL,                         -- 1-120
  extra_time_minute INTEGER DEFAULT 0,             -- added time (90+3 etc)
  is_home_team BOOLEAN NOT NULL,
  description TEXT,                                -- "Header from corner"
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- ═══════════════════════════════════════
-- PLAYER MATCH PERFORMANCES
-- ═══════════════════════════════════════

CREATE TABLE player_match_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID NOT NULL REFERENCES matches(id),
  player_id UUID NOT NULL REFERENCES players(id),
  team_id UUID NOT NULL REFERENCES teams(id),
  position_played TEXT,
  started BOOLEAN DEFAULT TRUE,
  minutes_played INTEGER DEFAULT 90,
  goals INTEGER DEFAULT 0,
  assists INTEGER DEFAULT 0,
  yellow_cards INTEGER DEFAULT 0,
  red_cards INTEGER DEFAULT 0,
  shots INTEGER DEFAULT 0,
  shots_on_target INTEGER DEFAULT 0,
  saves INTEGER DEFAULT 0,                  -- for GKs
  clean_sheet BOOLEAN DEFAULT FALSE,        -- for GKs and defenders
  fouls_committed INTEGER DEFAULT 0,
  fouls_suffered INTEGER DEFAULT 0,
  offsides INTEGER DEFAULT 0,
  dribbles_completed INTEGER DEFAULT 0,
  tackles_won INTEGER DEFAULT 0,
  aerial_duels_won INTEGER DEFAULT 0,
  pass_accuracy DECIMAL,
  rating DECIMAL CHECK (rating BETWEEN 0 AND 10),  -- 0-10 match rating
  is_motm BOOLEAN DEFAULT FALSE,
  entered_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(match_id, player_id)
);

-- ═══════════════════════════════════════
-- TOURNAMENT STANDINGS (auto-computed)
-- ═══════════════════════════════════════

CREATE TABLE tournament_standings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id UUID NOT NULL REFERENCES tournaments(id),
  team_id UUID NOT NULL REFERENCES teams(id),
  group_name TEXT,
  matches_played INTEGER DEFAULT 0,
  wins INTEGER DEFAULT 0,
  draws INTEGER DEFAULT 0,
  losses INTEGER DEFAULT 0,
  goals_for INTEGER DEFAULT 0,
  goals_against INTEGER DEFAULT 0,
  goal_difference INTEGER GENERATED ALWAYS AS (goals_for - goals_against) STORED,
  points INTEGER DEFAULT 0,
  form TEXT DEFAULT '',                    -- "WWDLW" last 5 results
  position INTEGER,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tournament_id, team_id, group_name)
);

-- ═══════════════════════════════════════
-- PLAYER SEASON STATS (per year per team)
-- ═══════════════════════════════════════

CREATE TABLE player_season_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID NOT NULL REFERENCES players(id),
  team_id UUID NOT NULL REFERENCES teams(id),
  season TEXT NOT NULL,                    -- "2024-25"
  matches INTEGER DEFAULT 0,
  goals INTEGER DEFAULT 0,
  assists INTEGER DEFAULT 0,
  yellow_cards INTEGER DEFAULT 0,
  red_cards INTEGER DEFAULT 0,
  clean_sheets INTEGER DEFAULT 0,
  motm_awards INTEGER DEFAULT 0,
  avg_rating DECIMAL DEFAULT 0,
  minutes_played INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(player_id, team_id, season)
);

-- ═══════════════════════════════════════
-- SCOUTING + DISCOVERY
-- ═══════════════════════════════════════

CREATE TABLE scout_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id),
  full_name TEXT NOT NULL,
  organization TEXT,                       -- "Minerva Punjab FC", "SSB Football"
  role TEXT,                               -- "Head Scout", "Academy Director"
  verified BOOLEAN DEFAULT FALSE,
  photo_url TEXT,
  city TEXT,
  state TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE scout_watchlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scout_id UUID NOT NULL REFERENCES scout_profiles(id),
  player_id UUID NOT NULL REFERENCES players(id),
  notes TEXT,
  added_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(scout_id, player_id)
);

CREATE TABLE scout_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scout_id UUID NOT NULL REFERENCES scout_profiles(id),
  player_id UUID NOT NULL REFERENCES players(id),
  message TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  sent_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════
-- MEDIA (videos and photos)
-- ═══════════════════════════════════════

CREATE TABLE media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  uploader_id UUID NOT NULL REFERENCES auth.users(id),
  media_type TEXT CHECK (media_type IN ('photo', 'video', 'highlight_reel')),
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  title TEXT,
  description TEXT,
  duration_seconds INTEGER,               -- for videos
  linked_to TEXT CHECK (linked_to IN ('player', 'team', 'match', 'tournament', 'venue')),
  linked_id UUID,
  match_id UUID REFERENCES matches(id),
  is_highlight BOOLEAN DEFAULT FALSE,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════
-- ACHIEVEMENTS / BADGES
-- ═══════════════════════════════════════

CREATE TABLE player_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID NOT NULL REFERENCES players(id),
  achievement_type TEXT NOT NULL CHECK (achievement_type IN (
    'golden_boot', 'golden_glove', 'best_player', 'mvp',
    'top_scorer_season', 'most_assists', 'unbeaten_season',
    'hat_trick', 'brace', 'clean_sheet_streak',
    'tournament_winner', 'player_of_tournament',
    '100_goals', '50_goals', '10_goals', 'debut'
  )),
  tournament_id UUID REFERENCES tournaments(id),
  team_id UUID REFERENCES teams(id),
  season TEXT,
  value TEXT,                              -- "23 goals", "100th goal"
  date_achieved DATE,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════
-- USERS AND ROLES
-- ═══════════════════════════════════════

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  full_name TEXT NOT NULL,
  phone TEXT UNIQUE,
  email TEXT,
  role TEXT NOT NULL CHECK (role IN (
    'player', 'team_manager', 'tournament_organizer', 'scout',
    'venue_owner', 'admin', 'super_admin'
  )),
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════
-- NOTIFICATIONS
-- ═══════════════════════════════════════

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  type TEXT NOT NULL CHECK (type IN (
    'match_live', 'match_result', 'goal_scored', 'goal_conceded',
    'scout_interest', 'scout_contact', 'tournament_registered',
    'tournament_fixture', 'tournament_result', 'achievement_earned',
    'new_follower', 'team_invitation', 'announcement'
  )),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  action_url TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════
-- AI GENERATED CONTENT
-- ═══════════════════════════════════════

CREATE TABLE ai_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type TEXT NOT NULL CHECK (content_type IN (
    'match_report', 'tournament_summary', 'player_season_review',
    'scouting_report', 'player_bio', 'tournament_preview'
  )),
  linked_to TEXT,
  linked_id UUID,
  content TEXT NOT NULL,
  model_used TEXT,
  generated_at TIMESTAMPTZ DEFAULT NOW(),
  is_published BOOLEAN DEFAULT FALSE
);

-- ═══════════════════════════════════════
-- SECURITY: AUDIT LOG
-- ═══════════════════════════════════════

CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id UUID,
  ip_address INET,
  user_agent TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════
-- INDEXES (performance)
-- ═══════════════════════════════════════

CREATE INDEX idx_players_state ON players(state, position, age);
CREATE INDEX idx_players_goals ON players(career_goals DESC);
CREATE INDEX idx_players_search ON players USING GIN(search_vector);
CREATE INDEX idx_players_embedding ON players USING ivfflat(embedding vector_cosine_ops);
CREATE INDEX idx_matches_tournament ON matches(tournament_id, status);
CREATE INDEX idx_match_events_match ON match_events(match_id, minute);
CREATE INDEX idx_player_match_stats ON player_match_stats(player_id, match_id);
CREATE INDEX idx_standings_tournament ON tournament_standings(tournament_id, points DESC);
CREATE INDEX idx_notifications_user ON notifications(user_id, is_read, created_at DESC);

-- ═══════════════════════════════════════
-- ROW LEVEL SECURITY
-- ═══════════════════════════════════════

ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE match_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE scout_contacts ENABLE ROW LEVEL SECURITY;

-- Players: public profiles visible to all, editing only by owner
CREATE POLICY "Public player profiles" ON players FOR SELECT TO anon, authenticated USING (profile_visibility = 'public');
CREATE POLICY "Players edit own profile" ON players FOR UPDATE USING (user_id = auth.uid());

-- Scout contacts: only sender and recipient
CREATE POLICY "Scout contact privacy" ON scout_contacts FOR SELECT
  USING (scout_id IN (SELECT id FROM scout_profiles WHERE user_id = auth.uid())
    OR player_id IN (SELECT id FROM players WHERE user_id = auth.uid()));

-- Match events: only scorer or organizer can insert
CREATE POLICY "Scorer inserts events" ON match_events FOR INSERT
  WITH CHECK (created_by = auth.uid());
```

---

# PART 2: DESIGN SYSTEM

```
VISUAL IDENTITY:

NAME: Foot Heroes
TAGLINE: "Your game. Your record. Forever."

COLORS:
  Background:     #0A1628  (deep football night)
  Surface:        #111D35
  Card:           #1A2B48
  Primary:        #22C55E  (football green — fresh grass)
  Primary Dark:   #16A34A
  Accent:         #F59E0B  (gold — trophies, achievements)
  Secondary:      #3B82F6  (electric blue — energy)
  Danger:         #EF4444  (red card red)
  Warning:        #F97316  (orange — yellow card warning)
  Text:           #F1F5F9  (near white)
  Text Muted:     #94A3B8
  Border:         #1E3A5F
  
TYPOGRAPHY:
  Display:        Bebas Neue (all caps, sport-bold headlines)
  Headings:       Exo 2 (semi-bold, modern sport)
  Body:           Inter (clean, readable)
  Stats/Numbers:  JetBrains Mono (monospaced — for scores, stats)
  
VISUAL ELEMENTS:
  Football pitch grid lines: subtle background pattern
  Hexagonal stat cards (like FIFA Ultimate Team)
  Trophy shine animation on achievements
  Green pulse on live match indicators
  Stats bars with gradient fills
  Player cards: similar to Transfermarkt but more visual
  
LOGO:
  Icon: Football with speed lines (motion)
  Or: Boot kicking ball (referencing loading animation)
  Text: "FOOT HEROES" in Bebas Neue
  Color: Green circle + white text
  
FEEL: FIFA meets Transfermarkt meets ESPN FC
  Not a startup SaaS — a sports brand
  Dark, energetic, premium
  Every number should look like it matters
```

---

# PART 3: COMPLETE BUILD PROMPTS

## PREFIX — Paste Before Every Prompt

```
You are the Senior Full-Stack Engineer building Foot Heroes —
India's football identity and scouting network.
Transfermarkt + CricHeroes + LinkedIn for grassroots football.

Stack: Next.js 14 App Router, TypeScript strict,
Tailwind CSS, Supabase (PostgreSQL + Auth + Realtime),
Framer Motion (animations), Recharts (stats charts),
React Query, Zustand.

Design System:
- Background: #0A1628 (deep night blue)
- Surface: #111D35
- Card: #1A2B48
- Primary: #22C55E (grass green)
- Accent: #F59E0B (gold)
- Secondary: #3B82F6 (electric blue)
- Danger: #EF4444 (red)
- Text: #F1F5F9
- Font: Bebas Neue (display) + Exo 2 (headings) + Inter (body)
- Feel: Sports broadcast meets esports — dark, premium, energetic

NON-NEGOTIABLE RULES:
1. Loading animation: boy kicking football on EVERY cold page load
2. TypeScript strict — zero 'any'
3. Mobile-first: every page works perfectly on 375px
4. Match scoring: events must post within 200ms (real-time feel)
5. Supabase Realtime: live scores update without page refresh
6. Never expose other users' private data (RLS must be active)
7. Rate limiting on all API routes
8. All file uploads: validate MIME type, size limit, virus-safe path
9. SEO: every player profile, tournament, match has proper meta tags
10. No mock data anywhere: every stat must come from real events

[PASTE SPECIFIC PROMPT BELOW]
```

---

## PROMPT 1 — Loading Animation + Homepage
### Tool: CLAUDE ACCOUNT 1

```
Build the iconic loading animation and complete homepage.

FILE 1: src/components/LoadingAnimation.tsx

THE KICKING BOY ANIMATION:
  
  Full-screen dark overlay (#0A1628)
  Centered SVG animation:
  
  THE BOY (SVG path animation):
    Side-profile silhouette of a footballer
    Running cycle animation (Framer Motion keyframes):
      Frame 1: running approach, arms back
      Frame 2: planting foot, arms forward
      Frame 3: KICK — kicking leg swings through, arms spread
      Frame 4: follow through, weight forward
    Smooth loop from frame 1-4 in 0.6 seconds
    Boy is white/light green silhouette on dark background
    Position: left 30% of screen, vertically centered
    
  THE FOOTBALL:
    Starting position: boy's foot at kick frame
    Framer Motion animation:
      x: from boyPosition to screen right edge (100vw + 100px)
      y: slight arc (natural ball trajectory)
        keyframes: [0, -40px, 0] for the arc shape
      rotate: 0 to 720 degrees (two full rotations — natural spin)
      scale: slight size increase at peak arc then normal
    duration: 0.9 seconds
    easing: custom cubic-bezier (fast start, slight deceleration)
    Trail effect: 3 ghost footballs behind with decreasing opacity
                  (0.6, 0.3, 0.1) and slight delay
    
  AFTER BALL LEAVES SCREEN (0.9s):
    Letters appear one by one, as if flying in following the ball's path:
    "FOOT" slides in from left → settles in center-left
    " " gap
    "HEROES" slides in from left → settles in center-right
    Font: Bebas Neue, 72px, white
    Each letter: delay 0.05s between them
    
    Tagline fades in below (1.6s total):
    "Your game. Your record. Forever."
    Font: Inter, 16px, #94A3B8

  FULL SEQUENCE TIMING:
    0.0s: Screen appears (black)
    0.1s: Boy starts running
    0.5s: Ball launches
    0.9s: Ball off screen
    1.0s: Letters start appearing
    1.8s: All letters visible, tagline fades in
    2.6s: Animation complete
    2.8s: Fade to homepage (crossfade, not cut)
  
  SKIP: tap anywhere after 0.5s to skip to homepage
  
  IMPLEMENTATION:
    useEffect: check localStorage for 'ft_intro_shown'
    If true: skip animation, show homepage directly
    If false: play animation, then set flag, show homepage
    Flag expires after 24 hours (so they see it daily, not every visit)
    
  MOBILE: same animation but scaled to mobile viewport
    Boy + ball: smaller scale (60%)
    Letters: 48px on mobile

FILE 2: src/app/page.tsx — HOMEPAGE

NAVBAR (transparent on homepage, solid on scroll):
  Left: Foot Heroes logo
  Center: Live | Tournaments | Players | Teams | Venues | Discover
  Right: "Sign In" | "Join Free" (green CTA)
  Mobile: hamburger menu

SECTION 1 — HERO:
  Background: football pitch aerial view photo (dark overlay)
              OR animated pitch lines (CSS grid pattern)
  Large heading (Bebas Neue, 80px desktop / 48px mobile):
    "YOUR GAME."
    "YOUR RECORD."
    "FOREVER."
  Each line slides up with Framer Motion (staggered, 0.2s each)
  
  Subheading (Inter, 20px):
    "India's football identity network.
     Track stats. Get discovered. Build your legacy."
  
  Two CTAs:
    [Create Your Profile →]  (green, large, filled)
    [Explore Players]         (outline, secondary)
  
  Trust bar below CTAs:
    "12,847 players | 342 tournaments | 18 states"
    (update manually, then auto from DB)

SECTION 2 — LIVE MATCHES TICKER:
  Auto-scrolling horizontal ticker (if live matches exist)
  Each match card: Team A [1] - [0] Team B | Live 67'
  Green pulse dot next to "Live"
  Tap to go to live match
  If no live matches: "No live matches right now — Upcoming: [next match]"

SECTION 3 — HOW IT WORKS:
  3 column cards (icon + title + description):
  ⚽ PLAY: "Join a tournament. Score goals. Get recorded automatically."
  📊 TRACK: "Every match builds your permanent stats profile."
  🔍 GET FOUND: "Scouts and coaches discover talent through our platform."

SECTION 4 — RECENT TOURNAMENT WINNERS:
  Horizontal scroll of tournament cards (last 5 completed tournaments):
  Each card: tournament name, winner team logo + name, date, location
  "View Tournament →" link on each
  Section heading: "Recent Champions"

SECTION 5 — FEATURED PLAYERS:
  "Players Making News This Week"
  Grid of 6 player cards (stat-heavy):
  Each: photo + name + position + city + goals this season
  "View Profile →" link
  This week's top scorer badge (golden boot icon)

SECTION 6 — SCOUT SEARCH PREVIEW:
  The discovery feature teaser:
  Heading: "Find Football Talent Anywhere in India"
  Interactive search demo (fake UI, shows what scouts can do):
  Position dropdown | Age group | State dropdown | Min Goals
  [Search Players] button → goes to /discover (requires signup)
  Below: "Join as a Scout →" CTA

SECTION 7 — STATES MAP:
  Simplified India map (SVG, static)
  Dots on football-heavy states (colored by activity level):
    Kerala, West Bengal, Goa, Manipur, Mizoram, Meghalaya highlighted
  Hover: "West Bengal — 1,242 players registered"
  
SECTION 8 — SOCIAL PROOF:
  "What Players Are Saying"
  3 testimonial cards (real or seeded for launch)
  
SECTION 9 — FINAL CTA:
  "Stop Playing in the Shadows"
  "Your goals deserve a record. Join Foot Heroes free."
  [Create Free Profile] button (large, green)

FOOTER:
  Logo | About | Privacy | Terms | Contact
  Social links: Instagram, Twitter/X, YouTube
  "© 2025 Foot Heroes. All rights reserved."

FILE 3: src/components/Navbar.tsx
Responsive navbar:
  Desktop: horizontal nav with all links
  Mobile: hamburger → slide-in drawer from right
  Transparent when at top of homepage (hero section)
  Solid #111D35 when scrolled
  Transition: smooth background-color transition
  Active page: green underline on nav item
  Auth state: shows avatar/name if logged in, else Sign In / Join Free
```

---

## PROMPT 2 — Player Profile (The Core Product)
### Tool: CLAUDE ACCOUNT 2

```
Build the complete player profile — the heart of Foot Heroes.
This is what makes players want to join and scouts want to pay.

FILE 1: src/app/player/[slug]/page.tsx

DESIGN: Like Transfermarkt meets FIFA Ultimate Team.
Dark cards, glowing stats, everything looks premium.

HERO SECTION:
  Cover photo (full width, dark gradient overlay)
  Player avatar (circle, 120px, white border, bottom of cover)
  
  Name: large Bebas Neue
  Position badge: colored pill (GK=yellow, DEF=blue, MID=green, FWD=red)
  Verified badge: checkmark (blue) if organizer-verified stats
  
  City + State: with map pin icon
  Current team: team logo + name (clickable)
  
  QUICK STATS ROW (horizontal, 6 stats):
    Matches | Goals | Assists | Cards | Rating | Season Goals
    Each: number (large, Bebas Neue) + label (small, muted)
    Live-updating if currently in a match
    
  ACTION BUTTONS:
    [Follow] (if visitor) | [Contact Player] (for scouts)
    [Edit Profile] (if own profile)
    [Share Profile] (copy link)

STATS CARDS SECTION:
  
  CAREER OVERVIEW (hexagonal stat display):
    Radar/spider chart: Goals, Assists, Discipline, Consistency,
                        Experience, Rating
    Each axis 0-100 normalized
    Compared to position average (subtle overlay)
    
  THIS SEASON vs CAREER (side by side):
    Season 2024-25 | Career All-Time
    Goals:   XX | XX
    Assists: XX | XX  
    Matches: XX | XX
    Cards:   XX | XX
    Rating:  X.X | X.X
    Clean Sheets: XX | XX (for GKs)
    
  FORM GUIDE (last 5 matches):
    5 circles: G (goal scored), A (assist), W (win), D (draw), L (loss)
    Color: green=good, red=loss, yellow=draw
    
  GOALS BY TYPE:
    Pie/donut chart: Right foot | Left foot | Header | Penalties | Free kicks

MATCH HISTORY TABLE:
  Columns: Date | Tournament | vs | Result | Goals | Assists | Rating | MOTM
  Last 20 matches
  Expandable rows: click match → see full event timeline
  Filter: by season, by tournament, by team

TOURNAMENT HISTORY:
  Cards per tournament:
    Tournament name + year | Team | Final position | Goals | Assists | Awards
  Trophy icons for wins/runner-up
  "Top Scorer" golden boot badge if they won it

TEAM HISTORY:
  Timeline view (vertical):
    [Club Logo] [Team Name] [Period] [Apps] [Goals]
    Most recent at top
    All historical teams below

ACHIEVEMENTS + BADGES:
  Trophy wall: grid of achievement badges
  Each badge: icon + name + "Tournament X, 2024"
  Locked badges greyed out (motivates players to earn them)
  Most impressive: Golden Boot (gold), Best Player (platinum)

MEDIA GALLERY:
  Photo grid (3 columns)
  Video highlights (separate tab)
  Each video: thumbnail + title + date + views
  Video player: fullscreen, fast loading

SCOUTING REPORT (visible only to verified scouts):
  AI-generated assessment:
    Strengths: [auto-generated from stats]
    Areas for improvement: [auto-generated]
    Similar to: [comparable players by stats]
    Potential rating: [AI assessment]
    Last 30 days form: [trend]

SCOUT ACTIONS (scout users only):
  [Add to Watchlist] | [Send Contact Request] | [Generate Report PDF]

FILE 2: src/app/player/[slug]/edit/page.tsx
Profile editor (player's own profile):

TABS: Basic Info | Stats & Positions | Media | Privacy

BASIC INFO:
  Name, DOB, city, state
  Bio (rich text, 500 chars)
  Playing style (free text)
  Position + secondary position
  Preferred foot
  Height, weight
  Jersey number
  Social links (Instagram, YouTube)

MEDIA:
  Profile photo upload (drag/drop or camera)
  Cover photo upload
  Video highlights:
    Upload video (max 200MB, .mp4)
    OR paste YouTube/Instagram link
    Add title and description
  Photos: upload up to 20 match action photos

PRIVACY SETTINGS:
  Profile visibility: Public | Private | Scouts Only
  Show phone to scouts: Yes / No
  Allow scout contact: Yes / No / Only from verified scouts
  Show in discovery: Yes / No

FILE 3: src/components/player/PlayerCard.tsx
Reusable compact player card (used in discovery, search, team pages):
  Photo (round, 60px) | Name | Position badge | City | 
  Top stats: Goals | Assists | Matches | Rating
  Mini form guide (5 dots)
  Verified badge if applicable
  Click: goes to full profile

FILE 4: SEO + structured data
generateMetadata for player profile:
  title: "[Player Name] — Football Stats, Profile & Career | Foot Heroes"
  description: "[Name], [Position] from [City]. [X] goals, [Y] assists..."
  OG: player photo + stats
  JSON-LD: Person schema with sports stats
  This makes profiles rank on Google when people search player names
```

---

## PROMPT 3 — Live Match Scoring (The Data Engine)
### Tool: CLAUDE ACCOUNT 3

```
Build the live match scoring interface — the data collection engine.
This must work perfectly on a scorer's phone at a football ground.
Speed and reliability are critical. Network may be poor at grounds.

FILE 1: src/app/match/[id]/score/page.tsx
Live scoring interface (scorer role only):

DESIGN: All large touch targets. Works with one thumb.
        Dark background (sunlight readable).

HEADER:
  Match: "Team A vs Team B"
  Score: LARGE "1 — 0" (most visible element)
  Time: "67'" with blinking green dot
  Half: "2nd Half" badge
  "END MATCH" button (top right, danger color)

SCOREBOARD:
  Two team columns:
  Left: home team name + logo + score (large)
  Right: away team name + logo + score (large)
  Center: time ticker (counts up from 0, manual control)

QUICK EVENT BUTTONS (large, thumb-sized):
The most important UX — these must be one tap.

  [⚽ GOAL] (large green button, center)
  
  Two columns for home vs away:
  HOME SIDE | AWAY SIDE
  [🟨 Yellow]  [🟨 Yellow]
  [🟥 Red]     [🟥 Red]
  [↔️ Sub]     [↔️ Sub]
  [🥅 Save]    [🥅 Save]
  [📍 Corner]  [📍 Corner]
  [⚠️ Injury]  [⚠️ Injury]

ON GOAL TAP → modal slides up:
  "Who scored? (HOME TEAM)"
  Player list: large cards with jersey number + name
  (Preloaded from team rosters for this match)
  Tap player → "Assist?"
    Same player list + "No Assist" option
    Tap assist player (or no assist) → CONFIRM
  
  "Penalty?" toggle
  "Own Goal?" toggle
  
  Minute confirmation (pre-filled with current time):
    [67'] — tap to edit if needed
  
  [SUBMIT EVENT] — large green button
  
  Back button to cancel

ON YELLOW/RED CARD:
  Same flow: which team → which player → which minute
  Red card: option for "Second Yellow"

ON SUBSTITUTION:
  Which team → who went OFF → who came ON → minute

HALF TIME CONTROLS:
  [HALF TIME] button → logs half time event, shows half time summary
  [START 2ND HALF] button

EVENTS TICKER (scrollable, below main controls):
  Shows all events recorded so far:
  "45' ⚽ GOAL — Rahul K. (Assist: Priya M.) [1-0]"
  "32' 🟨 Yellow Card — Amit P."
  "18' ⚽ GOAL — Priya M. [0-0 → 1-0]"
  
  Tap any event: option to EDIT or DELETE (undo mistakes)
  Delete: shows confirmation "Delete this event?"

REALTIME SYNC:
  Every event POST: optimistic UI update (shows immediately)
  Supabase Realtime: broadcasts to all viewers of this match
  If offline: stores events in IndexedDB
              shows "Offline — will sync when connected"
              on reconnect: syncs all offline events in order

FILE 2: src/app/match/[id]/page.tsx
Live match viewer (for everyone):

LIVE SCORE DISPLAY:
  Large score, real-time via Supabase Realtime subscription
  Green pulse animation when goal scored
  Goal animation: brief celebration effect (confetti burst, subtle)
  
MATCH TIMELINE:
  Vertical event timeline:
  Time | Event Icon | Description
  "90+2' 🟥 RED CARD — Opponent FC #5"
  "78' ⚽ GOAL — Rahul K. ⚫ Team A (87' total)"
  
LINEUPS:
  Starting XI + bench for both teams
  Formations if entered (visual grid)
  Substitution annotations

STATS (updates live):
  Possession | Shots | Shots on Target | Corners | Cards

PLAYER RATINGS (post-match):
  After final whistle: 1-10 sliders for each player
  Crowd/organizer can rate (average shown)
  MOTM voting: tap to vote, most votes wins

FILE 3: Offline support for scoring
src/lib/offline/matchQueue.ts

interface QueuedEvent {
  localId: string;
  matchId: string;
  eventData: MatchEvent;
  timestamp: number;
  synced: boolean;
}

saveToQueue(event: MatchEvent): void
  // Store in IndexedDB (idb library)
  // Show locally immediately
  // Mark as "pending sync"
  
syncQueue(): Promise<void>
  // On network restore (navigator.onLine event)
  // Send each queued event in order
  // Mark as synced
  // Show "Synced ✓" indicator

FILE 4: src/app/api/match/events/route.ts
POST endpoint for match events:
  Auth: scorer must be assigned to this match
  Validate: match is 'live' status
  Validate: event data with Zod schema
  Rate limit: 30 events per minute (prevent spam)
  Insert: match_events table
  Trigger: update player_match_stats (via DB function)
  Trigger: update tournament_standings (if tournament match)
  Trigger: broadcast via Supabase Realtime
  Trigger: notify followers (push notification)
  Return: { success, event, updatedScore }

  SECURITY:
  - Verify scorer_user_id === authenticated user
  - Verify match belongs to a tournament the user manages
  - No direct score manipulation (score derived from events only)
  - All events logged to audit_log
```

---

## PROMPT 4 — Tournament OS
### Tool: CLAUDE ACCOUNT 2

```
Build the complete tournament management system.

FILE 1: src/app/tournament/create/page.tsx
Tournament creation wizard (4 steps):

STEP 1: BASICS
  Tournament name (e.g., "SRM College Football Cup 2025")
  Edition / Season (optional: "Season 3")
  Sport: Football | Futsal
  Format: League | Knockout | Group Stage + Knockout
  Age Group: U12 | U15 | U17 | U19 | U21 | Open | 30+ | 35+
  Gender: Men's | Women's | Mixed
  Level: Local | District | State | National
  Cover image upload

STEP 2: SCHEDULE + VENUE
  Start date, End date
  Registration deadline
  Venue: search existing venues OR add new venue
  Max teams (4, 8, 12, 16, 32)
  Entry fee (₹ — 0 for free)
  Prize pool description

STEP 3: MATCH SETTINGS
  Match duration (45, 60, 70, 90 minutes)
  Extra time: Yes/No
  Penalty shootout: Yes/No
  Max substitutions per team (3, 5, unlimited)
  Points: Win=3, Draw=1, Loss=0 (or customize)

STEP 4: REVIEW + PUBLISH
  Summary of all settings
  [Save as Draft] | [Publish Tournament]
  On publish: tournament appears in listings, registration opens

FILE 2: src/app/tournament/[slug]/page.tsx
Public tournament page:

HEADER:
  Tournament name + edition
  Status badge: UPCOMING | REGISTRATION OPEN | ONGOING | COMPLETED
  Date range, venue, city
  Organizer: [Name/Organization]
  Cover image banner

QUICK STATS:
  Teams Registered | Matches Played | Goals Scored | Days Remaining

TABS: Overview | Teams | Fixtures | Standings | Stats | Media

OVERVIEW TAB:
  Tournament description
  Format explanation (auto-generated from settings)
  Prize breakdown
  Venue details with map
  Sponsors logos (if any)
  Registration CTA (if open)

TEAMS TAB:
  Grid of registered team cards
  Each: logo + name + city + stats this tournament
  
FIXTURES TAB:
  Filter: All | Today | This Week | Group A / Group B
  Match cards:
    [Team A Logo] [1] - [2] [Team B Logo]
    Date + time + venue
    "LIVE" badge with green pulse if happening now
    "Full Time" if completed (tap for details)
    "Preview" if upcoming
  
STANDINGS TAB:
  League table or group tables:
  Pos | Team | P | W | D | L | GF | GA | GD | Pts | Form
  Form: WWDLW (colored dots)
  
STATS TAB:
  Top Scorers: player | goals | team | flag
  Top Assists: player | assists | team
  Clean Sheets: goalkeeper | team | clean sheets
  Fair Play: team | cards
  
MEDIA TAB:
  Match photos
  Highlight videos
  Tournament documents (rules PDF)

AWARDS (shown after tournament ends):
  🥇 WINNERS: [Team Name]
  🥈 RUNNERS-UP: [Team Name]
  🥇 GOLDEN BOOT: [Player] — X goals
  🧤 GOLDEN GLOVE: [Goalkeeper] — Y clean sheets
  ⭐ BEST PLAYER: [Player]

REGISTER TEAM BUTTON (if open):
  [Register Your Team →]
  Requirements checklist:
    Min/max squad size
    Eligibility (age, gender)
    Documents required
    Fee amount

FILE 3: src/app/tournament/[slug]/manage/page.tsx
Organizer management dashboard:

SECTION: REGISTRATIONS
  Pending teams (need approval)
  Approved teams
  Rejected teams
  Waitlisted teams
  [Approve] [Reject] [Waitlist] buttons per team
  WhatsApp/email to team on status change

SECTION: FIXTURE GENERATION
  [Generate Fixtures] button (auto-generate based on format + team count)
  Preview fixtures before confirming
  Manual fixture editing (drag to reorder)
  Assign venues and times to each match
  Assign scorers to each match

SECTION: LIVE MATCH MANAGEMENT
  All matches in a day listed
  [Start Match] button for each
  Opens scorer interface
  Real-time status view

SECTION: STANDINGS CONTROL
  Auto-calculated standings
  Manual override option (for walkover, disputed matches)
  
SECTION: AWARDS
  After tournament: assign Golden Boot, Golden Glove, Best Player
  System suggests based on stats (organizer confirms)
  
SECTION: SETTINGS
  Edit tournament details
  Open/close registration
  Cancel tournament (with confirmation)

FILE 4: Fixture auto-generation algorithm
src/lib/tournament/fixtureGenerator.ts

generateRoundRobinFixtures(teams: Team[]): Match[]
  - Every team plays every other team once (or twice)
  - Round robin scheduling algorithm
  - Distribute home/away balanced

generateKnockoutFixtures(teams: Team[], rounds: string[]): Match[]
  - Bracket generation
  - Seeded placement

generateGroupStageKnockout(teams: Team[], numGroups: number): { groups, knockout }
  - Split teams into groups (snake seeding)
  - Top 2 from each group advance
  - Semifinal + Final brackets auto-created

generateSchedule(matches: Match[], startDate: Date, matchesPerDay: number): Match[]
  - Distribute matches across available days
  - Avoid same team playing twice in one day
  - Return matches with scheduled dates/times
```

---

## PROMPT 5 — Discovery Engine (The Scout Portal)
### Tool: CLAUDE ACCOUNT 3

```
Build the talent discovery and scouting system.
This is the most valuable and defensible feature.

FILE 1: src/app/discover/page.tsx
Scout search interface:

HERO:
  "Discover Football Talent Across India"
  "Search verified player stats from 18 states"
  
SEARCH FILTERS (the core UX):
  Position: All | GK | DEF | MID | FWD (with sub-positions)
  Age Group: U12 | U14 | U17 | U19 | U21 | Senior (23+)
  State: dropdown of all Indian states
  City: text search
  Min Goals This Season: 0 | 5 | 10 | 20 | 30 | 50+
  Min Matches: 0 | 5 | 10 | 20+
  Min Rating: 5 | 6 | 7 | 8+
  Tournament Level: Local | District | State | National
  Preferred Foot: Left | Right | Both
  [SEARCH] button

RESULTS:
  Sort: Goals (high-low) | Rating | Matches Played | Recent Activity
  
  Player result cards (compact, data-rich):
    Row: Photo | Name | Position | Age | City, State | Goals | Assists | Matches | Rating
    Badges: verified | top scorer icon | recent form dots
    [View Profile] [Add to Watchlist] (for scouts)
    
  Pagination: 20 per page, infinite scroll on mobile
  
  Map view toggle: show players as pins on India map
  Cluster by state, click cluster → list of players in that state

QUICK SEARCH PRESETS (prominent, above search):
  "🥅 U17 Goalkeepers in Kerala"
  "⚽ U21 Strikers with 20+ goals"
  "🛡️ Defenders in West Bengal"
  "⚡ Top Rated Midfielders"

ACCESS CONTROL:
  Basic results (name, position, city): available to all
  Full stats + contact: scouts only (verified account)
  Scout signup CTA for non-scouts trying to view full profiles

FILE 2: src/app/discover/scout/dashboard/page.tsx
Scout's personal dashboard:

MY WATCHLIST:
  Grid of saved players
  Each: photo + name + last updated stats
  [Remove] | [Generate Report] | [Send Contact Request]
  
RECENT ACTIVITY:
  New players I viewed
  Responses from contact requests
  Players who viewed my profile
  
SAVED SEARCHES:
  Save my favorite search filter combinations
  Get notifications when new players match my saved searches

CONTACT REQUESTS:
  Sent requests with status (pending/accepted/rejected)
  Players can reply with message
  
AI SCOUTING REPORTS:
  "Generate Report" for any watchlisted player
  AI produces: strengths, weaknesses, potential rating, recommendation
  Download as PDF (branded report with player photo and stats)
  
FILE 3: src/app/api/discover/search/route.ts
Player search API:
  GET with query params
  Build Supabase query dynamically based on filters
  Full text search on player names (tsvector)
  Vector similarity search (future: AI semantic search)
  Rate limit: 20 searches/minute per user
  Results: paginated, 20 per page
  Exclude: players who set profile_visibility to 'private'
  Include: only is_scoutable = true players
  
FILE 4: AI-Powered Scouting Report Generator
src/lib/ai/scoutingReport.ts

generateScoutingReport(playerId: string): Promise<string>
  
  SYSTEM PROMPT:
  "You are an experienced football scout analyzing player data.
   Write a professional scouting report in clear English.
   Be specific, use the numbers provided.
   Be honest about weaknesses.
   Format: Overview | Strengths | Areas for Improvement | 
   Potential | Similar Players | Recommendation"
  
  INPUT: Player full stats JSON
    {name, position, age, city, career stats,
     recent form, tournament levels played,
     goals breakdown, season trend}
     
  OUTPUT: 300-word professional scouting report
  Model: OpenRouter Llama 3.3 70B (free)
  Cache: store in ai_content table, don't regenerate if < 7 days old
```

---

## PROMPT 6 — Security + Cybersecurity Layer
### Tool: CLAUDE ACCOUNT 1 (most important — security must be right)

```
Build the complete security layer for Foot Heroes.
This platform handles player identity data — security is critical.

FILE 1: src/middleware.ts
Complete security middleware:

AUTHENTICATION:
  Protected routes: /dashboard/*, /player/*/edit, /tournament/*/manage,
                    /discover/scout/*, /match/*/score, /api/* (most)
  Public routes: /, /player/*, /tournament/*, /teams, /venues,
                 /api/public/*, /api/webhooks/*
  Redirect: unauthenticated → /auth/login with returnTo

SECURITY HEADERS (on every response):
  Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  X-XSS-Protection: 1; mode=block
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=(self)
  Content-Security-Policy:
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline';
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    font-src 'self' https://fonts.gstatic.com;
    img-src 'self' data: https://*.supabase.co https://res.cloudinary.com;
    connect-src 'self' https://*.supabase.co wss://*.supabase.co;
    media-src 'self' https://res.cloudinary.com;
    frame-src 'none';

RATE LIMITING (via Upstash Redis):
  /api/match/events: 30 per minute per user
  /api/discover/search: 20 per minute per user  
  /api/ai/*: 5 per minute per user
  /auth/*: 5 per 15 minutes per IP
  All other /api/*: 60 per minute per user
  Return 429 with Retry-After header

FILE 2: src/lib/security/inputSanitizer.ts

sanitizeText(input: string): string
  Remove: HTML tags, null bytes, control characters
  Normalize: Unicode, trim whitespace
  Max length: enforced per field type

sanitizeSearchQuery(input: string): string
  Remove SQL injection patterns
  Remove Supabase query operators from user input
  Allow only: letters, numbers, spaces, hyphens, dots

validateFileUpload(file: File, type: 'image' | 'video'): ValidationResult
  Image: MIME type must be image/jpeg, image/png, image/webp
  Video: MIME type must be video/mp4, video/quicktime
  Magic bytes check (not just Content-Type header):
    JPEG: starts with FF D8 FF
    PNG: starts with 89 50 4E 47
    MP4: contains ftyp box at offset 4
  Size limits:
    Profile photo: 5MB max
    Cover photo: 10MB max
    Video highlight: 200MB max
  
  IMPORTANT: Never execute uploaded files
  Store with UUID filename (never original filename)
  Store in private Supabase bucket, serve via signed URLs

FILE 3: src/lib/security/rateLimiter.ts
Using @upstash/ratelimit:

Create limiters:
  matchEventLimiter: slidingWindow(30, '1 m')
  searchLimiter: slidingWindow(20, '1 m')
  aiLimiter: slidingWindow(5, '1 m')
  authLimiter: slidingWindow(5, '15 m')
  globalLimiter: slidingWindow(60, '1 m')

checkLimit(identifier: string, limiter: Ratelimit): Promise<LimitResult>
  Returns: { allowed, remaining, resetIn }
  On deny: return 429 response with Retry-After header

FILE 4: src/lib/security/auditLogger.ts

logAction(params: {
  userId?: string,
  action: string,
  resourceType?: string,
  resourceId?: string,
  ipAddress?: string,
  userAgent?: string,
  metadata?: object
}): Promise<void>
  
  Insert to audit_log table
  Never log: passwords, tokens, OTPs, full credit card numbers
  Log actions: login, logout, profile_update, match_event_add,
               match_event_delete, tournament_create, scout_contact,
               report_generate, file_upload, account_delete
  
  Sensitive field masking:
    Phone: show only last 4 digits in logs
    Email: hash before logging

FILE 5: src/lib/security/csrfProtection.ts
CSRF for all state-changing API routes:
  Generate token on session creation
  Validate X-CSRF-Token header on POST/PUT/DELETE
  Rotate token after use
  Next.js API routes: use origin header validation (built-in)

FILE 6: Supabase RLS policy audit
Ensure these policies exist and are tested:

-- Players: own data writable, public profiles readable
-- No user can read another user's private profile
-- Match events: only assigned scorer can insert
-- Scout contacts: only visible to sender and recipient
-- Audit log: INSERT only, never UPDATE or DELETE

Test script: create 2 test users, verify they cannot access each other's private data

FILE 7: src/app/api/auth/verify-organizer/route.ts
Organizer verification system:
  Organizers can enter match events (critical)
  Verification process:
    Submit: name, organization, contact, tournament details
    Admin reviews (manually for now)
    On approval: is_verified = true, role allows scoring
  This prevents anyone from submitting fake match events
  Prevent match data manipulation: scorers assigned PER match,
  cannot score matches they were not assigned to

FILE 8: Video upload security
src/lib/security/videoProcessor.ts
  After upload:
    Scan for malware using ClamAV (or skip in MVP, add note)
    Strip metadata (GPS, device info from EXIF)
    Re-encode via FFmpeg to standard format (removes malicious content embedded in video)
    Store re-encoded version, delete original
  
  Access control:
    Videos stored in private bucket
    Generate signed URLs (expire in 1 hour)
    Log every video access in audit_log

FILE 9: Privacy controls
src/app/settings/privacy/page.tsx
  Player privacy settings:
    Profile visibility: Public / Scouts Only / Private
    Show in search: Yes / No
    Allow scout contact: Yes / No / Verified Scouts Only
    Show phone: No one / Scouts Only / Everyone
    Show age: Yes / No
  
  Data export: "Download my data" (GDPR/PDPB compliance)
  Account deletion: 
    "Delete my account" → 30-day cooling period
    Confirmation email required
    After 30 days: anonymize data, don't delete match events
    (Match events are part of shared records — other players' stats)
```

---

## PROMPT 7 — AI Reports + Analytics
### Tool: CLAUDE ACCOUNT 4

```
Build the AI content generation and analytics systems.

FILE 1: src/lib/ai/matchReport.ts
Auto-generate match reports:

generateMatchReport(matchId: string): Promise<string>

SYSTEM PROMPT:
"You are a sports journalist covering grassroots football in India.
Write a concise, engaging match report (200-250 words).
Use: key events, goalscorers, turning points, player highlights.
Tone: enthusiastic but professional.
Include: scoreline, venue, goalscorers with minutes,
any notable cards, MOTM mention.
End with a one-line tournament context sentence.
Do NOT hallucinate player names or events not in the data."

USER PROMPT:
"Match data: [JSON with all match events, player names, stats]
Write the match report:"

This generates automatically after match ends.
Stored in ai_content table.
Published on match page and shared via WhatsApp to teams.

FILE 2: src/lib/ai/playerSeasonReview.ts
generateSeasonReview(playerId: string, season: string): Promise<string>

Creates: 200-word season review for every player at season end
Sent to player via notification
Player can share as a card/graphic on social media

FILE 3: src/lib/ai/tournamentSummary.ts
generateTournamentSummary(tournamentId: string): Promise<string>

After tournament ends: auto-generate 300-word summary
Include: winners, golden boot, standout moments, stats
Published on tournament page
WhatsApp broadcast to all registered teams

FILE 4: src/app/analytics/[type]/[id]/page.tsx
Analytics pages for players, teams, and tournaments:

PLAYER ANALYTICS (/analytics/player/[slug]):
  Goals per match (bar chart by month)
  Rating trend (line chart across matches)
  Position heatmap (simple hexagonal grid)
  Goals by opponent (which teams they score against)
  Tournament performance comparison (bar chart)
  Form last 10 matches (colored result dots with stats)

TEAM ANALYTICS (/analytics/team/[slug]):
  Win/Draw/Loss ratio (donut chart)
  Goals scored vs conceded (area chart)
  Top scorers in team (horizontal bar)
  Performance by tournament
  Squad depth (position coverage)

TOURNAMENT ANALYTICS (/analytics/tournament/[slug]):
  Most goals in tournament (leaderboard)
  Most cards (leaderboard)
  Match results timeline (all matches, scores)
  Team form comparison (spider chart)
  Top performers across all positions

FILE 5: src/app/api/ai/generate/route.ts
API endpoint for AI generation:
  POST: { type, id } where type is match_report/season_review/tournament_summary
  Auth: admin or organizer only (not public trigger)
  Rate limit: 10 per hour per user (AI is expensive)
  Check: content not already generated (cache)
  Queue: via Upstash QStash (async generation)
  Return: { queued: true, estimatedTime: '30 seconds' }
  
After generation:
  Store in ai_content table
  Send notification to relevant users ("Your match report is ready")
  
FILE 6: Share Cards (Social Media Optimization)
src/app/api/og/player/[slug]/route.tsx

Dynamic OG image for player profiles:
  Player photo (circular) on dark football background
  Name (large, Bebas Neue)
  Position badge
  Key stats: Goals | Assists | Rating
  Foot Heroes branding
  
  Uses @vercel/og for generation
  Cached per player (regenerates when stats update)
  
  Result: when someone shares a player profile link,
  WhatsApp/Twitter previews show a professional stats card
  This is organic marketing every time a player shares their profile
```

---

## PROMPT 8 — Venue System + India Map
### Tool: CLAUDE ACCOUNT 4

```
Build the venue database and India football map.

FILE 1: src/app/venues/page.tsx
India's football venues map:

HERO: "India's Football Ground Database"
Subheading: "Find venues, check facilities, see tournament history"

MAP VIEW (Leaflet.js):
  India map centered, dark theme
  Green pins for verified venues
  Gray pins for unverified
  Cluster on zoom out
  Tap pin: venue popup (name, type, city, [View →])
  
LIST VIEW toggle:
  Card grid: venue photo | name | type | city | facilities badges
  
FILTER SIDEBAR:
  State, City
  Type: Natural Grass | Artificial Turf | Futsal | Indoor
  Facilities: Floodlights | Changing Rooms | Parking
  
FILE 2: src/app/venues/[slug]/page.tsx
Individual venue page:

Header: venue name, type badge, city, state
Photos: horizontal scroll gallery
Facilities badges: floodlights, parking, changing rooms, etc.
Location: embedded map with venue pin

STATS:
  Tournaments hosted: X
  Total matches played: X
  Teams using this venue: X

HISTORY:
  Recent tournaments at this venue (last 5)
  Teams that call this home venue

CONTACT: owner contact (if listed)
"Add to Favorites" for organizers
"Register tournament here" CTA

FILE 3: src/app/venues/add/page.tsx
Add venue form:
  Name, type, address, city, state
  Map pin: tap to set exact location (Leaflet click handler)
  Latitude/longitude auto-filled from map click
  Facilities checkboxes
  Photos (up to 10)
  Contact details
  
  Submitted venues: marked is_verified=false
  Admin reviews and verifies
  Verified venues get a checkmark badge
```

---

# PART 4: LAUNCH STRATEGY

## The Chennai-First Approach

```
DO NOT LAUNCH NATIONWIDE ON DAY 1.

START IN ONE ECOSYSTEM:
  SRM + Anna University + Chennai football leagues

WHY CHENNAI:
  You are from SRM — you have distribution
  Chennai has multiple active football leagues
  Tamil Nadu has strong football culture
  You can visit tournaments in person to onboard organizers

PHASE 1 LAUNCH (Month 1-2):
  Target: 5 tournament organizers in Chennai
  Get them to use Foot Heroes for one tournament
  Each tournament: 8-12 teams × 15 players = 120-180 player profiles
  3 tournaments = 500 players on platform

  How to get organizers:
  Visit tournaments in person (most are on weekends)
  Show them the live scoring on your phone
  Offer: "Use it free, we'll set it up for you, your tournament
          gets a professional page with live scores and standings"
  Nobody says no to free + looks professional

PHASE 2 (Month 3-4):
  Kerala: approach Santosh Trophy circuits, local leagues
  West Bengal: Kolkata football clubs (oldest football culture)
  Goa: I-League feeder clubs, local tournaments

PHASE 3 (Month 5+):
  All major states
  Approach Football Association of India connections
  Academic institutions: colleges with football programs

THE GROWTH LOOP:
  Organizer creates tournament → teams register
  Teams register → players create profiles
  Players create profiles → share on Instagram
  Instagram shares → more players join
  More players → scouts join
  Scouts join → organizers see value
  Organizers create more tournaments
  Loop repeats
```

## Monetization Plan

```
PHASE 1 (0 to 10K players): FREE
  Build the network. Don't monetize early.
  Revenue comes from network effect, not early paywall.

PHASE 2 (10K+ players):

  SCOUT PREMIUM: ₹999/month
    Full player stats (basic free)
    Contact players directly
    Watchlists
    AI scouting reports (PDF download)
    Advanced search filters
    
  TOURNAMENT PRO: ₹499/tournament
    All basic features free
    Pro: custom domain (srmcup.footheroes.in)
    Pro: premium standings widget (embed on their website)
    Pro: AI match reports and tournament summary
    Pro: WhatsApp broadcast to all registered teams
    Pro: Certificate generation for winners
    
  VENUE FEATURED LISTING: ₹299/month
    Venue appears first in search results
    "Premium Venue" badge
    Direct booking inquiry form
    Analytics on profile views

  ACADEMY SUBSCRIPTION: ₹2,999/month
    Multiple team management (all their age groups)
    All player profiles linked to academy
    Recruitment pipeline tools
    Academy stats dashboard
    Verified Academy badge

REVENUE PROJECTION:
  100 scout accounts × ₹999 = ₹99,900/month
  50 tournaments/month × ₹499 = ₹24,950/month
  Month 6 total: ~₹1,25,000/month
  At 50,000 players: multiply by 5-10x
```

---

# PART 5: BUILD SCHEDULE

```
╔══════════════════════════════════════════════════════════════╗
║           FOOT HEROES BUILD SCHEDULE (5 Weeks)               ║
╠══════════════════════════════════════════════════════════════╣
║ Day 1-2  │ Codex: package.json, DB schema, Supabase setup    ║
║          │ Claude Acc 1: Prompt 1 (Loading anim + Homepage)  ║
╠══════════════════════════════════════════════════════════════╣
║ Day 3-5  │ Claude Acc 2: Prompt 2 (Player Profile)           ║
║          │ This is the core product. Do it best.             ║
╠══════════════════════════════════════════════════════════════╣
║ Day 6-8  │ Claude Acc 3: Prompt 3 (Live Match Scoring)       ║
╠══════════════════════════════════════════════════════════════╣
║ Day 9-11 │ Claude Acc 2: Prompt 4 (Tournament OS)            ║
╠══════════════════════════════════════════════════════════════╣
║ Day 12-13│ Claude Acc 3: Prompt 5 (Discovery + Scout)        ║
╠══════════════════════════════════════════════════════════════╣
║ Day 14-15│ Claude Acc 1: Prompt 6 (Security — CRITICAL)      ║
╠══════════════════════════════════════════════════════════════╣
║ Day 16-17│ Claude Acc 4: Prompt 7 (AI Reports + Analytics)   ║
╠══════════════════════════════════════════════════════════════╣
║ Day 18-19│ Claude Acc 4: Prompt 8 (Venues + Map)             ║
╠══════════════════════════════════════════════════════════════╣
║ Day 20-22│ Integration testing + PWA setup                   ║
╠══════════════════════════════════════════════════════════════╣
║ Day 23-25│ SEO audit + performance optimization              ║
╠══════════════════════════════════════════════════════════════╣
║ Day 26-28│ Chennai beta launch: first tournament onboarded   ║
╚══════════════════════════════════════════════════════════════╝

PRE-LAUNCH CHECKLIST:
[ ] Loading animation: kicking boy plays on cold load, skips on return visit
[ ] Player profile: looks stunning on mobile (test on Android Chrome)
[ ] Live scoring: match event adds in under 1 second
[ ] Realtime: two browser tabs, score updates instantly on goal
[ ] Match events: offline storage and sync tested (airplane mode)
[ ] Tournament: fixture generation correct for 8-team knockout
[ ] Discovery: search filters all work, returns correct players
[ ] Security headers: verified via securityheaders.com (A rating)
[ ] RLS: player A cannot see player B's private data (test manually)
[ ] File upload: MIME type validation tested (rename .exe to .jpg → rejected)
[ ] Rate limiting: 31st match event in 1 minute returns 429
[ ] OG images: player profile shared on WhatsApp shows stats card preview
[ ] SEO: player profiles have correct meta tags
[ ] PWA: add to home screen works on Android Chrome
[ ] Performance: homepage Lighthouse score > 85
[ ] Mobile: all core flows tested on real Android phone (not just DevTools)
[ ] Offline: scoring page cached, works without internet at venues
```

---

## The Honest Truth

```
The hardest problem in building Foot Heroes is not the code.
It is distribution.

CricHeroes succeeded because cricket scorers existed.
Every club match had someone noting each ball.
CricHeroes digitized that behavior.

Football matches in India currently have:
- A referee (busy refereeing)
- Team managers (busy coaching)
- Nobody officially recording events

You need to CREATE the scorer behavior.

THE SOLUTION:
  Make scoring so easy that a team manager can score
  their own match on their phone while watching.
  
  The scoring UX must be THIS fast:
  Goal scored → tap GOAL → tap player → tap assist player → Done.
  Under 5 seconds per event.
  
  If it takes 15 seconds per event, nobody will do it.
  
  THIS IS THE MOST IMPORTANT DESIGN DECISION IN THE PRODUCT.
  
Test the scoring flow with a non-technical person watching a
football match on YouTube. If they can score it accurately in
real time, you've built the right product.
If they fall behind — you haven't.

Build the scoring UI first.
Test it before building anything else.
Everything else is secondary.
```

*Foot Heroes: Every goal documented. Every player found.*
*India's football data infrastructure starts here.*
