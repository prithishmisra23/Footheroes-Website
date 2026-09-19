"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, MapPin, Radar, Share2, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { EmptyState } from "@/components/common/EmptyState";
import { ShareModal } from "@/components/modals/ShareModal";
import { Button } from "@/components/ui/Button";
import { Tabs } from "@/components/ui/Tabs";
import { mockMatches } from "@/mock/matches";
import { mockPlayers } from "@/mock/players";
import { mockTeams } from "@/mock/teams";

const formColors: Record<string, string> = {
  W: "bg-primary",
  G: "bg-primary",
  A: "bg-secondary",
  D: "bg-accent",
  L: "bg-danger",
};

const positionAccent: Record<string, string> = {
  Goalkeeper: "text-accent",
  "Centre Back": "text-secondary",
  "Right Back": "text-secondary",
  "Left Back": "text-secondary",
  "Defensive Midfielder": "text-primary",
  "Central Midfielder": "text-primary",
  "Attacking Midfielder": "text-primary",
  "Right Winger": "text-danger",
  "Left Winger": "text-danger",
  Striker: "text-danger",
  "Centre Forward": "text-danger",
};

function StatTile({ label, value, accent = "text-white" }: { label: string; value: string; accent?: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
      <div className={`font-mono text-2xl font-bold ${accent}`}>{value}</div>
      <div className="mt-1 text-[11px] uppercase tracking-[0.24em] text-text-muted">{label}</div>
    </div>
  );
}

