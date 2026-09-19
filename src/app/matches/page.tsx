import { AppHeader } from "@/components/AppHeader";
import { MatchCard } from "@/components/match/MatchCard";
import { mockMatches } from "@/mock/matches";
import { mockTeams } from "@/mock/teams";
import { mockTournaments } from "@/mock/tournaments";

export default function MatchesPage() {
  const sections = [
    { title: "Live now", description: "Scores update as the match happens.", matches: mockMatches.filter((match) => match.status === "LIVE" || match.status === "HALF_TIME") },
    { title: "Upcoming", description: "Fixtures scheduled next.", matches: mockMatches.filter((match) => match.status === "SCHEDULED") },
    { title: "Recent results", description: "Completed matches and final scores.", matches: mockMatches.filter((match) => match.status === "COMPLETED") },
  ];
  return <div className="min-h-screen bg-gray-50 pb-24 dark:bg-gray-950"><AppHeader /><main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
    <p className="text-xs font-semibold uppercase tracking-wider text-orange-700 dark:text-orange-400">Match centre</p><h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Matches</h1><p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Live scores, upcoming fixtures, and recent results.</p>
    <div className="mt-8 space-y-8">{sections.map((section) => <section key={section.title}><div className="mb-3"><h2 className="text-lg font-bold text-gray-900 dark:text-white">{section.title}</h2><p className="text-sm text-gray-500 dark:text-gray-400">{section.description}</p></div><div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">{section.matches.map((match) => <MatchCard key={match.id} match={match} homeTeam={mockTeams.find((team) => team.id === match.homeTeamId)!} awayTeam={mockTeams.find((team) => team.id === match.awayTeamId)!} tournament={mockTournaments.find((tournament) => tournament.id === match.tournamentId)!} />)}</div></section>)}</div>
  </main></div>;
}
