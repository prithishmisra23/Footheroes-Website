export type Position = 
  | "Goalkeeper" 
  | "Centre Back" 
  | "Right Back" 
  | "Left Back" 
  | "Defensive Midfielder" 
  | "Central Midfielder" 
  | "Attacking Midfielder" 
  | "Right Winger" 
  | "Left Winger" 
  | "Striker" 
  | "Centre Forward";

export type PreferredFoot = "Right" | "Left" | "Both";
export type MatchStatus = "SCHEDULED" | "LIVE" | "HALF_TIME" | "COMPLETED" | "POSTPONED" | "CANCELLED" | "ABANDONED";
export type MatchEventType = "GOAL" | "OWN_GOAL" | "PENALTY_SCORED" | "PENALTY_MISSED" | "YELLOW_CARD" | "SECOND_YELLOW" | "RED_CARD" | "SUB_ON" | "SUB_OFF" | "ASSIST";

export interface User {
  id: string;
  name: string;
  avatarUrl?: string;
  role: "player" | "team_manager" | "tournament_organizer" | "scout" | "venue_owner" | "admin";
}

export interface Player {
  id: string;
  slug: string;
  name: string;
  avatarUrl?: string;
  coverUrl?: string;
  position: Position;
  preferredFoot: PreferredFoot;
  dateOfBirth: string; // ISO string
  age: number;
  heightCm?: number;
  weightKg?: number;
  city: string;
  state: string;
  isVerified: boolean;
  currentTeamId?: string;
  stats: PlayerStats;
  formGuide: ("W" | "D" | "L" | "G" | "A")[];
  bio?: string;
}

export interface PlayerStats {
  careerMatches: number;
  careerGoals: number;
  careerAssists: number;
  careerYellowCards: number;
  careerRedCards: number;
  careerCleanSheets: number; // for GKs/Defs
  currentSeasonRating: number;
}

export interface Team {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  logoUrl?: string;
  type: "Club" | "Academy" | "School" | "College" | "Corporate" | "District" | "State" | "Other";
  foundedYear: number;
  city: string;
  state: string;
  homeVenueId?: string;
  isVerified: boolean;
  stats: TeamStats;
  formGuide: ("W" | "D" | "L")[];
}

export interface TeamStats {
  totalMatches: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  cleanSheets: number;
}

export interface Tournament {
  id: string;
  slug: string;
  name: string;
  logoUrl?: string;
  status: "UPCOMING" | "REGISTRATION_OPEN" | "ONGOING" | "COMPLETED";
  format: "League" | "Knockout" | "Group + Knockout" | "Round Robin";
  level: "Local" | "District" | "State" | "National" | "International";
  organizerName: string;
  organizerId?: string;
  startDate: string;
  endDate: string;
  city: string;
  state: string;
  teamsCount: number;
  maxTeams: number;
  matchesPlayed: number;
  totalMatches: number;
  totalGoals: number;
  teamsParticipating?: string[];
}

export interface Match {
  id: string;
  tournamentId: string;
  homeTeamId: string;
  awayTeamId: string;
  venueId: string;
  date: string; // ISO string
  status: MatchStatus;
  currentMinute?: string;
  homeScore: number;
  awayScore: number;
  homeStats: MatchTeamStats;
  awayStats: MatchTeamStats;
  events?: MatchEvent[];
}

export interface MatchTeamStats {
  possessionPct: number;
  shots: number;
  shotsOnTarget: number;
  corners: number;
  fouls: number;
  yellowCards: number;
  redCards: number;
}

export interface MatchEvent {
  id: string;
  matchId: string;
  teamId: string;
  playerId: string;
  eventType: MatchEventType;
  type?: string; // alias used by score page UI
  minute: number;
  additionalPlayerId?: string; // e.g. for sub_out or assist
  assistPlayerId?: string;
  secondaryPlayerId?: string;
  isHomeTeam?: boolean;
}

export interface Venue {
  id: string;
  slug: string;
  name: string;
  city: string;
  state: string;
  address: string;
  lat: number;
  lng: number;
  isVerified: boolean;
  facilities: string[];
  imageUrls: string[];
  surface?: string;
  capacity?: number;
}

export interface Notification {
  id: string;
  userId: string;
  type: "INFO" | "MATCH_START" | "GOAL" | "SCOUT_VIEW" | "ACHIEVEMENT" | "MATCH_UPDATE" | "TEAM_INVITE" | "TOURNAMENT_ALERT" | "SYSTEM";
  title: string;
  message: string;
  isRead: boolean;
  read?: boolean; // alias
  createdAt: string;
  link?: string;
  actionUrl?: string;
}

export interface Achievement {
  id: string;
  playerId: string;
  type: "GOLDEN_BOOT" | "GOLDEN_GLOVE" | "MVP" | "TOURNAMENT_WINNER" | "100_GOALS";
  tournamentId?: string;
  season?: string;
  dateEarned: string;
}
