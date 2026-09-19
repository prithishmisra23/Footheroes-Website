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
