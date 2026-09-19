import Link from "next/link";
import { Tournament } from "@/types";
import { Calendar, Users } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

interface TournamentCardProps {
  tournament: Tournament;
}

export function TournamentCard({ tournament }: TournamentCardProps) {
  const statusColors = {
    "ONGOING": "success",
    "UPCOMING": "secondary",
    "REGISTRATION_OPEN": "gk",
    "COMPLETED": "default",
  } as const;

  const statusMap = {
    "ONGOING": "Ongoing",
    "UPCOMING": "Upcoming",
    "REGISTRATION_OPEN": "Registering",
    "COMPLETED": "Completed"
  };

  return (
    <Link href={`/tournament/${tournament.slug}`} className="block group">
      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-4 hover:border-gray-200 dark:hover:border-gray-700 hover:shadow-sm transition-all h-full flex flex-col">
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex items-center justify-center shrink-0">
            {tournament.logoUrl ? (
              <img src={tournament.logoUrl} alt={tournament.name} className="w-full h-full object-contain p-1" />
            ) : (
              <span className="font-bebas text-lg text-gray-400">{tournament.name.charAt(0)}</span>
            )}
          </div>
          <Badge variant={statusColors[tournament.status] as any}>{statusMap[tournament.status]}</Badge>
        </div>

        <div className="flex-1 mb-4">
          <h3 className="font-bold text-lg text-gray-900 dark:text-gray-50 leading-tight mb-1">{tournament.name}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{tournament.level} • {tournament.city}</p>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1.5">
            <Calendar size={14} className="text-gray-400" />
            <span>{new Date(tournament.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users size={14} className="text-gray-400" />
            <span>{tournament.teamsCount} / {tournament.maxTeams} Teams</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
