import Link from "next/link";
import { Team } from "@/types";
import { ShieldCheck, MapPin } from "lucide-react";

interface TeamCardProps {
  team: Team;
}

export function TeamCard({ team }: TeamCardProps) {
  const goalDifference = team.stats.goalsFor - team.stats.goalsAgainst;

  return (
    <Link href={`/team/${team.slug}`} className="block group">
      <div className="flex h-full flex-col rounded-[1.75rem] border border-white/10 bg-surface/75 p-4 shadow-card transition-all duration-200 hover:-translate-y-1 hover:border-primary/30">
        <div className="mb-4 flex items-start gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-[1.35rem] border border-white/10 bg-white/8">
            {team.logoUrl ? (
              <img src={team.logoUrl} alt={team.name} className="h-full w-full object-cover" />
            ) : (
              <span className="font-bebas text-2xl tracking-[0.08em] text-white">{team.shortName}</span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="mb-1 flex items-center gap-1.5">
              <h3 className="truncate text-base font-semibold text-white">{team.name}</h3>
              {team.isVerified && <ShieldCheck size={14} className="shrink-0 text-secondary" />}
            </div>
            <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">{team.type}</div>
            <div className="flex items-center gap-1 text-xs text-text-muted">
              <MapPin size={11} className="shrink-0" />
              <span className="truncate">{team.city}, {team.state}</span>
            </div>
          </div>
        </div>

        <div className="mt-auto grid grid-cols-4 gap-2">
          <div className="rounded-2xl border border-white/8 bg-background/55 px-2 py-3 text-center">
            <div className="text-[10px] uppercase tracking-[0.2em] text-text-muted">P</div>
            <div className="mt-1 font-mono text-sm font-bold text-white">{team.stats.totalMatches}</div>
          </div>
          <div className="rounded-2xl border border-white/8 bg-background/55 px-2 py-3 text-center">
            <div className="text-[10px] uppercase tracking-[0.2em] text-text-muted">W</div>
            <div className="mt-1 font-mono text-sm font-bold text-primary">{team.stats.wins}</div>
          </div>
          <div className="rounded-2xl border border-white/8 bg-background/55 px-2 py-3 text-center">
            <div className="text-[10px] uppercase tracking-[0.2em] text-text-muted">D</div>
            <div className="mt-1 font-mono text-sm font-bold text-text-muted">{team.stats.draws}</div>
          </div>
          <div className="rounded-2xl border border-white/8 bg-background/55 px-2 py-3 text-center">
            <div className="text-[10px] uppercase tracking-[0.2em] text-text-muted">GD</div>
            <div className={`mt-1 font-mono text-sm font-bold ${goalDifference >= 0 ? "text-accent" : "text-danger"}`}>{goalDifference}</div>
          </div>
        </div>
      </div>
    </Link>
  );
}
