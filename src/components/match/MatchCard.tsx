import Link from "next/link";
import { Match, Team, Tournament } from "@/types";
import { Clock } from "lucide-react";

interface MatchCardProps {
  match: Match;
  homeTeam: Team;
  awayTeam: Team;
  tournament: Tournament;
}

export function MatchCard({ match, homeTeam, awayTeam, tournament }: MatchCardProps) {
  const isLive = match.status === "LIVE" || match.status === "HALF_TIME";
  const isUpcoming = match.status === "SCHEDULED";
  
  return (
    <Link href={`/match/${match.id}`} className="block group">
      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-4 hover:border-gray-200 dark:hover:border-gray-700 hover:shadow-sm transition-all">
        <div className="flex items-center justify-between mb-3 border-b border-gray-50 dark:border-gray-800 pb-2">
          <span className="text-[0.65rem] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider truncate mr-2">
            {tournament.name}
          </span>
          {isLive ? (
            <span className="text-[0.6rem] font-bold bg-red-500 text-white px-2 py-0.5 rounded-sm flex items-center gap-1.5 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              {match.currentMinute || "LIVE"}
            </span>
          ) : isUpcoming ? (
            <span className="text-[0.65rem] font-mono text-gray-500 dark:text-gray-400 flex items-center gap-1 shrink-0">
              <Clock size={10} />
              {new Date(match.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </span>
          ) : (
            <span className="text-[0.65rem] font-bold text-gray-400 uppercase tracking-wider shrink-0">FT</span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex-1 text-right flex items-center justify-end gap-3">
            <span className={`font-semibold text-sm ${match.homeScore > match.awayScore ? "text-gray-900 dark:text-gray-50" : "text-gray-600 dark:text-gray-400"} truncate`}>
              {homeTeam.shortName}
            </span>
            <div className="w-6 h-6 rounded bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-xs font-bold shrink-0">
              {homeTeam.shortName.charAt(0)}
            </div>
          </div>

          <div className="px-4 shrink-0 flex items-center gap-2">
            {!isUpcoming ? (
              <>
                <span className={`font-mono text-xl font-bold tabular-nums ${match.homeScore > match.awayScore ? "text-gray-900 dark:text-gray-50" : "text-gray-500 dark:text-gray-400"}`}>{match.homeScore}</span>
                <span className="text-gray-300 dark:text-gray-600">-</span>
                <span className={`font-mono text-xl font-bold tabular-nums ${match.awayScore > match.homeScore ? "text-gray-900 dark:text-gray-50" : "text-gray-500 dark:text-gray-400"}`}>{match.awayScore}</span>
              </>
            ) : (
              <span className="font-bold text-xs text-gray-300 dark:text-gray-600">VS</span>
            )}
          </div>

          <div className="flex-1 text-left flex items-center justify-start gap-3">
            <div className="w-6 h-6 rounded bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-xs font-bold shrink-0">
              {awayTeam.shortName.charAt(0)}
            </div>
            <span className={`font-semibold text-sm ${match.awayScore > match.homeScore ? "text-gray-900 dark:text-gray-50" : "text-gray-600 dark:text-gray-400"} truncate`}>
              {awayTeam.shortName}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
