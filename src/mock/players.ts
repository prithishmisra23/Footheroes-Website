import { Player } from "@/types";
export type { Player };

export const mockPlayers: Player[] = [
  {
    id: "p_001",
    slug: "rahul-sharma",
    name: "Rahul Sharma",
    avatarUrl: "",
    position: "Striker",
    preferredFoot: "Right",
    dateOfBirth: "2005-08-15T00:00:00Z",
    age: 18,
    heightCm: 182,
    weightKg: 74,
    city: "Lucknow",
    state: "Uttar Pradesh",
    isVerified: true,
    currentTeamId: "t_001",
    bio: "Explosive forward known for clinical finishing and pace. Golden boot winner in DPL U21.",
    stats: {
      careerMatches: 45,
      careerGoals: 32,
      careerAssists: 12,
      careerYellowCards: 4,
      careerRedCards: 0,
      careerCleanSheets: 0,
      currentSeasonRating: 8.4
    },
    formGuide: ["W", "G", "G", "W", "A"]
  },
  {
    id: "p_002",
    slug: "vikram-singh",
    name: "Vikram Singh",
    avatarUrl: "",
    position: "Left Winger",
    preferredFoot: "Left",
    dateOfBirth: "2004-11-22T00:00:00Z",
    age: 19,
    heightCm: 175,
    weightKg: 68,
    city: "Varanasi",
    state: "Uttar Pradesh",
    isVerified: true,
    currentTeamId: "t_001",
    stats: {
      careerMatches: 42,
      careerGoals: 18,
      careerAssists: 24,
      careerYellowCards: 8,
      careerRedCards: 1,
      careerCleanSheets: 0,
      currentSeasonRating: 8.1
    },
    formGuide: ["A", "W", "L", "A", "G"]
  },
  {
    id: "p_003",
    slug: "aditya-patil",
    name: "Aditya Patil",
    avatarUrl: "",
    position: "Centre Forward",
    preferredFoot: "Both",
    dateOfBirth: "2006-03-10T00:00:00Z",
    age: 17,
    heightCm: 188,
    weightKg: 80,
    city: "Pune",
    state: "Maharashtra",
    isVerified: false,
    currentTeamId: "t_002",
    stats: {
      careerMatches: 30,
      careerGoals: 21,
      careerAssists: 5,
      careerYellowCards: 2,
      careerRedCards: 0,
      careerCleanSheets: 0,
      currentSeasonRating: 7.9
    },
    formGuide: ["W", "W", "G", "G", "G"]
  }
];
