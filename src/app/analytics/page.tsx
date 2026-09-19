import Link from "next/link";
import { ArrowRight, BarChart3, Goal, Shield, Sparkles, Trophy } from "lucide-react";

import { mockPlayers } from "@/mock/players";
import { mockTeams } from "@/mock/teams";
import { mockTopScorers } from "@/mock/stats";
import { mockTournaments } from "@/mock/tournaments";

const playerLeader = mockPlayers[0];
const teamLeader = mockTeams[0];
const tournamentLeader = mockTournaments[0];

export default function AnalyticsDashboard() {
  return (
    <div className="min-h-screen bg-background pb-24 text-white">
      <section className="border-b border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(34,197,94,0.16),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(59,130,246,0.15),_transparent_25%)]">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
              <BarChart3 size={14} />
              Analytics
            </div>
            <h1 className="text-4xl font-semibold leading-tight text-balance text-white sm:text-5xl">
              Turn raw grassroots match data into scouting-ready insight.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-text-muted sm:text-lg">
              Player form, team consistency, and tournament momentum all live here. These dashboards are where Foot
              Heroes starts to feel bigger than scorekeeping.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-3">
          <Link
            href={`/analytics/player/${playerLeader.slug}`}
            className="section-shell block overflow-hidden p-6 transition-transform hover:-translate-y-1"
          >
            <div className="mb-5 inline-flex rounded-full border border-primary/30 bg-primary/10 p-3 text-primary">
              <Sparkles size={20} />
            </div>
            <p className="text-xs uppercase tracking-[0.2em] text-text-muted">Player analytics</p>
            <h2 className="mt-3 text-2xl font-semibold text-white">{playerLeader.name}</h2>
            <p className="mt-3 text-sm leading-6 text-text-muted">
              Form trend, scoring bursts, tournament output, and an opponent-by-opponent breakdown.
            </p>
            <div className="mt-6 flex items-center justify-between text-sm font-semibold text-primary">
              Open dashboard
              <ArrowRight size={16} />
            </div>
          </Link>

          <Link
            href={`/analytics/team/${teamLeader.slug}`}
            className="section-shell block overflow-hidden p-6 transition-transform hover:-translate-y-1"
          >
            <div className="mb-5 inline-flex rounded-full border border-secondary/30 bg-secondary/10 p-3 text-secondary">
              <Shield size={20} />
            </div>
            <p className="text-xs uppercase tracking-[0.2em] text-text-muted">Team analytics</p>
            <h2 className="mt-3 text-2xl font-semibold text-white">{teamLeader.name}</h2>
            <p className="mt-3 text-sm leading-6 text-text-muted">
              Win profile, goals for versus goals against, squad depth, and top contributors across tournaments.
            </p>
            <div className="mt-6 flex items-center justify-between text-sm font-semibold text-secondary">
              Open dashboard
              <ArrowRight size={16} />
            </div>
          </Link>

          <Link
            href={`/analytics/tournament/${tournamentLeader.slug}`}
            className="section-shell block overflow-hidden p-6 transition-transform hover:-translate-y-1"
          >
            <div className="mb-5 inline-flex rounded-full border border-accent/30 bg-amber-500/10 p-3 text-amber-300">
              <Trophy size={20} />
            </div>
            <p className="text-xs uppercase tracking-[0.2em] text-text-muted">Tournament analytics</p>
            <h2 className="mt-3 text-2xl font-semibold text-white">{tournamentLeader.name}</h2>
            <p className="mt-3 text-sm leading-6 text-text-muted">
              Match timelines, top performers, card pressure, and comparative team strength across the competition.
            </p>
            <div className="mt-6 flex items-center justify-between text-sm font-semibold text-amber-300">
              Open dashboard
              <ArrowRight size={16} />
            </div>
          </Link>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
          <div className="section-shell p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-text-muted">Scoring leaders snapshot</p>
            <h2 className="mt-3 text-2xl font-semibold text-white">Who is driving attention right now</h2>

            <div className="mt-6 space-y-3">
              {mockTopScorers.slice(0, 3).map((entry, index) => {
                const player = mockPlayers.find((item) => item.id === entry.playerId);
                if (!player) {
                  return null;
                }

                return (
                  <Link
                    key={entry.playerId}
                    href={`/analytics/player/${player.slug}`}
                    className="flex items-center justify-between rounded-[1.5rem] border border-white/10 bg-white/5 p-4 transition-colors hover:border-primary/30"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-lg font-semibold text-primary">
                        {index + 1}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{player.name}</p>
                        <p className="mt-1 text-sm text-text-muted">
                          {player.position} • {player.city}, {player.state}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-semibold text-white">{entry.value}</p>
                      <p className="text-xs uppercase tracking-[0.18em] text-text-muted">Goals</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="section-shell p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-text-muted">Why this matters</p>
            <h2 className="mt-3 text-2xl font-semibold text-white">The graph, not just the score</h2>
            <div className="mt-6 space-y-4 text-sm leading-6 text-text-muted">
              <p>Player dashboards make form visible to scouts instead of leaving talent buried inside WhatsApp groups.</p>
              <p>Team dashboards help organizers tell better stories around consistency, style, and title momentum.</p>
              <p>Tournament dashboards turn every fixture into durable football data that compounds over time.</p>
            </div>

            <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-background/60 p-4">
              <div className="flex items-center gap-2 text-primary">
                <Goal size={16} />
                <span className="text-sm font-semibold">Current build status</span>
              </div>
              <p className="mt-2 text-sm text-text-muted">
                Analytics now has dedicated player, team, and tournament routes instead of a single placeholder screen.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
