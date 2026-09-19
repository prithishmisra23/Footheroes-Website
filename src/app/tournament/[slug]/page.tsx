"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, ChevronRight, MapPin, Share2, Trophy, Users } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { EmptyState } from "@/components/common/EmptyState";
import { MatchCard } from "@/components/match/MatchCard";
import { ShareModal } from "@/components/modals/ShareModal";
import { TeamCard } from "@/components/team/TeamCard";
import { Button } from "@/components/ui/Button";
import { Tabs } from "@/components/ui/Tabs";
import { mockMatches } from "@/mock/matches";
import { mockPlayers } from "@/mock/players";
import { mockTopScorers } from "@/mock/stats";
import { mockTeams } from "@/mock/teams";
import { mockTournaments } from "@/mock/tournaments";
import type { Team } from "@/types";

function StatTile({ label, value, accent = "text-white" }: { label: string; value: string; accent?: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
      <div className={`font-mono text-2xl font-bold ${accent}`}>{value}</div>
      <div className="mt-1 text-[11px] uppercase tracking-[0.24em] text-text-muted">{label}</div>
    </div>
  );
}

export default function TournamentProfile({ params }: { params: { slug: string } }) {
  const [activeTab, setActiveTab] = useState("Overview");
  const [shareOpen, setShareOpen] = useState(false);

  const tournament = mockTournaments.find((item) => item.slug === params.slug);
  if (!tournament) {
    return notFound();
  }

  const tournamentMatches = mockMatches.filter((match) => match.tournamentId === tournament.id);
  const tournamentTeams = (tournament.teamsParticipating || [])
    .map((teamId) => mockTeams.find((team) => team.id === teamId))
    .filter(Boolean) as Team[];

  const standings = tournamentTeams
    .map((team, index) => ({
      team,
      played: Math.max(3, 8 - index),
      won: Math.max(1, 6 - index),
      drawn: index % 2,
      lost: Math.max(0, index - 1),
      goalDifference: Math.max(0, 12 - index * 3),
      points: Math.max(3, (Math.max(1, 6 - index) * 3) + (index % 2)),
    }))
    .sort((a, b) => b.points - a.points)
    .map((entry, index) => ({ ...entry, rank: index + 1 }));

  const topScorers = mockTopScorers
    .filter((entry) => tournamentTeams.some((team) => team.name === entry.teamName))
    .slice(0, 5);

  const statusLabel: Record<string, string> = {
    ONGOING: "Ongoing",
    UPCOMING: "Upcoming",
    REGISTRATION_OPEN: "Registration Open",
    COMPLETED: "Completed",
  };

  const statusAccent: Record<string, string> = {
    ONGOING: "text-primary",
    UPCOMING: "text-secondary",
    REGISTRATION_OPEN: "text-accent",
    COMPLETED: "text-white",
  };

  return (
    <div className="min-h-screen bg-transparent pb-20 text-text">
      <div className="mx-auto max-w-6xl px-4 pb-16 pt-6 sm:px-6">
        <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top_right,_rgba(245,158,11,0.18),_transparent_28%),radial-gradient(circle_at_bottom_left,_rgba(34,197,94,0.2),_transparent_26%),linear-gradient(135deg,_rgba(17,29,53,0.96),_rgba(10,22,40,0.98))] shadow-card">
          <div className="absolute inset-0 pitch-grid opacity-20" />
          <div className="relative px-5 pb-6 pt-5 sm:px-8 sm:pb-8">
            <div className="flex items-center justify-between">
              <Link href="/" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-text-muted transition-colors hover:text-white">
                <ArrowLeft size={16} />
                Back
              </Link>
              <button
                type="button"
                onClick={() => setShareOpen(true)}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-text-muted transition-colors hover:text-white"
              >
                <Share2 size={16} />
                Share
              </button>
            </div>

            <div className="mt-8 grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-end">
                <div className="flex h-28 w-28 items-center justify-center rounded-[2rem] border border-white/10 bg-white/8 shadow-card sm:h-32 sm:w-32">
                  {tournament.logoUrl ? (
                    <img src={tournament.logoUrl} alt={tournament.name} className="h-full w-full object-cover" />
                  ) : (
                    <Trophy size={42} className="text-accent" />
                  )}
                </div>

                <div className="min-w-0">
                  <div className={`text-[11px] font-semibold uppercase tracking-[0.28em] ${statusAccent[tournament.status] ?? "text-primary"}`}>
                    {statusLabel[tournament.status] ?? tournament.status}
                  </div>
                  <h1 className="mt-3 font-bebas text-5xl tracking-[0.08em] text-white sm:text-6xl">{tournament.name}</h1>
                  <p className="mt-2 text-sm uppercase tracking-[0.24em] text-text-muted">
                    {tournament.level} · {tournament.format}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-4 text-sm text-text-muted">
                    <span className="inline-flex items-center gap-2">
                      <MapPin size={15} />
                      {tournament.city}, {tournament.state}
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <Calendar size={15} />
                      {new Date(tournament.startDate).toLocaleDateString()}
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <Users size={15} />
                      {tournament.organizerName}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <StatTile label="Teams" value={String(tournament.teamsCount)} />
                <StatTile label="Played" value={String(tournament.matchesPlayed)} accent="text-primary" />
                <StatTile label="Goals" value={String(tournament.totalGoals)} accent="text-accent" />
                <StatTile label="Capacity" value={String(tournament.maxTeams)} accent="text-secondary" />
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-[2rem] border border-white/10 bg-surface/70 p-4 shadow-card backdrop-blur-sm sm:p-5">
          <Tabs
            tabs={[
              { id: "Overview", label: "Overview" },
              { id: "Matches", label: "Matches" },
              { id: "Standings", label: "Standings" },
              { id: "Teams", label: "Teams" },
            ]}
            activeTab={activeTab}
            onChange={setActiveTab}
          />
        </section>

        <div className="mt-6">
          {activeTab === "Overview" && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="space-y-6">
                <div className="rounded-[2rem] border border-white/10 bg-surface/70 p-6 shadow-card">
                  <p className="text-[11px] uppercase tracking-[0.24em] text-primary">Tournament Story</p>
                  <h2 className="mt-3 font-bebas text-4xl tracking-[0.08em] text-white">COMPETITION SNAPSHOT</h2>
                  <p className="mt-4 text-sm leading-7 text-text-muted">
                    This tournament surface is designed to read like a football competition hub rather than an admin table. Teams, fixtures, standings, and standout performers all stay visible in one place.
                  </p>
                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    <StatTile label="Total Matches" value={String(tournament.totalMatches)} />
                    <StatTile label="Registered Teams" value={String(tournament.teamsCount)} accent="text-primary" />
                    <StatTile label="Host City" value={tournament.city} accent="text-secondary" />
                    <StatTile label="Format" value={tournament.format} accent="text-accent" />
                  </div>
                </div>

                <div className="rounded-[2rem] border border-white/10 bg-surface/70 p-6 shadow-card">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.24em] text-accent">Leaderboard</p>
                      <h2 className="mt-3 font-bebas text-4xl tracking-[0.08em] text-white">TOP SCORERS</h2>
                    </div>
                    <Link href="#standings" className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
                      View All <ChevronRight size={16} />
                    </Link>
                  </div>

                  <div className="mt-6 space-y-3">
                    {topScorers.length === 0 ? (
                      <EmptyState icon={Trophy} title="No scorer data yet" description="Leaderboard data will appear as verified match events are recorded." />
                    ) : (
                      topScorers.map((entry, index) => {
                        const player = mockPlayers.find((item) => item.id === entry.playerId);
                        return (
                          <div key={entry.playerId} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="font-bebas text-2xl tracking-[0.08em] text-accent">0{index + 1}</div>
                              <div>
                                <div className="text-sm font-semibold text-white">{player?.name ?? entry.playerName}</div>
                                <div className="text-xs text-text-muted">{entry.teamName}</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-mono text-xl font-bold text-primary">{entry.value}</div>
                              <div className="text-[10px] uppercase tracking-[0.24em] text-text-muted">Goals</div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-[2rem] border border-white/10 bg-surface/70 p-6 shadow-card">
                  <p className="text-[11px] uppercase tracking-[0.24em] text-primary">Tournament Health</p>
                  <h2 className="mt-3 font-bebas text-4xl tracking-[0.08em] text-white">COMPETITION STATUS</h2>
                  <div className="mt-6 space-y-4">
                    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
                      <div className="text-[11px] uppercase tracking-[0.24em] text-text-muted">Organizer</div>
                      <div className="mt-2 text-sm font-semibold text-white">{tournament.organizerName}</div>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
                      <div className="text-[11px] uppercase tracking-[0.24em] text-text-muted">Date Window</div>
                      <div className="mt-2 text-sm font-semibold text-white">
                        {new Date(tournament.startDate).toLocaleDateString()} - {new Date(tournament.endDate).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
                      <div className="text-[11px] uppercase tracking-[0.24em] text-text-muted">Current Phase</div>
                      <div className="mt-2 text-sm font-semibold text-white">{statusLabel[tournament.status] ?? tournament.status}</div>
                    </div>
                  </div>
                </div>

                <div className="rounded-[2rem] border border-white/10 bg-surface/70 p-6 shadow-card">
                  <p className="text-[11px] uppercase tracking-[0.24em] text-accent">Actions</p>
                  <h2 className="mt-3 font-bebas text-4xl tracking-[0.08em] text-white">NEXT STEP</h2>
                  <p className="mt-4 text-sm leading-7 text-text-muted">
                    The organizer dashboard, team approvals, and fixture generation are already linked in this project. This public view is now aligned with that future workflow.
                  </p>
                  <div className="mt-6 flex flex-col gap-3">
                    <Link href={`/tournament/${tournament.slug}/manage`}>
                      <Button variant="primary" className="w-full rounded-full">Open Tournament Hub</Button>
                    </Link>
                    <Link href="/discover">
                      <Button variant="outline" className="w-full rounded-full border-white/15 bg-white/5 text-white hover:bg-white/10">
                        Discover Players For This Circuit
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "Matches" && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
              {tournamentMatches.length === 0 ? (
                <EmptyState icon={Calendar} title="No fixtures yet" description="Matches for this tournament have not been scheduled yet." />
              ) : (
                <div className="grid gap-4 lg:grid-cols-2">
                  {tournamentMatches.map((match) => {
                    const homeTeam = mockTeams.find((team) => team.id === match.homeTeamId)!;
                    const awayTeam = mockTeams.find((team) => team.id === match.awayTeamId)!;
                    return <MatchCard key={match.id} match={match} homeTeam={homeTeam} awayTeam={awayTeam} tournament={tournament} />;
                  })}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "Standings" && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] border border-white/10 bg-surface/70 p-4 shadow-card sm:p-6">
              <div className="overflow-x-auto">
                <table className="min-w-full text-left">
                  <thead>
                    <tr className="border-b border-white/10 text-[11px] uppercase tracking-[0.24em] text-text-muted">
                      <th className="pb-3 pr-4">#</th>
                      <th className="pb-3 pr-4">Team</th>
                      <th className="pb-3 pr-4 text-center">P</th>
                      <th className="pb-3 pr-4 text-center">W</th>
                      <th className="pb-3 pr-4 text-center">D</th>
                      <th className="pb-3 pr-4 text-center">L</th>
                      <th className="pb-3 pr-4 text-center">GD</th>
                      <th className="pb-3 text-center">Pts</th>
                    </tr>
                  </thead>
                  <tbody>
                    {standings.map((entry) => (
                      <tr key={entry.team.id} className="border-b border-white/6 last:border-b-0">
                        <td className="py-4 pr-4 font-mono font-bold text-text-muted">{entry.rank}</td>
                        <td className="py-4 pr-4">
                          <Link href={`/team/${entry.team.slug}`} className="font-semibold text-white transition-colors hover:text-primary">
                            {entry.team.name}
                          </Link>
                        </td>
                        <td className="py-4 pr-4 text-center font-mono text-white">{entry.played}</td>
                        <td className="py-4 pr-4 text-center font-mono text-primary">{entry.won}</td>
                        <td className="py-4 pr-4 text-center font-mono text-text-muted">{entry.drawn}</td>
                        <td className="py-4 pr-4 text-center font-mono text-danger">{entry.lost}</td>
                        <td className="py-4 pr-4 text-center font-mono text-white">{entry.goalDifference}</td>
                        <td className="py-4 text-center font-mono font-bold text-accent">{entry.points}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === "Teams" && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
              {tournamentTeams.length === 0 ? (
                <EmptyState icon={Users} title="No teams yet" description="Teams have not registered for this tournament." />
              ) : (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {tournamentTeams.map((team) => (
                    <TeamCard key={team.id} team={team} />
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>

      <ShareModal
        isOpen={shareOpen}
        onClose={() => setShareOpen(false)}
        title={`Check out ${tournament.name} on Foot Heroes!`}
        url={typeof window !== "undefined" ? window.location.href : ""}
      />
    </div>
  );
}
