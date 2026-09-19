import { Team } from "@/types";
export type { Team };

export const mockTeams: Team[] = [
  {
    id: "t_001",
    slug: "delhi-fc",
    name: "Delhi FC",
    shortName: "DFC",
    type: "Club",
    foundedYear: 2018,
    city: "New Delhi",
    state: "Delhi",
    isVerified: true,
    stats: {
      totalMatches: 84,
      wins: 52,
      draws: 18,
      losses: 14,
      goalsFor: 156,
      goalsAgainst: 62,
      cleanSheets: 28
    },
    formGuide: ["W", "W", "D", "W", "L"]
  },
  {
    id: "t_002",
    slug: "mumbai-strikers",
    name: "Mumbai Strikers",
    shortName: "MST",
    type: "Academy",
    foundedYear: 2015,
    city: "Mumbai",
    state: "Maharashtra",
    isVerified: true,
    stats: {
      totalMatches: 112,
      wins: 64,
      draws: 22,
      losses: 26,
      goalsFor: 198,
      goalsAgainst: 95,
      cleanSheets: 34
    },
    formGuide: ["W", "L", "W", "D", "W"]
  },
  {
    id: "t_003",
    slug: "kerala-united",
    name: "Kerala United",
    shortName: "KBU",
    type: "State",
    foundedYear: 2020,
    city: "Kochi",
    state: "Kerala",
    isVerified: true,
    stats: {
      totalMatches: 45,
      wins: 30,
      draws: 10,
      losses: 5,
      goalsFor: 92,
      goalsAgainst: 30,
      cleanSheets: 18
    },
    formGuide: ["W", "W", "W", "D", "W"]
  }
];
