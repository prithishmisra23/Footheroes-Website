import Link from "next/link";
import { Player } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { MapPin, ShieldCheck } from "lucide-react";

interface PlayerCardProps {
  player: Player;
  teamName?: string;
  isScoutView?: boolean;
}

export function PlayerCard({ player, teamName, isScoutView }: PlayerCardProps) {
  const positionColors = {
    "Goalkeeper": "gk",
    "Centre Back": "def",
    "Right Back": "def",
    "Left Back": "def",
    "Defensive Midfielder": "mid",
    "Central Midfielder": "mid",
    "Attacking Midfielder": "mid",
    "Right Winger": "fwd",
    "Left Winger": "fwd",
    "Striker": "fwd",
    "Centre Forward": "fwd",
  } as const;

  const posColor = positionColors[player.position] || "default";
  const initials = player.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);

  return (
    <Link href={`/player/${player.slug}`} className="block group">
      <div className="h-full rounded-[1.75rem] border border-white/10 bg-surface/75 p-4 shadow-card transition-all duration-200 hover:-translate-y-1 hover:border-primary/30">
        <div className="mb-4 flex items-start gap-4">
          <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-[1.35rem] border border-white/10 bg-white/8">
            {player.avatarUrl ? (
              <img src={player.avatarUrl} alt={player.name} className="h-full w-full object-cover" />
            ) : (
              <span className="font-bebas text-2xl tracking-[0.08em] text-white">{initials}</span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="mb-1 flex items-center gap-1.5">
              <h3 className="truncate text-base font-semibold text-white">{player.name}</h3>
              {player.isVerified && <ShieldCheck size={14} className="shrink-0 text-secondary" />}
            </div>
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <Badge variant={posColor} className="border-white/10 bg-white/8 text-[10px] uppercase tracking-[0.18em]">
                {player.position}
              </Badge>
              <span className="text-xs text-text-muted">{player.age} yrs</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-text-muted">
              <MapPin size={11} className="shrink-0" />
              <span className="truncate">{player.city}, {player.state}</span>
            </div>
          </div>
        </div>

        {teamName && <div className="mb-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">{teamName}</div>}

        {isScoutView && (
          <div className="mb-4 rounded-2xl border border-primary/15 bg-primary/10 px-3 py-2 text-[11px] uppercase tracking-[0.22em] text-primary">
            Scout-ready profile
          </div>
        )}

        <div className="mt-auto grid grid-cols-4 gap-2">
          <div className="rounded-2xl border border-white/8 bg-background/55 px-2 py-3 text-center">
            <div className="text-[10px] uppercase tracking-[0.2em] text-text-muted">M</div>
            <div className="mt-1 font-mono text-sm font-bold text-white">{player.stats.careerMatches}</div>
          </div>
          <div className="rounded-2xl border border-white/8 bg-background/55 px-2 py-3 text-center">
            <div className="text-[10px] uppercase tracking-[0.2em] text-text-muted">G</div>
            <div className="mt-1 font-mono text-sm font-bold text-primary">{player.stats.careerGoals}</div>
          </div>
          <div className="rounded-2xl border border-white/8 bg-background/55 px-2 py-3 text-center">
            <div className="text-[10px] uppercase tracking-[0.2em] text-text-muted">A</div>
            <div className="mt-1 font-mono text-sm font-bold text-secondary">{player.stats.careerAssists}</div>
          </div>
          <div className="rounded-2xl border border-white/8 bg-background/55 px-2 py-3 text-center">
            <div className="text-[10px] uppercase tracking-[0.2em] text-text-muted">RTG</div>
            <div className="mt-1 font-mono text-sm font-bold text-accent">{player.stats.currentSeasonRating.toFixed(1)}</div>
          </div>
        </div>
      </div>
    </Link>
  );
}
