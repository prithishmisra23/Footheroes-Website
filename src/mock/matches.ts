import { Match, MatchEvent } from "@/types";
export type { Match, MatchEvent };

export const mockMatches: Match[] = [
  {
    id: "m_001",
    tournamentId: "tr_001",
    homeTeamId: "t_001",
    awayTeamId: "t_002",
    venueId: "v_001",
    date: new Date().toISOString(),
    status: "LIVE",
    currentMinute: "67'",
    homeScore: 2,
    awayScore: 1,
    homeStats: {
      possessionPct: 58,
      shots: 12,
      shotsOnTarget: 5,
      corners: 6,
      fouls: 8,
      yellowCards: 1,
      redCards: 0
    },
    awayStats: {
      possessionPct: 42,
      shots: 8,
      shotsOnTarget: 3,
      corners: 2,
      fouls: 11,
      yellowCards: 2,
      redCards: 0
    }
  },
  {
    id: "m_002",
    tournamentId: "tr_001",
    homeTeamId: "t_003",
    awayTeamId: "t_001",
    venueId: "v_002",
    date: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
    status: "SCHEDULED",
    homeScore: 0,
    awayScore: 0,
    homeStats: { possessionPct: 0, shots: 0, shotsOnTarget: 0, corners: 0, fouls: 0, yellowCards: 0, redCards: 0 },
    awayStats: { possessionPct: 0, shots: 0, shotsOnTarget: 0, corners: 0, fouls: 0, yellowCards: 0, redCards: 0 }
  },
  {
    id: "m_003",
    tournamentId: "tr_003",
    homeTeamId: "t_002",
    awayTeamId: "t_003",
    venueId: "v_003",
    date: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 days ago
    status: "COMPLETED",
    homeScore: 3,
    awayScore: 3,
    homeStats: {
      possessionPct: 50,
      shots: 15,
      shotsOnTarget: 8,
      corners: 4,
      fouls: 12,
      yellowCards: 3,
      redCards: 0
    },
    awayStats: {
      possessionPct: 50,
      shots: 14,
      shotsOnTarget: 7,
      corners: 5,
      fouls: 10,
      yellowCards: 2,
      redCards: 1
    }
  }
];