export default function PlayerProfile({ params }: { params: { slug: string } }) {
  const [activeTab, setActiveTab] = useState("Overview");
  const [shareOpen, setShareOpen] = useState(false);

  const player = mockPlayers.find((item) => item.slug === params.slug);
  if (!player) {
    return notFound();
  }

  const currentTeam = player.currentTeamId ? mockTeams.find((team) => team.id === player.currentTeamId) : null;
  const recentMatches = mockMatches.filter((match) => match.homeTeamId === player.currentTeamId || match.awayTeamId === player.currentTeamId);

  const scoringRate = !player.stats.careerMatches ? "0.00" : (player.stats.careerGoals / player.stats.careerMatches).toFixed(2);

  const profileInitials = player.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-transparent pb-20 text-text">
      <div className="mx-auto max-w-6xl px-4 pb-16 pt-6 sm:px-6">
        <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top_right,_rgba(59,130,246,0.18),_transparent_28%),radial-gradient(circle_at_bottom_left,_rgba(34,197,94,0.2),_transparent_28%),linear-gradient(135deg,_rgba(17,29,53,0.96),_rgba(10,22,40,0.98))] shadow-card">
          <div className="absolute inset-0 pitch-grid opacity-20" />
          <div className="relative px-5 pb-6 pt-5 sm:px-8 sm:pb-8 sm:pt-6">
            <div className="flex items-center justify-between">
              <Link href="/discover" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-text-muted transition-colors hover:text-white">
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

            <div className="mt-8 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
              <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-end">
                <div className="relative">
                  <div className="flex h-28 w-28 items-center justify-center rounded-[2rem] border border-white/10 bg-white/8 font-bebas text-5xl tracking-[0.08em] text-white shadow-card sm:h-32 sm:w-32">
                    {player.avatarUrl ? <img src={player.avatarUrl} alt={player.name} className="h-full w-full object-cover" /> : profileInitials}
                  </div>
                  {player.isVerified && (
                    <div className="absolute -bottom-2 -right-2 flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-secondary text-white shadow-card">
                      <ShieldCheck size={20} />
                    </div>
                  )}
                </div>

                <div className="min-w-0">
                  <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-primary">
                    <Sparkles size={12} />
                    Verified Football Identity
                  </div>
                  <h1 className="mt-4 font-bebas text-5xl tracking-[0.08em] text-white sm:text-6xl">{player.name}</h1>
                  <p className={`mt-2 text-sm font-semibold uppercase tracking-[0.24em] ${positionAccent[player.position] ?? "text-primary"}`}>
                    {player.position}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-4 text-sm text-text-muted">
                    <span className="inline-flex items-center gap-2">
                      <MapPin size={15} />
                      {player.city}, {player.state}
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <Calendar size={15} />
                      Age {player.age}
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <Radar size={15} />
                      {currentTeam?.name ?? "Independent Player"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <StatTile label="Matches" value={String(player.stats.careerMatches)} />
                <StatTile label="Goals" value={String(player.stats.careerGoals)} accent="text-primary" />
                <StatTile label="Assists" value={String(player.stats.careerAssists)} accent="text-secondary" />
                <StatTile label="Rating" value={player.stats.currentSeasonRating.toFixed(1)} accent="text-accent" />
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-[2rem] border border-white/10 bg-surface/70 p-4 shadow-card backdrop-blur-sm sm:p-5">
          <Tabs
            tabs={[
              { id: "Overview", label: "Overview" },
              { id: "Matches", label: "Matches" },
              { id: "Profile", label: "Profile" },
            ]}
            activeTab={activeTab}
            onChange={setActiveTab}
          />
        </section>

        <div className="mt-6">
          {activeTab === "Overview" && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
              <div className="space-y-6">
                <div className="rounded-[2rem] border border-white/10 bg-surface/70 p-6 shadow-card">
                  <p className="text-[11px] uppercase tracking-[0.24em] text-primary">Player Story</p>
                  <h2 className="mt-3 font-bebas text-4xl tracking-[0.08em] text-white">CAREER SNAPSHOT</h2>
                  <p className="mt-4 text-sm leading-7 text-text-muted">
                    {player.bio ??
                      `${player.name} is building a grassroots football record through consistent minutes, verified match output, and a profile designed to be scouted across tournaments.`}
                  </p>

                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    <StatTile label="Scoring Rate" value={scoringRate} accent="text-primary" />
                    <StatTile label="Preferred Foot" value={player.preferredFoot} accent="text-secondary" />
                    <StatTile label="Yellow Cards" value={String(player.stats.careerYellowCards)} accent="text-accent" />
                    <StatTile label="Red Cards" value={String(player.stats.careerRedCards)} accent="text-danger" />
                  </div>
                </div>

                <div className="rounded-[2rem] border border-white/10 bg-surface/70 p-6 shadow-card">
                  <p className="text-[11px] uppercase tracking-[0.24em] text-primary">Form Guide</p>
                  <h2 className="mt-3 font-bebas text-4xl tracking-[0.08em] text-white">LAST FIVE SIGNALS</h2>
                  <div className="mt-6 flex flex-wrap gap-3">
                    {player.formGuide.map((item, index) => (
                      <div key={`${item}-${index}`} className={`flex h-14 w-14 items-center justify-center rounded-2xl text-lg font-bold text-white ${formColors[item]}`}>
                        {item}
                      </div>
                    ))}
                  </div>
                  <p className="mt-5 text-sm leading-7 text-text-muted">
                    W = team result, G = goal contribution, A = assist impact. This gives scouts a quick read on both output and recent momentum.
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-[2rem] border border-white/10 bg-surface/70 p-6 shadow-card">
                  <p className="text-[11px] uppercase tracking-[0.24em] text-primary">Identity</p>
                  <h2 className="mt-3 font-bebas text-4xl tracking-[0.08em] text-white">PROFILE DETAILS</h2>
                  <div className="mt-6 space-y-4">
                    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
                      <div className="text-[11px] uppercase tracking-[0.24em] text-text-muted">Current Team</div>
                      <div className="mt-2 text-sm font-semibold text-white">{currentTeam?.name ?? "Independent Player"}</div>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
                      <div className="text-[11px] uppercase tracking-[0.24em] text-text-muted">Date of Birth</div>
                      <div className="mt-2 text-sm font-semibold text-white">{new Date(player.dateOfBirth).toLocaleDateString()}</div>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
                      <div className="text-[11px] uppercase tracking-[0.24em] text-text-muted">Physical Profile</div>
                      <div className="mt-2 text-sm font-semibold text-white">
                        {player.heightCm ? `${player.heightCm} cm` : "--"} · {player.weightKg ? `${player.weightKg} kg` : "--"}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-[2rem] border border-white/10 bg-surface/70 p-6 shadow-card">
                  <p className="text-[11px] uppercase tracking-[0.24em] text-accent">Scout Actions</p>
                  <h2 className="mt-3 font-bebas text-4xl tracking-[0.08em] text-white">NEXT STEP</h2>
                  <p className="mt-4 text-sm leading-7 text-text-muted">
                    Save the player, generate a scouting report, or move directly into the discovery shortlist workflow once backend account controls are wired.
                  </p>
                  <div className="mt-6 flex flex-col gap-3">
                    <Button variant="primary" className="rounded-full">Add To Watchlist</Button>
                    <Button variant="outline" className="rounded-full border-white/15 bg-white/5 text-white hover:bg-white/10">
                      Generate Scout Summary
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "Matches" && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
              {recentMatches.length === 0 ? (
                <EmptyState icon={Calendar} title="No matches found" description="This player has no recorded match history yet." />
              ) : (
                <div className="space-y-4">
                  {recentMatches.map((match) => {
                    const homeTeam = mockTeams.find((team) => team.id === match.homeTeamId);
                    const awayTeam = mockTeams.find((team) => team.id === match.awayTeamId);
                    return (
                      <Link
                        key={match.id}
                        href={`/match/${match.id}`}
                        className="block rounded-[2rem] border border-white/10 bg-surface/70 p-5 shadow-card transition-colors hover:border-primary/30"
                      >
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <p className="text-[11px] uppercase tracking-[0.24em] text-text-muted">
                              {new Date(match.date).toLocaleDateString()}
                            </p>
                            <h3 className="mt-2 text-lg font-semibold text-white">
                              {homeTeam?.name} vs {awayTeam?.name}
                            </h3>
                          </div>
                          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-center">
                            <div className="font-mono text-2xl font-bold text-white">
                              {match.homeScore} - {match.awayScore}
                            </div>
                            <div className="mt-1 text-[10px] uppercase tracking-[0.24em] text-text-muted">{match.status.replace("_", " ")}</div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "Profile" && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] border border-white/10 bg-surface/70 p-6 shadow-card">
              <p className="text-[11px] uppercase tracking-[0.24em] text-primary">Identity Layer</p>
              <h2 className="mt-3 font-bebas text-4xl tracking-[0.08em] text-white">PUBLIC PROFILE DATA</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <StatTile label="Player City" value={player.city} />
                <StatTile label="Player State" value={player.state} />
                <StatTile label="Role" value={player.position} />
                <StatTile label="Foot" value={player.preferredFoot} />
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <ShareModal
        isOpen={shareOpen}
        onClose={() => setShareOpen(false)}
        title={`Check out ${player.name}'s football profile on Foot Heroes!`}
        url={typeof window !== "undefined" ? window.location.href : ""}
      />
    </div>
  );
}
