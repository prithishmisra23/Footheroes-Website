// Basic stats interfaces since complex ones are inside Player/Team
export interface LeaderboardStat {
  playerId: string;
  playerName: string;
  teamName: string;
  value: number;
}

export const mockTopScorers: LeaderboardStat[] = [
  { playerId: "p_001", playerName: "Rahul Sharma", teamName: "Delhi FC", value: 12 },
  { playerId: "p_002", playerName: "Vikram Singh", teamName: "Delhi FC", value: 9 },
  { playerId: "p_003", playerName: "Aditya Patil", teamName: "Mumbai Strikers", value: 8 }
];

export const mockTopAssists: LeaderboardStat[] = [
  { playerId: "p_002", playerName: "Vikram Singh", teamName: "Delhi FC", value: 11 },
  { playerId: "p_004", playerName: "Samson D'Souza", teamName: "Kerala United", value: 7 },
  { playerId: "p_001", playerName: "Rahul Sharma", teamName: "Delhi FC", value: 5 }
];
